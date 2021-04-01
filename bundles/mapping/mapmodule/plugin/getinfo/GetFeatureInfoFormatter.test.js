import './GetInfoPlugin';
import './GetFeatureInfoFormatter';
import { processFeatureProperties } from '../../../mapwfs2/plugin/WfsVectorLayerPlugin/util/props';

const plugin = Oskari.clazz.create('Oskari.mapframework.mapmodule.GetInfoPlugin');
// simple mock
const myPlaceProperties = {
    __fid: 234,
    image_url: 'http://my.domain/test.png',
    name: 'TESTING',
    attention_text: 'Text for Map',
    place_desc: 'Lorem ipsum',
    geometry: 'fake'
};
const wfsProperties = {
    __fid: 234,
    test: 'TESTING',
    image_url: 'http://test.domain/test.png',
    geometry: 'fake'
};
const getWfsPropertyLabels = () => {
    return { image_url: 'Image', test: 'Label for test' };
};
const myPlacesLayer = {
    isLayerOfType: (type) => type === 'myplaces',
    getPropertySelection: () => ['name', 'place_desc', 'image_url', 'attention_text'],
    getPropertyLabels: () => {
        return {
            __fid: 'ID',
            name: 'Name',
            place_desc: 'Description',
            image_url: 'Image',
            attention_text: 'Text for Map'
        };
    },
    getName: () => 'testing_myplaces',
    getFieldFormatMetadata: (prop) => {
        const formatterOpts = { skipEmpty: true };
        if (prop === 'name') {
            formatterOpts.noLabel = true;
            formatterOpts.type = 'h3';
        }
        if (prop === 'place_desc') {
            formatterOpts.noLabel = true;
            formatterOpts.type = 'p';
        }
        if (prop === 'image_url') {
            formatterOpts.noLabel = true;
            formatterOpts.type = 'image';
            formatterOpts.params = { link: true };
        }
        if (prop === 'attention_text') {
            formatterOpts.type = 'hidden';
        }
        return formatterOpts;
    }
};
const otherLayer = {
    isLayerOfType: (type) => type === 'wfsplaces',
    getPropertySelection: () => ['test'],
    getPropertyLabels: getWfsPropertyLabels,
    getName: () => 'testing_wfs'
};
// try to use without selection, if ordering causes propblems then add selection
// and remove processFeatureProperties
const attrConfigLayer = {
    isLayerOfType: (type) => type === 'wfsplaces',
    getPropertySelection: () => [],
    getPropertyLabels: getWfsPropertyLabels,
    getFieldFormatMetadata: (field) => {
        if (field === 'image_url') {
            return { type: 'image', noLabel: true };
        }
        return {};
    },
    getName: () => 'testing_wfs'
};
plugin._sandbox = {
    findMapLayerFromSelectedMapLayers: (layerId) => {
        if (`${layerId}`.startsWith('myplaces_')) {
            return myPlacesLayer;
        }
        if (layerId === 123) {
            return otherLayer;
        }
        return attrConfigLayer;
    }
};
plugin._loc.noAttributeData = 'NO DATA';

const removeWhitespace = (content) => content.replace(/\s/g, '');

