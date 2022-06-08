import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { getHistogramData, getYScaleFunction, getXScaleFunction } from './helper';

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

    &.selected {
        fill: #fad500;
        stroke: #ac9200;
    }
`;

export const HistogramSVG = ({
    classifiedDataset,
    data,
    onBoundChange
}) => {
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

    // TODO: only indexes are needed
    const blocks = bounds.slice(0, -1); // skip last
    const drags = bounds.slice(1, -1); // skip first & last

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
            <BoundDrags>
                {drags.map((drag, i) =>
                    <g key={`drag-${i}`} transform={`translate(${xScales[i + 1]} 0)`}>
                        <path d={`M0 0 v${DRAG.height}`}/>
                        <circle cy={DRAG.height} r={DRAG.r}/>
                    </g>
                )}
            </BoundDrags>
        </svg>
    );
};

HistogramSVG.propTypes = {
    classifiedDataset: PropTypes.object.isRequired,
    data: PropTypes.array.isRequired,
    onBoundChange: PropTypes.func.isRequired
};
