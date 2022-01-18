import React from 'react';
import PropTypes from 'prop-types';
import { Message, Option } from 'oskari-ui';
import { LocaleConsumer, Controller } from 'oskari-ui/util';
import { DefaultStyle, StyleField, StyleSelect, StyledFormField } from '../styled';
import { GLOBAL_LEGEND } from './helper';

const RasterStyleSelect = ({ selected, styles, defaultName, setSelected, controller, getMessage }) => {
    const isDefaultStyle = name => name === defaultName;
    const getStyleLabel = style => {
        const { name } = style;
        if (isDefaultStyle(name)) {
            return name + ' (' + getMessage('styles.default') + ')';
        }
        return name;
    };
    const onDefaultStyleChange = (name, isSelected) => {
        const defaultStyle = isSelected ? name : '';
        controller.setStyle(defaultStyle);
    };

    let showInvailable = false;
    if (styles.length === 0) {
        showInvailable = true;
    } else if (styles.length === 1 && styles[0].name === GLOBAL_LEGEND) {
        showInvailable = true;
    }

    if (showInvailable) {
        return (
            <StyledFormField>
                <Message messageKey='styles.raster.unavailable'/>
            </StyledFormField>
        );
    }
    return (
        <StyleField>
            <StyleSelect
                value={selected}
                onChange={setSelected}
            >
                { styles.map(style => (
                    <Option key={style.name} value={style.name} title={style.title || style.name}>
                        {getStyleLabel(style)}
                    </Option>
                )) }
            </StyleSelect>
            <DefaultStyle
                checked={isDefaultStyle(selected)}
                onClick={evt => onDefaultStyleChange(selected, evt.target.checked)}
            >
                <Message messageKey='styles.default'/>
            </DefaultStyle>
        </StyleField>
    );
};
RasterStyleSelect.propTypes = {
    selected: PropTypes.string.isRequired,
    styles: PropTypes.array.isRequired,
    defaultName: PropTypes.string,
    setSelected: PropTypes.func.isRequired,
    controller: PropTypes.instanceOf(Controller).isRequired,
    getMessage: PropTypes.func.isRequired
};

const contextWrap = LocaleConsumer(RasterStyleSelect);
export { contextWrap as RasterStyleSelect };
