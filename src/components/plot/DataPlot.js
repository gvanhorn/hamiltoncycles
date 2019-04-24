import React, {Component} from 'react';
import {PlotCanvas} from "./PlotCanvas";
import {PlotMenu} from "./PlotMenu";
import styled from 'styled-components';
import {PlotComponentHeader} from "./StyledPlotComponents";
import {LoadScatterPlotDataComponent} from "./LoadScatterPlotDataComponent";
import {LoadedScatterPlotDataList} from "./LoadedScatterPlotDataList";

const Window = styled.div`
    width: 100%;
    height: 100vh;
    overflow: hidden;
`;

export class DataPlot extends Component {

    constructor(props) {
        super(props);

        let algorithms = [{
            id: 'cetal',
            displayName: 'Cetal'
        },{
            id: 'horn',
            displayName: 'Horn'
        }];

        let graphSizes = [16, 24];
        let lineTypes = [
            {
                id: 'average',
                displayName: 'Average'
            },
            {
                id: 'median',
                displayName: 'Median'
            }
        ];

        let testScatterData = algorithms[0];
        testScatterData.graphSize = 16;
        testScatterData.loaded = true;
        testScatterData.visible = true;

        let testScatterData2 = algorithms[1];
        testScatterData2.graphSize = 24;
        testScatterData2.loaded = true;
        testScatterData2.visible = true;

        let dummyLoadedData = [
            testScatterData,
            testScatterData2
        ];

        this.state = {
            algorithms: algorithms,
            graphSizes: graphSizes,
            lineTypes: lineTypes,
            loadedScatterPlotData: dummyLoadedData
        }
    }

    render() {
        return (
            <Window id={'plot-wrapper'}>
                <PlotCanvas>
                    <PlotComponentHeader>Relative time-cost of algorithms</PlotComponentHeader>
                </PlotCanvas>
                <PlotMenu>
                    <LoadScatterPlotDataComponent algorithms={this.state.algorithms} graphSizes={this.state.graphSizes}/>
                    <LoadedScatterPlotDataList loadedScatterPlotData={this.state.loadedScatterPlotData}/>
                </PlotMenu>
            </Window>
        )
    }
}