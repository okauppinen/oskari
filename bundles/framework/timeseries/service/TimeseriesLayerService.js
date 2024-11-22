/**
 * @class Oskari.mapframework.bundle.timeseries.TimeseriesLayerService
 * @deprecated
 */
Oskari.clazz.define(
    'Oskari.mapframework.bundle.timeseries.TimeseriesLayerService',
    function () {
    }, {
        getQName: function () {
            return 'Oskari.mapframework.bundle.timeseries.TimeseriesLayerService';
        },
        getName: function () {
            return 'TimeseriesLayerService';
        },
        registerLayerType: function (type, factory) {
            Oskari.log('TimeseriesLayerService').deprecated('registerLayerType', 'Use Timeseries.ConfigurationRequest with "layer" operation intead.');
            Oskari.getSandbox().postRequestByName('Timeseries.ConfigurationRequest', ['unregister', { type, factory }]);
        }
    });
