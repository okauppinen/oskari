import { StateHandler, controllerMixin } from 'oskari-ui/util';
import { showTimeSeriesController, timeUnits, uiModes, parseTimeToValue, getFullYearRange, nextValueByInterval } from 'oskari-ui/components/TimeSeries';
import { TimeseriesMetadataService } from '../service/TimeseriesMetadataService';
import { bisectLeft } from 'd3';

const debounceTime = 300;

// TODO: move to helper?
const getOptionsFromLayer = (layer) => {
    if (!layer) {
        return {};
    }
    const title = layer.getName();

    const { timeseries = {} } = layer.getOptions();
    const uiMode = timeseries.ui || uiModes.PLAYER;
    let timeUnit = timeseries.unit;
    if (!timeUnit) {
        timeUnit = uiMode === uiModes.RANGE ? timeUnits.YEAR_INT : timeUnits.DAY;
    }
    return { uiMode, timeUnit, title };
};

class UIHandler extends StateHandler {
    constructor (instance) {
        super();
        this._instance = instance;
        this._delegate = null;
        this._timer = null;
        this._playerControls = null;
        this.setState({
            title: '',
            start: null,
            end: null,
            timeUnit: null, // to format shown value and request time
            uiMode: 'player', // player, range, none
            value: null, // TODO: always string or string | number
            values: []
        });
        this.addStateListener(state => this._playerControls && this._playerControls.update(state));
    }

    getLayer () {
        // Note that delegate protocol doesn't have layer or getLayer
        return this._delegate?.getLayer();
    }

    setDelegate (delegate) {
        if (!delegate || this._delegate === delegate) {
            // already set
            return;
        }
        this._delegate = delegate;
        const layer = delegate.getLayer();
        const { timeUnit, ...restLayerOpts } = getOptionsFromLayer(layer);

        const [start, end] = delegate.getSubsetRange().map(t => parseTimeToValue(t, timeUnit));
        const values = delegate.getTimes().map(t => parseTimeToValue(t, timeUnit)).filter(nonEmpty => nonEmpty);
        const value = values[0];

        if (delegate.getTimes().length !== values.length) {
            // remove invalid values from delegate by indexes
        }

        this._initMetadataLayer(layer);
        this.updateState({ start, end, value, values, timeUnit, ...restLayerOpts });

        delegate.onDestroy(() => this._teardownMetadata());
        this.showPlayer();
    }

    onMapSizeEvent (width) {
        Oskari.util.isMobile();
        // TODO: toggle to compact on small size
    }

    showPlayer () {
        if (this._playerControls) {
            this._playerControls.update(this.getState());
            return;
        }
        this._playerControls = showTimeSeriesController(
            this.getState(),
            val => this.setValue(val),
            { bundle: 'timeseries' },
            () => this.closePlayer()
        );
    }

    closePlayer () {
        this._playerControls?.close();
        this._playerControls = null;
    }

    setConfiguration () {}

    setStoredState (state) {
        const { time } = state || {};
        this.setValue(time);
    }

    getStateToStore () {
        // TODO: or ISO time from delegate. Maybe it's always right delegate for value (layer and permissions are correct)
        return { time: this.getState().value };
    }

    toggleValueMode () {
        // For now player handles internally
        const { value, values } = this.getState();
        const toggled = Array.isArray(value) ? value[0] : [values[0], value];
        this.setValue(toggled);
    }

    setValue (value, animating, stepInterval) {
        this.updateState({ value });
        if (!this._delegate) {
            return;
        }
        if (this._timer) {
            clearTimeout(this._timer);
        }
        const { values, timeUnit } = this.getState();
        const index = values.indexOf(value);
        const times = this._delegate.getTimes();
        const time = timeUnit === timeUnits.YEAR
            ? getFullYearRange(value).join('/')
            : times[index];
        if (animating) {
            let nextTime = times[index + 1];
            if (stepInterval) {
                const nextISO = nextValueByInterval(value, stepInterval);
                nextTime = times[bisectLeft(times, nextISO)];
            }
            // TODO: getFullYearRange
            this._requestNewTime(time, nextTime);
        }
        this._timer = setTimeout(() => this._requestNewTime(time), debounceTime);
    }

    _autoSelectMidDataYear (dataYears) {
        if (!this._shouldAutoSelectMidDataYear || !dataYears.length) {
            return;
        }
        this._shouldAutoSelectMidDataYear = false;
        const value = dataYears[Math.ceil(dataYears.length / 2)];
        this.updateValue(value);
    }

    _requestNewTime (time, next) {
        this._delegate.requestNewTime(time, next);
        this._updateFeaturesByTime();
    }

    /* ------------------ METADATA ------------------------ */
    _initMetadataLayer (layer) {
        if (!layer) {
            this._teardownMetadata();
            return;
        }
        const { metadata = {} } = layer.getOptions().timeseries || {};
        // TODO: should we check also that layer is available? No
        if (!metadata.layer) {
            return false;
        }
        this._metadataHandler = new TimeseriesMetadataService(metadata);
    }

    setCurrentViewportBbox (zoomLevel) {
        if (!this._metadataHandler) {
            return;
        }
        // TODO: use same filtered values than player skip ahead option
        // or override and init again from delegate when needed
        if (this._metadataHandler.getToggleLevel() > zoomLevel) {
            // const dataYears = getValuesFromLayer(this.getLayer());
            // this._autoSelectMidDataYear(dataYears);
            this.updateState({ error: false });
            return;
        }
        this.updateState({ error: false, loading: true });
        this._metadataHandler.getDataYearsFromService(
            (dataYears) => {
                this._autoSelectMidDataYear(dataYears);
                this._updateFeaturesByTime();
                this.updateState({ dataYears, loading: false });
            },
            (error) => {
                this.updateState({ error: true, loading: false });
                Oskari.log('TimeSeries').warn('Error updating features', error);
            }
        );
    }

    _updateFeaturesByTime () {
        if (!this._metadataHandler) {
            return;
        }
        const { value } = this.getState();
        const [start, end] = this.getFullYearRange(value, false);
        this._metadataHandler.showFeaturesForRange(start, end);
    }

    _teardownMetadata () {
        // TODO: this.closePlayer() ??
        if (!this._metadataHandler) {
            return;
        }
        this._metadataHandler.clearPreviousFeatures();
        this._metadataHandler = null;
    }

    /* ------------------ /METADATA ------------------------ */
}

export const TimeSeriesHandler = controllerMixin(UIHandler, [
    'updateValue',
    'setCurrentViewportBbox'
]);
