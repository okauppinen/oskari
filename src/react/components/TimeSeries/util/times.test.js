import { getFullYearRange, parseTimeToValue, getISOTime, getTimesFromAttributes, nextValueByInterval, getSkipOptions } from './times';
import { timeUnits, playerSkip } from './constants';

const getMM = mm => `2020-${mm}-01T00:00:00.000Z`;
const getDD = dd => `2020-01-${dd}T00:00:00.000Z`;
const getHH = hh => `2020-01-01T${hh}:00:00.000Z`;

describe('getFullYearRange function', () => {
    test('does not fail on invalid/missing time', () => {
        expect.assertions(2);
        expect(getFullYearRange()).toEqual([]);
        expect(getFullYearRange('foo')).toEqual([]);
    });

    test('returns ISO range for single year', () => {
        expect.assertions(2);
        const expected = ['2024-01-01T00:00:00.000Z', '2024-12-31T23:59:59.999Z'];
        expect(getFullYearRange('2024-11-22T15:45:24.125Z')).toEqual(expected);
        expect(getFullYearRange(2024)).toEqual(expected);
    });
    test('returns ISO range for range', () => {
        expect.assertions(2);
        const expected = ['2020-01-01T00:00:00.000Z', '2024-12-31T23:59:59.999Z'];
        expect(getFullYearRange(['2020-11-22', '2024-11-22'])).toEqual(expected);
        expect(getFullYearRange([2020, 2024])).toEqual(expected);
    });
});
describe('getISOTime function', () => {
    test('does not fail on invalid/missing time', () => {
        expect.assertions(3);
        expect(getISOTime()).toEqual(new Date().toISOString());
        expect(getISOTime('foo')).toEqual('');
        expect(getISOTime('11.2024')).toEqual('');
    });
    test('returns ISO time', () => {
        expect.assertions(5);
        const iso = '2024-11-22T15:45:24.125Z';
        expect(getISOTime(iso)).toEqual(iso);
        expect(getISOTime('2024')).toEqual('2024-01-01T00:00:00.000Z');
        expect(getISOTime('2024-11')).toEqual('2024-11-01T00:00:00.000Z');
        expect(getISOTime('2024-11-11')).toEqual('2024-11-11T00:00:00.000Z');
        // time is strigified so numbers should work for years
        expect(getISOTime(2024)).toEqual('2024-01-01T00:00:00.000Z');
    });
});

describe('parseTimeToValue function', () => {
    const time = '2024-11-22T15:45:24.125Z'
    test('returns year', () => {
        expect.assertions(1);
        expect(parseTimeToValue(time, timeUnits.YEAR)).toEqual('2024');
    });
    test('returns month/year', () => {
        expect.assertions(1);
        expect(parseTimeToValue(time, timeUnits.MONTH)).toEqual('11/2024');
    });
    test('returns locale date', () => {
        expect.assertions(2);
        Oskari.setLang('fi');
        expect(parseTimeToValue(time, timeUnits.DAY)).toEqual('22.11.2024');
        Oskari.setLang('en');
        expect(parseTimeToValue(time, timeUnits.DAY)).toEqual('11/22/2024');
        
    });
    test('returns locale time', () => {
        expect.assertions(2);
        Oskari.setLang('fi');
        expect(parseTimeToValue(time, timeUnits.HOUR)).toEqual('17.45');
        Oskari.setLang('en');
        expect(parseTimeToValue(time, timeUnits.HOUR)).toEqual('5:45 PM');
    });
    test('returns locale datetime', () => {
        expect.assertions(2);
        Oskari.setLang('fi');
        expect(parseTimeToValue(time)).toEqual('22.11.2024 17.45'); // or 22. marras 2024, klo 17.45
        Oskari.setLang('en');
        expect(parseTimeToValue(time)).toEqual('11/22/2024 5:45 PM'); // or Nov 22, 2024 5:45 PM
    });
});

describe('getTimesFromAttributes function', () => {
    test('returns empty', () => {
        expect.assertions(3);
        expect(getTimesFromAttributes()).toEqual([]);
        expect(getTimesFromAttributes(null)).toEqual([]);
        expect(getTimesFromAttributes({})).toEqual([]);
    });

    test('returns same', () => {
        expect.assertions(2);
        const times = [2022, 2023, 2024];
        expect(getTimesFromAttributes({ times })).toEqual(times);
        const iso = ['2024-11-23T11:54:19.206Z']
        expect(getTimesFromAttributes({ times: iso })).toEqual(iso);
    });

    test('return ISO times from interval', () => {
        expect.assertions(7);
        const months = getTimesFromAttributes({ times: {start: getMM('01'), end: getMM('12'), interval: 'P1M'}})
        expect(months.length).toEqual(12);
        // don't loop list because summer time doesn't work with them
        expect(months.at(0)).toEqual(getMM('01'));
        expect(months.at(1)).toEqual(getMM('02'));
        expect(months.at(-2)).toEqual(getMM('11'));
        expect(months.at(-1)).toEqual(getMM('12'));

        const days = getTimesFromAttributes({ times: {start: getHH('02'), end: getHH('21'), interval: 'PT1H'}});
        const expected = [];
        for (let i = 2; i <= 21; i++) {
            const hh = i < 10 ? '0' + i : i;
            expected.push(getHH(hh));
        }
        expect(days.length).toEqual(20);
        expect(days).toEqual(expected);
    });
});

describe('nextValueByInterval function', () => {
    test('returns next value by interval', () => {
        expect.assertions(8);
        const interval = key => playerSkip.find(s => s.key === key).value;
        const time = getMM('01');

        expect(nextValueByInterval(time, interval('none'))).toEqual(time);

        const hour = nextValueByInterval(time, interval('hour'));
        expect(hour).toEqual(getHH('01'));
        expect(nextValueByInterval(hour, interval('hour'))).toEqual(getHH('02'));

        let minute = time;
        expect(minute).toEqual(getHH('00'));
        for (let i = 0; i < 60; i++) {
            minute = nextValueByInterval(minute, interval('minute'));
        }
        expect(minute).toEqual(getHH('01'));

        expect(nextValueByInterval(time, interval('day'))).toEqual(getDD('02'));
        expect(nextValueByInterval(time, interval('week'))).toEqual(getDD('08'));
        expect(nextValueByInterval(time, interval('month'))).toEqual(getMM('02'));
    });
});

describe('getSkipOptions function', () => {
    test('returns  ', () => {
        expect.assertions(4);
        const all = [getHH('01'), getHH('01')];
        expect(getSkipOptions(all)).toEqual(playerSkip);
        const day = [getHH('01'), getHH('05')];
        expect(getSkipOptions(day)).toEqual(playerSkip.slice(3));
        const week = [getDD('01'), getDD('05')];
        expect(getSkipOptions(week)).toEqual(playerSkip.slice(4));
        // Use short month (february) to get 'months' option
        const month = [getMM('02'), getMM('03')];
        expect(getSkipOptions(month)).toEqual(playerSkip.filter(s => s.key ===  'month'));
    });
});