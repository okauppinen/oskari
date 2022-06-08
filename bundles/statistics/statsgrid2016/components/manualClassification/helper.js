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
