/**
 * @class Oskari.mapframework.bundle.timeseries.ConfigurationRequest
 * Request timeseries to set configuration.
 *
 * Requests are build and sent through Oskari.Sandbox.
 * Oskari.mapframework.request.Request superclass documents how to send one.
 */
Oskari.clazz.define('Oskari.mapframework.bundle.timeseries.ConfigurationRequest',
    /**
     * @method create called automatically on construction
     * @static
     *
     * @param {String} op Operation
     * @param {Object} opts Options
     */
    function (op, opts) {
        const isDepracated = typeof op === 'object';
        this._conf = isDepracated ? op : null;
        this._op = isDepracated ? 'config' : op;
        this._opts = opts || {};
    }, {
        /** @static @property __name request name */
        __name: 'Timeseries.ConfigurationRequest',
        /**
         * @method getName
         * @return {String} request name
         */
        getName: function () {
            return this.__name;
        },
        getOptions: function () {
            return this._conf || this._opts;
        },
        getOperation: function () {
            return this._op;
        }
    }, {
        /**
         * @property {String[]} protocol array of superclasses as {String}
         * @static
         */
        protocol: ['Oskari.mapframework.request.Request']
    });
