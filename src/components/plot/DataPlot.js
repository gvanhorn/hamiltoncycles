import React, {Component} from 'react';
import {PlotArea} from "./PlotArea";
import {PlotMenu} from "./interface/PlotMenu";
import styled from 'styled-components';
import {PlotComponentHeader} from "./StyledPlotComponents";
import {LoadScatterPlotDataComponent} from "./interface/LoadScatterPlotDataComponent";
import {LoadedScatterPlotDataList} from "./interface/LoadedScatterPlotDataList";
import {DetailOverlay} from "./interface/overlay/DetailOverlay";

const Window = styled.div`
    width: 100%;
    height: 100vh;
    overflow: hidden;
`;

export class DataPlot extends Component {

    constructor(props) {
        super(props);

        this.state = {
            lineTypes: lineTypes,
            loadedData: [],
            isLoading: false,
            overlayOpen: false
        };

        this.loadData = this.loadData.bind(this);
        this.isLoaded = this.isLoaded.bind(this);
        this.getData = this.getData.bind(this);
        this.toggleVisibility = this.toggleVisibility.bind(this);
        this.hideAllData = this.hideAllData.bind(this);
        this.fetchJSONData = this.fetchJSONData.bind(this);
        this.overlayCloseHandler = this.overlayCloseHandler.bind(this);
        this.overlayOpener = this.overlayOpener.bind(this);
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
                plotData.derived = values[1].sort(function (a, b) {
                    return a['averageDegree'] - b['averageDegree']
                });
                let loadedData = this.state.loadedData;
                loadedData.push(plotData);
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

    hideAllData(algorithmName, graphSize) {
        let data = this.getData(algorithmName, graphSize);
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
        switch (dataType) {
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

    componentDidMount() {
        this.loadData('cetal', 16);
    }

    overlayCloseHandler() {
        this.setState({overlayOpen: false});
    }

    overlayOpener(graphSize, graphID) {
        this.setState({overlayOpen: true, overlayGraphSize: graphSize, overlayGraphID: graphID});
    }

    render() {
        return (
            <Window id={'plot-wrapper'}>
                <PlotComponentHeader>Relative time-cost of algorithms</PlotComponentHeader>
                <PlotArea loadedData={this.state.loadedData} overlayOpener={this.overlayOpener}/>
                <PlotMenu>
                    <LoadScatterPlotDataComponent isLoading={this.state.isLoading}
                                                  errorLoadingData={this.state.errorLoadingData}
                                                  loadDataFunction={this.loadData}/>
                    <LoadedScatterPlotDataList loadedData={this.state.loadedData}
                                               toggleVisibilityFunction={this.toggleVisibility}
                                               hideAllDataFunction={this.hideAllData}/>
                </PlotMenu>
                {this.state.overlayOpen ? (<DetailOverlay closeHandler={this.overlayCloseHandler}
                                                          graphSize={this.state.overlayGraphSize}
                                                          graphID={this.state.overlayGraphID}
                                                          loadedData={this.state.loadedData}/>): ''}
            </Window>
        )
    }
}

export const graphSizes = [16, 24, 32];
export const lineTypes = [
    {
        id: 'average',
        displayName: 'Average'
    },
    {
        id: 'median',
        displayName: 'Median'
    }
];

export const algorithms = ['cetal','martello','nakeddepthfirst','rubin','vacul','vanhorn'];
export const algorithmDisplayNames = {
    'cetal': "Cetal",
    'martello': "Martello",
    'nakeddepthfirst': "Depth first, no heuristic",
    'rubin': "Rubin",
    'vacul': "Vandergriend & Culberson",
    'vanhorn': "van Horn"
}