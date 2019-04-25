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
        }, {
            algorithmName: 'horn',
            algorithmDisplayName: 'Horn'
        }, {
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
        this.getScatterData = this.getScatterData.bind(this);
        this.toggleScatterDataVisibility = this.toggleScatterDataVisibility.bind(this);
    }

    loadData(algorithmName, graphSize) {
        if (this.isLoaded(algorithmName, graphSize)) {
            console.log('Data already loaded for ', algorithmName, graphSize);
            if(!this.getScatterData(algorithmName, graphSize).visible) {
                this.toggleScatterDataVisibility(algorithmName, graphSize);
            }
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
                scatterPlotData.algorithmName = algorithmName;
                scatterPlotData.graphSize = parseInt(graphSize);
                scatterPlotData.data = jsonData;
                scatterPlotData.visible = true;

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

    toggleScatterDataVisibility(algorithmName, graphSize){
        console.log(algorithmName, graphSize);
        console.log(this.state.loadedScatterPlotData);
        let scatterdata = this.getScatterData(algorithmName, graphSize);
        scatterdata.visible = !scatterdata.visible;

        let index = this.state.loadedScatterPlotData.findIndex(data => {
            return data.id === algorithmName && data.graphSize === graphSize;
        });
        let loadedScatterData = this.state.loadedScatterPlotData;
        loadedScatterData[index] = scatterdata;
        this.setState({loadedScatterPlotData: loadedScatterData});
    }

    isLoaded(algorithmName, graphSize) {
        return this.state.loadedScatterPlotData.findIndex(data => {
            return data.algorithmName === algorithmName && data.graphSize === graphSize;
        }) > -1;
    }

    getScatterData(algorithmName, graphSize) {
        return this.state.loadedScatterPlotData.find(data => {
            return data.algorithmName === algorithmName && data.graphSize === graphSize;
        });
    }

    render() {
        return (
            <Window id={'plot-wrapper'}>
                <PlotComponentHeader>Relative time-cost of algorithms</PlotComponentHeader>
                <PlotCanvas/>
                <PlotMenu>
                    <LoadScatterPlotDataComponent algorithms={this.state.algorithms}
                                                  graphSizes={this.state.graphSizes}
                                                  isLoading={this.state.isLoading}
                                                  loadDataFunction={this.loadData}/>
                    <LoadedScatterPlotDataList loadedScatterPlotData={this.state.loadedScatterPlotData}
                                               algorithms={this.state.algorithms}
                                               graphSizes={this.state.graphSizes}
                                               toggleScatterDataFunction={this.toggleScatterDataVisibility}/>
                </PlotMenu>
            </Window>
        )
    }
}