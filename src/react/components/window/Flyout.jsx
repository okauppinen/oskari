import React, { useCallback, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { CloseCircleFilled } from '@ant-design/icons';
import { createDraggable } from './util';

const Container = styled.div`
    position: absolute;
    left: 0;
    top: 0;
    z-index: 20009;
    background:white;
    min-width: 300px;

    &.outofviewport {
        border: 2px solid rgba(255, 0, 0);
    }
`;

const FlyoutHeader = styled.div`
    height: 57px;
    width: 100%;
    background-color: #fdf8d9;
    border-top: #fdfdfd;
    border-bottom: #fef2ba;
`;
const HeaderBand = styled.div`
    background-color: #ffd400;
    border-top: 1px solid #ffdf00;
    border-bottom: 1px solid #ebb819;
    height: 14px;
    width: 100%;
`;
const Title = styled.div`
    float: left;
    margin-left: 20px;
    margin-top: 12px;
    height: 20px;
    display: inline-block;
    font-size: 16px;
    line-height: 20px;
`;
const ToolsContainer = styled.div`
    float: right;
    margin-right: 25px;
    height: 16px;
    display: inline-block;
    margin-top: 12px;
    /* Size and color for tool icons from AntD: */
    font-size: 18px;
    color: black;
    > span:hover {
        color: #ffd400;
    }
`;


export const Flyout = ({title = '', children, onClose, bringToTop, options}) => {
    const [position, setPosition] = useState({ x: 210, y: 30 });
    const elementRef = useRef();
    const containerClass = `t_flyout t_${options.id}`
    const onMouseDown = useCallback(() => {
        if (typeof bringToTop === 'function') {
            bringToTop();
        }
        createDraggable(position, setPosition, elementRef)
    }, [position, setPosition, elementRef]);
    /*
    Other tools for toolcontainer:
        <div className="oskari-flyouttool-help"></div>
        <div className="oskari-flyouttool-attach"></div>
        <div className="oskari-flyouttool-detach"></div>
        <div className="oskari-flyouttool-minimize"></div>
        <div className="oskari-flyouttool-restore"></div>
    Maybe allow passing tools from caller?
    */
    return (<Container className={containerClass} ref={elementRef} style={{transform: `translate(${position.x}px, ${position.y}px)`}}>
        <FlyoutHeader className="oskari-flyouttoolbar" onMouseDown={onMouseDown} onTouchStart={onMouseDown}>
            <HeaderBand />
            <Title>{title}</Title>
            <ToolsContainer>
                <CloseCircleFilled className="oskari-flyouttool-close" onClick={onClose}/>
            </ToolsContainer>
        </FlyoutHeader>
        <div>
            {children}
        </div>
    </Container>)
};

Flyout.propTypes = {
    children: PropTypes.any,
    title: PropTypes.string,
    onClose: PropTypes.func.isRequired,
    bringToTop: PropTypes.func,
    options: PropTypes.object
};
