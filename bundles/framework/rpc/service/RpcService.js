import { arrayToObject, domainMatch } from '../util/RPCUtil';

/**
 * @class Oskari.mapframework.bundle.rpc.service.RpcService
 * Allows extend RPC supported funtions
 *
 */
Oskari.clazz.define('Oskari.mapframework.bundle.rpc.service.RpcService',

    /**
     * @method create called automatically on construction
     * @static
     *
     */

    function (instance) {
        this.instance = instance;
        this.conf = this.instance.conf || {};
        this.channel = this.instance._channel;
        this._log = Oskari.log('RpcService');
        this._availableFunctions = {};
        this._allowedFunctions = this.conf.allowedfunctions || [];
        this._allowedFunctionsFromConf = Array.isArray(this.conf.allowedfunctions);
    }, {
        __name: 'Rpc.RpcService',
        __qname: 'Oskari.mapframework.bundle.rpc.service.RpcService',

        getQName: function () {
            return this.__qname;
        },

        getName: function () {
            return this.__name;
        },

        /**
         * @method init
         * Initializes the service
         */
        init: function () {
        },

        /**
         * @method addFunction
         * Add function to RPC
         *
         * @param {String} name function name
         * @param {Function} func function that should be added
         */
        addFunction: function (name, func) {
            if (!name || typeof func !== 'function') {
                throw new Error('Tried registering function without name or implementation!');
            }

            if (this._availableFunctions[name] != null) {
                this._log.warn('Trying add already defined RPC function (' + func.name + '), skipping.');
                return;
            }

            this._availableFunctions[name] = func;

            // bind functions
            this.__updateAllowedFunctions(name);
            this.__bindFunction(name);
        },

        /**
         * @public @method getAllowedFunctions
         * Get allowed functions
         *
         * @returns {Object} allowed functions
         */
        getAllowedFunctions: function () {
            return arrayToObject(this._allowedFunctions);
        },

        /**
         * @private @method __bindFunction
         * Bind allowed function to channel
         *
         * @param {String} name function name
         */
        __bindFunction: function (name) {
            const me = this;

            const requestedFunction = me._availableFunctions[name];
            if (!requestedFunction) {
                return;
            }

            me.channel.bind(name, function (trans, params) {
                if (!domainMatch(trans.origin, me.conf.domain)) {
                    // eslint-disable-next-line no-throw-literal
                    throw {
                        error: 'invalid_origin',
                        message: 'Invalid origin: ' + trans.origin
                    };
                }

                const errorHandler = (err) => trans.error(err, 'Error calling RPC-function: ' + name + 'with params: ' + params);
                try {
                    const value = requestedFunction.apply(me, params || []);
                    if (typeof value === 'undefined') {
                        // async functions should return promise
                        trans.error('Error calling RPC-function: ' + name + 'with params: ' + params);
                        return;
                    }
                    // check if we got a promise
                    if (typeof value.catch === 'function') {
                        value.catch(errorHandler);
                    }
                    if (typeof value.then === 'function') {
                        trans.delayReturn(true);
                        value.then(response => trans.complete(response));
                        return;
                    }
                    // if we didn't we got the response synchronously -> return it
                    return value;
                } catch (err) {
                    errorHandler(err);
                }
            });
        },

        /**
         * @private @method __updateAllowedFunctions
         * Update allowed functions list
         *
         * @param {String} name function name
         */
        __updateAllowedFunctions: function (name) {
            if (this._allowedFunctionsFromConf) {
                return;
            }
            this._allowedFunctions.push(name);
        }

    }, {
        protocol: ['Oskari.mapframework.service.Service']
    });
