const TRESHOLD = 50;
const MARGIN = 12;

export const getHistogramData = (data) => d3.histogram().thresholds(TRESHOLD)(data);

export const getYScaleFunction = (data, height) => d3.scaleLinear()
    .domain([0, d3.max(data, (d) => d.length)])
    .range([height, 0]);

export const getXScaleFunction = (min, max, width) => d3.scaleLinear()
    .domain([min, max])
    .clamp(true)
    .range([MARGIN, width - MARGIN]);

export const parseValidateInput = (value, min, max) => {
    const parsed = parseFloat(value);
    if (isNaN(parsed)) {
        return null;
    }
    if (parsed < min) {
        return null; // min or null
    }
    if (parsed > max) {
        return null; // max or null
    }
    return parsed;
};

export function dragHandles (el, dragBounds, activeBound, controller, xFunc, options) {
    const { height, r } = options;
    const dragBehavior = d3.drag()
        .subject((d) => {
            return { x: xFunc(d.value), y: d3.event.y };
        })
        .on('start', (d) => {
            controller.selected(d);
        })
        .on('drag', () => {
            const newX = d3.event.x;
            controller.drag(xFunc.invert(newX));
        })
        .on('end', console.log('controller.end()'));
    const getTransform = d => {
        const value = isSelected(d) ? activeBound.value : d.value;
        return `translate(${xFunc(value)} 0)`;
    };

    const isSelected = d => d.id === activeBound.id;

    const handles = d3.select(el)
        .selectAll('.handle')
        .data(dragBounds, (d) => d.id);

    const handlesEnter = handles.enter()
        .append('g')
        .classed('handle', true)
        .call(dragBehavior);

    handlesEnter
        .append('path')
        .classed('handle-line', true)
        .attr('d', `M0 0 v${height}`);

    handlesEnter
        .append('circle')
        .attr('cy', height);

    const mergedHandles = handlesEnter
        .merge(handles);

    mergedHandles
        .attr('transform', getTransform)
        .classed('selected', isSelected)
        .filter(isSelected)
        .raise();

    mergedHandles
        .selectAll('circle')
        .attr('r', r);
};

export function dragHandles2 (el, xFunc, onSelect, onBoundChange, onValueChange) {
    const dragBehavior = d3.drag()
        .on('start', (d) => {
            onSelect(d.id);
        })
        .on('drag', () => {
            const newX = d3.event.x;
            onValueChange(xFunc.invert(newX));
        })
        .on('end', (d) => onBoundChange(d.id));

    d3.select(el)
        .selectAll('g')
        .call(dragBehavior);
};
