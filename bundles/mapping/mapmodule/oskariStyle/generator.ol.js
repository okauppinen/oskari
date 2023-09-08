import olStyleStyle, { createDefaultStyle } from 'ol/style/Style';
import olStyleFill from 'ol/style/Fill';
import olStyleStroke from 'ol/style/Stroke';
import olStyleCircle from 'ol/style/Circle';
import olStyleIcon from 'ol/style/Icon';
import olStyleText from 'ol/style/Text';

import { LINE_DASH, LINE_JOIN, EFFECT, FILL_STYLE, STYLE_TYPE, PATTERN_STROKE } from './constants';
import { filterOptionalStyle, getOptionalStyleFilter } from './filter';

const log = Oskari.log('MapModule.util.style');
const TRANSPARENT = 'rgba(1,1,1,0)';

const merge = (...styles) => jQuery.extend(true, {}, ...styles);

const defaultOlStyles = {
    hidden: new olStyleStyle({ visibility: 'hidden' })
};

// types ['function', ...STYLE_TYPE]
const getDefaultOLStyle = type => {
    if (!defaultOlStyles[type]) {
        defaultOlStyles[type] = getGeomTypedStyles(type);
    }
    return defaultOlStyles[type];
};

export const getFeatureStyle = (layer, extendedDef = {}) => {
    const style = layer.getCurrentStyle();
    return merge(Oskari.custom.getDefaultStyle(), style.getFeatureStyle(), extendedDef);
};

const geometryTypeToStyleType = type => {
    const types = Object.values(STYLE_TYPE);
    if (types.includes(type)) {
        return type;
    }

    let styleType = STYLE_TYPE.UNKNOWN;
    switch (type) {
    case 'LineString':
    case 'MultiLineString':
        styleType = STYLE_TYPE.LINE; break;
    case 'Polygon':
    case 'MultiPolygon':
        styleType = STYLE_TYPE.AREA; break;
    case 'Point':
    case 'MultiPoint':
        styleType = STYLE_TYPE.POINT; break;
    case 'GeometryCollection':
        styleType = STYLE_TYPE.COLLECTION; break;
    }
    return styleType;
};


/* Oskari style related functions */

export const useStyleFunction = layer => {
    const current = layer.getCurrentStyle();
    const styleType = geometryTypeToStyleType(layer.getSimpleGeometryType());
    const hasPropertyLabel = Oskari.util.keyExists(current.getFeatureStyle(), 'text.labelProperty');
    const hasOptionalStyles = current.getOptionalStyles().length > 0;
    const hasCluster = layer.getClusteringDistance() > 0;
    return hasOptionalStyles || hasCluster || hasPropertyLabel ||
        styleType === STYLE_TYPE.COLLECTION || styleType === STYLE_TYPE.UNKNOWN;
};

const getGeomTypedStyles = (mapmodule, styleDef, geometryType) => {
    const styleType = geometryTypeToStyleType(geometryType);
    if (styleType !== STYLE_TYPE.COLLECTION && styleType !== STYLE_TYPE.UNKNOWN) {
        return getOlStyle(styleDef, styleType);
    }

    const styles = {};
    styles[STYLE_TYPE.AREA] = getOlStyle(mapmodule,styleDef, STYLE_TYPE.AREA);
    styles[STYLE_TYPE.LINE] = getOlStyle(mapmodule, styleDef, STYLE_TYPE.LINE);
    styles[STYLE_TYPE.POINT] = getOlStyle(mapmodule, styleDef, STYLE_TYPE.POINT);
    if (styleDef.text) {
        styles.label = {
            property: styleDef.text.labelProperty,
            text: styleDef.text.labelText
        };
    }
    return styles;
};

export const getOlStyleForLayer = (mapmodule, layer, extendedDef) => {
    const styleType = geometryTypeToStyleType(layer.getSimpleGeometryType());
    const featureStyle = getFeatureStyle(layer, extendedDef);
    return getOlStyle(mapmodule, featureStyle, styleType);
};
/**
 * @method getOlStyleFunction
 * @param mapmodule
 * @param layer Oskari layer
 * @param extendedDef Oskari style definition which overrides layer's featureStyle
 * @return {ol/style/StyleLike}
 **/
