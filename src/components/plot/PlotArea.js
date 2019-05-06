import React, {Component} from 'react';
import styled from 'styled-components';
import {
    canvasSetup,
    drawDataPoints,
    drawMeanLine,
    drawMedianLine,
    hideData,
    isDrawn,
    removeLine,
    showData
} from "./d3/PlotHelper";

const Area = styled.div`
    width: 100%;
    height: 100%;
`;

export class PlotArea extends Component {

    componentDidMount() {
        canvasSetup();

        this.updateDrawing = this.updateDrawing.bind(this);
        this.redrawAllLines = this.redrawAllLines.bind(this);
    }

    componentDidUpdate() {
        this.props.loadedData.forEach((plotData) => {
            this.updateDrawing(plotData, 'scatter');
            this.updateDrawing(plotData, 'mean');
            this.updateDrawing(plotData, 'median');
        });
    }

    updateDrawing(plotData, type) {
        let classNames = [plotData.algorithmName, "graph-size-" + plotData.graphSize, type];
        if (!isDrawn(classNames)) {
            switch (type) {
                case 'scatter':
                    drawDataPoints(plotData.data, classNames, this.props.overlayOpenHandler);
                    this.redrawAllLines();
                    break;
                case 'mean':
                    drawMeanLine(plotData.derived, classNames);
                    break;
                case 'median':
                    drawMedianLine(plotData.derived, classNames);
                    break;
                default:
                    console.log("unrecognized type for drawing");
            }
        } else {
            switch (type) {
                case 'scatter':
                    plotData.scatterVisible ? showData(classNames) : hideData(classNames);
                    break;
                case 'mean':
                    plotData.meanVisible ? showData(classNames) : hideData(classNames);
                    break;
                case 'median':
                    plotData.medianVisible ? showData(classNames) : hideData(classNames);
                    break;
                default:
                    console.log('unrecognized type for drawing');
            }
        }
    }

    redrawAllLines() {
        this.props.loadedData.forEach(dataSet => {
            let classNames = [dataSet.algorithmName, "graph-size-" + dataSet.graphSize, 'mean'];
            removeLine(classNames);
            drawMeanLine(dataSet.derived, classNames);
            if (!dataSet.meanVisible) {
                hideData(classNames)
            }

            classNames = [dataSet.algorithmName, "graph-size-" + dataSet.graphSize, 'median'];
            removeLine(classNames);
            drawMedianLine(dataSet.derived, classNames);
            if (!dataSet.medianVisible) {
                hideData(classNames)
            }
        });
    }

    render() {
        return (
            <Area id={'plot-canvas'}>
                {this.props.children}
            </Area>
        )
    }

}