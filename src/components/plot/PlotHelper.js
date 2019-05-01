import * as d3 from 'd3';

var svg;

const maximumAverageDegree = 31;
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
const color = d3.scaleOrdinal().domain(["true", "false", "null"]).range(["#33cc33", "#ff0000", "#0000ff"]);

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

export const drawDataPoints = function drawDataPoints(dataArray, className) {
    svg.selectAll(className)
        .data(dataArray)
        .enter().append("circle")
        .attr("data-graphid", function (result) {
            return result["graphID"];
        })
        .attr("class", className)
        .attr("r", 3.5)
        .attr("cx", xMap)
        .attr("cy", yMap)
        .style("fill", function (result) {
            return color(result["hamiltonian"]);
        });
    // .style("display", "none")
    // .on("mouseover", dataMouseOver)
    // .on("mouseout", dataMouseOut)
    // .on("click", dataClickHandler);
};

export function isDrawn(className){
    return getCanvasElement().getElementsByClassName(className).length > 0;
}

export function hideData(className){
    console.log("Hiding data:");
    getCanvasSelection().selectAll("." + className).style("display", "none");
}

export function showData(className) {
    console.log("Showing data:");
    getCanvasSelection().selectAll("." +className).style("display", "block");
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