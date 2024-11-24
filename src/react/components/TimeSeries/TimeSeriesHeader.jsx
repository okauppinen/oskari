import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { LoginOutlined, LogoutOutlined, QuestionCircleOutlined, MoreOutlined } from '@ant-design/icons';
import { Message, Spin } from 'oskari-ui';
import { IconButton } from 'oskari-ui/components/buttons';
import { Dropdown } from 'antd';
import { getMenuOptions } from './util/helper';

const Header = styled.h3`
    padding: 10px 20px;
    cursor: grab;
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: ${props => props.theme.getTextColor()};
`;

const IconContainer = styled.div`
    display: flex;
    > * {
        margin-left: 1em;
    }
`;

const TooltipContent = styled.div`
    p:not(:first-child) {
        padding-top: 1em;
    }
`;
const Spinner = styled(Spin)`
    margin-left: 1em;
`;

const Paragraph = styled.p``;

const ICON_OPTIONS = {
    iconSize: 20
};

const MENU_OPTIONS = {
    selectable: true,
    trigger: ['click', 'hover']
};

// TODO: for mobile only??
const OptionsMenu = ({iconProps, onPlayerUpdate, skip, speed }) => {
    const onSelect = ({keyPath}) => {
        // TODO: for one item group is used and path doesn't include key (only value) => fix
        const key = keyPath[1];
        const value = keyPath[0];
        onPlayerUpdate({ [key]: value });
    };
    const opts = getMenuOptions(skip, speed);
    return (
        <Dropdown menu={{ onSelect, ...opts, ...MENU_OPTIONS }}>
            <IconButton {...iconProps} icon={<MoreOutlined />} />
        </Dropdown>
    );
    
};

const Label = ({ title, loading = false, error = false, value }) => {
    const content = value ? `${title} (${value})` : title;
    // TODO: give an icon with tooltip or something cleaner
    const style = error ? { color: 'red' } : null;
        
    return (
        <span style={style}>
            {content}  <Spinner spinning={loading} />
        </span>
    );
};
Label.propTypes = {
    title: PropTypes.string.isRequired,
    loading: PropTypes.bool,
    error: PropTypes.bool,
    value: PropTypes.any,
};

const getTooltipContent = (additional) => {
    return (
        <TooltipContent>
            <Message messageKey="TimeSeries.controls.info" LabelComponent={Paragraph} />
            {additional}
        </TooltipContent>
    );
}

export const TimeSeriesHeader = ({
    onPlayerUpdate,
    onChange,
    title,
    uiMode,
    loading = false,
    error = false,
    value,
    values,
    skip,
    speed,
    theme
}) => {
    const iconProps = { ...ICON_OPTIONS, color: theme.getTextColor() };
    const toggleMode = Array.isArray(value) ? 'range' : 'year';
    const toggleRangeMode = () => Array.isArray(value) ? onChange(values[1]) : onChange([values[0], value]);
    return (
        <Header theme={theme}>
            <Label title={title} loading={loading} error={error} value={value}/>
            <IconContainer>
                <IconButton {...iconProps} icon={<QuestionCircleOutlined />} title={getTooltipContent()}/>
                { uiMode === 'range' && 
                    <IconButton {...iconProps}
                        icon = {toggleMode === 'year' ? <LoginOutlined /> : <LogoutOutlined />}
                        title={<Message messageKey={`TimeSeries.controls.${toggleMode}.toggle`}/>}
                        onClick={toggleRangeMode} />
                }
                {uiMode === 'player' && 
                    <OptionsMenu iconProps={iconProps} skip={skip} speed={speed} onPlayerUpdate={onPlayerUpdate}/>
                }
            </IconContainer>
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
    theme: PropTypes.object.isRequired,
    hoverColor: PropTypes.string
};