export const getStyleFunctionForLayer = (mapmodule, layer, extendedDef) => {
    const featureStyle = getFeatureStyle(layer, extendedDef);
    const styles = getGeomTypedStyles(mapmodule, featureStyle, layer.getSimpleGeometryType());
    const optional = layer.getCurrentStyle().getOptionalStyles().map(optionalDef => ({
        filter: getOptionalStyleFilter(optionalDef),
        styles: getGeomTypedStyles(merge(featureStyle, optionalDef))
    }));
    const styleFunction = getStyleFunction(styles, optional);
    // 3D doesn't support cluster
    if (mapmodule.getSupports3D()) {
        return wrapApplyOpacity(styleFunction, layer.getOpacity);
    }
    if (layer.getClusteringDistance() > 0) {
        return wrapClusterStyleFunction(styleFunction);
    }
    return styleFunction;
};



// Style for cluster circles
const clusterStyleCache = {};
const clusterStyleFunc = feature => {
    const size = feature.get('features').length;
    const cacheKey = `${size}`;
    let style = clusterStyleCache[cacheKey];
    if (!style) {
        style = new olStyleStyle({
            image: new olStyleCircle({
                radius: size > 9 ? 14 : 12,
                stroke: new olStyleStroke({
                    color: '#fff'
                }),
                fill: new olStyleFill({
                    color: '#3399CC' // isSelected '#005d90'
                })
            }),
            text: new olStyleText({
                text: size.toString(),
                font: 'bold 14px sans-serif',
                fill: new olStyleFill({
                    color: '#fff'
                })
            })
        });
        clusterStyleCache[cacheKey] = style;
    }
    return style;
};

/**
 * @method getStyleFunction
 * @param styles [olStyle] || { point: [olStyle], line: [olStyle], area: [olStyle] }
 * @param optionalStyles [{ filter, styles }]
 * @return {ol/style/StyleLike}
 **/
const getStyleFunction = (styles, optionalStyles) => {
    return (feature) => {
        let olStyles = optionalStyles.find(op => filterOptionalStyle(op.filter, feature))?.styles || styles;
        if (!Array.isArray(olStyles)) {
            olStyles = getStylesForGeometry(feature.getGeometry(), olStyles);
        }
        const textStyle = olStyles[0]?.getText();
        if (textStyle) {
            _setFeatureLabel(feature, textStyle, label);
        }
        return olStyles;
    };
};

const wrapApplyOpacity = (styleFunction, getOpacity) => {
    return feature => {
        const olStyles = styleFunction(feature);
        // apply opacity only for main style. other styles may use aplha for workarounds
        applyOpacityToStyle(olStyles[0], getOpacity());
        return olStyles;
    };
};
const wrapClusterStyleFunction = styleFunction => {
    return (feature) => {
        // Cluster layer feature
        const feats = feature.get('features');
        if (feats) {
            if (feats.length > 1) {
                return clusterStyleFunc(feature);
            } else {
                // Only single point in cluster. Use it in styling.
                feature = feature.get('features')[0];
            }
        } else {
            // Vector layer feature, hide single points
            const geomType = feature.getGeometry().getType();
            if (geomType === 'Point' ||
                (geomType === 'MultiPoint' && feature.getGeometry().getPoints().length === 1)) {
                return null;
            }
        }
        return styleFunction(feature);
    };
};

const getStylesForGeometry = (geometry, styleTypes) => {
    if (!geometry || !styleTypes) {
        return;
    }
    let geometries = [];
    const geomType = geometry.getType ? geometry.getType() : geometry;
    const type = geometryTypeToStyleType(geomType);
    if (type === STYLE_TYPE.COLLECTION) {
        if (typeof geometry.getGeometries === 'function') {
            geometries = geometry.getGeometries() || [];
        }
        if (geometries.length > 0) {
            log.debug('Received GeometryCollection. Using first feature to determine feature style.');
            return getStylesForGeometry(geometries[0], styleTypes);
        } else {
            log.info('Received GeometryCollection without geometries. Feature style cannot be determined.');
        }
    };
    return styleTypes[type] || [];
};

const applyAlphaToColorable = (colorable, alpha) => {
    const color = getAlphaForColor(colorable?.getColor(), alpha);
    if (color) {
        colorable.setColor(color);
    }
};

