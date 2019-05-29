import * as d3 from 'd3';

var svg;

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
    svg = getCanvasSelection().append("svg")
        .attr("width", getWidth() + margin.left + margin.right)
        .attr("height", getHeight() + margin.top + margin.bottom)
        .append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

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
};

export const drawDataPoints = function drawDataPoints(dataArray, classNames, clickHandler) {
    svg.selectAll(makeSelector(classNames))
        .data(dataArray)
        .enter().append("circle")
        .attr("class", classNames.join(" "))
        .attr("r", 3.5)
        .attr("cx", xMap)
        .attr("cy", yMap)
        .style("fill", function (result) {
            return colorScale(result["hamiltonian"]);
        })
        .style("cursor", "pointer")
        .on("click", function(result){
            let className = classNames.find(className => /graph-size-[0-9]+/.test(className));
            let graphSize = parseInt(className.match(/[0-9]+/));
            clickHandler(graphSize, result['graphID']);
        });
};

export const drawMeanLine = function drawMeanLine(dataArray, classNames){
    svg.append("path")
        .datum(dataArray)
        .attr("d", meanLine)
        .attr("class", classNames.join(" "))
        .style("fill", 'none');
};

export const removeLine = function removeLine(classNames) {
    svg.selectAll(makeSelector(classNames))
        .exit();
};

export const drawMedianLine = function drawMeanLine(dataArray, classNames){
    svg.append("path")
        .datum(dataArray)
        .attr("d", medianLine)
        .attr("class", classNames.join(" "))
        .style("fill", 'none');
};

export function isDrawn(classNames){
    return getCanvasElement().querySelectorAll(makeSelector(classNames)).length > 0;
}

export function hideData(classNames){
    getCanvasSelection().selectAll(makeSelector(classNames)).style("display", "none");
}

export function showData(classNames) {
    getCanvasSelection().selectAll(makeSelector(classNames)).style("display", "block");
}

function makeSelector(classNames){
    let selector = classNames.join(".");
    return "." + selector;
}

function getXScale() {
    return d3.scaleLinear().range([xPadding, getWidth() - xPadding]).domain([0, maximumAverageDegree]);
}

function getYScale() {
    return d3.scaleLog().range([getHeight() - yPadding, yPadding]).domain([0.01, maximumRelativeCost]).nice();
}

function getCanvasSelection() {
    return d3.select("#plot-canvas");
}

function getCanvasElement() {
    return document.getElementById("plot-canvas");
}

function getWidth() {
    return getCanvasElement().getBoundingClientRect().width - margin.left - margin.right;
}

function getHeight() {
    return getCanvasElement().getBoundingClientRect().height - margin.top - margin.bottom;
}