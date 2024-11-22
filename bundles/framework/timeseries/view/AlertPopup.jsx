import React from 'react';
import styled from 'styled-components';
import { showPopup } from 'oskari-ui/components/window';
import { Message } from 'oskari-ui';

const BUNDLE_KEY = 'timeseries';

const Content = styled.div`
    padding: 20px;
`;

export const showAlertPopup = (onClose) => {
    // no need to update
    return showPopup(
        <Message messageKey='alert.title' bundleKey={BUNDLE_KEY}/>,
        (<Content><Message messageKey='alert.message' bundleKey={BUNDLE_KEY}/></Content>),
        onClose,
        { id: BUNDLE_KEY + '-alert' }
    );
};