const getAlphaForColor = (color, alpha) => {
    if (!color || typeof alpha !== 'number' || color === TRANSPARENT) {
        // null colors use transparent to avoid ol rendering default black color
        // 3D uses alpha for layer opacity. On opacity change alphas are updated.
        // Don't set alpha (opacity) for transparent color
        return color;
    }
    if (typeof color === 'string' && color.startsWith('rgb')) {
        const lastChar = color.startsWith('rgba') ? ',' : ')';
        const rgb = color.substring(color.indexOf('('), color.lastIndexOf(lastChar));
        return `rgba(${rgb},${alpha})`;
    }
    if (Array.isArray(color)) {
        const [ r, g, b] = color;
        return (`rgba(${r},${g},${b},${alpha})`);
    }
    const rgb = Oskari.util.hexToRgb(color);
    if (rgb) {
        const { r, g, b } = rgb;
        return (`rgba(${r},${g},${b},${alpha})`);
    }
};

export const applyOpacityToStyle = (olStyle, opacity) => {
    if (!olStyle || isNaN(opacity)) {
        return;
    }
    const alpha = opacity <= 1 ? opacity : opacity / 100.0;
    applyAlphaToColorable(olStyle.getFill(), alpha);
    applyAlphaToColorable(olStyle.getStroke(), alpha);
    if (olStyle.getImage()) {
        olStyle.getImage().setOpacity(alpha);
    }
    return olStyle;
};

const _setFeatureLabel = (feature, textStyle, label = {}) => {
    const { text, property } = label;
    if (!property) {
        return;
    }
    let value;
    if (Array.isArray(property)) {
        const keyForFirstValue = property.find(p => feature.get(p));
        value = feature.get(keyForFirstValue);
    } else {
        value = feature.get(property);
    }
    if (typeof value === 'undefined') {
        value = '';
    }
    const featureLabel = text ? text + ': ' + value : value;
    textStyle.setText(featureLabel);
};

/* OpenLayer style related functions */

/**
 * Creates style based on JSON
 * @param {AbstractMapModule} mapModule
 * @param styleDef Oskari style definition
 * @param geomType One of 'area', 'line', 'dot' | optional
 * @param requestedStyle layer's or feature's style definition (not overrided with defaults)
 * @return {Array} ol/style/Style. First item is main style and rest are optional/additional
 */
export const getOlStyle = (mapModule, styleDef, geomType, extendedDef = {}) => {
    const { image, fill, stroke, text, effect } = styleDef;
    const { area: areaStroke, ...lineStroke } = stroke;
    const styleType = geometryTypeToStyleType(geomType);

    const olStyles = [];
    const olStyle = {};
    if (styleType === STYLE_TYPE.POINT) {
        olStyle.image = getImageStyle(mapModule, image, effect);
    } else if (styleType === STYLE_TYPE.LINE) {
        olStyle.stroke = getStrokeStyle(lineStroke, effect);
    } else if (styleType === STYLE_TYPE.AREA) {
        olStyle.stroke = getStrokeStyle(areaStroke, effect);
        olStyle.fill = getFillStyle(fill, effect);
        olStyles.push(...getWorkaroundForDash(olStyle.stroke));
    } else {
        olStyle.image = getImageStyle(mapModule, image, effect);
        olStyle.stroke = getStrokeStyle(lineStroke, effect); // areaStroke or lineStroke
        olStyle.fill = getFillStyle(fill, effect);
    }

    if (text) {
        olStyle.text = getTextStyle(text, effect);
    }
    const mainStyle = new olStyleStyle(olStyle);
    olStyles.unshift(mainStyle);
    return olStyles;
};

// draw transparent solid stroke to fire hover and click also on gaps with dashed stroke
// open layers renders only dashes so hover or click aren't fired on gaps
const getWorkaroundForDash = olStroke => {
    if (!olStroke) {
        // stroke with width 0 returns undefined as olStroke
        return [];
    }
    const lineDash = olStroke.getLineDash();
    if (!lineDash || !lineDash.length) {
        return [];
    }
    const transparent = olStroke.clone();
    applyAlphaToColorable(transparent, 0.01);
    transparent.setLineDash(null);
    const olStyle = new olStyleStyle({ stroke: transparent });
    return [olStyle];
};

/**
 * @method getFillStyle
 * @param fill Oskari style fill definition
 * @param effect EFFECT
 * @return {ol/style/Fill} fill style
 */
const getFillStyle = (fill = {}, effect) => {
    const color = getColorEffect(effect, fill.color);
    if (!color) {
        return new olStyleFill({ color: TRANSPARENT });
    }
    const pattern = getFillPattern(fill.area?.pattern, color);
    if (pattern) {
        return new olStyleFill({ color: pattern });
    }
    return new olStyleFill({ color });
};

