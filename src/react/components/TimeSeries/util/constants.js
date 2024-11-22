export const playbackSpeedOptions = {
    HOUR: 'HH',
    MONTH: 'MM',
    YEAR: 'YYYY'
};

export const timeUnits = {
    HOUR: 'hour',
    DAY: 'day',
    MONTH: 'month',
    YEAR: 'year'
};

export const sliderTypes = {
    YEAR: 'year',
    DATE: 'date'
};

export const playerDefaults = {
    speed: 'normal',
    skip: 'none',
    animate: false
};

export const playerSpeed = [
    { key: 'slow', value: 1000},
    { key: 'normal', value: 2000},
    { key: 'fast', value: 3000}
];

// dayjs durations
export const playerSkip = [
    { key: 'none', value: ''},
    { key: 'minute', value: 'minutes'},
    { key: 'hour', value: 'hours'},
    { key: 'day', value: 'days'},
    { key: 'week', value: 'weeks'},
    { key: 'month', value: 'months'}
];
