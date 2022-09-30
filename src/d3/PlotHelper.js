import * as d3 from 'd3';

var svg, canvas, context, lineContainer, quadTree, overlayOpenFunction;

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
export const colorScale = d3.scaleOrdinal()
    .domain([ "true", "false", "null"])
    .range(["#ff0000", "#33cc33", "#0000ff"]);

const meanLine = d3.line()
    .x(function (d) {
        return getXScale()(d['averageDegree']);
    }) // set the x values for the line generator
    .y(function (d) {
        return getYScale()(d['mean']);
    }) // set the y values for the line generator
    .curve(d3.curveMonotoneX); // apply smoothing to the line

const medianLine = d3.line()
    .x(function (d) {
        return getXScale()(d['averageDegree']);
    }) // set the x values for the line generator
    .y(function (d) {
        return getYScale()(d['median']);
    }) // set the y values for the line generator
    .curve(d3.curveMonotoneX); // apply smoothing to the line

const scatterPointRadius = 3;

export const canvasSetup = function canvasSetup(overlayOpener) {
    overlayOpenFunction = overlayOpener;
    if (svg) {
        while (svg.node().lastChild) {
            svg.node().removeChild(svg.node().lastChild);
        }
    }

    svg = getPlotAreaSelection().append("svg")
        .attr("id", "plot-svg")
        .attr("width", getWidth() + margin.left + margin.right)
        .attr("height", getHeight() + margin.top + margin.bottom)
        .style("position", "relative")
        .append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    canvas = d3.select("#plot-canvas")
        .attr("width", getWidth() - 1)
        .attr("height", getHeight() - 1)
        .style("transform", "translate(" + (margin.left + 1) + "px," + (margin.top + 1) + "px)")
        .on("click", canvasClickHandler);

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
};

function canvasClickHandler(event) {
    let mouse = d3.pointer(event, this);
    let closest = quadTree.find(mouse[0], mouse[1], scatterPointRadius);
    if (closest) {
        overlayOpenFunction(closest['graphSize'], closest['graphID']);
    }
}

export const drawDataPoints = function drawDataPoints(dataArray) {
    dataArray.forEach(function (result) {
        let cx = xMap(result);
        let cy = yMap(result);

        let color = colorScale(result["hamiltonian"]);
        context.fillStyle = color;
        context.strokeStyle = color;
        context.beginPath();
        context.arc(cx, cy, scatterPointRadius, 0, 2 * Math.PI);
        context.closePath();
        context.fill();
        context.stroke();

    });
    quadTree.addAll(dataArray);
};

export const drawMeanLine = function drawMeanLine(dataArray, classNames) {
    lineContainer.append("path")
        .datum(dataArray)
        .attr("d", meanLine)
        .attr("class", classNames.join(" "))
        .style("fill", 'none');
};

export const drawMedianLine = function drawMeanLine(dataArray, classNames) {
    lineContainer.append("path")
        .datum(dataArray)
        .attr("d", medianLine)
        .attr("class", classNames.join(" "))
        .style("fill", 'none');
};

export function clearCanvas() {
    context.clearRect(0, 0, getWidth(), getHeight());
    quadTree = d3.quadtree()
        .x(function (d) {
            return getXScale()(d['averageDegree']);
        })
        .y(function (d) {
            return getYScale()(d['relativeCost']);
        });
}

export function clearSvg() {
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