/**
 * @method getFillPattern
 * @param {Number} fillStyleCode Oskari style constant
 * @param {String} color color
 * @return {CanvasPattern} fill style
 */
const getFillPattern = (fillStyleCode, color) => {
    const canvasSize = 64;
    const { strokeWidth, path } = getFillPatternPath(canvasSize, fillStyleCode);
    if (!path || !color) {
        return;
    }
    const canvas = document.createElement('canvas');
    canvas.width = canvasSize;
    canvas.height = canvasSize;
    const ctx = canvas.getContext('2d');
    ctx.lineCap = 'square';
    ctx.strokeStyle = color;
    ctx.lineWidth = strokeWidth;
    ctx.stroke(new Path2D(path));
    return ctx.createPattern(canvas, 'repeat');
};
export const getFillPatternPath = (size, fillCode) => {
    const { THIN, THICK } = PATTERN_STROKE;
    let strokeWidth = THIN;
    let path;
    switch (fillCode) {
    case FILL_STYLE.THICK_DIAGONAL:
        strokeWidth = THICK;
    case FILL_STYLE.THIN_DIAGONAL:
        path = getDiagonalPattern(size, strokeWidth);
        break;
    case FILL_STYLE.THICK_HORIZONTAL :
        strokeWidth = THICK;
    case FILL_STYLE.THIN_HORIZONTAL :
        path = getHorizontalPattern(size, strokeWidth);
        break;
    }
    return { strokeWidth, path };
};

const getDiagonalPattern = (size, lineWidth) => {
    const whiteSpace = lineWidth * 2 + 2;
    const bandWidth = lineWidth + whiteSpace;
    const transition = size / Math.floor(size / bandWidth);
    const path = [];
    for (let t = transition / 2; t < size; t += transition) {
        path.push(`M${t},0`);
        path.push(`L0,${t}`);
    }
    for (let t = transition / 2; t < size; t += transition) {
        path.push(`M${t},${size}`);
        path.push(`L${size},${t}`);
    }
    return path.join(' ');
};

const getHorizontalPattern = (size, lineWidth) => {
    const whiteSpace = lineWidth + 2;
    const bandWidth = lineWidth + whiteSpace;
    const transition = size / Math.floor(size / bandWidth);
    const path = [];
    for (let y = transition / 2; y < size; y += transition) {
        path.push(`M0,${y}`);
        path.push(`L${size},${y}`);
    }
    return path.join(' ');
};

/**
 * Parses stroke style from json
 * @method getStrokeStyle
 * @param {Object} style json
 * @return {ol/style/Stroke}
 */
const getStrokeStyle = (stroke, effect) => {
    if (stroke.width === 0) {
        return;
    }
    const { color, lineDash, lineJoin, ...olStroke } = stroke;
    olStroke.color = getColorEffect(effect, color);

    let dash = Array.isArray(lineDash) ? lineDash : [];
    const getDash = (segment, gap) => [segment, gap + (width || 0)];
    switch (lineDash) {
        case LINE_DASH.DASH:
            dash = getDash(5, 4);
            break;
        case LINE_DASH.DOT:
            dash = getDash(1, 1);
            break;
        case LINE_DASH.DASHDOT:
            dash = getDash(5, 1).concat(getDash(1, 1));
            break;
        case LINE_DASH.LONGDASH:
            dash = getDash(10, 4);
            break;
        case LINE_DASH.LONGDASHDOT:
            dash = getDash(10, 1).concat(getDash(1, 1));
    }
    olStroke.lineDash = dash;
    olStroke.lineDashOffset = 0;

    if (lineJoin === LINE_JOIN.MITRE) {
        olStroke.lineJoin = 'miter';
    }
    return new olStyleStroke(stroke);
};

/**
 * Parses image style from json
 * @method getImageStyle
 * @param {Object} image json
 * @param {Object} requestedStyle layer's or feature's style definition (not overrided with defaults)
 * @return {ol/style/Circle}
 */