describe('GetInfoPlugin', () => {
    describe('formatters', () => {
        describe('html', () => {
            const content = `
                <div>
                    <script>alert('Bazinga!')</script>
                </div>
            `;
            test('is function', () => {
                expect(typeof plugin.formatters.html).toEqual('function');
            });
            test('returns jQuery object', () => {
                const result = plugin.formatters.html(content);
                expect(result instanceof jQuery).toEqual(true);
            });
            test('wraps content to additional div', () => {
                const result = plugin.formatters.html(`My data`);
                expect(result.outerHTML()).toEqual('<div>My data</div>');

                const result2 = plugin.formatters.html(`<div></div>`);
                expect(removeWhitespace(result2.outerHTML())).toEqual('<div><div></div></div>');
            });
            test('removes script tags', () => {
                const result = plugin.formatters.html(content);
                const scriptTags = result.find('script');
                expect(scriptTags.length).toEqual(0);
            });
        });
    });
    describe('_formatWFSFeaturesForInfoBox', () => {
        test('is function', () => {
            expect(typeof plugin._formatWFSFeaturesForInfoBox).toEqual('function');
        });
        test('myplaces', () => {
            // [{"isMyPlace": true, "layerId": "myplaces_test", "layerName": "testing_myplaces", "markup": {"0": <div class="myplaces_place"><h3 class="myplaces_header">TESTING</h3><br></div>, "length": 1}, "type": "wfslayer"}]
            const imageLink = 'http://my.domain/test.png';
            const result = plugin._formatWFSFeaturesForInfoBox({
                layerId: 'myplaces_test',
                features: [myPlaceProperties]
            });
            expect(result.length).toEqual(1);
            expect(result[0].isMyPlace).toEqual(true);
            expect(result[0].layerId).toEqual('myplaces_test');
            expect(result[0].layerName).toEqual(myPlacesLayer.getName());
            expect(result[0].type).toEqual('wfslayer');
            expect(result[0].markup instanceof jQuery).toEqual(true);
            const html = result[0].markup.outerHTML();
            expect(html).toEqual(`<table class="getinforesult_table"><tr><td colspan="2"><h3>TESTING</h3></td></tr><tr><td colspan="2"><p>Lorem ipsum</p></td></tr><tr><td colspan="2"><a href="${imageLink}" rel="noreferrer noopener" target="_blank" title="${imageLink}"><img class="oskari_gfi_img" src="${imageLink}"></a></td></tr></table>`);
        });

        test('wfslayer without values', () => {
            // [{"isMyPlace": false, "layerId": 123, "layerName": "testing_wfs", "markup": "<table><tr><td>NO DATA</td></tr></table>", "type": "wfslayer"}]
            const result = plugin._formatWFSFeaturesForInfoBox({
                layerId: 123,
                features: [{}]
            });
            expect(result.length).toEqual(1);
            expect(result[0].isMyPlace).toEqual(false);
            expect(result[0].layerId).toEqual(123);
            expect(result[0].layerName).toEqual(otherLayer.getName());
            expect(result[0].type).toEqual('wfslayer');
            expect(typeof result[0].markup).toEqual('string');
            expect(result[0].markup).toEqual('<table><tr><td>NO DATA</td></tr></table>');
        });

        test('wfslayer with values', () => {
            // [{"isMyPlace": false, "layerId": 123, "layerName": "testing_wfs", "markup": "<table class="getinforesult_table"><tr class="odd"><td>Label for test</td><td>TESTING</td></tr></table>", "type": "wfslayer"}]
            const result = plugin._formatWFSFeaturesForInfoBox({
                layerId: 123,
                features: [wfsProperties]
            });
            expect(result.length).toEqual(1);
            expect(result[0].isMyPlace).toEqual(false);
            expect(result[0].layerId).toEqual(123);
            expect(result[0].layerName).toEqual(otherLayer.getName());
            expect(result[0].type).toEqual('wfslayer');
            expect(result[0].markup instanceof jQuery).toEqual(true);
            const html = result[0].markup.outerHTML();
            expect(html).toEqual(`<table class="getinforesult_table"><tr class="odd"><td>Label for test</td><td>TESTING</td></tr></table>`);
        });

        test('wfslayer with no label image formatter', () => {
            // process properties to use same properties than GFI gets without selection
            const result = plugin._formatWFSFeaturesForInfoBox({
                layerId: 468,
                features: [processFeatureProperties(wfsProperties, true)]
            });
            expect(result[0].layerName).toEqual(attrConfigLayer.getName());
            expect(result[0].type).toEqual('wfslayer');
            expect(result[0].markup instanceof jQuery).toEqual(true);
            const html = result[0].markup.outerHTML();
            // should skip "Image" label" and write colspan=2. Should have <img></img> but outerHTML() probably messes it up
            expect(html).toEqual(`<table class="getinforesult_table"><tr class="odd"><td>Label for test</td><td>TESTING</td></tr><tr><td colspan="2"><img class="oskari_gfi_img" src="http://test.domain/test.png"></td></tr></table>`);
        });
    });
});
