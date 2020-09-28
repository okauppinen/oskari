/**
 * @class Oskari.mapframework.bundle.printout.PrintoutBundleInstance
 *
 * Main component and starting point for the "map printout" functionality. Printout
 * is a wizardish tool to configure a printout .
 *
 * See Oskari.mapframework.bundle.printout.PrintoutBundle for bundle definition.
 *
 */
Oskari.clazz.define('Oskari.mapframework.bundle.printout.PrintoutBundleInstance',

    /**
     * @method create called automatically on construction
     * @static
     */

    function () {
        this.sandbox = undefined;
        this.started = false;
        this.plugins = {};
        this.localization = undefined;
        this.printout = undefined;
        this.buttonGroup = 'viewtools';
        this.ignoreEvents = false;
        this.dialog = undefined;
        this.printoutHandler = undefined;
        this.printService = undefined;
        this._log = Oskari.log(this.getName());
    }, {
        /**
         * @static
         * @property __name
         */
        __name: 'Printout',
        /**
         * @method getName
         * @return {String} the name for the component
         */
        getName: function () {
            return this.__name;
        },
        /**
         * @method getSandbox
         * @return {Oskari.Sandbox}
         */
        getSandbox: function () {
            return this.sandbox;
        },
        /**
         * @method getLocalization
         * Returns JSON presentation of bundles localization data for current language.
         * If key-parameter is not given, returns the whole localization data.
         *
         * @param {String} key (optional) if given, returns the value for key
         * @return {String/Object} returns single localization string or
         *      JSON object for complete data depending on localization
         *      structure and if parameter key is given
         */
        getLocalization: function (key) {
            if (!this._localization) {
                this._localization = Oskari.getLocalization(this.getName());
            }
            if (key) {
                return this._localization[key];
            }
            return this._localization;
        },
        /**
         * @method start
         * Implements BundleInstance protocol start method
         */
        start: function () {
            var me = this;
            if (me.started) {
                return;
            }
            me.started = true;
            var conf = this.conf,
                sandboxName = (conf ? conf.sandbox : null) || 'sandbox',
                sandbox = Oskari.getSandbox(sandboxName),
                p;
            me.sandbox = sandbox;

            this.localization = Oskari.getLocalization(this.getName());

            sandbox.register(me);

            for (p in me.eventHandlers) {
                if (me.eventHandlers.hasOwnProperty(p)) {
                    sandbox.registerForEventByName(me, p);
                }
            }
            // requesthandler
            this.printoutHandler = Oskari.clazz.create('Oskari.mapframework.bundle.printout.request.PrintMapRequestHandler', sandbox, function () {
                me.instance.sandbox.postRequestByName('userinterface.UpdateExtensionRequest', [me.instance, 'attach']);
            });
            sandbox.requestHandler('printout.PrintMapRequest', this.printoutHandler);

            // request toolbar to add buttons
            var addToolButtonBuilder = Oskari.requestBuilder('Toolbar.AddToolButtonRequest');
            var buttonConf = {
                iconCls: 'tool-print',
                tooltip: this.localization.btnTooltip,
                sticky: false,
                callback: function () {
                    me.sandbox.postRequestByName('userinterface.UpdateExtensionRequest', [me, 'attach']);
                }
            };
            sandbox.request(this, addToolButtonBuilder('print', this.buttonGroup, buttonConf));

            // create the PrintService for handling ajax calls
            // and common functionality.
            var printService = Oskari.clazz.create(
                'Oskari.mapframework.bundle.printout.service.PrintService',
                me
            );
            sandbox.registerService(printService);
            this.printService = printService;

            // Let's extend UI
            var request = Oskari.requestBuilder('userinterface.AddExtensionRequest')(this);
            sandbox.request(this, request);
            // draw ui
            me._createUi();
        },
        /**
         * @method init
         * Implements Module protocol init method - does nothing atm
         */
        init: function () {
            return null;
        },
        /**
         * @method update
         * Implements BundleInstance protocol update method - does nothing atm
         */
        update: function () {

        },
        getService: function () {
            return this.printService;
        },
        /**
         * @method onEvent
         * Event is handled forwarded to correct #eventHandlers if found or discarded if not.
         * @param {Oskari.mapframework.event.Event} event a Oskari event object
         */
        onEvent: function (event) {
            var handler = this.eventHandlers[event.getName()];
            if (!handler) {
                return;
            }
            return handler.apply(this, [event]);
        },
        /**
         * @property {Object} eventHandlers
         * @static
         */
        eventHandlers: {
            'AfterMapMoveEvent': function (event) {
                if (this.printout && this.printout.isEnabled) {
                    this.printout.refresh();
                }
            },
            /**
             * @method userinterface.ExtensionUpdatedEvent
             */
            'userinterface.ExtensionUpdatedEvent': function (event) {
                var me = this;

                if (event.getExtension().getName() !== me.getName()) {
                    // not me -> do nothing
                    return;
                }

                var isOpen = event.getViewState() !== 'close';
                me.displayContent(isOpen);
            }
        },

        /**
         * @method stop
         * Implements BundleInstance protocol stop method
         */
        stop: function () {
            if (this.printout) {
                this.printout.destroy();
                this.printout = undefined;
            }

            var sandbox = this.sandbox(),
                p;
            for (p in this.eventHandlers) {
                if (this.eventHandlers.hasOwnProperty(p)) {
                    sandbox.unregisterFromEventByName(this, p);
                }
            }

            sandbox.removeRequestHandler('printout.PrintMapRequest', this.printoutHandler);
            this.printoutHandler = null;
            var request = Oskari.requestBuilder('userinterface.RemoveExtensionRequest')(this);
            sandbox.request(this, request);

            this.sandbox.unregisterStateful(this.mediator.bundleId);
            this.sandbox.unregister(this);
            this.started = false;
        },
        /**
         * @method startExtension
         * implements Oskari.userinterface.Extension protocol startExtension method
         * Creates a flyout
         * Oskari.mapframework.bundle.printout.Flyout
         */
        startExtension: function () {
            this.plugins['Oskari.userinterface.Flyout'] = Oskari.clazz.create('Oskari.mapframework.bundle.printout.Flyout', this);
        },
        /**
         * @method stopExtension
         * implements Oskari.userinterface.Extension protocol stopExtension method
         * Clears references to flyout
         */
        stopExtension: function () {
            this.plugins['Oskari.userinterface.Flyout'] = null;
        },
        /**
         * @method getPlugins
         * implements Oskari.userinterface.Extension protocol getPlugins method
         * @return {Object} references to flyout
         */
        getPlugins: function () {
            return this.plugins;
        },
        /**
         * @method getTitle
         * @return {String} localized text for the title of the component
         */
        getTitle: function () {
            return this.getLocalization('title');
        },
        /**
         * @method getDescription
         * @return {String} localized text for the description of the component
         */
        getDescription: function () {
            return this.getLocalization('desc');
        },
        /**
         * @method _createUi
         * @private
         * (re)creates the UI for "printout" functionality
         */
        _createUi: function () {
            this.plugins['Oskari.userinterface.Flyout'].createUi();
        },
        /**
         * @method setPublishMode
         * Transform the map view to printout mode if parameter is true and back to normal if false.
         * Makes note about the map layers that the user cant publish, removes them for publish mode and
         * returns them when exiting the publish mode.
         *
         * @param {Boolean} blnEnabled
         */
        setPublishMode: function (blnEnabled) {
            const me = this;
            const map = jQuery('#contentMap');

            // trigger an event letting other bundles know we require the whole UI
            var eventBuilder = Oskari.eventBuilder('UIChangeEvent');
            this.sandbox.notifyAll(eventBuilder(this.mediator.bundleId));

            if (blnEnabled) {
                map.addClass('mapPrintoutMode');
                me.sandbox.mapMode = 'mapPrintoutMode';
                this.sandbox.postRequestByName('userinterface.UpdateExtensionRequest', [this, 'hide']);
                // proceed with printout view
                this.printout = Oskari.clazz.create('Oskari.mapframework.bundle.printout.view.BasicPrintout', this, this.getLocalization('BasicView'));
                this.printout.render(map);
                this.printout.show();
                this.printout.setEnabled(true);
                // reset and disable map rotation
                this.sandbox.postRequestByName('rotate.map', []);
                this.sandbox.postRequestByName('DisableMapMouseMovementRequest', [['rotate']]);
            } else {
                map.removeClass('mapPrintoutMode');
                if (me.sandbox._mapMode === 'mapPrintoutMode') {
                    delete me.sandbox._mapMode;
                }
                if (this.printout) {
                    this.sandbox.postRequestByName('userinterface.UpdateExtensionRequest', [this, 'close']);
                    this.printout.setEnabled(false);
                    this.printout.hide();
                }
                var builder = Oskari.requestBuilder('Toolbar.SelectToolButtonRequest');
                this.sandbox.request(this, builder());
                this.sandbox.postRequestByName('EnableMapMouseMovementRequest', [['rotate']]);
            }
            // resize map to fit screen with expanded/normal sidebar
            var reqBuilder = Oskari.requestBuilder('MapFull.MapSizeUpdateRequest');
            if (reqBuilder) {
                me.sandbox.request(me, reqBuilder(true));
            }
        },
        displayContent: function (isOpen) {
            if (isOpen) {
                this.plugins['Oskari.userinterface.Flyout'].refresh();
            }
        }
    }, {
        /**
         * @property {String[]} protocol
         * @static
         */
        protocol: ['Oskari.bundle.BundleInstance', 'Oskari.mapframework.module.Module', 'Oskari.userinterface.Extension']
    });
