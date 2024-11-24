import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { ThemedSlider } from 'oskari-ui';
import { IconButton } from 'oskari-ui/components/buttons';
import { StepBackwardOutlined, StepForwardOutlined, PauseOutlined, CaretRightOutlined } from '@ant-design/icons';
import { playerSpeed } from '../util/constants'

const ControlsContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
`;

const Container = styled.div`
    margin-top: 10px;
    padding: 0 0 10px 20px;
    display: flex;
    flex-flow: row wrap;
    justify-content: space-around;
    align-items: flex-start;
    flex-wrap: wrap;
    text-align: center;
    align-items: center;
    button {
        margin-right 10px;
    }
`;
const StyledButton = styled(IconButton)`
    border-radius: 50%;
    background: inherit;
    width: 32px;
    padding: 0;
    :hover {
        background: inherit;
    }
`;

const ICON_OPTIONS = {
    iconSize: 22,
    bordered: true
};

export const TimeSeriesPlayerControl = ({onChange, onPlayerUpdate, value, values, iconColor, speed, animate}) => {
    // TODO: should animate be insidePlayer state? stop animate on line drag or disable drag?
    const animateIcon = animate ? <PauseOutlined /> : <CaretRightOutlined />;
    const opts = { ...ICON_OPTIONS, color: iconColor };
    const onStep = step => {
        const index = values.indexOf(value);
        const newIndex = index + step;
        if (newIndex < 0 || newIndex >= values.length ) {
            return;
        }
        onChange(values[newIndex]);
    };
    if (animate) {
        const index = values.indexOf(value);
        
        if (index >= values.length - 1) {
            onPlayerUpdate({ animate });
            return;
        } else {
            const interval = playerSpeed.find(s => s.key === speed)?.value || 0;
            setTimeout(() => onStep(1), interval);
        }
    }
    return (
        <ControlsContainer>
            <Container>
                <StyledButton {...opts} disabled={animate} icon={<StepBackwardOutlined/>} onClick={() => onStep(-1)} />
                <StyledButton {...opts} icon={animateIcon} onClick={() => onPlayerUpdate({ animate: !animate})} />
                <StyledButton {...opts} disabled={animate} icon={<StepForwardOutlined/>} onClick={() => onStep(1)} />
            </Container>
            <ThemedSlider useThick />
        </ControlsContainer>
    );
};

TimeSeriesPlayerControl.propTypes = {
    onChange: PropTypes.func.isRequired,
    onPlayerUpdate: PropTypes.func.isRequired,
    options: PropTypes.object,
    value: PropTypes.any,
    values: PropTypes.array.isRequired,

};
