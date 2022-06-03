const BORDER_PRIO = 10000;
const REGION_PRIO = 10;
const HIGHLIGHT_PRIO = 1;

Oskari.clazz.define('Oskari.statistics.statsgrid.RegionsetViewer', function (instance, sandbox) {
    this.instance = instance;
    this.sb = sandbox;
    this.service = sandbox.getService('Oskari.statistics.statsgrid.StatisticsService');
    this.log = Oskari.log('Oskari.statistics.statsgrid.RegionsetViewer');

    this.LAYER_ID = 'STATS_LAYER';

    this._bindToEvents();
    this._pointSymbol = jQuery('<div><svg><circle></circle></svg></div>');
    this._regionsAdded = [];
    this._lastRenderCache = {};
}, {
    render: function (highlightRegionId) {
        const me = this;
        const { activeIndicator, regionset, error, seriesStats } = this.service.getStateService().getStateForRender();
        if (error) {
            this.log.debug('Error getting state', error);
            me._clearRegions();
            return;
        }
        const { datasource, indicator, selections, series, classification } = activeIndicator;
        const { mapStyle } = classification;
        me._updateLayerProperties(mapStyle, regionset);

        this.service.getIndicatorData(datasource, indicator, selections, series, regionset, function (err, dataByRegion) {
            if (err) {
                me.log.warn('Error getting indicator data', datasource, indicator, selections, regionset);
                me._clearRegions();
                return;
            }
            const { error, ...classifiedDataset } = me.service.getClassificationService().getClassification(dataByRegion, classification, seriesStats);
            if (error) {
                me._clearRegions();
                return;
            }
            if (me._lastRenderCache.mapStyle !== mapStyle) {
                me._clearRegions();
            }
            me._viewRegions(regionset, classification, classifiedDataset, dataByRegion, highlightRegionId);
        });
    },
    /** **** PRIVATE METHODS ******/
    _viewRegions: function (regionset, classification, classifiedDataset, dataByRegion, highlightRegionId) {
        const me = this;
        const locale = me.instance.getLocalization();
        this.service.getRegions(regionset, function (err, regions) {
            if (err) {
                // notify error!!
                me.service.getErrorService().show(locale.errors.title, locale.errors.regionsDataError);
                return;
            }
            if (regions.length === 0) {
                me.service.getErrorService().show(locale.errors.title, locale.errors.regionsDataIsEmpty);
                return;
            }
            me._addRegionFeatures(classification, classifiedDataset, regions, dataByRegion, highlightRegionId);
        });
    },
    _addRegionFeatures: function (classification, classifiedDataset, regions, dataByRegion, highlightRegionId) {
        const me = this;
        const addFeaturesRequestParams = [];
        const handledRegions = [];
        const { groups, format } = classifiedDataset;
        const { mapStyle, showValues, transparency } = classification;
        groups.forEach(function (regiongroup, index) {
            const { color, sizePx, regionIds } = regiongroup;
            const optionalStyles = [];
            const updates = [];
            const adds = [];
            const regionFeaturesToAdd = [];
            const borderFeatures = [];

            regionIds.forEach(regionId => {
                if (highlightRegionId && (highlightRegionId.toString() === regionId.toString())) {
                    optionalStyles.push(me._getFeatureStyle(mapStyle, regionId, color, true, sizePx));
                }
                const region = regions.find(r => r.id === regionId);
                if (!region) {
                    return;
                }
                const regionVal = format(dataByRegion[regionId]);
                if (me._regionsAdded.includes(regionId)) {
                    updates.push({
                        value: regionId,
                        properties: {
                            regionValue: regionVal
                        }
                    });
                } else {
                    const feature = me._getFeature(mapStyle, region, regionVal);
                    if (mapStyle === 'points') {
                        borderFeatures.push(me._getBorderFeature(region, regionVal));
                    }
                    regionFeaturesToAdd.push(feature);
                    adds.push(regionId);
                }
                handledRegions.push(regionId);
            });

            const defaultFeatureStyle = me._getFeatureStyle(mapStyle, null, color, false, sizePx);
            const regionFeatureStyle = Object.assign({
                text: {
                    scale: 1.2,
                    fill: {
                        color: Oskari.util.isDarkColor(color) ? '#ffffff' : '#000000'
                    },
                    stroke: {
                        width: 0
                    },
                    labelProperty: showValues ? 'regionValue' : '',
                    offsetX: 0,
                    offsetY: 0
                }
            }, defaultFeatureStyle);

            const regionRequestOptions = {
                clearPrevious: false,
                featureStyle: regionFeatureStyle,
                optionalStyles: optionalStyles,
                layerId: me.LAYER_ID,
                prio: REGION_PRIO + index,
                opacity: typeof transparency !== 'undefined' ? transparency : 100,
                animationDuration: 250
            };
            const borderRequestOptions = Object.assign({}, regionRequestOptions, {
                prio: BORDER_PRIO + index
            });
            borderRequestOptions.featureStyle = defaultFeatureStyle;

            if (adds.length !== 0) {
                me._regionsAdded = me._regionsAdded.concat(adds);
                addFeaturesRequestParams.push([me._getGeoJSON(regionFeaturesToAdd), regionRequestOptions]);
                // Add border features under the points
                if (borderFeatures.length > 0) {
                    addFeaturesRequestParams.push([me._getGeoJSON(borderFeatures), borderRequestOptions]);
                }
            }
            if (updates.length !== 0) {
                const searchOptions = { 'id': updates };
                addFeaturesRequestParams.push([searchOptions, regionRequestOptions]);

                if (mapStyle === 'points') {
                    const borderUpdates = updates.map(updateParams => Object.assign({}, updateParams, { value: 'border' + updateParams.value }));
                    const borderSearchOptions = { 'id': borderUpdates };
                    addFeaturesRequestParams.push([borderSearchOptions, borderRequestOptions]);
                }
            }
        });

        // Remove regions missing value
        if (handledRegions.length !== regions.length) {
            const regionsWithoutValue = [];
            me._regionsAdded = [];
            regions.forEach(r => {
                const id = r.id;
                if (handledRegions.includes(id)) {
                    me._regionsAdded.push(id);
                } else {
                    regionsWithoutValue.push(id);
                }
            });
            const borders = regionsWithoutValue.map(id => 'border' + id);
            const removes = regionsWithoutValue.concat(borders);
            me.sb.postRequestByName('MapModulePlugin.RemoveFeaturesFromMapRequest', ['id', removes, me.LAYER_ID]);
        }
        addFeaturesRequestParams.forEach(params => {
            me.sb.postRequestByName('MapModulePlugin.AddFeaturesToMapRequest', params);
        });

        me._lastRenderCache = { groups, highlightRegionId, mapStyle };
    },

    _getGeoJSON: function (features) {
        const geojson = {
            'type': 'FeatureCollection',
            'crs': {
                'type': 'name',
                'properties': {
                    'name': this.sb.getMap().getSrsName()
                }
            },
            'features': features
        };
        return geojson;
    },

    _clearRegions: function () {
        var me = this;
        me.sb.postRequestByName('MapModulePlugin.RemoveFeaturesFromMapRequest', [null, null, me.LAYER_ID]);
        me._regionsAdded = [];
    },

    _getFeatureStyle: function (mapStyle, region, color, highlighted, size) {
        var me = this;
        var style = null;
        var strokeWidth = highlighted ? 4 : 1;
        if (mapStyle === 'points') {
            style = me._getPointStyle(strokeWidth, color, size);
        } else {
            style = me._getPolygonStyle(strokeWidth, color);
        }
        if (highlighted) {
            style.effect = 'darken';
        }
        if (region) {
            style.property = {
                value: region,
                key: 'id'
            };
        }
        return style;
    },
    _getPointStyle: function (strokeWidth, color, size) {
        return {
            fill: { color: null },
            image: {
                radius: size / 2,
                fill: { color }
            },
            stroke: {
                color: '#000000',
                width: strokeWidth
            }
        };
    },
    _getPolygonStyle: function (strokeWidth, color) {
        var style = {
            fill: {
                color
            },
            stroke: {
                color: '#000000',
                width: strokeWidth
            },
            image: {
                opacity: 1
            }
        };
        return style;
    },

    _getFeature: function (mapStyle, region, label) {
        var featureProperties = {
            'id': region.id,
            'name': region.name,
            'regionValue': label,
            'oskari_type': 'region'
        };
        if (mapStyle === 'points') {
            return {
                'type': 'Feature',
                'geometry': {
                    'type': 'Point',
                    'coordinates': [region.point.lon, region.point.lat]
                },
                'properties': featureProperties
            };
        } else {
            var geojson = jQuery.extend(true, {}, region.geojson);
            geojson.properties = featureProperties;
            return geojson;
        }
    },

    _getBorderFeature: function (region, label) {
        var featureProperties = {
            'id': 'border' + region.id,
            'name': region.name,
            'regionValue': label,
            'oskari_type': 'border'
        };
        var geojson = jQuery.extend(true, {}, region.geojson);
        geojson.properties = featureProperties;
        return geojson;
    },

    _updateLayerProperties: function (mapStyle, regionsetId) {
        const regionset = this.service.getRegionsets(regionsetId);

        const hoverOptions = {
            featureStyle: {
                stroke: {
                    width: 4
                },
                inherit: true
            },
            content: [
                {
                    keyProperty: 'name',
                    valueProperty: 'regionValue'
                }
            ]
        };

        if (mapStyle !== 'points') {
            hoverOptions.featureStyle.effect = 'darken';
        }
        this.sb.postRequestByName(
            'VectorLayerRequest',
            [
                {
                    layerId: this.LAYER_ID,
                    hover: hoverOptions,
                    showLayer: true,
                    layerDescription: (regionset && regionset.name) ? regionset.name : null
                }
            ]
        );
    },
    _updateFeatureStyle: function (regionId, highlight) {
        const { mapStyle, groups } = this._lastRenderCache;
        if (!groups || !mapStyle) {
            return;
        }
        const index = groups.findIndex(group => group.regionIds && group.regionIds.includes(regionId));
        if (index === -1) {
            return;
        }
        const { color, sizePx } = groups[index];
        const style = this._getFeatureStyle(mapStyle, regionId, color, highlight, sizePx);
        style.effect = highlight ? 'darken' : '';
        const requestOptions = {
            featureStyle: style,
            layerId: this.LAYER_ID,
            prio: highlight ? HIGHLIGHT_PRIO : REGION_PRIO + index
        };
        const searchOptions = { id: regionId };
        this.sb.postRequestByName('MapModulePlugin.AddFeaturesToMapRequest', [searchOptions, requestOptions]);

        if (mapStyle === 'points') {
            const borderRequestOptions = { ...requestOptions };
            const borderSearchOptions = { ...searchOptions };
            delete borderRequestOptions.prio;
            borderSearchOptions.id = 'border' + regionId;
            this.sb.postRequestByName('MapModulePlugin.AddFeaturesToMapRequest', [borderSearchOptions, borderRequestOptions]);
        }
    },
    /**
     * Listen to events that require re-rendering the UI
     */
    _bindToEvents: function () {
        var me = this;
        var state = me.service.getStateService();
        me.service.on('StatsGrid.ActiveIndicatorChangedEvent', function (event) {
            // Always show the active indicator
            me.render(state.getRegion());
        });
        me.service.on('StatsGrid.ParameterChangedEvent', function (event) {
            me.render(state.getRegion());
        });

        me.service.on('StatsGrid.RegionsetChangedEvent', function (event) {
            // Need to update the map
            me._clearRegions();
            me.render(state.getRegion());
        });

        me.service.on('StatsGrid.RegionSelectedEvent', function (event) {
            const selectedRegion = event.getRegion();
            me._updateFeatureStyle(selectedRegion, true);
            // Remove previous highlight
            const previous = me._lastRenderCache.highlightRegionId;
            if (previous && previous !== selectedRegion) {
                me._updateFeatureStyle(previous, false);
            }
            me._lastRenderCache.highlightRegionId = selectedRegion;
        });

        me.service.on('StatsGrid.ClassificationChangedEvent', function (event) {
            // Classification changed, need update map
            me.render(state.getRegion());
        });
        me.service.on('StatsGrid.StateChangedEvent', function (event) {
            if (event.isReset()) {
                return;
            }
            me._clearRegions();
            me.render(state.getRegion());
        });
        me.service.on('AfterMapLayerRemoveEvent', function () {
            me._clearRegions();
        });

        me.service.on('FeatureEvent', function (event) {
            if (event.getParams().operation !== 'click' || !event.hasFeatures()) {
                return;
            }

            // resolve region
            var topmostFeature = event.getParams().features[0];
            if (topmostFeature.layerId !== me.LAYER_ID) {
                return;
            }
            var region = topmostFeature.geojson.features[0].properties.id;
            state.toggleRegion(region, 'map');
        });
    }

});
