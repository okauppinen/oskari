/**
 * @class Oskari.mapframework.bundle.timeseries.TimeseriesService
 * @deprecated
 */
Oskari.clazz.define(
    'Oskari.mapframework.bundle.timeseries.TimeseriesService',
    function () {
    }, {
        getQName: function () {
            return 'Oskari.mapframework.bundle.timeseries.TimeseriesService';
        },
        getName: function () {
            return 'TimeseriesService';
        },
        registerTimeseries: function (id, type, priority, delegate, config = {}) {
            if (!id || !type || typeof priority !== 'number' || !delegate) {
                throw new Error('All arguments must be given!');
            }
            Oskari.log('TimeseriesService').deprecated('registerTimeseries', 'Use Timeseries.ConfigurationRequest with "register" operation intead.');
            Oskari.getSandbox().postRequestByName('Timeseries.ConfigurationRequest', ['register', { id, delegate, config }]);
        },
        unregisterTimeseries: function (id, type) {
            if (!id || !type) {
                throw new Error('All arguments must be given!');
            }
            Oskari.log('TimeseriesService').deprecated('unregisterTimeseries', 'Use Timeseries.ConfigurationRequest with "unregister" operation instead.');
            Oskari.getSandbox().postRequestByName('Timeseries.ConfigurationRequest', ['unregister']);
        },
        updateTimeseriesPriority: function () {
            Oskari.log('TimeseriesService').deprecated('updateTimeseriesPriority');
        }
    });
