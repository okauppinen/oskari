import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { ThemeConsumer, LocaleProvider } from 'oskari-ui/util';
import { showMovableContainer, PLACEMENTS } from 'oskari-ui/components/window';
import { getNavigationTheme } from 'oskari-ui/theme/ThemeHelper';
import { Background, TimeSeriesHeader, TimeSeriesSlider } from './';
import { TimeSeriesControls } from './TimeSeriesPlayer/TimeSeriesControls';
import { playerDefaults } from './util/constants';

const BUNDLE_KEY = 'oskariui';
const MAX_MARKS = 10;

const ControlsContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
`;

const getMarkers = raw => {
    const values = raw.map(val => typeof val === 'number' ? val : Number(val)).filter(val => !isNaN(val));
    const min = values[0];
    const max = values[values.length-1];
    const increment = Math.ceil(values.length / MAX_MARKS);
    const markers = [min];
    for (let i = min; i < max - increment; i += increment) {
        markers.push(i);
    }
    markers.push(max);
    return { min, max, markers };
};

const TimeSeriesPlayer = ThemeConsumer(({
    state,
    controller,
    options,
    theme,
    isMobile = Oskari.util.isMobile()
}) => {
    const { error, loading, value, mode, title, values } = state;
    const [playerState, setPlayerState] = useState(playerDefaults);
    const playerController = {
        onSelect: (key, value) => {
            setPlayerState({...playerState, [key]: value})
        },
        setAnimate: animate => setPlayerState({ ...playerState, animate }),
        setSeriesValue: value => controller.setSeriesValue(value)
    };
    const navigationTheme = getNavigationTheme(theme);
    const textColor = navigationTheme.getTextColor();
    const hoverColor = navigationTheme.getButtonHoverColor();
    const backgroundColor = navigationTheme.getNavigationBackgroundColor();
    const { min, max, markers } = getMarkers(values);
    return (
        <Background textColor={textColor} backgroundColor={backgroundColor} isMobile={isMobile}>
            <TimeSeriesHeader
                textColor={textColor}
                hoverColor={hoverColor}
                controller={playerController}
                title={title}
                mode={'player'}
                loading={loading}
                error={error}
                value={playerState} />
            <ControlsContainer>
                <TimeSeriesControls
                    textColor={textColor}
                    controller={playerController}
                    values={values}
                    error={error}
                    value={value}
                    {...playerState }/>
                <TimeSeriesSlider
                    min={min}
                    max={max}
                    dataPoints={values}
                    markers={markers}
                    onChange={controller.setSeriesValue}
                    value={value}
                    width={isMobile ? 200 : 350} />
            </ControlsContainer>
        </Background>
    );
});

TimeSeriesPlayer.propTypes = {
    state: PropTypes.object.isRequired,
    controller: PropTypes.object.isRequired,
    options: PropTypes.object
};

export const showTimeSeriesPlayer = (state, controller, options, onClose) => {
    const Component = (
        <LocaleProvider value={{ bundleKey: BUNDLE_KEY }}>
            <TimeSeriesPlayer
                state={state}
                controller={controller}
                options={options}/>
        </LocaleProvider>
    );
    const containerOpts = {
        // theme ??
        id: options.id + '-TimeSeriesPlayer',
        placement: options.placement || PLACEMENTS.TOP
    };
    const controls = showMovableContainer(Component, onClose, containerOpts);
    return {
        ...controls,
        update: (state) => {
            controls.update(
                <LocaleProvider value={{ bundleKey: BUNDLE_KEY }}>
                    <TimeSeriesPlayer
                        state={state}
                        controller={controller} />
                </LocaleProvider>
            );
        }
    };
};