import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { LoginOutlined, LogoutOutlined, QuestionCircleOutlined, MoreOutlined } from '@ant-design/icons';
import { Message, Spin } from 'oskari-ui';
import { IconButton } from 'oskari-ui/components/buttons';
import { Header } from './';
import { Dropdown } from 'antd'; // TODO from oskariui => menu => items
import { getPlayerOptions } from './util/helper';


const TooltipContent = styled.div`
    p:not(:first-child) {
        padding-top: 1em;
    }
`;
const Loading = styled.div`
    :first-child {
        margin-right: 1em;
    }
`;

const noop = () => {};
const Paragraph = styled.p``;

const iconOpts = {
    iconSize: 20
};

const dropdownOpts = {
    selectable: true,
    multiple: true,
    trigger: ['click', 'hover']
};

const ModeIcon = ({mode, textColor, controller, value }) => {
    if (mode !== 'player') {
        return <IconButton {...iconOpts}
                    icon = {mode === 'year' ? <LoginOutlined /> : <LogoutOutlined />}
                    title={<Message messageKey={`TimeSeries.rangeControl.switch2${mode}`}/>}
                    onClick={() => controller.toggleMode()} color={textColor}/>
    }
    const onSelect = ({keyPath}) => {
        const key = keyPath[1];
        const value = keyPath[0];
        controller.onSelect(key, value);
    };
    const selectedKeys = Object.values(value);
    // TODO: create on showTimeSeriesPlayer and pass items
    const items = getPlayerOptions(Object.keys(value));
    return (
        <Dropdown menu={{ items, onSelect, selectedKeys, ...dropdownOpts }}>
            <IconButton {...iconOpts} icon={<MoreOutlined />} color={textColor} />                    
        </Dropdown>
    );
    
};

const getHeaderContent = (title, loading = false, error = false, value) => {
    const content = typeof value === 'number' ? `${title} (${value})` : title;
    if (error) {
        // TODO: give an icon with tooltip or something cleaner
        return <span style={{ color: 'red' }}>{content}</span>;
    }
    if (loading) {
        return (
            <Loading>
                {content} <Spin />
            </Loading>
        );
    }
    return content;
};

const getTooltipContent = (additional) => {
    return (
        <TooltipContent>
            <Message messageKey="rangeControl.helpGeneric" LabelComponent={Paragraph} />
            {additional}
        </TooltipContent>
    );
}

export const TimeSeriesHeader = ({ 
    controller,
    title,
    mode = 'year',
    loading = false,
    error = false,
    value,
    textColor,
    hoverColor
}) => {
    // TODO: pass ModeIcon in actions props (ModeIcon, value etc. are too complicated)
    return (
        <Header className="timeseries-range-drag-handle" textColor={textColor} hovercolor={hoverColor}>
            {getHeaderContent(title, loading, error, value)}
            <div className="header-mid-spacer"></div>
            <IconButton {...iconOpts} color={textColor} icon={<QuestionCircleOutlined />} title={getTooltipContent()}/>
            <ModeIcon mode={mode} textColor={textColor} hoverColor={hoverColor} value={value} controller={controller}/>
        </Header>
    );
};

TimeSeriesHeader.propTypes = {
    toggleMode: PropTypes.func,
    title: PropTypes.string.isRequired,
    mode: PropTypes.oneOf(['year', 'range', 'player']),
    loading: PropTypes.bool,
    error: PropTypes.bool,
    value: PropTypes.any,
    textColor: PropTypes.string,
    hoverColor: PropTypes.string
};
