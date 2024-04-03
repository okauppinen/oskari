import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { Slider } from './Slider';
import { NumberInput } from './NumberInput';

const StyledSlider = styled('div')`
    width: 100%;
    padding: 0 10px 0 5px;
    float: left;
    .ant-slider-track {
        background-color: #0091ff;
    }
    .ant-slider-handle {
        border: #0091ff solid 2px;
        margin-top: -6px;
    }
    &:hover .ant-slider-track {
        background-color: #003fc3 !important;
    }
    &:hover .ant-slider-handle {
        border: #003fc3 solid 2px !important;
    }
    ${props => props.bordered && (
        `
            border-radius: 4px 0 0 4px;
            border: 1px solid #d9d9d9;
        `
    )}
`;

const Container = styled('div')`
    width: 100%;
    display: flex;
    flex-direction: row;
`;

const NumberInputContainer = styled('div')`
    display: flex;
    flex-direction: row;
`;

const NumberSuffix = styled('span')`
    margin: 0;
    padding-top: 5px;
`;

const StyledNumberInput = styled(NumberInput)`
    width: 65px;
    margin: 0 5px 0 -1px;
`;

const StyledClear = styled('br')`
    clear: left;
`;

export const Opacity = ({
    onChange,
    bordered,
    value,
    inputOnly
}) => {
    return (
        <Container>
            {!inputOnly && (
                <StyledSlider bordered={bordered}>
                    <Slider
                        min={0}
                        max={100}
                        onChange={val => onChange(val)}
                        value={typeof value === 'number' ? value : 0}
                    />
                </StyledSlider>
            )}
            <NumberInputContainer>
                <StyledNumberInput
                    min={0}
                    max={100}
                    value={value}
                    onChange={val => onChange(val)}
                />
                <NumberSuffix>
                    %
                </NumberSuffix>
            </NumberInputContainer>
            <StyledClear />
        </Container>
    );
};

Opacity.propTypes = {
    value: PropTypes.number,
    onChange: PropTypes.func,
    bordered: PropTypes.bool,
    inputOnly: PropTypes.bool
};
