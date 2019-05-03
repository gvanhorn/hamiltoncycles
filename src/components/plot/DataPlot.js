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

        this.state = {
            algorithms: algorithms,
            graphSizes: graphSizes,
            lineTypes: lineTypes,
            loadedData: [],
            isLoading: false
        };

        this.loadData = this.loadData.bind(this);
        this.isLoaded = this.isLoaded.bind(this);
        this.getData = this.getData.bind(this);
        this.toggleVisibility = this.toggleVisibility.bind(this);
        this.hideAllData = this.hideAllData.bind(this);
        this.fetchJSONData = this.fetchJSONData.bind(this);
    }

    loadData(algorithmName, graphSize) {
        if (this.isLoaded(algorithmName, graphSize)) {
            console.log('Data already loaded for ', algorithmName, graphSize);
            if (!this.getData(algorithmName, graphSize).visible) {
                this.toggleVisibility(algorithmName, graphSize);
            }
            return;
        }

        this.setState({
            isLoading: true
        });

        let plotData = {};
        plotData.algorithmName = algorithmName;
        plotData.graphSize = parseInt(graphSize);
        plotData.visible = true;
        plotData.scatterVisible = true;
        plotData.meanVisible = true;
        plotData.medianVisible = true;

        let scatterPlotDataID = algorithmName + '-' + graphSize.toString();
        let dataUrl = window.location + "results/" + scatterPlotDataID + ".json";
        let derivedDataUrl = window.location + "results/" + scatterPlotDataID + "-derived.json";
        Promise.all([this.fetchJSONData(dataUrl), this.fetchJSONData(derivedDataUrl)])
            .then(values => {
                plotData.data = values[0];
                plotData.derived = values[1].sort(function(a, b){return a['averageDegree'] - b['averageDegree']});
                let loadedData = this.state.loadedData;
                loadedData.push(plotData);
                console.log(loadedData);
                this.setState({isLoading: false, loadedData: loadedData});
            });
    }

    fetchJSONData(url) {
        return fetch(url)
            .then(response => response.json())
            .then((jsonData) => {
                this.setState({errorLoadingData: false});
                return jsonData;
            })
            .catch((error) => {
                console.log(error);
                this.setState({errorLoadingData: true});
            });
    }

    hideAllData(algorithmName, graphSize){
        let data = this.getData(algorithmName, graphSize);
        console.log(data);
        data.visible = false;
        data.scatterVisible = false;
        data.meanVisible = false;
        data.medianVisible = false;
        let index = this.state.loadedData.findIndex(data => {
            return data.id === algorithmName && data.graphSize === graphSize;
        });
        let loadedData = this.state.loadedData;
        loadedData[index] = data;
        this.setState({loadedData: loadedData});
    }

    toggleVisibility(algorithmName, graphSize, dataType) {
        let data = this.getData(algorithmName, graphSize);
        switch(dataType){
            case 'scatter':
                data.scatterVisible = !data.scatterVisible;
                break;
            case 'mean':
                data.meanVisible = !data.meanVisible;
                break;
            case 'median':
                data.medianVisible = !data.medianVisible;
                break;
            default:
                data.visible = !data.visible;
        }
        let index = this.state.loadedData.findIndex(data => {
            return data.id === algorithmName && data.graphSize === graphSize;
        });
        let loadedData = this.state.loadedData;
        loadedData[index] = data;
        this.setState({loadedData: loadedData});
    }

    isLoaded(algorithmName, graphSize) {
        let index = this.state.loadedData.findIndex(data => {
            return (data.algorithmName === algorithmName) && (data.graphSize === graphSize);
        });
        return index > -1;
    }

    getData(algorithmName, graphSize) {
        return this.state.loadedData.find(data => {
            return data.algorithmName === algorithmName && data.graphSize === graphSize;
        });
    }

    render() {
        return (
            <Window id={'plot-wrapper'}>
                <PlotComponentHeader>Relative time-cost of algorithms</PlotComponentHeader>
                <PlotCanvas loadedData={this.state.loadedData}/>
                <PlotMenu>
                    <LoadScatterPlotDataComponent algorithms={this.state.algorithms}
                                                  graphSizes={this.state.graphSizes}
                                                  isLoading={this.state.isLoading}
                                                  errorLoadingData={this.state.errorLoadingData}
                                                  loadDataFunction={this.loadData}/>
                    <LoadedScatterPlotDataList loadedData={this.state.loadedData}
                                               algorithms={this.state.algorithms}
                                               graphSizes={this.state.graphSizes}
                                               toggleVisibilityFunction={this.toggleVisibility}
                                               hideAllDataFunction={this.hideAllData}/>
                </PlotMenu>
            </Window>
        )
    }
}

const graphSizes = [16, 24, 32];
const lineTypes = [
    {
        id: 'average',
        displayName: 'Average'
    },
    {
        id: 'median',
        displayName: 'Median'
    }
];

const algorithms = [{
    algorithmName: 'cetal',
    algorithmDisplayName: 'Cetal'
}, {
    algorithmName: 'martello',
    algorithmDisplayName: 'Martello'
}, {
    algorithmName: 'nakeddepthfirst',
    algorithmDisplayName: 'Depth First, no heuristics'
}, {
    algorithmName: 'rubin',
    algorithmDisplayName: 'Rubin'
}, {
    algorithmName: 'vacul',
    algorithmDisplayName: 'Vandergriend & Culberson'
}, {
    algorithmName: 'vanhorn',
    algorithmDisplayName: 'van Horn'
}
];