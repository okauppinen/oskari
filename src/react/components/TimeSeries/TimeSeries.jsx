import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { ThemeConsumer, LocaleProvider } from 'oskari-ui/util';
import { showMovableContainer, PLACEMENTS } from 'oskari-ui/components/window';
import { getNavigationTheme } from 'oskari-ui/theme/ThemeHelper';
import { TimeSeriesPlayerControl } from './TimeSeriesPlayer/TimeSeriesPlayerControl';
import { TimeSeriesRangeControl } from './TimeSeriesRange/TimeSeriesRangeControl';
import { TimeSeriesHeader } from './TimeSeriesHeader';
import { playerDefaults, uiModes } from './util/constants';
import { BUNDLE_KEY } from 'oskari-ui';

const Background = styled.div`
    width: ${props => props.width}px;
    color: ${props => props.theme.getTextColor()};
    background-color: ${props => props.theme.getNavigationBackgroundColor()};
`;
// TODO: from state??
const getWidth = options => {
    if (Oskari.util.isMobile()) {
        return 350;
    }
    return options.compact ? 500 : 800;
};

const TimeSeries = ThemeConsumer(({
    state,
    onChange,
    options,
    theme: themeObj
}) => {
    const [playerState, setPlayerState] = useState(playerDefaults);
    const onPlayerUpdate = newState => setPlayerState({ ...playerState, ...newState });
    const Control = state.uiMode === uiModes.RANGE ? TimeSeriesRangeControl : TimeSeriesPlayerControl;
    const theme = getNavigationTheme(themeObj);
    return (
        <Background theme={theme} width={getWidth(options)}>
            <TimeSeriesHeader
                { ...state }
                { ...playerState }
                theme={theme}
                onChange={onChange}
                onPlayerUpdate={onPlayerUpdate}/>
            <Control
                {...state}
                {...playerState}
                onChange={onChange}
                onPlayerUpdate={onPlayerUpdate}
                iconColor={theme.getTextColor()}/>
        </Background>
    );
});

TimeSeries.propTypes = {
    state: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
    options: PropTypes.object.isRequired
};

export const showTimeSeriesController = (state, onChange, options, onClose) => {
    const Component = (
        <LocaleProvider value={{ bundleKey: BUNDLE_KEY }}>
            <TimeSeries
                state={state}
                onChange={onChange}
                options={options}/>
        </LocaleProvider>
    );
    const containerOpts = {
        id: options.id + '-TimeSeries',
        placement: options.placement || PLACEMENTS.TOP
    };
    const controls = showMovableContainer(Component, onClose, containerOpts);
    return {
        ...controls,
        update: (state) => {
            controls.update(
                <LocaleProvider value={{ bundleKey: BUNDLE_KEY }}>
                    <TimeSeries
                        state={state}
                        onChange={onChange}
                        options={options}/>
                </LocaleProvider>
            );
        }
    };
};