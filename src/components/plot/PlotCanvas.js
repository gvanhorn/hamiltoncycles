import React, {Component} from 'react';
import styled from 'styled-components';
import {canvasSetup, drawDataPoints, hideData, isDrawn, showData} from "./PlotHelper";

const Canvas = styled.div`
    width: 100%;
    height: 100%;
`;

export class PlotCanvas extends Component {

    componentDidMount() {
        canvasSetup();

        this.updateScatterData = this.updateScatterData.bind(this);
    }

    componentDidUpdate() {
        this.props.loadedScatterPlotData.forEach((scatterPlotData) => {
            this.updateScatterData(scatterPlotData);
        });
    }

    updateScatterData(scatterPlotData){
        let className = scatterPlotData.algorithmName + "-" + scatterPlotData.graphSize;
        if (!isDrawn(className)) {
            drawDataPoints(scatterPlotData.data, className);
        } else {
            if(scatterPlotData.visible){
                showData(className);
            }else {
                hideData(className);
            }
        }
    }

    render() {
        return (
            <Canvas id={'plot-canvas'}>
                {this.props.children}
            </Canvas>
        )
    }

}