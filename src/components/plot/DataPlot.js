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
            algorithmName: 'cetal',
            algorithmDisplayName: 'Cetal'
        },{
            algorithmName: 'horn',
            algorithmDisplayName: 'Horn'
        },{
            algorithmName: 'vacul',
            algorithmDisplayName: 'Vandergriend & Culberson'
        }
        ];

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
            lineTypes: lineTypes,
            loadedScatterPlotData: [],
            isLoading: false
        };

        this.loadData = this.loadData.bind(this);
        this.isLoaded = this.isLoaded.bind(this);
    }

    loadData(algorithmName, graphSize){
        if(this.isLoaded(algorithmName, graphSize)){
            console.log('Data already loaded for {}, {}', algorithmName, graphSize);
            return;
        }

        this.setState({
            isLoading: true
        });
        let scatterPlotDataID = algorithmName + '-' + graphSize.toString();
        let url = window.location + "data/" + scatterPlotDataID + ".json";
        console.log(url);

        fetch(url)
            .then(response => response.json())
            .then((jsonData) => {
                let scatterPlotData = {};
                scatterPlotData.id = scatterPlotDataID;
                scatterPlotData.algorithmName = algorithmName;
                scatterPlotData.graphSize = graphSize;
                scatterPlotData.data = jsonData;
                scatterPlotData.loaded = true;

                let loadedData = this.state.loadedScatterPlotData;
                loadedData.push(scatterPlotData);
                console.log(loadedData);
                this.setState({isLoading: false, loadedScatterPlotData: loadedData});
            })
            .catch((error) => {
                console.log(error);
                this.setState({isLoading: false});
            })
    }

    isLoaded(algorithmID, graphSize){
        let isLoaded = this.state.loadedScatterPlotData.find(data => {
            return data.id===algorithmID && data.graphSize===graphSize;
        });
        return !(isLoaded === undefined);
    }

    render() {
        return (
            <Window id={'plot-wrapper'}>
                <PlotCanvas>
                    <PlotComponentHeader>Relative time-cost of algorithms</PlotComponentHeader>
                </PlotCanvas>
                <PlotMenu>
                    <LoadScatterPlotDataComponent algorithms={this.state.algorithms}
                                                  graphSizes={this.state.graphSizes}
                                                  isLoading={this.state.isLoading}
                                                  loadDataFunction={this.loadData}/>
                    <LoadedScatterPlotDataList loadedScatterPlotData={this.state.loadedScatterPlotData}
                                               algorithms={this.state.algorithms}
                                               graphSizes={this.state.graphSizes}/>
                </PlotMenu>
            </Window>
        )
    }
}