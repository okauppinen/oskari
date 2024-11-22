import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { StateHandler, controllerMixin } from 'oskari-ui/util';
import { showTimeSeriesPlayer } from 'oskari-ui/components/TimeSeries';
import { TimeseriesMetadataService } from '../service/TimeseriesMetadataService';
import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(utc);
dayjs.extend(customParseFormat);

const debounceTime = 300;

// TODO move to helper? dayjs imports??
const _getStartTimeFromYear = (year) => {
    if (!year) {
        return null;
    }
    return dayjs.utc(year.toString(), 'YYYY').startOf('year');
};

const _getEndTimeFromYear = (year) => {
    if (!year) {
        return null;
    }
    return dayjs.utc(year.toString(), 'YYYY').endOf('year');
};

const _getDataYearsFromWMS = (layer) => {
    if (!layer) {
        return [];
    }
    // get years from WMS-layer timeseries
    const { times = [] } = layer.getAttributes();
    return times.map(time => dayjs(time).year());
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
            // TODO: use mode for all??: player, year, range => jsx
            mode: 'year', // year or range for range player TODO: refactor?? (it not stored)
            ui: 'player',
            value: null,
            values: []
        });
        this.addStateListener(state => this._playerControls && this._playerControls.update(state));
    }

    getLayer () {
        return this._delegate?.getLayer();
    }

    setDelegate (delegate) {
        if (delegate && this._delegate?.getLayer() === delegate.getLayer()) {
            // already set
            return;
        }
        this._delegate = delegate;
        const layer = delegate.getLayer();
        const { timeseries = {} } = layer.getOptions();

        const ui = timeseries.ui || 'player';
        const title = layer.getName();
        const [start, end] = delegate.getYearRange(); // TODO: mode
        const hasMetadata = this._initMetadataLayer(layer);
        const values = hasMetadata ? [] : _getDataYearsFromWMS(layer);
        const value = values[0]; // TODO: autoselect ?
        this.updateState({ start, end, title, value, values, ui });

        delegate.onDestroy(() => this._teardown());
        this.showPlayer();
    }

    showPlayer () {
        if (this._playerControls) {
            return;
        }
        this._playerControls = showTimeSeriesPlayer(
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
        return { time: this.getState().value };
    }

    updateValue (value, mode) {
        const state = { value };
        if (mode) {
            state.mode = mode;
        }
        this.updateState(state);
        if (this._timer) {
            clearTimeout(this._timer);
        }
        this._timer = setTimeout(() => this._requestNewTime(value), debounceTime);
    }

    setValue (value) {
        this.updateState({ value });
        if (this._timer) {
            clearTimeout(this._timer);
        }
        this._timer = setTimeout(() => this._requestNewTime(value), debounceTime);
    }

    _autoSelectMidDataYear (dataYears) {
        if (!this._shouldAutoSelectMidDataYear || !dataYears.length) {
            return;
        }
        this._shouldAutoSelectMidDataYear = false;
        const value = dataYears[Math.ceil(dataYears.length / 2)];
        this.updateValue(value);
    }

    _requestNewTime (value) {
        let startYear = null;
        let endYear = null;
        if (Array.isArray(value)) {
            startYear = value[0];
            endYear = value[1];
        } else {
            startYear = value;
            endYear = value;
        }
        const startTime = _getStartTimeFromYear(startYear);
        const endTime = _getEndTimeFromYear(endYear);
        if (!startTime || !endTime) {
            return null;
        }
        const newTime = `${startTime.toISOString()}/${endTime.toISOString()}`;
        this._delegate.requestNewTime(newTime);
        this._updateFeaturesByTime(startTime, endTime);
    }

    _getTimeRange () {
        const { time } = this.getState();
        let startYear = null;
        let endYear = null;
        if (time.length === 2) {
            startYear = time[0];
            endYear = time[1];
        } else {
            startYear = time;
            endYear = time;
        }
        return [_getStartTimeFromYear(startYear), _getEndTimeFromYear(endYear)];
    }

    /* ------------------ METADATA ------------------------ */
    _initMetadataLayer (layer) {
        if (!layer) {
            return false;
        }
        const options = layer.getOptions() || {};
        const timeseries = options.timeseries || {};
        const metadata = timeseries.metadata || {};
        const layerId = metadata.layer;
        if (!layerId) {
            return false;
        }
        const attribute = metadata.attribute || 'time';
        this._metadataHandler = new TimeseriesMetadataService(layerId, attribute, metadata.toggleLevel, !!metadata.visualize);
        return true;
    }

    setCurrentViewportBbox (bbox, zoomLevel) {
        if (!this._metadataHandler) {
            return;
        }
        if (this._metadataHandler.getToggleLevel() > zoomLevel) {
            const dataYears = this._getDataYearsFromWMS(this.getLayer());
            this._autoSelectMidDataYear(dataYears);
            this.updateState({ dataYears, error: false });
            return;
        }
        this.updateState({ error: false, loading: true });
        this._metadataHandler.setBbox(
            bbox,
            (dataYears) => {
                this._autoSelectMidDataYear(dataYears);
                this.updateState({ dataYears, loading: false });
                const [start, end] = this._getTimeRange();
                this._updateFeaturesByTime(start, end);
            },
            (error) => {
                this.updateState({ error: true, loading: false });
                Oskari.log('TimeSeries').warn('Error updating features', error);
            }
        );
    }

    _updateFeaturesByTime (start, end) {
        if (!this._metadataHandler) {
            return;
        }
        this._metadataHandler.showFeaturesForRange(start, end);
    }

    _teardown () {
        // TODO: this.closePlayer() ??
        if (!this._metadataHandler) {
            return;
        }
        this._metadataHandler.clearPreviousFeatures();
    }

    /* ------------------ /METADATA ------------------------ */
}

export const TimeSeriesHandler = controllerMixin(UIHandler, [
    'updateValue',
    'setCurrentViewportBbox'
]);
