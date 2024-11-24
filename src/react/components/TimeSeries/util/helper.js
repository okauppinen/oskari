import React from 'react';
import { playerSpeed, playerSkip } from './constants';
import { Message } from 'oskari-ui';

export const getMenuOptions = (skip, speed) => {
    const items = [];
    const selectedKeys = [];
    if (typeof speed !== 'undefined') {
        selectedKeys.push(speed);
        items.push({
            key: 'speed',
            label: <Message messageKey='TimeSeries.speed.label' />,
            children: playerSpeed.map(({ key }) => ({ key, label: <Message messageKey={`TimeSeries.speed.${key}`}/> }))
        });
    }
    if (typeof skip !== 'undefined') {
        selectedKeys.push(skip);
        items.push({
            key: 'skip',
            label: <Message messageKey='TimeSeries.skip.label' />,
            children: playerSkip.map(({ key }) => ({ key, label: <Message messageKey={`TimeSeries.skip.${key}`}/> }))
        });
    }
    if (items.length === 1) {
        items[0].type = 'group';
    }
    const multiple = items.length > 1;
    return { items, selectedKeys, multiple };
};

export const calculateSvgX = (clientX, svg) => {
    const ctm = svg.getScreenCTM();
    return (clientX - ctm.e) / ctm.a;
};