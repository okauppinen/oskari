import React, { useState, useEffect, Fragment } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Footer } from './Footer/';
import { Controller, LocaleConsumer } from 'oskari-ui/util';
import { Draggable } from 'react-beautiful-dnd';
import { Row, Col, ColAuto, ColAutoRight } from './Grid';
import { Message, Tooltip } from 'oskari-ui';
import { EyeOpen, EyeShut, DragIcon } from '../../CustomIcons';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';

const StyledBox = styled.div`
    min-height: 100px;
    box-shadow: 1px 1px 3px 0 rgba(0, 0, 0, 0.23);
    border-radius: 3px;
    margin-bottom: 10px;
    margin-left: 5px;
    margin-right: 5px;
    border: 1px #fff solid;
    background-color: #fff;
`;

const Publishable = styled.span`
    font-style: italic;
    font-size: 14px;
    margin-left: 5px;
`;

const LayerBox = ({ layer, index, visibilityInfo, controller }) => {
    const organizationName = layer.getOrganizationName();
    const publishable = layer.getPermission('publish');

    const [visible, setVisible] = useState(visibilityInfo.visible);
    useEffect(() => {
        setVisible(visibilityInfo.visible);
    }, [visibilityInfo]);

    const handleToggleVisibility = () => {
        setVisible(!visible);
        controller.toggleLayerVisibility(layer);
    };
    const handleRemoveLayer = () => {
        controller.removeLayer(layer);
    };
    const getName = () => {
        // The layer model has entity-references for < > etc (&gt; &lt;)
        // FIXME: after 2.4.0 when we remove the older layerlisting bundles we can
        //  have the name in the model without encoding and NOT use dangerouslySetInnerHTML
        const field = <b dangerouslySetInnerHTML={{__html: layer.getName()}} />;
        const description = layer.getDescription();
        if (!description) {
            return field;
        }
        return <Tooltip title={description}>{field}</Tooltip>;
    };

    return (
        <Draggable draggableId={`${layer.getId()}`} index={index}>
            { provided => (
                <div ref={provided.innerRef} {...provided.draggableProps}>
                    <Row style={{ backgroundColor: '#fafafa', padding: '0px' }}>
                        <ColAuto style={{ padding: '0px' }}>
                            <DragIcon style={{ marginTop: '5px' }} {...provided.dragHandleProps} />
                        </ColAuto>
                        <Col style={{ paddingRight: '0px' }}>
                            <StyledBox>
                                <Row>
                                    <ColAuto>
                                        {visible ? <EyeOpen onClick={handleToggleVisibility} />
                                            : <EyeShut onClick={handleToggleVisibility} />}
                                    </ColAuto>
                                    <Col>
                                        <Row style={{ padding: '0px' }}>
                                            <ColAuto style={{ padding: '0px' }}>
                                                {getName()}<br/>
                                                {organizationName}
                                            </ColAuto>
                                            <ColAutoRight style={{ padding: '0px' }}>
                                                {publishable &&
                                                <Fragment>
                                                    <br/>
                                                    <CheckOutlined style={{ color: '#01ca79' }} />
                                                    <Publishable>
                                                        <Message messageKey={'layer.publishable'} />
                                                    </Publishable>
                                                </Fragment>
                                                }
                                            </ColAutoRight>
                                        </Row>
                                    </Col>
                                    <ColAutoRight>
                                        <CloseOutlined
                                            onClick={handleRemoveLayer}
                                            style={{ fontSize: '12px', marginRight: '4px' }}
                                        />
                                    </ColAutoRight>
                                </Row>
                                <Footer layer={layer} controller={controller} visibilityInfo={visibilityInfo}/>
                            </StyledBox>
                        </Col>
                    </Row>
                </div>
            )}
        </Draggable>
    );
};

LayerBox.propTypes = {
    layer: PropTypes.object.isRequired,
    index: PropTypes.number.isRequired,
    visibilityInfo: PropTypes.object.isRequired,
    controller: PropTypes.instanceOf(Controller).isRequired
};

const wrapped = LocaleConsumer(LayerBox);
export { wrapped as LayerBox };
