import PropTypes from 'prop-types';
import React from 'react';
import { TimeSeriesRange } from './TimeSeriesRange';
import { TimeSeriesYear } from './TimeSeriesYear';

export const TimeSeriesRangeControl = ({
    onChange,
    start,
    end,
    value,
    values
}) => {
    const Control = Array.isArray(value) ? TimeSeriesRange : TimeSeriesYear;
    return <Control
        onChange={onChange}
        start={start}
        end={end}
        value={value}
        values={values}/>;
};

TimeSeriesRangeControl.propTypes = {
    onChange: PropTypes.func.isRequired,
    start: PropTypes.number.isRequired,
    end: PropTypes.number.isRequired,
    value: PropTypes.oneOfType([PropTypes.number, PropTypes.arrayOf(PropTypes.number)]).isRequired,
    values: PropTypes.arrayOf(PropTypes.number).isRequired
};
