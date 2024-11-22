import React from 'react';
import { playerSpeed, playerSkip } from './constants';
import { Message } from 'oskari-ui';

export const getPlayerOptions = keys => {
    const addSpeed = keys.includes('speed');
    const addSkip = keys.includes('skip');
    const options = [];
    if (addSpeed) {
        options.push({
            key: 'speed',
            label: <Message messageKey='TimeSeries.speed.label' />,
            children: playerSpeed.map(({ key }) => ({ key, label: <Message messageKey={`TimeSeries.speed.${key}`}/> }))
        });
    }
    if (addSkip) {
        options.push({
            key: 'skip',
            label: <Message messageKey='TimeSeries.skip.label' />,
            children: playerSkip.map(({ key }) => ({ key, label: <Message messageKey={`TimeSeries.skip.${key}`}/> }))
        });
    }
    if (options.length === 1) {
        options[0].type = 'group';
    }
    return options;
};

export const calculateSvgX = (clientX, svg) => {
    const ctm = svg.getScreenCTM();
    return (clientX - ctm.e) / ctm.a;
};