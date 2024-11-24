import { getTimesFromAttributes } from 'oskari-ui/components/TimeSeries';

/**
 * @class Oskari.mapframework.bundle.timeseries.WMSAnimator
 * Handles timeseries enabled layer animation
 */
Oskari.clazz.define('Oskari.mapframework.bundle.timeseries.WMSAnimator',
    function (sandbox, layerId) {
        this._mapModule = sandbox.findRegisteredModuleInstance('MainMapModule');
        this._sandbox = sandbox;
        this._layer = this._sandbox.findMapLayerFromSelectedMapLayers(layerId);

        this._times = this.getTimes();
        this._currentTime = this._times[0];
        this._subsetRange = [this._times.at(0), this._times.at(-1)];

        this._doneCallback = null;
        this._isBuffering = false;
        this._isLoading = false;

        this._sandbox.register(this);
        this._onDestroyCallbacks = [];
        this.requestNewTime(this._currentTime, null, function () {});
    }, {
        __name: 'WMSAnimator',
        getName: function () {
            return this.__name;
        },
        init: function () {
            Object.getOwnPropertyNames(this.__eventHandlers)
                .forEach(p => this._sandbox.registerForEventByName(this, p));
        },
        _clazz: 'Oskari.mapframework.bundle.timeseries.WMSAnimator',
        __eventHandlers: {
            ProgressEvent: function (event) {
                if (event.getStatus() && this._layer.getId() === event.getId()) {
                    this._isLoading = false;
                    this._resolveWait();
                }
            }
        },
        onEvent: function (event) {
            const handler = this.__eventHandlers[event.getName()];
            if (!handler) {
                return;
            }
            return handler.apply(this, [event]);
        },
        /**
         * @method getTimes
         * Returns all available time instants that can be shown
         * @return {String[]} list of available timeseries times
         */
        getTimes: function () {
            if (!this._times) {
                this._times = getTimesFromAttributes(this.getLayer()?.getAttributes());
            }
            return this._times;
        },
        /**
         * @method getLayer
         * Returns the layer domain object
         * @return {Oskari.mapframework.domain.WmsLayer} layer domain object
         */
        getLayer: function () {
            return this._layer;
        },
        /**
         * @method getCurrentTime
         * Returns current selected time instant
         * @return {String} current time as ISO-string
         */
        getCurrentTime: function () {
            return this._currentTime;
        },
        /**
         * @method getSubsetRange
         * Returns current selected time range subset
         * @return {String[]} range Array with 2 elements, start & end, ISO-string
         */
        getSubsetRange: function () {
            return this._subsetRange.slice();
        },
        /**
         * @method getSubsetRange
         * Set current selected time range subset
         * @param {String[]} range Array with 2 elements, start & end, ISO-string
         */
        setSubsetRange: function (range) {
            this._subsetRange = range;
        },
        /**
         * @method requestNewTime
         * Requests change in current selected time
         * @param {String} newTime change current time to this value(ISO string)
         * @param {String} nextTime time value at next animation frame(ISO string). Can be null if not animating
         * @param {function} doneCallback callback that will be called after new time has been loaded
         */
        // TODO: remove doneCallback ??
        requestNewTime: function (newTime, nextTime, doneCallback) {
            const me = this;
            this._currentTime = newTime;
            const requestBuilder = Oskari.requestBuilder('MapModulePlugin.MapLayerUpdateRequest');
            if (!requestBuilder) {
                Oskari.log('WMSAnimator').warn('MapLayerUpdateRequest not available');
                return;
            }
            this._isLoading = true;
            this._doneCallback = doneCallback;
            if (nextTime) {
                this._isBuffering = true;
                this._bufferImages(this._mapModule.getLayerTileUrls(this._layer.getId()), nextTime, function (success) {
                    me._isBuffering = false;
                    me._resolveWait();
                });
            }
            const layerParams = this._layer.getParams();
            layerParams.time = newTime;
            const request = requestBuilder(this._layer.getId(), true, { TIME: newTime });
            this._sandbox.request(this, request);
            if (!nextTime && this._doneCallback) {
                this._doneCallback();
                this._doneCallback = null;
            }
        },
        /**
         * @method _bufferImages
         * @private
         * Preload tile images that will be used in next animation frame
         * @param {String[]} urls urls of tile images
         * @param {String} nextTime the time instant to request tiles for
         * @param {Function} callback is called when loading is ready or 5000 ms timeout reached
         */
        _bufferImages: function (urls, nextTime, callback) {
            /* eslint-disable n/no-callback-literal */
            let imgCount = urls.length;
            if (imgCount === 0) {
                callback(true);
                return;
            }
            let aborted = false;
            const timeout = setTimeout(function () {
                aborted = true;
                callback(false);
            }, 5000);
            urls.forEach(function (url) {
                if (!url) {
                    Oskari.log('WMSAnimator').warn('Image preloading didnt receive an URL to preload');
                    return;
                }
                const image = document.createElement('img');
                image.onload = function () {
                    if (aborted) {
                        return;
                    }
                    imgCount--;
                    if (imgCount === 0) {
                        clearTimeout(timeout);
                        callback(true);
                    }
                };
                image.src = url.replace(/([?&])(TIME=[^&]*)/, '$1TIME=' + encodeURIComponent(nextTime));
            });
        },
        /**
         * @method _resolveWait
         * @private
         * Check if both map layer has loaded AND next frame has buffered
         */
        _resolveWait: function () {
            if (!this._isLoading && !this._isBuffering && this._doneCallback) {
                const cb = this._doneCallback;
                this._doneCallback = null;
                cb();
            }
        },
        onDestroy: function (callbackFn) {
            this._onDestroyCallbacks.push(callbackFn);
        },
        /**
         * @method destroy
         * Releases any event handlers and any other resources
         */
        destroy: function () {
            Object.getOwnPropertyNames(this.__eventHandlers)
                .forEach(p => this._sandbox.unregisterFromEventByName(this, p));
            const destroyCbs = this._onDestroyCallbacks;
            while (destroyCbs.length) {
                const callbackFn = destroyCbs.shift();
                if (typeof callbackFn === 'function') {
                    callbackFn();
                }
            }
        }
    }, {
        protocol: [
            'Oskari.mapframework.bundle.timeseries.TimeseriesDelegateProtocol',
            'Oskari.mapframework.module.Module'
        ]
    }
);
