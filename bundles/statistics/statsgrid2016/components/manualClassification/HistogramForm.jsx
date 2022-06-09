import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { showPopup } from 'oskari-ui/components/window';
import { Message, Select, Option, TextInput } from 'oskari-ui';
import { PrimaryButton, ButtonContainer } from 'oskari-ui/components/buttons';
import { HistogramSVG } from './HistogramSVG';
import { parseValidateInput } from './helper';

const BUNDLE_KEY = 'StatsGrid';

const Content = styled.div`
    padding: 24px;
`;

const Label = styled.label`
    margin-right: 10px;
    font-weight: bold;
`;

const StyledSelect = styled(Select)`
    min-width: 150px;
    margin-bottom: 10px;
`;

const Histogram = styled.div`
    position: relative;
`;

const BoundInput = styled.div`
    input {
        width: 150px;
    }
`;

const Form = ({
    state,
    classifiedDataset,
    data,
    editOptions,
    onClose
}) => {
    const { bounds } = classifiedDataset;
    // TODO: refactor states
    const [index, setIndex] = useState(0);
    const [bound, setBound] = useState({ value: bounds[index] });
    const { activeIndicator: { classification }, seriesStats, controller } = state;
    const { method, fractionDigits } = classification;
    const { methods } = editOptions;
    const dataAsList = Object.values(seriesStats ? seriesStats.serie : data);

    const min = bounds[0];
    const max = bounds[bounds.length - 1];

    const onValueChange = (value) => {
        const parsed = parseValidateInput(value, min, max);
        const isValid = parsed !== null;
        setBound({
            value,
            status: isValid ? '' : 'error'
        });

        // TODO: trottle or timeout bound change
        // bounds vs manualBounds
        // order bounds (in state or classify service??)
        if (isValid) {
            bounds[index] = parsed;
            onBoundChange(bounds);
        }
    };

    const onMethodChange = method => controller.updateClassification('method', method);
    const onBoundChange = (manualBounds) => {
        const updated = { manualBounds };
        if (method !== 'manual') {
            updated.method = 'manual';
        }
        controller.updateClassificationObj(updated);
    };
    const onBoundClick = i => {
        if (i === index) return;
        setIndex(i);
        setBound({ value: bounds[i] });
    };
    // TODO: InputNumber (min,max,step,formatter)?? At least have to check why error status doesn't use styling
    return (
        <Content>
            <Label><Message messageKey={'classify.labels.method' } bundleKey={BUNDLE_KEY} /></Label>
            <StyledSelect
                className='t_option-method'
                value = {method}
                onChange={value => onMethodChange(value)}>
                {methods.map(({ label, ...rest }, i) => (
                    <Option key={`option-${i}`} {...rest}>
                        {label}
                    </Option>
                ))}
            </StyledSelect>
            <Histogram>
                <HistogramSVG
                    activeIndex={index}
                    classifiedDataset={classifiedDataset}
                    data={dataAsList}
                    onBoundClick={onBoundClick}
                    onBoundChange={onBoundChange}/>
            </Histogram>
            <BoundInput>
                <Label><Message messageKey={'Selected' } bundleKey={BUNDLE_KEY} /></Label>
                <TextInput status={bound.status} inputMode="numeric" value={bound.value} onChange={e => onValueChange(e.target.value)}/>
            </BoundInput>
            <ButtonContainer>
                <PrimaryButton type='close' onClick={onClose}/>
            </ButtonContainer>
        </Content>
    );
};

Form.propTypes = {
    state: PropTypes.object.isRequired,
    classifiedDataset: PropTypes.object.isRequired,
    data: PropTypes.object.isRequired,
    editOptions: PropTypes.object.isRequired,
    onClose: PropTypes.func.isRequired
};

const getMessage = path => <Message messageKey={ `classify.edit.${path}` } bundleKey={BUNDLE_KEY} />;

const getContent = (state, classifiedDataset, data, editOptions, onClose) => (
    <Form
        state = { state }
        onClose={ onClose }
        classifiedDataset = { classifiedDataset }
        data = { data }
        editOptions = { editOptions }
    />
);

export const showHistogramPopup = (state, classifiedDataset, data, editOptions, onClose) => {
    const controls = showPopup(
        getMessage('title'),
        getContent(state, classifiedDataset, data, editOptions, onClose),
        onClose,
        { id: 'statsgrid-histogram' }
    );
    return {
        ...controls,
        update: (state, classifiedDataset, data, editOptions) =>
            controls.update(getMessage('title'), getContent(state, classifiedDataset, data, editOptions, onClose))
    };
};
