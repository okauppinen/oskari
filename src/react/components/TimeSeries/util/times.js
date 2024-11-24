import { timeUnits, playerSkip } from './constants';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import duration from 'dayjs/plugin/duration';
import customParseFormat from 'dayjs/plugin/customParseFormat';
// TODO: or store format in locale?
import localizedFormat from 'dayjs/plugin/localizedFormat';
import 'dayjs/locale/en';
import 'dayjs/locale/fi';
import 'dayjs/locale/sv';

dayjs.extend(duration);
dayjs.extend(utc);
dayjs.extend(customParseFormat);
dayjs.extend(localizedFormat)

/* --------- FORMATTERS ---------- */
export const getFullYearRange = (time, stringify = true) => {
    const arr = Array.isArray(time) ? time : [time, time];
    // dayjs returns invalid for null, undefined,..
    return arr
        .map(t => typeof t === 'number' ? t.toString() : t)
        .map(t => dayjs.utc(t, 'YYYY'))
        .map((d, i) => i === 0 ? d.startOf('year') : d.endOf('year'))
        .filter(d => d.isValid())
        .map(d => stringify ? d.toISOString(): d);
};

// TODO: return number or string?? if string local time (dayjs, i18)??
export const parseTimeToValue = (time, unit) => {
    const d = dayjs(time);
    const loc = Oskari.getLang();
    if (!d.isValid()) {
        return '';
    }
    if (unit === timeUnits.YEAR_INT) {
        return d.year();
    } else if (unit === timeUnits.YEAR) {
        return d.year().toString();
    } else if (unit === timeUnits.MONTH) {
        const d = dayjs(time);
        return `${d.month() + 1}/${d.year()}`;
    } else if (unit === timeUnits.DAY) {
        return d.locale(loc).format('l');
    } else if (unit === timeUnits.HOUR) {
        return d.locale(loc).format('LT');
    }
    return d.locale(loc).format('l LT');
};

export const getISOTime = raw => {
    const time = raw && raw.toString();
    const d = dayjs.utc(time);
    if (d.isValid()) {
        return d.toISOString();
    }
    return '';
};
/* --------- /FORMATTERS ---------- */

/* --------- LAYER RELATED ---------- */

export const getTimesFromAttributes = (attributes) => {
    let { times = [] } = attributes || {};
    if (Array.isArray(times)) {
        // TODO: support other than ISO times in attributes? map to ISO?
        return times;
    }
    const { end, start, interval } = times;
    let time = dayjs(start);
    const last = dayjs(end);
    const duration = dayjs.duration(interval);
    if (!interval || !time.isValid() || !last.isValid() || time.isAfter(last)) {
        Oskari.log('TimeSeriesHelper').error('Invalid interval');
        return [];
    }
    times = [];
    for (time; time.isBefore(last); time = time.add(duration)) {
        times.push(time.toISOString());
    }
    times.push(last.toISOString());
    return times;
};

export const determineTimeUnit = (times) => {
    // Check only one duration for optimization
    // admin can define timeUnit in layer attributes metadata
    const first = dayjs(times[0]);
    const next = dayjs(times[1]);
    const last = dayjs(times.at(-1));
    const duration = dayjs.duration(next.diff(first));
    const range = dayjs.duration(last.diff(first));
    // TODO:
    // duration(next.diff(first))
    // duration(last.diff(first))
    // duration.asDays() or .years(), .months(),..
};
export const getSkipOptions = (times) => {
    // TODO: loop values to find shortest interval??
    const first = dayjs(times[0]);
    const next = dayjs(times[1]);
    const duration = dayjs.duration(next.diff(first));
    return playerSkip.filter(({ value }) => dayjs.duration(1, value) >= duration);
};

/* --------- /LAYER RELATED ---------- */

/* ---------- CALCULATIONS -----------*/
export const nextValueByInterval = (time, stepInterval) => {
    if (!stepInterval) {
        return time;
    }
    const d = dayjs(time).add(1, stepInterval);
    return d.isValid ? d.toISOString() : '';
};

const calculateYearDifference = (from, to) => {
    return from - to;
};

const calculateMonthDifference = (from, to) => {
    return dayjs(to).diff(dayjs(from), timeUnits.MONTH);
};

const calculateDayDifference = (from, to) => {
    return dayjs(to).diff(dayjs(from), timeUnits.DAY);
};

const calculateHourDifference = (from, to) => {
    return dayjs(to).diff(dayjs(from), timeUnits.HOUR);
};

export const getDifferenceCalculator = (unit) => {
    switch (unit) {
        case timeUnits.YEAR:
            return calculateYearDifference;
        case timeUnits.MONTH:
            return calculateMonthDifference;
        case timeUnits.DAY:
            return calculateDayDifference;
        case timeUnits.HOUR:
            return calculateHourDifference;
        default:
            return calculateYearDifference;
    }
};
/* ---------- /CALCULATIONS -----------*/
