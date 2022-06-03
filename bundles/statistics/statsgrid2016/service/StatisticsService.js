/**
 * @class Oskari.statistics.statsgrid.StatisticsService
 */
(function (Oskari) {
    /* eslint-disable node/no-callback-literal */
    const _log = Oskari.log('StatsGrid.StatisticsService');
    let _cacheHelper = null;

    Oskari.clazz.define('Oskari.statistics.statsgrid.StatisticsService', function (sandbox, locale) {
        this.sandbox = sandbox;
        this.locale = locale;
        this.cache = Oskari.clazz.create('Oskari.statistics.statsgrid.Cache');
        _cacheHelper = Oskari.clazz.create('Oskari.statistics.statsgrid.CacheHelper', this.cache, this);
        this.series = Oskari.clazz.create('Oskari.statistics.statsgrid.SeriesService', sandbox);
        this.state = Oskari.clazz.create('Oskari.statistics.statsgrid.StateService', sandbox, this);
        this.colors = Oskari.clazz.create('Oskari.statistics.statsgrid.ColorService');
        this.classification = Oskari.clazz.create('Oskari.statistics.statsgrid.ClassificationService', this.colors);
        this.error = Oskari.clazz.create('Oskari.statistics.statsgrid.ErrorService', sandbox);
        this.missingRegionsetNamesCount = 0;

        // pushed from instance
        this.datasources = [];
        this.regionsets = [];
        // attach on, off, trigger functions
        Oskari.makeObservable(this);

        // possible values: wms, vector
        this._mapModes = ['vector'];

        // Make series service listen for changes
        this.series.bindToEvents(this);

        this.log = Oskari.log(this.getQName());
    }, {
        __name: 'StatsGrid.StatisticsService',
        __qname: 'Oskari.statistics.statsgrid.StatisticsService',

        getQName: function () {
            return this.__qname;
        },
        getName: function () {
            return this.__name;
        },
        getSandbox: function () {
            return this.sandbox;
        },
        setMapModes: function (mapModes) {
            this._mapModes = mapModes;
        },
        getMapModes: function () {
            return this._mapModes;
        },
        hasMapMode: function (mode) {
            const me = this;
            let hasMode = false;
            me._mapModes.forEach(function (mapmode) {
                if (mapmode === mode) {
                    hasMode = true;
                }
            });
            return hasMode;
        },
        /**
         * Used to propate Oskari events for files that have reference to service, but don't need to be registered to sandbox.
         * Usage: service.on('StatsGrid.RegionsetChangedEvent', function(evt) {});
         *
         * statsgrid/instance.js registers eventhandlers and calls this to let components know about events.
         * @param  {Oskari.mapframework.event.Event} event event that needs to be propagated to components
         */
        notifyOskariEvent: function (event) {
            this.trigger(event.getName(), event);
        },
        getSeriesService: function () {
            return this.series;
        },
        getStateService: function () {
            return this.state;
        },
        getClassificationService: function () {
            return this.classification;
        },
        getColorService: function () {
            return this.colors;
        },
        getErrorService: function () {
            return this.error;
        },
        getAllServices: function () {
            return {
                seriesService: this.series,
                stateService: this.state,
                classificationService: this.classification,
                colorService: this.colors,
                errorService: this.error
            };
        },
        addDatasource: function (ds) {
            if (!ds) {
                // log error message
                return;
            }
            const me = this;
            if (Array.isArray(ds)) {
                // if(typeof ds === 'array') -> loop and add all
                ds.forEach(function (item) {
                    me.addDatasource(item);
                });
                return;
            }
            // normalize to always have info-object (so far only holds optional description url of service with "url" key)
            ds.info = ds.info || {};
            this.datasources.push(ds);
        },
        getUserDatasource: function () {
            return this.datasources.find(function (src) {
                return src.type === 'user';
            });
        },
        getUILabels: function (ind, callback) {
            const selectionValues = this.locale('panels.newSearch.selectionValues');
            if (typeof callback !== 'function') {
                this.log.warn('Requested UI labels without callback function');
                return;
            }
            const { datasource, indicator, selections, series } = ind;

            this.getIndicatorMetadata(datasource, indicator, function (err, meta) {
                if (err) {
                    callback({
                        error: true,
                        indicator: '',
                        params: '',
                        full: '',
                        paramsAsObject: {}
                    });
                    return;
                }
                const { name, selectors, source } = meta;
                const uiLabels = [];
                Object.keys(selections).forEach(key => {
                    const selection = selections[key];
                    const foundSelector = selectors.find(s => s.id === key);
                    if (foundSelector) {
                        const value = foundSelector.allowedValues.find(v => selection === v.id || selection === v);
                        const isObject = typeof value === 'object';
                        const selector = foundSelector.id;
                        const id = isObject ? value.id : value;
                        let label;
                        if (isObject) {
                            label = value.name;
                        } else {
                            // try finding localization for the param
                            label = Oskari.util.keyExists(selectionValues, selector + '.' + value) ? selectionValues[selector][value] : value;
                        }
                        uiLabels.push({ selector, id, label });
                    }
                });
                const localizedName = Oskari.getLocalized(name);
                let selectorsFormatted = ' (' + uiLabels.map(l => l.label).join(' / ') + ')';
                if (series) {
                    const range = String(series.values[0]) + ' - ' + String(series.values[series.values.length - 1]);
                    selectorsFormatted = range + ' ' + selectorsFormatted;
                }
                callback({
                    indicator: localizedName,
                    source: Oskari.getLocalized(source),
                    params: selectorsFormatted,
                    full: localizedName + ' ' + selectorsFormatted,
                    paramsAsObject: uiLabels
                });
            });
        },
        /**
         * Returns datasource {id, name, type} as object.
         * If id omitted returns all datasources as array.
         * If datasource with matching id isn't found returns null.
         * @param  {Number} id datasource id
         * @return {Object[]|Object|Null} datasource information or null if not found
         */
        getDatasource: function (id) {
            if (!id) {
                return this.datasources;
            }
            let found = null;
            this.datasources.forEach(function (ds) {
                if ('' + ds.id === '' + id) {
                    found = ds;
                }
            });
            return found;
        },
        addRegionset: function (regionset) {
            if (!regionset) {
                // log error message
                return;
            }
            const me = this;
            if (Array.isArray(regionset)) {
                // if(typeof regionset === 'array') -> loop and add all
                regionset.forEach(function (item) {
                    me.addRegionset(item);
                });
                return;
            }
            if (!regionset.name) {
                regionset.name = `${this.locale('missing.regionsetName')} ${++this.missingRegionsetNamesCount}`;
            }
            if (regionset.id && regionset.name) {
                this.regionsets.push(regionset);
            } else {
                _log.info('Ignoring regionset without id or name:', regionset);
            }
        },
        /**
         * Returns regionsets that are available to user.
         * Based on maplayers of type STATS.
         */
        getRegionsets: function (includeOnlyIds) {
            const list = this.regionsets || [];
            if (!list || list.length === 0) {
                return [];
            }
            const singleValue = typeof includeOnlyIds === 'number' || typeof includeOnlyIds === 'string';
            if (singleValue) {
                // wrap to an array
                includeOnlyIds = [includeOnlyIds];
            }
            if (Array.isArray(includeOnlyIds)) {
                const result = list.filter(function (reg) {
                    return includeOnlyIds.indexOf(reg.id) !== -1;
                });
                if (singleValue) {
                    // if requested with single value, unwrap result from array
                    return result.length ? result[0] : null;
                }
                return result;
            }
            return list;
        },
        /**
         * Calls callback with a list of regions for the regionset.
         * @param  {Number}   regionset regionset id
         * @param  {Function} callback  function to call with error or results
         */
        getRegions: function (regionset, callback) {
            if (typeof callback !== 'function') {
                this.log.warn('Requested regions without callback function');
                return;
            }
            if (!regionset) {
                this.log.warn('Requested regions without regionset');
                callback('Regionset missing');
                return;
            }
            const me = this;
            const cacheKey = _cacheHelper.getRegionsKey(regionset);
            if (this.cache.tryCachedVersion(cacheKey, callback)) {
                // found a cached response
                return;
            }
            if (this.cache.addToQueue(cacheKey, callback)) {
                // request already in progress
                return;
            }
            // call GetRegions with parameter regionset=regionset
            // use first param as error indicator - null == no error
            jQuery.ajax({
                type: 'GET',
                dataType: 'json',
                data: {
                    regionset: regionset,
                    srs: this.sandbox.getMap().getSrsName()
                },
                url: Oskari.urls.getRoute('GetRegions'),
                success: function (pResp) {
                    const onlyWithNames = pResp.regions.filter(function (region) {
                        return !!region.name;
                    });
                    me.cache.respondToQueue(cacheKey, null, onlyWithNames);
                },
                error: function (jqXHR, textStatus) {
                    me.cache.respondToQueue(cacheKey, 'Error loading regions');
                }
            });
        },
        /**
         * Calls callback with a list of indicators for the datasource.
         * @param  {Number}   ds       datasource id
         * @param  {Function} callback function to call with error or results
         */
        getIndicatorList: function (ds, callback) {
            if (typeof callback !== 'function') {
                // log error message
                return;
            }
            if (!ds) {
                // log error message
                callback('Datasource missing');
                return;
            }
            const cacheKey = _cacheHelper.getIndicatorListKey(ds);
            if (this.cache.tryCachedVersion(cacheKey, callback)) {
                // found a cached response
                return;
            }
            if (this.cache.addToQueue(cacheKey, callback)) {
                // request already in progress
                return;
            }

            const me = this;
            const updateIncompleteIndicatorList = function (previousList) {
                _log.info('Indicator listing was not complete. Refreshing in 10 seconds');
                setTimeout(function () {
                    me.cache.remove(cacheKey);
                    // try again after 10 seconds
                    me.getIndicatorList(ds, function (err, newResponse) {
                        if (err) {
                            // Don't call callback with err as we will be trying again.
                            _log.warn('Error updating indicator list.');
                            return;
                        }
                        if (!newResponse.complete && newResponse.indicators.length === previousList.length) {
                            // same list size??? somethings propably wrong
                            _log.warn('Same indicator list as in previous try. There might be some problems with the service');
                            return;
                        }
                        // send out event about new indicators
                        const eventBuilder = Oskari.eventBuilder('StatsGrid.DatasourceEvent');
                        me.sandbox.notifyAll(eventBuilder(ds));
                    });
                }, 10000);
            };

            // call GetIndicatorList with parameter datasource=ds
            // use first param as error indicator - null == no error
            jQuery.ajax({
                type: 'GET',
                dataType: 'json',
                data: {
                    datasource: ds
                },
                url: Oskari.urls.getRoute('GetIndicatorList'),
                success: function (pResp) {
                    me.cache.respondToQueue(cacheKey, null, pResp);
                    if (!pResp.complete) {
                        // wasn't complete dataset - remove from cache and poll for more
                        updateIncompleteIndicatorList(pResp.indicators);
                    }
                },
                error: function (jqXHR, textStatus) {
                    me.cache.respondToQueue(cacheKey, 'Error loading indicators');
                }
            });
        },
        /**
         * Calls callback with a list of indicators for the datasource.
         * @param  {Number}   ds        datasource id
         * @param  {Number}   indicator indicator id
         * @param  {Function} callback  function to call with error or results
         */
        getIndicatorMetadata: function (ds, indicator, callback) {
            if (typeof callback !== 'function') {
                // log error message
                return;
            }
            if (!ds || !indicator) {
                // log error message
                callback('Datasource or indicator missing');
                return;
            }
            const me = this;
            const cacheKey = _cacheHelper.getIndicatorMetadataKey(ds, indicator);
            if (this.cache.tryCachedVersion(cacheKey, callback)) {
                // found a cached response
                return;
            }
            if (this.cache.addToQueue(cacheKey, callback)) {
                // request already in progress
                return;
            }
            // call GetIndicatorMetadata with parameter datasource=ds and indicator=indicator
            // use first param as error indicator - null == no error
            jQuery.ajax({
                type: 'GET',
                dataType: 'json',
                data: {
                    datasource: ds,
                    indicator: indicator
                },
                url: Oskari.urls.getRoute('GetIndicatorMetadata'),
                success: function (pResp) {
                    me.cache.respondToQueue(cacheKey, null, pResp);
                },
                error: function (jqXHR, textStatus) {
                    me.cache.respondToQueue(cacheKey, 'Error loading indicator metadata');
                }
            });
        },
        /**
         * Calls callback with a list of indicators for the datasource.
         * @param  {Number}   ds        datasource id
         * @param  {Number}   indicator indicator id
         * @param  {Object}   params    indicator selections
         * @param  {Object}   series    serie keys
         * @param  {Object}   regionset regionset
         * @param  {Function} callback  function to call with error or results
         */
        getIndicatorData: function (ds, indicator, params, series, regionset, callback) {
            if (typeof callback !== 'function') {
                // log error message
                return;
            }
            if (!ds || !indicator || !regionset) {
                // log error message
                callback('Datasource, regionset or indicator missing');
                return;
            }
            if (series && series.values.indexOf(params[series.id]) === -1) {
                callback('Requested dataset is out of range');
                return;
            }
            const me = this;
            const data = {
                datasource: ds,
                indicator: indicator,
                regionset: regionset,
                selectors: JSON.stringify(params || {})
            };

            const cacheKey = _cacheHelper.getIndicatorDataKey(ds, indicator, params, regionset);
            _log.debug('Getting data with key', cacheKey);

            function fractionInit (err, data) {
                const hash = me.state.getHash(ds, indicator, params, series);
                if (!err) {
                    me._setInitialFractions(hash, data);
                }
                callback(err, data);
            }
            if (this.cache.tryCachedVersion(cacheKey, fractionInit)) {
                // found a cached response
                return;
            }
            if (this.cache.addToQueue(cacheKey, fractionInit)) {
                // request already in progress
                return;
            }
            // call GetIndicatorData with parameters:
            // - datasource=ds
            // - indicator=indicator
            // - selectors=serialized params
            // - regionset = regionset
            // use first param as error indicator - null == no error
            jQuery.ajax({
                type: 'GET',
                dataType: 'json',
                data: data,
                url: Oskari.urls.getRoute('GetIndicatorData'),
                success: function (pResp) {
                    me.getRegions(regionset, function (err, regions) {
                        if (err) {
                            me.cache.respondToQueue(cacheKey, 'Error loading indicator data');
                            return;
                        }
                        // filter out data for regions that are not part of the regionset since some adapters return additional data!
                        // any additional data will result in broken classification
                        const filteredResponse = {};
                        regions.forEach(function (reg) {
                            filteredResponse[reg.id] = pResp[reg.id];
                        });
                        me.cache.respondToQueue(cacheKey, null, filteredResponse);
                    });
                },
                error: function (jqXHR, textStatus) {
                    me.cache.respondToQueue(cacheKey, 'Error loading indicator data');
                }
            });
        },
        /**
         * @method @private _setInitialFractions
         * Sets initial fractionDigits for presentation of indicator
         * Zero if indicator has only integers values, otherwise 1
         * @param {String} indicatorHash
         * @param {Object} data indicator data
         */
        _setInitialFractions: function (indicatorHash, data) {
            const ind = this.state.getIndicator(indicatorHash);
            if (!ind) {
                return;
            }
            if (typeof ind.classification.fractionDigits !== 'number') {
                const allInts = Object.keys(data).every(function (key) {
                    return data[key] % 1 === 0;
                });
                ind.classification.fractionDigits = allInts ? 0 : 1;
            }
        },
        getSelectedIndicatorsRegions: function () {
            const me = this;
            const indicators = me.getStateService().getIndicators();
            const regionsets = [];
            const addRegions = function (regions) {
                for (let i = 0; i < regions.length; i++) {
                    if (jQuery.inArray(regions[i], regionsets) === -1) {
                        regionsets.push(regions[i]);
                    }
                }
            };
            for (let i = 0; i < indicators.length; i++) {
                const ind = indicators[i];
                me.getIndicatorMetadata(ind.datasource, ind.indicator, function (err, indicator) {
                    if (!err) {
                        addRegions(indicator.regionsets);
                    }
                });
            }
            return regionsets;
        },
        // FIXME: getIndicatorData returns error if dataset contains serie which is outside of current selection
        getCurrentDataset: function (callback) {
            const me = this;
            if (typeof callback !== 'function') {
                return;
            }
            const setId = this.getStateService().getRegionset();
            if (!setId) {
                callback('No regionset selected');
                return;
            }
            const regionset = this.getRegionsets(setId);
            const response = {
                regionset: {
                    id: setId,
                    name: regionset.name
                },
                indicators: [],
                data: []
            };
            const indicators = this.getStateService().getIndicators();
            this.getRegions(setId, function (err, regions) {
                if (err) {
                    callback(err, response);
                    return;
                }

                regions.forEach(function (reg) {
                    response.data.push({
                        id: reg.id,
                        name: reg.name,
                        values: {}
                    });
                });
                if (!indicators.length) {
                    // no indicators, just respond with regions
                    callback(null, response);
                    return;
                }
                // figure out ui names and data for indicators
                let count = 0;
                let errors = 0;
                const done = function () {
                    if (errors) {
                        callback('Error populating indicators', response);
                        return;
                    }
                    callback(null, response);
                };
                indicators.forEach(function (ind) {
                    const metadata = {
                        datasource: {
                            id: ind.datasource,
                            name: me.getDatasource(ind.datasource).name
                        },
                        id: ind.indicator,
                        name: 'N/A',
                        selections: ind.selections,
                        series: ind.series,
                        hash: ind.hash
                    };
                    response.indicators.push(metadata);
                    me.getIndicatorMetadata(ind.datasource, ind.indicator, function (err, indicator) {
                        count++;
                        if (err) {
                            errors++;
                            return;
                        }
                        metadata.name = Oskari.getLocalized(indicator.name);
                        if (count === indicators.length * 2) {
                            // if count is 2 x indicators length both metadata and indicator data has been loaded for all indicators
                            done();
                        }
                    });

                    me.getIndicatorData(ind.datasource, ind.indicator, ind.selections, ind.series, setId, function (err, indicatorData) {
                        count++;
                        if (err) {
                            errors++;
                            return;
                        }
                        response.data.forEach(function (item) {
                            item.values[ind.hash] = indicatorData[item.id];
                        });
                        if (count === indicators.length * 2) {
                            done();
                        }
                    });
                });
            });
        },
        saveIndicator: function (datasrc, data, callback) {
            const me = this;
            if (typeof callback !== 'function') {
                return;
            }
            if (!datasrc) {
                callback('Datasource missing');
                return;
            }
            if (!data) {
                callback('Data missing');
                return;
            }
            const responseHandler = function (err, indicatorId) {
                if (err) {
                    callback(err);
                    return;
                }
                // send out event about new/updated indicators
                const eventBuilder = Oskari.eventBuilder('StatsGrid.DatasourceEvent');
                me.sandbox.notifyAll(eventBuilder(datasrc));
                callback(null, {
                    ds: datasrc,
                    id: indicatorId
                });
            };

            if (!Oskari.user().isLoggedIn()) {
                // successfully saved for guest user
                const indicatorId = data.id || 'RuntimeIndicator' + Oskari.seq.nextVal('RuntimeIndicator');
                _cacheHelper.updateIndicatorInCache(datasrc, indicatorId, data, function (err) {
                    responseHandler(err, indicatorId);
                });
                return;
            }
            // send data to server for logged in users
            jQuery.ajax({
                type: 'POST',
                dataType: 'json',
                data: {
                    // my indicators datasource id
                    datasource: datasrc,
                    id: data.id,
                    name: data.name,
                    desc: data.description,
                    // textual name for the source the data is from
                    source: data.datasource
                },
                url: Oskari.urls.getRoute('SaveIndicator'),
                success: function (pResp) {
                    _log.debug('SaveIndicator', pResp);
                    _cacheHelper.updateIndicatorInCache(datasrc, pResp.id, data, function (err) {
                        // send out event about new/updated indicators
                        responseHandler(err, pResp.id);
                    });
                },
                error: function (jqXHR, textStatus) {
                    responseHandler('Error saving data to server');
                }
            });
        },
        saveIndicatorData: function (datasrc, indicatorId, selectors, data, callback) {
            const me = this;
            if (typeof callback !== 'function') {
                return;
            }
            if (!datasrc) {
                callback('Datasource missing');
                return;
            }
            if (!indicatorId) {
                callback('Indicator missing');
                return;
            }
            if (!selectors) {
                callback('Selectors missing');
                return;
            }
            if (!data) {
                callback('Data missing');
                return;
            }
            const regionset = selectors.regionset;
            const actualSelectors = {};
            Object.keys(selectors).forEach(function (selectorId) {
                if (selectorId !== 'regionset') {
                    // filter out regionset
                    actualSelectors[selectorId] = selectors[selectorId];
                }
            });
            if (!Oskari.user().isLoggedIn()) {
                // successfully saved for guest user
                _cacheHelper.updateIndicatorDataCache(datasrc, indicatorId, actualSelectors, regionset, data, callback);
                // send out event about updated indicators
                me.sandbox.notifyAll(Oskari.eventBuilder('StatsGrid.DatasourceEvent')(datasrc));
                return;
            }
            // send data to server for logged in users
            jQuery.ajax({
                type: 'POST',
                dataType: 'json',
                data: {
                    datasource: datasrc,
                    id: indicatorId,
                    selectors: JSON.stringify(actualSelectors),
                    regionset: regionset,
                    data: JSON.stringify(data)
                },
                url: Oskari.urls.getRoute('AddIndicatorData'),
                success: function (pResp) {
                    _log.debug('AddIndicatorData', pResp);
                    _cacheHelper.updateIndicatorDataCache(datasrc, indicatorId, actualSelectors, regionset, data, callback);
                    // send out event about updated indicators
                    me.sandbox.notifyAll(Oskari.eventBuilder('StatsGrid.DatasourceEvent')(datasrc));
                },
                error: function (jqXHR, textStatus) {
                    callback('Error saving data to server');
                }
            });
        },
        /**
         * selectors and regionset are optional -> will only delete dataset from indicator if given
         */
        deleteIndicator: function (datasrc, indicatorId, selectors, regionset, callback) {
            const stateService = this.getStateService();
            // remove indicators from state before deleting indicator data
            stateService.getIndicators()
                .filter(ind => ind.datasource === datasrc && ind.indicator === indicatorId)
                .forEach(ind => {
                    stateService.removeIndicator(ind.datasource, ind.indicator, ind.selections, ind.series);
                });
            if (!Oskari.user().isLoggedIn()) {
                // just flush cache
                _cacheHelper.clearCacheOnDelete(datasrc, indicatorId, selectors, regionset);
                callback();
                return;
            }
            const me = this;
            const data = {
                datasource: datasrc,
                id: indicatorId
            };
            if (selectors && typeof selectors === 'object') {
                // only remove dataset from indicator, not the whole indicator
                data.selectors = JSON.stringify(selectors);
                data.regionset = regionset;
            }
            jQuery.ajax({
                type: 'POST',
                dataType: 'json',
                data: data,
                url: Oskari.urls.getRoute('DeleteIndicator'),
                success: function (pResp) {
                    _log.debug('DeleteIndicator', pResp);
                    _cacheHelper.clearCacheOnDelete(datasrc, indicatorId, selectors, regionset);
                    if (!selectors) {
                        // if selectors/regionset is missing -> trigger a DatasourceEvent as the indicator listing changes
                        const eventBuilder = Oskari.eventBuilder('StatsGrid.DatasourceEvent');
                        me.sandbox.notifyAll(eventBuilder(datasrc));
                    }
                    callback();
                },
                error: function (jqXHR, textStatus) {
                    callback('Error on server');
                }
            });
        },
        /**
         * @method  @public  getUnsupportedRegionsets
         * @description returns a list of unsupported regionsets for the currently selected datasource
         * @param datasource datasource
         */
        getUnsupportedRegionsets: function (ds) {
            const all = this.regionsets.slice(0);
            const supported = this.datasources.find(function (e) {
                return e.id === Number(ds);
            });
            if (supported) {
                supported.regionsets.forEach(function (index) {
                    for (let i = 0; i < all.length; i++) {
                        if (all[i].id === index) {
                            all.splice(i, 1);
                        }
                    }
                });
                return all;
            }
        },
        /**
         * @method  @public  getUnsupportedDatasets
         * @description returns a list of unsupported datasources for the currently selected regionset(s)
         * @param regionsets regionsets
         */
        getUnsupportedDatasetsList: function (regionsets) {
            if (regionsets === null) {
                return;
            }

            const unsupportedDatasources = [];
            this.datasources.forEach(function (ds) {
                const supported = regionsets.some(function (iter) {
                    return ds.regionsets.indexOf(Number(iter)) !== -1;
                });
                if (!supported) {
                    unsupportedDatasources.push(ds);
                }
            });
            return unsupportedDatasources;
        }
    }, {
        protocol: ['Oskari.mapframework.service.Service']
    });
}(Oskari));
