/**
 * @class Oskari.mapframework.bundle.coordinatetool.plugin.CoordinateTransformationExtension
 * Provides a coordinate display for map
 */
Oskari.clazz.define('Oskari.mapframework.bundle.coordinatetool.plugin.CoordinateTransformationExtension',
    /**
     * @method create called automatically on construction
     * @static
     * @param {Object} config
     *      JSON config with params needed to run the plugin
     */
    function (instance, config, locale, mapmodule, sandbox) {
        this._locale = locale;
        this._config = config;
        this._mapmodule = mapmodule;
        this._sandbox = sandbox;
        this._instance = instance;
        this._messageDialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');
        this._clazz =
            'Oskari.mapframework.bundle.coordinatetool.plugin.CoordinateTransformationExtension';
        this._templates = {
            projectionTransformSelect: jQuery(
                '<div class="coordinatetool-divider"></div>'+
                '<div class="coordinatetool-projection-change-header"></div>'+
                '<div>'+
                '    <select id="projection" class="lon-input projection-select projection-transformation"></select>'+
                '</div>'+
                '<div class="clear"/>'+
                '<div class="coordinate-tool-projection-change-confirmation margintop" style="display:none;">'+
                '   <div class="projection-change-confirmation-message"></div>'+
                '</div>'
            ),
            projectionSelectOption: jQuery('<option></option>')
        };
        this._ajaxXhr = null;
    }, {
        /**
         * Generates the element for the projection transformation based on config
         * @method @public initCoordinatesTransformChange
         * @param {Object} popupContent
         * @return {Object} projectionSelect
         */
        initCoordinatesTransformChange: function(popupContent) {
            var me = this,
                keys = _.keys(me._config.supportedProjections);
            me._popupContent = popupContent;
            if (keys && keys.length > 1) {
                me._popupContent.find('.srs').append(me._templates.projectionTransformSelect.clone());
                me._popupContent.find('.coordinatetool-projection-change-header').html(me._locale.coordinatesTransform.header);
                me._projectionSelect =  me._popupContent.find('.projection-select');
                me._populateCoordinatesTransformSelect(me._projectionSelect);
                me._projectionSelect.on('change', function(event) {
                    var nowSelected = jQuery("#projection option:selected").val();
                    var coordinateToolPlugin = me._mapmodule.getPluginInstances('CoordinateToolPlugin');

                    //getting transformed coordinate from frontend first
                    var data = coordinateToolPlugin._getInputsData();
                    var usersInputs = _.clone(data);
                    coordinateToolPlugin._projectionChanged = true;
                    coordinateToolPlugin.refresh(data);

                    var successCb = function(newLonLat) {
                         coordinateToolPlugin._updateLonLat(newLonLat);
                    };

                    var errorCb = function(){
                        me._showMessage(me._locale.cannotTransformCoordinates.title, me._locale.cannotTransformCoordinates.message);
                    };

                    //getting precise transformed coordinates from server
                    me.getTransformedCoordinatesFromServer(usersInputs, coordinateToolPlugin._previousProjection, me._projectionSelect.val(), successCb, errorCb);
                    coordinateToolPlugin._previousProjection = nowSelected;

                });
            }
            return me._projectionSelect;
        },
        /**
         * Generates the options for the projection change select based on config, or hides control if no options
         * @method @private _populateCoordinatesTransformSelect
         * @param {Object} popupContent
         */
         _populateCoordinatesTransformSelect: function(select) {
            var me = this,
                projections = me._config.supportedProjections;
            _.each(projections, function(key) {
                var option = me._templates.projectionSelectOption.clone();
                option.val(key);
                if(me._locale.coordinatesTransform.projections[key]) {
                   option.html(me._locale.coordinatesTransform.projections[key]);
                } else {
                   option.html(key);
                }
                select.append(option);
            });
         },
         /**
         * @method @private _showMessage show message
         * @param  {String} title   mesage title
         * @param  {String} message mesage
         */
        _showMessage: function(title, message) {
            var me = this;

            if(!me._messageDialog) {
                me._messageDialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');
            }
            me._messageDialog.show(title, message);
            me._messageDialog.fadeout();
        },
         /**
         * Transforms the given coordinates
         * @method @public transformCoordinates
         * @param {Object} data: lat/lon coordinates to be transformed
         * @param {String} srs: projection for given lonlat params like "EPSG:4326"
         * @param {String} targetSRS: projection to transform to like "EPSG:4326"
         * @return {Object} data: transformed coordinates as object with lon and lat keys
         */
        transformCoordinates: function(data, srs, targetSRS) {
            var me = this;
            me._coordinatesFromServer = false;
             if(!data) {
                var map = this._sandbox.getMap();
                data = {
                    'lonlat': {
                        'lat': parseFloat(map.getY()),
                        'lon': parseFloat(map.getX())
                    }
                };
            }
            if(!srs) {
                srs = this._mapmodule.getProjection();
            }
            if(!targetSRS && this._projectionSelect) {
                targetSRS = this._projectionSelect.val();
            }

            if(srs && targetSRS) {
                data.lonlat = this._mapmodule.transformCoordinates(data.lonlat, srs, targetSRS);
            }
            return data;
        },
         /**
         * Transforms the given coordinates using action_route=Coordinates and updates coordinates to the UI
         * @method getTransformedCoordinatesFromServer
         * @param {Object} lonlat: lat/lon coordinates to be transformed
         * @param {String} srs: projection for given lonlat params like "EPSG:4326"
         * @param {String} targetSRS: projection to transform to like "EPSG:4326"
         * @param {Function} successCb success callback
         * @param {Function} errorCb error callback
         */
        getTransformedCoordinatesFromServer: function (lonlat, srs, targetSRS, successCb, errorCb) {
            var me = this;
            if(!lonlat) {
                var map = me._sandbox.getMap();
                lonlat = {
                    'lonlat': {
                        'lat': parseFloat(map.getY()),
                        'lon': parseFloat(map.getX())
                    }
                };
            }
            if(!srs) {
                srs = this._mapmodule.getProjection();
            }
            if(!targetSRS && this._projectionSelect) {
                targetSRS = this._projectionSelect.val();
            }
            if(srs !== targetSRS) {
                if(me._ajaxXhr) {
                    me._ajaxXhr.abort();
                }
                me._ajaxXhr = jQuery.ajax({
                    url: me._sandbox.getAjaxUrl('Coordinates'),
                    data: {
                        lat: lonlat.lonlat.lat,
                        lon: lonlat.lonlat.lon,
                        srs: srs,
                        targetSRS: targetSRS
                    },
                    success: function (response) {
                        if (response.lat && response.lon) {
                            var newLonLat = {
                                'lonlat': {
                                    'lon': response.lon,
                                    'lat': response.lat
                                }
                            };
                            me._coordinatesFromServer = true;
                            if(typeof successCb === 'function') {
                                successCb(newLonLat);
                            }
                        }
                    },
                    error: function (jqXHR, textStatus) {
                        if(typeof errorCb === 'function' && jqXHR.status !== 0) {
                            errorCb(jqXHR, textStatus);
                        }
                    }
                });
            } else {
                successCb(lonlat);
            }
        },
        /**
         * @public @method changeToolStyle
         * Changes the tool style of the plugin
         *
         * @param {Object} style
         * @param {jQuery} div
         */
        _changeToolStyle: function (style, div) {
            var me = this,
                el = div || me.getElement();

            if (!el) {
                return;
            }

            var styleClass = 'toolstyle-' + (style ? style : 'default');

            var classList = el.attr('class').split(/\s+/);
            for(var c=0;c<classList.length;c++){
                var className = classList[c];
                if(className.indexOf('toolstyle-') > -1){
                    el.removeClass(className);
                }
            }
            el.addClass(styleClass);
        }
    }, {
        'extend': ['Oskari.mapping.mapmodule.plugin.BasicMapModulePlugin'],
        /**
         * @static @property {string[]} protocol array of superclasses
         */
        'protocol': [
            "Oskari.mapframework.module.Module",
            "Oskari.mapframework.ui.module.common.mapmodule.Plugin"
        ]
    });