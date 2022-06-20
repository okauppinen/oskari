import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { getHistogramData, getYScaleFunction, getXScaleFunction, dragHandles } from './helper';

const SVG = {
    width: 500,
    height: 280
};

const HISTO_HEIGHT = SVG.height - 40; // space for drag controls

const HISTOCLIP = {
    height: SVG.height,
    shapeRendering: 'crispEdges'
};

const DRAG = {
    height: HISTO_HEIGHT + 25,
    r: 10
};

const Blocks = styled.g``;
const Edges = styled.g`
    text {    
        fill: #000;
        font-size: 10px;
    }
    path {
        stroke: rgba(0,0,0, 0.3)
    }
`;

const BoundDrags = styled.g`
    fill: #6baed6;
    stroke: #4f819e;

    g.selected circle {
        fill: #fad500;
        stroke: #ac9200;
    }
`;

export const HistogramSVG = ({
    classifiedDataset,
    data,
    dragBounds,
    activeBound,
    controller
}) => {
    const dragRef = useRef();
    useEffect(() => {
        // editor appends content to ref element, clear content
        // dragRef.current.innerHTML = '';
        dragHandles(dragRef.current, dragBounds, activeBound, controller, xFunc, DRAG);
        // dragHandles2(dragRef.current, xFunc, drags, onBoundChange);
    });
    /*
    const setBound = a => console.log(a);
    const dragHandler = useCallback(
        ({ clientX }) => {
            setBound(clientX);
        },
        [setBound]
    );

    const useEventListener = (eventName, handler, elementRef) => {
        // Create a ref that stores handler
        const savedHandler = useRef();
        useEffect(() => {
            savedHandler.current = handler;
        }, [handler]);
        useEffect(
            () => {
                const element = elementRef.current;
                // Create event listener that calls handler function stored in ref
                const eventListener = (event) => console.log(event);
                // Add event listener
                element.addEventListener(eventName, eventListener);
                // Remove event listener on cleanup
                return () => {
                    element.removeEventListener(eventName, eventListener);
                };
            },
            [eventName, elementRef]
        );
    };
    useEventListener('drag', dragHandler, dragRef);
    */

    // TODO: short & validate in service
    const { groups, bounds, format } = classifiedDataset;
    const colors = groups.map(group => group.color);
    const lastIndex = bounds.length - 1;
    const minBound = bounds[0];
    const maxBound = bounds[lastIndex];

    const histoData = getHistogramData(data);
    const xFunc = getXScaleFunction(minBound, maxBound, SVG.width);
    const yFunc = getYScaleFunction(histoData, HISTO_HEIGHT);

    const xScales = bounds.map(b => xFunc(b));

    const blocks = bounds.slice(0, -1); // skip last

    return (
        <svg {...SVG}>
            <defs>
                <clipPath id='histoClip'>
                    {histoData.map((d, i) => <rect key={`histo-${i}`}{...HISTOCLIP}
                        x={xFunc(d.x0)} y={yFunc(d.length)}
                        width={xFunc(d.x1) - xFunc(d.x0)}/>)}
                </clipPath>
            </defs>
            <Blocks clipPath='url(#histoClip)'>
                {blocks.map((block, i) => <rect key={`block-${i}`}
                    y={0} x={xScales[i]}
                    width={xScales[i + 1] - xScales[i]}
                    height={HISTO_HEIGHT}
                    fill={colors[i]}/>)}
            </Blocks>
            <Edges>
                <g transform= {`translate(${xScales[0]} 0)`}>
                    <path d={`M0 0 v${HISTO_HEIGHT}`}/>
                    <text y={HISTO_HEIGHT} x={3} dy='1em' textAnchor='start'>
                        {format(minBound)}
                    </text>
                </g>
                <g transform= {`translate(${xScales[lastIndex]} 0)`}>
                    <path d={`M0 0 v${HISTO_HEIGHT}`}/>
                    <text y={HISTO_HEIGHT} x={-3} dy='1em' textAnchor='end'>
                        {format(maxBound)}
                    </text>
                </g>
            </Edges>
            <BoundDrags ref={dragRef} />
        </svg>
    );
};

HistogramSVG.propTypes = {
    classifiedDataset: PropTypes.object.isRequired,
    data: PropTypes.array.isRequired,
    controller: PropTypes.object.isRequired,
    dragBounds: PropTypes.array.isRequired,
    activeBound: PropTypes.object.isRequired
};
// <BoundDrags ref={dragRef} />

/*          <BoundDrags ref={dragRef}>
                {drags.map(({ value, id }) => {
                    const selected = activeIndex === id;
                    const className = selected ? 't_bound-drag selected' : 't_bound-drag';
                    return (
                        <g key={`drag-${id}`} transform={`translate(${xFunc(value)} 0)`} dataId={id}>
                            <path d={`M0 0 v${DRAG.height}`}/>
                            <circle cy={DRAG.height} r={DRAG.r}
                                className={className}/>
                        </g>
                    );
                })}
            </BoundDrags>
*/
