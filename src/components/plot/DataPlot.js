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
            loadedScatterPlotData: [],
            isLoading: false
        };

        this.loadData = this.loadData.bind(this);
        this.isLoaded = this.isLoaded.bind(this);
        this.getScatterData = this.getScatterData.bind(this);
        this.toggleScatterDataVisibility = this.toggleScatterDataVisibility.bind(this);
        this.fetchJSONData = this.fetchJSONData.bind(this);
    }

    loadData(algorithmName, graphSize) {
        if (this.isLoaded(algorithmName, graphSize)) {
            console.log('Data already loaded for ', algorithmName, graphSize);
            if (!this.getScatterData(algorithmName, graphSize).visible) {
                this.toggleScatterDataVisibility(algorithmName, graphSize);
            }
            return;
        }

        this.setState({
            isLoading: true
        });

        let scatterPlotData = {};
        scatterPlotData.algorithmName = algorithmName;
        scatterPlotData.graphSize = parseInt(graphSize);
        scatterPlotData.visible = true;

        let scatterPlotDataID = algorithmName + '-' + graphSize.toString();
        let dataUrl = window.location + "results/" + scatterPlotDataID + ".json";
        let meanDataUrl = window.location + "results/" + scatterPlotDataID + "-mean.json";
        let medianDataUrl = window.location + "results/" + scatterPlotDataID + "-median.json";
        Promise.all([this.fetchJSONData(dataUrl), this.fetchJSONData(meanDataUrl), this.fetchJSONData(medianDataUrl)])
            .then(values => {
                scatterPlotData.data = values[0];
                scatterPlotData.means = values[1];
                scatterPlotData.medians = values[2];
                let loadedData = this.state.loadedScatterPlotData;
                loadedData.push(scatterPlotData);
                this.setState({isLoading: false, loadedScatterPlotData: loadedData});
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

    toggleScatterDataVisibility(algorithmName, graphSize) {
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
        let index = this.state.loadedScatterPlotData.findIndex(data => {
            return (data.algorithmName === algorithmName) && (data.graphSize === graphSize);
        });
        return index > -1;
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
                <PlotCanvas loadedScatterPlotData={this.state.loadedScatterPlotData}/>
                <PlotMenu>
                    <LoadScatterPlotDataComponent algorithms={this.state.algorithms}
                                                  graphSizes={this.state.graphSizes}
                                                  isLoading={this.state.isLoading}
                                                  errorLoadingData={this.state.errorLoadingData}
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