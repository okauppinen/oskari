import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { ThemeConsumer } from 'oskari-ui/util';
import { getNavigationTheme } from 'oskari-ui/theme/ThemeHelper';
import { Select } from 'oskari-ui';
import { Col, ColFixed } from './styled';
import { YearSlider } from './YearSlider';
import { IconButton } from 'oskari-ui/components/buttons';
import { StepBackwardOutlined, StepForwardOutlined } from '@ant-design/icons';

const ICON_PROPS = {
    iconSize: 18,
    shape: 'circle',
    bordered: true
};

const Row = styled.div`
    margin-top: 10px;
    padding: 0 20px 10px 20px;
    display: flex;
    flex-flow: row wrap;
    justify-content: space-around;
    align-items: flex-start;
    flex-wrap: wrap;
    text-align: center;
    align-items: center;
`;

const StyledIcon = styled(IconButton)`
    border-width: 2px;
`;

export const TimeSeriesYear = ThemeConsumer(({ onChange, start, end, value, values, theme }) => {
    const isMobile = Oskari.util.isMobile();
    // when current value is after last data layer
    let prevDataYear = values[values.length - 1] || null;
    let nextDataYear = null;
    for (let i = 0; i < values.length; i++) {
        if (values[i] === value) {
            // when current value is one of the data years
            prevDataYear = values[i - 1] || null;
            nextDataYear = values[i + 1] || null;
            break;
        }
        if (values[i] > value) {
            // when current value is between two data years or before first data year
            prevDataYear = values[i - 1] || null;
            nextDataYear = values[i];
            break;
        }
    }
    const color = getNavigationTheme(theme).getTextColor();
    const iconProps = { ...ICON_PROPS, color };

    if (isMobile) {
        const disabledYear = values.includes(value) ? null : value;
        // need to clone this, otherwise the "current year" will remain even if we switch to a valid year without panning the map
        const years = disabledYear ? [...values, disabledYear].sort() : values;
        const options = years.map(value => ({
            label: value,
            value,
            disabled: value === disabledYear
        }));

        return (
            <Row>
                <Col>
                    <StyledIcon { ...iconProps }
                        icon={<StepBackwardOutlined/>}
                        disabled={prevDataYear === null}
                        onClick={() => onChange(prevDataYear)} />
                </Col>
                <Col>
                    <Select value={value} onChange={(value) => onChange(parseInt(value))} options={options} />
                </Col>
                <Col>
                    <StyledIcon { ...iconProps }
                        icon={<StepForwardOutlined/>}
                        disabled={nextDataYear === null}
                        onClick={() => onChange(nextDataYear)}/>
                </Col>
            </Row>
        );
    }

    return (
        <Row>
            <Col>
                <StyledIcon { ...iconProps }
                    icon={<StepBackwardOutlined/>}
                    disabled={prevDataYear === null}
                    onClick={() => onChange(prevDataYear)} />
            </Col>
            <ColFixed>
                <YearRangeSlider
                    isMobile={isMobile}
                    included={false}
                    step={1}
                    start={start}
                    end={end}
                    values={values}
                    value={value}
                    onChange={(val) => onChange(val)}
                />
            </ColFixed>
            <Col>
                <StyledIcon { ...iconProps }
                    icon={<StepForwardOutlined/>}
                    disabled={nextDataYear === null}
                    onClick={() => onChange(nextDataYear)} />
            </Col>
        </Row>
    );
});

TimeSeriesYear.propTypes = {
    onChange: PropTypes.func.isRequired,
    start: PropTypes.number.isRequired,
    end: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
    values: PropTypes.arrayOf(PropTypes.number).isRequired
};
