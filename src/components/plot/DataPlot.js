import React, {Component} from 'react';
import {PlotCanvas} from "./PlotCanvas";
import {PlotMenu} from "./PlotMenu";
import styled from 'styled-components';
import {PlotComponentHeader} from "./StyledPlotComponents";
import {LoadScatterPlotDataComponent} from "./LoadScatterPlotDataComponent";

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

        this.state = {
            algorithms: algorithms,
            graphSizes: graphSizes,
            lineTypes: lineTypes
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
                </PlotMenu>
            </Window>
        )
    }
}