import React from 'react';
import PropTypes from 'prop-types';
import { Switch, Message } from 'oskari-ui';
import { Controller } from 'oskari-ui/util';
import { InfoTooltip } from '../InfoTooltip';
import { StyledFormField, SpacedLabel } from '../styled';

export const SingleTile = ({ layer, controller }) => {
    const options = layer.options || {};
    return (
        <StyledFormField>
            <label>
                <Switch size='small' checked={!!options.singleTile} onChange={checked => controller.setSingleTile(checked)} />
                <Message messageKey='fields.singleTile' LabelComponent={SpacedLabel} />
            </label>
            <InfoTooltip messageKeys='singleTileDesc'/>
        </StyledFormField>
    );
};

SingleTile.propTypes = {
    layer: PropTypes.object.isRequired,
    controller: PropTypes.instanceOf(Controller).isRequired
};
