import React, {Component} from 'react';
import {PlotArea} from "./PlotArea";
import {PlotMenu} from "./interface/PlotMenu";
import styled from 'styled-components';
import {PlotComponentHeader} from "./StyledPlotComponents";
import {LoadScatterPlotDataComponent} from "./interface/LoadScatterPlotDataComponent";
import {LoadedScatterPlotDataList} from "./interface/LoadedScatterPlotDataList";
import {DetailOverlay} from "./interface/overlay/DetailOverlay";
import * as Realm from "realm-web";

const Window = styled.div`
    position: relative;
    width: 100%;
    height: 100vh;
    overflow: hidden;
`;

const ErrorMessage = styled.span`
    color: red;
`;

const realm = new Realm.App({id: 'hamilton-cycles-backend-dbwps'});

export class DataPlot extends Component {

    constructor(props) {
        super(props);

        this.state = {
            lineTypes: lineTypes,
            loadedData: [],
            isLoading: false,
            overlayOpen: false,
        };

        this.loadData = this.loadData.bind(this);
        this.isLoaded = this.isLoaded.bind(this);
        this.getData = this.getData.bind(this);
        this.toggleVisibility = this.toggleVisibility.bind(this);
        this.hideAllData = this.hideAllData.bind(this);
        this.overlayCloseHandler = this.overlayCloseHandler.bind(this);
        this.overlayOpener = this.overlayOpener.bind(this);
    }

    loadData(algorithmName, graphSize) {
        if (this.isLoaded(algorithmName, graphSize)) {

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

        Promise.all([
            this.state.db.collection("results").find({algorithm: algorithmName, graphSize: graphSize}),
            this.state.db.collection("derivedresults").find({algorithm: algorithmName, graphSize: graphSize})
        ]).then((values) => {
            plotData.data = values[0];
            plotData.derived = values[1].sort((a, b) => a['averageDegree'] - b['averageDegree']);
            let loadedData = this.state.loadedData;
            loadedData.push(plotData);
            this.setState({isLoading: false, loadedData: loadedData});
        })
    }

    hideAllData(algorithmName, graphSize) {
        let data = this.getData(algorithmName, graphSize);
        data.visible = false;
        data.scatterVisible = false;
        data.meanVisible = false;
        data.medianVisible = false;
        let index = this.state.loadedData.findIndex(d => {
            return d.id === algorithmName && d.graphSize === graphSize;
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
        let index = this.state.loadedData.findIndex(d => {
            return d.id === algorithmName && d.graphSize === graphSize;
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
        this.loginAnonymous()
            .then(() => {
                let client = realm.currentUser.mongoClient("hamilton-cycles-atlas");
                this.setState({db: client.db("hamiltoncycles")});
            });
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (!prevState.db && this.state.db) {
            this.loadData('cetal', 16)
        }
    }

    async loginAnonymous() {
        // Create an anonymous credential
        const credentials = Realm.Credentials.anonymous();
        try {
            // Authenticate the user
            return await realm.logIn(credentials);
        } catch (err) {
            console.error("Failed to log in", err);
        }
    }

    overlayCloseHandler() {
        this.setState({overlayOpen: false});
    }

    overlayOpener(graphSize, graphID) {
        this.setState({overlayOpen: true, overlayGraphSize: graphSize, overlayGraphID: graphID});
    }

    render() {
        if (this.state.error) {
            return (
                <Window><ErrorMessage>Could not connect to the database...</ErrorMessage></Window>
            );
        }

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
                {this.state.overlayOpen ? (<DetailOverlay
                    db={this.state.db}
                    closeHandler={this.overlayCloseHandler}
                    graphSize={this.state.overlayGraphSize}
                    graphID={this.state.overlayGraphID}/>) : ''}
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

export const algorithms = ['cetal', 'martello', 'nakeddepthfirst', 'rubin', 'vacul', 'vanhorn'];
export const algorithmDisplayNames = {
    'cetal': "Cetal",
    'martello': "Martello",
    'nakeddepthfirst': "Depth first, no heuristic",
    'rubin': "Rubin",
    'vacul': "Vandergriend & Culberson",
    'vanhorn': "van Horn"
}