const getImageStyle = (mapModule, image, effect, requestedStyle) => {
    // mapModule.getDefaultMarkerSize()
    const { opacity = 1, shape, size, sizePx = 64, radius } = image;
    const color = getColorEffect(effect, image.fill?.color);
    if (opacity !== 1) {
        // color = applyAlphaToColorable OR new function
    }
    const imageDef = {
        ...image,
        fill: { color }
    };

    if (radius) {
        // image.snapToPixel = styleDef.snapToPixel;
        return new olStyleCircle({
            fill: new olStyleFill({ color }),
            stroke: getStrokeStyle(styleDef)
        });
    }

    const { src, scale, offsetX, offsetY } = mapModule.isSvg(image) ? Oskari.custom.getSvg(imageDef) : image;
    const imgSize = typeof size === 'number' ?  mapModule.getPixelForSize(size) : sizePx;
    const opts = {
        src: !src && typeof shape === 'string' ? shape : src,
        anchorYUnits: 'pixels',
        anchorXUnits: 'pixels',
        anchorOrigin: 'bottom-left',
        anchor: [offsetX, offsetY],
        opacity
    };
    if (scale) {
        opts.scale = scale;
    } else {
        opts.imgSize = [sizePx, sizePx];
    }
    return new olStyleIcon(opts);
};

/**
 * Parses JSON and returns matching ol/style/Text
 * @param  {Object} textStyleJSON text style definition
 * @return {ol/style/Text} parsed style or undefined if no param is given
 */
const getTextStyle = styleDef => {
    if (!styleDef || !styleDef.text) {
        return;
    }
    const text = {};
    const { scale, offsetX, offsetY, rotation, textAlign, textBaseline, font, fill, stroke, labelText, overflow } = styleDef.text;
    if (scale) {
        text.scale = scale;
    }
    if (offsetX) {
        text.offsetX = offsetX;
    }
    if (offsetY) {
        text.offsetY = offsetY;
    }
    if (rotation) {
        text.rotation = rotation;
    }
    if (textAlign) {
        text.textAlign = textAlign;
    }
    if (textBaseline) {
        text.textBaseline = textBaseline;
    }
    if (font) {
        text.font = font;
    }
    if (overflow) {
        text.overflow = !!overflow;
    }
    if (fill && fill.color) {
        text.fill = new olStyleFill({
            color: getColorEffect(styleDef.effect, fill.color) || fill.color
        });
    }
    if (stroke) {
        text.stroke = getStrokeStyle(styleDef.text);
    }
    if (labelText) {
        if (typeof labelText === 'number') {
            text.text = labelText.toString();
        } else {
            text.text = labelText;
        }
    }
    return new olStyleText(text);
};

/**
 * @method getColorEffect
 * @param {String} effect Oskari style constant
 * @param {String} color Color to apply the effect on
 * @return {String} Affected color or undefined if effect or color is missing
 */
const getColorEffect = (effect, color = TRANSPARENT) => {
    if (!effect || effect === EFFECT.NONE) {
        return color;
    }
    const minor = 60;
    const normal = 90;
    const major = 120;
    const getEffect = (delta, auto) => Oskari.util.alterBrightness(color, delta, auto);
    switch (effect) {
    case EFFECT.AUTO : return getEffect(normal, true);
    case EFFECT.AUTO_MINOR : return getEffect(minor, true);
    case EFFECT.AUTO_NORMAL : return getEffect(normal, true);
    case EFFECT.AUTO_MAJOR : return getEffect(major, true);
    case EFFECT.DARKEN : return getEffect(-normal);
    case EFFECT.DARKEN_MINOR : return getEffect(-minor);
    case EFFECT.DARKEN_NORMAL : return getEffect(-normal);
    case EFFECT.DARKEN_MAJOR : return getEffect(-major);
    case EFFECT.LIGHTEN : return getEffect(normal);
    case EFFECT.LIGHTEN_MINOR : return getEffect(minor);
    case EFFECT.LIGHTEN_NORMAL : return getEffect(normal);
    case EFFECT.LIGHTEN_MAJOR : return getEffect(major);
    }
};

const getStrokeEffect = (effect, stroke = 1) => {
    if (!effect || effect === EFFECT.NONE) {
        return stroke;
    }
    const minor = 1;
    const normal = 2;
    const major = 3;
    switch (effect) {
        case EFFECT.AUTO_MINOR:
        case EFFECT.DARKEN_MINOR:
        case EFFECT.LIGHTEN_MINOR:
            return stroke + minor;
        case EFFECT.AUTO_MAJOR:
        case EFFECT.DARKEN_MAJOR:
        case EFFECT.LIGHTEN_MAJOR:
            return stroke + major;
    }
    return stroke + normal;
};
