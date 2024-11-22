import { TimeSeriesHandler } from './handler/TimeSeriesHandler';
import { showAlertPopup } from './view/AlertPopup';

/**
 * @class Oskari.mapframework.bundle.timeseries.TimeseriesToolBundleInstance
 *
 * Registers TimeseriesService & TimeseriesLayerService
 * Creates UI control for timeseries, when TimeseriesService indicates it's needed
 */
Oskari.clazz.define('Oskari.mapframework.bundle.timeseries.TimeseriesToolBundleInstance',
    /**
     * @method create called automatically on construction
     * @static
     */
    function () {
        this.started = false;
        this.sandbox = null;
        this.handler = null;
        this.eventHandlers = {};
        this.popupControls = null;
        this.layerTypeAnimators = {};
        this.delegates = {};
        this.registeredDelegate = null;
        this.loc = Oskari.getMsg.bind(null, this.getName());
        this.log = Oskari.log(this.getName());
    },
    {
        __name: 'timeseries',
        /**
         * @method getName
         * @return {String} the name for the component
         */
        getName: function () {
            return this.__name;
        },
        /**
         * @method start
         * implements BundleInstance protocol start methdod
         */
        start: function (sandbox) {
            if (this.started) {
                return;
            }
            this.started = true;
            const config = this.conf || {};
            this.sandbox = sandbox || Oskari.getSandbox(config.sandbox);

            this.registerServicesForAPI();
            this.registerLayerType('wms', layerId => Oskari.clazz.create('Oskari.mapframework.bundle.timeseries.WMSAnimator', this.sandbox, layerId));
            this.handler = new TimeSeriesHandler(this);

            this.sandbox.requestHandler('Timeseries.ConfigurationRequest', this);
            this.sandbox.registerAsStateful(this.mediator.bundleId, this);
            this.eventHandlers = this._createEventHandlers();
            this.setState(this.state);

            // TODO: publisher doesn't include bundle if not enabled can we get rid of this:
            if (config.plugins) {
                const plugin = config.plugins.find(plugin => plugin.id === 'Oskari.mapframework.bundle.timeseries.TimeseriesControlPlugin');
                if (plugin) {
                    // TODO: is showControl only required config
                    this.handler.setConfiguration(plugin.config);
                }
            }

            Oskari.on('app.start', () => {
                this._registerForLayerFiltering();
                this.updateControls();
            });
        },
        registerServicesForAPI: function () {
            const time = Oskari.clazz.create('Oskari.mapframework.bundle.timeseries.TimeseriesService', this);
            this.sandbox.registerService(time);
            const layer = Oskari.clazz.create('Oskari.mapframework.bundle.timeseries.TimeseriesLayerService', this);
            this.sandbox.registerService(layer);
        },
        registerLayerType: function (layerType, factory) {
            if (!layerType || typeof factory !== 'function') {
                this.log.error('All arguments must be given!');
                return;
            }
            this.layerTypeAnimators[layerType] = factory;
        },
        onEvent: function (event) {
            return this.eventHandlers[event.getName()]?.apply(this, [event]);
        },
        _createEventHandlers: function () {
            const handlers = {
                AfterRearrangeSelectedMapLayerEvent: event => this.onMapLayerEvent(event.getMovedMapLayer()),
                AfterMapLayerAddEvent: event => this.onMapLayerEvent(event.getMapLayer()),
                AfterMapLayerRemoveEvent: event => this.onMapLayerEvent(event.getMapLayer(), true),
                MapLayerVisibilityChangedEvent: event => {
                    const layer = event.getMapLayer();
                    this.onMapLayerEvent(layer, !layer.isVisible());
                }
            };
            Object.getOwnPropertyNames(handlers).forEach(p => this.sandbox.registerForEventByName(this, p));
            return handlers;
        },
        getLayers: function () {
            const srs = this.sandbox.getMap().getSrsName();
            return this.sandbox.findAllSelectedMapLayers()
                .filter(l => l.hasTimeseries() && l.isVisible() && l.isSupportedSrs(srs))
                .reverse();
        },
        onMapLayerEvent: function (layer, isRemove) {
            if (!layer || !layer.hasTimeseries()) {
                return;
            }
            if (isRemove) {
                this.delegates[layer.getId()]?.destroy();
            }
            this.updateControls();
        },
        updateControls: function () {
            const layers = this.getLayers();
            const topId = layers[0]?.getId();
            layers.forEach(layer => {
                const layerId = layer.getId();
                if (this.delegates[layerId]) {
                    return;
                }
                const type = layer.getLayerType();
                // new timeseries layer -> try to get a handler for the layer type
                const factory = this.layerTypeAnimators[type];
                if (factory) {
                    // layer type can be handled as timeseries - store it
                    this.delegates[layerId] = factory(layerId);
                } else {
                    this.log.warn(`No animator defined for layer type "${type}"!`);
                }
            });
            const active = this.registeredDelegate || this.delegates[topId];
            this.handler.setDelegate(active);
            if (layers.length > 1) {
                this.showMultipleAlert();
            }
        },
        showMultipleAlert: function () {
            if (this.popupControls) {
                // already visible
                return;
            }
            const onClose = () => {
                if (this.popupControls) {
                    this.popupControls.close();
                }
                this.popupControls = null;
            };
            this.popupControls = showAlertPopup(onClose);
        },
        /**
         * @method _registerForLayerFiltering
         * Registers for creation of ui filter button
         * @private
         */
        _registerForLayerFiltering: function () {
            this.sandbox.getService('Oskari.mapframework.service.LayerlistService')?.registerLayerlistFilterButton(
                this.loc('layerFilter.timeseries'),
                this.loc('layerFilter.tooltip'),
                {
                    active: 'layer-timeseries',
                    deactive: 'layer-timeseries-disabled'
                },
                this.getName()
            );
        },
        /**
         * @method handleRequest
         *
         * Request handler for control plugin configuration.
         */
        handleRequest: function (core, request) {
            if (!this.handler) {
                this.log.warn('No state handler, skipping!');
                return;
            }
            const op = request.getOperation();
            const opts = request.getOptions();
            if (op === 'config') {
                this.handler.setConfiguration(opts);
            } else if (op === 'layer') { // register
                const { type, factory } = opts;
                this.registerLayerType(type, factory);
            } else if (op === 'register') { // add
                const { delegete, config } = opts;
                this.registeredDelegate = delegete;
                this.handler.setConfiguration(config);
                this.handler.setDelegate(delegete);
            } else if (op === 'unregister') { // delete/remove
                this.registeredDelegate?.destroy();
                this.registeredDelegate = null;
                const topId = this.getLayers()[0]?.getId();
                this.handler.setDelegate(this.delegates[topId]);
            } else {
                Oskari.log('Timeseries.ConfigurationRequest').warn(`Unknown operation: ${op}, skipping`);
            }
        },
        /**
         * @method stop
         * implements BundleInstance protocol stop method
         */
        stop: function () {
            Object.values(this.delegates).forEach(d => d.destroy());
            this.delegates = {};
        },

        setState: function (state) {
            this.handler?.setStoredState(state);
        },

        getState: function () {
            return this.handler?.getStateToStore() || {};
        },

        getStateParameters: function () {
            const { time } = this.getState();
            if (!time) {
                return '';
            }
            return Array.isArray(time) ? `timeseries=${time[0]}/${time[1]}` : `timeseries=${time}`;
        }
    },
    {
        /**
         * @property {String[]} protocol
         * @static
         */
        protocol: ['Oskari.bundle.BundleInstance']
    }
);
