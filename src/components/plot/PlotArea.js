import React, {Component} from 'react';
import styled from 'styled-components';
import {canvasSetup, clearCanvas, clearSvg, drawDataPoints, drawMeanLine, drawMedianLine} from "../../d3/PlotHelper";

const Area = styled.div`
    width: 100%;
    height: 100%;
    pointer-events: none;
`;

const Canvas = styled.canvas`
    position: absolute;
    z-index: 0;
    pointer-events: auto;
`;

export class PlotArea extends Component {

    componentDidMount() {
        canvasSetup(this.props.overlayOpener);
    }

    componentDidUpdate() {
        clearCanvas();
        clearSvg();
        this.props.loadedData.forEach((plotData) => {
            if (plotData.scatterVisible) {
                drawDataPoints(plotData.data);
            }
            if (plotData.meanVisible) {
                let classNames = [plotData.algorithmName, "graph-size-" + plotData.graphSize, "mean"];
                drawMeanLine(plotData.derived, classNames);
            }
            if (plotData.medianVisible) {
                let classNames = [plotData.algorithmName, "graph-size-" + plotData.graphSize, "median"];
                drawMedianLine(plotData.derived, classNames);
            }
        });
    }

    render() {
        return (
            <Area id={'plot-area'}>
                {this.props.children}
                <Canvas id={'plot-canvas'}/>
            </Area>
        )
    }

}