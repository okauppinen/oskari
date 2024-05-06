import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Button, Popover, TextInput, Tooltip, Message } from 'oskari-ui'
import { SvgRadioButton } from './StyleEditor/index';
import { BgColorsOutlined } from '@ant-design/icons';

// Hide input softly to render color picker to correct place
const HiddenInput = styled('input')`
    opacity: 0;
    width: 0px;
    height: 0px;
    padding: 0px;
    border: none;
    left: -10px;
    top: 20px;
    position: relative;
`;

const StyledColorPicker = styled('div')`
    width: 210px;
    margin-left: 7px;
    margin-top: 7px;
`;

const ColorTextInput = styled(TextInput)`
    width: 90px;
    height: 34px;
`;
const ChooseColor = styled(Button)`
    width: 70px;
    height: 34px;
    &:hover {
        -webkit-box-shadow:inset 0px 0px 0px 2px white;
        -moz-box-shadow:inset 0px 0px 0px 2px white;
        box-shadow:inset 0px 0px 0px 2px white;
    }
`;

const MoreColors = styled('div')`
    display: inline-block;
`;

// Make array of inline SVG for pre-defined color block
const getColorOptions = () => Oskari.custom.getColors().map((color) => {
    return {
        name: color,
        data: '<svg viewBox="0 0 32 32" width="32" height="32" xmlns="http://www.w3.org/2000/svg"><rect x="0" y="0" width="32" height="32" fill="' + color + '" /></svg>'
    };
});

const getContent = (props, onColorChange) => {
    // Don't add id to hidden input to avoid getting duplicate id with ColorTextInput, modify id if needed
    const { id, ...inputProps } = props;
    const colorInput = useRef(null);
    const onClick = () => {
        const el = colorInput.current;
        el.focus(); // Safari might need focus before click
        el.click();
    }
    return (
        <StyledColorPicker>
            <SvgRadioButton options={ getColorOptions() } { ...props } onChange={onColorChange}/>
            <MoreColors>
                <HiddenInput ref={colorInput} type='color' { ...inputProps } onChange={onColorChange}/>
                <Button type="primary" onClick={onClick}>
                    <Message messageKey='ColorPicker.moreColors' bundleKey='oskariui'/>
                </Button>
            </MoreColors>
        </StyledColorPicker>
    );
};

export const ColorPicker = ({ onChange, ...props }) => {
    const { value = '#FFFFFF', disabled, hideTextInput } = props;
    const [visible, setVisible] = useState(false);
    const [text, setText] = useState(value);
    const [textStatus, setTextStatus] = useState();

    const onColorChange = evt => {
        const color = evt.target.value;
        const isValid = Oskari.util.colorToArray(color).length >= 3;
        setText(color);
        setTextStatus(isValid ? '' : 'error');
        if (isValid) {
            props.onChange(evt);
        }
    };

    const chooseIconStyle = {
        fontSize: '20px',
        color: disabled || Oskari.util.isDarkColor(value) ? '#FFFFFF' :'#000000'
    };
    const renderTextInput = !hideTextInput && !disabled;
    return (
        <React.Fragment>
            <Popover
                content={getContent(props, onColorChange)}
                trigger="click"
                placement="bottom"
                open={visible}
                onOpenChange = {setVisible}>
                <Tooltip title={disabled ? '' : <Message messageKey={`ColorPicker.tooltip`} bundleKey='oskariui'/>}>
                    <ChooseColor style={{ background: value }} disabled={disabled} >
                        <BgColorsOutlined style={chooseIconStyle}/>
                    </ChooseColor>
                </Tooltip>
            </Popover>
            { renderTextInput && <ColorTextInput { ...props } status={textStatus} value={text} onChange={onColorChange}/>}
        </React.Fragment>
    );
};

ColorPicker.propTypes = {
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    disabled: PropTypes.bool,
    hideTextInput: PropTypes.bool
};
