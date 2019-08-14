import * as d3 from 'd3';

var svg, canvas, context, lineContainer;

export const maximumAverageDegree = 31;
const maximumRelativeCost = 10000;
const margin = {top: 40, right: 40, bottom: 70, left: 70},
    xPadding = 0,
    yPadding = 0;

const xMap = function (result) {
    return getXScale()(result['averageDegree']);
};
const yMap = function (result) {
    return getYScale()(result['relativeCost'] + 0.01);
};
export const colorScale = d3.scaleOrdinal().domain(["true", "false", "null"]).range(["#33cc33", "#ff0000", "#0000ff"]);

const meanLine = d3.line()
    .x(function(d) { return getXScale()(d['averageDegree']); }) // set the x values for the line generator
    .y(function(d) { return getYScale()(d['mean']); }) // set the y values for the line generator
    .curve(d3.curveMonotoneX); // apply smoothing to the line

const medianLine = d3.line()
    .x(function(d) { return getXScale()(d['averageDegree']); }) // set the x values for the line generator
    .y(function(d) { return getYScale()(d['median']); }) // set the y values for the line generator
    .curve(d3.curveMonotoneX); // apply smoothing to the line

export const canvasSetup = function canvasSetup() {
    let start = performance.now();

    if(svg) {
        while (svg.node().lastChild) {
            svg.node().removeChild(svg.node().lastChild);
        }
    }

    svg = getPlotAreaSelection().append("svg")
        .attr("id", "plot-svg")
        .attr("width", getWidth() + margin.left + margin.right)
        .attr("height", getHeight() + margin.top + margin.bottom)
        .append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    canvas = d3.select("#plot-canvas")
        .attr("width", getWidth() - 1)
        .attr("height", getHeight() - 1)
        .style("transform", "translate(" + (margin.left + 1) + "px," + (margin.top + 1) + "px)");

    context = canvas.node().getContext('2d');

    let xAxis = d3.axisBottom(getXScale()).ticks(maximumAverageDegree);
    let yAxis = d3.axisLeft(getYScale())
        .ticks(11)
        .tickFormat(function (d) {
            return getYScale().tickFormat(1, d3.format(".1e"))(d);
        });

    //Draw x-axis
    svg.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(0," + getHeight() + ")")
        .call(xAxis);

    svg.append("text")
        .attr("class", "label")
        .attr("x", getWidth())
        .attr("y", getHeight())
        .attr("dy", "3em")
        .style("text-anchor", "end")
        .text("Average connectivity");

    //Draw y-axis
    svg.append("g")
        .attr("class", "axis")
        .call(yAxis);

    svg.append("text")
        .attr("class", "label")
        .attr("transform", "rotate(-90)")
        .attr("x", 0)
        .attr("y", "-4em")
        .style("text-anchor", "end")
        .text("Relative cost (iterations / nodes)");

    //Create element to contain lines
    lineContainer = svg.append("g");

    let end = performance.now();
    console.log("Canvas setup took: " + (end-start) + " milliseconds");
};

export const drawDataPoints = function drawDataPoints(dataArray, classNames, clickHandler) {
    let start = performance.now();
    dataArray.forEach(function(result){
        let cx = xMap(result);
        let cy = yMap(result);

        let color = colorScale(result["hamiltonian"]);
        context.fillStyle = color;
        context.strokeStyle = color;
        context.beginPath();
        context.arc(cx, cy, 3.5, 0, 2 * Math.PI);
        context.closePath();
        context.fill();
        context.stroke();
    });
    let end = performance.now();
    console.log("Drawing data took " + (end-start) + " milliseconds.");
};

export const drawMeanLine = function drawMeanLine(dataArray, classNames){
    let start = performance.now();
    lineContainer.append("path")
        .datum(dataArray)
        .attr("d", meanLine)
        .attr("class", classNames.join(" "))
        .style("fill", 'none');
    let end = performance.now();
    console.log("Drawing mean line took: " + (end - start) + " milliseconds");
};

export const drawMedianLine = function drawMeanLine(dataArray, classNames){
    let start = performance.now();
    lineContainer.append("path")
        .datum(dataArray)
        .attr("d", medianLine)
        .attr("class", classNames.join(" "))
        .style("fill", 'none');
    let end = performance.now();
    console.log("Drawing median line took: " + (end - start) + " milliseconds");
};

export function clearCanvas(){
    context.clearRect(0,0,getWidth(), getHeight());
}

export function clearSvg(){
    while (lineContainer.node().lastChild) {
        lineContainer.node().removeChild(lineContainer.node().lastChild);
    }
}

function getXScale() {
    return d3.scaleLinear().range([xPadding, getWidth() - xPadding]).domain([0, maximumAverageDegree]);
}

function getYScale() {
    return d3.scaleLog().range([getHeight() - yPadding, yPadding]).domain([0.01, maximumRelativeCost]).nice();
}

function getPlotAreaSelection() {
    return d3.select("#plot-area");
}

function getPlotAreaElement() {
    return document.getElementById("plot-area");
}

function getWidth() {
    return getPlotAreaElement().getBoundingClientRect().width - margin.left - margin.right;
}

function getHeight() {
    return getPlotAreaElement().getBoundingClientRect().height - margin.top - margin.bottom;
}