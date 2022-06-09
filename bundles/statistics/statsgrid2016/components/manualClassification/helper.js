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
/*
const dragBehavior = d3.drag()
    .subject((d) => {
        return { x: x(d.value), y: d3.event.y };
    })
    .on('start', (d) => {
        selectedId = d.id;
        update();
    })
    .on('drag', (d) => {
        var newX = d3.event.x;
        d.value = x.invert(newX);
        selectedId = d.id;
        update();
    })
    .on('end', notify);

*/
