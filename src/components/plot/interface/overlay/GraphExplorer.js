import React from "react";
import styled from 'styled-components';
import {
    colorHamiltonCycle,
    drawForceDirectedGraph,
    explorerCanvasSetup,
    removeHamiltonCycle
} from "../../../../d3/ExplorerHelper";
import {algorithmDisplayNames, db} from "../../DataPlot";
import {DownloadButton} from "../DownloadButton";

const ExplorerCanvas = styled.div`
    position: relative;
    width: 100%;
    height: 100%;
`;

const CenteredLoader = styled.div`
    position: relative;
    margin: auto auto;
`;

const ExplorerLegend = styled.div`
    position: absolute;
    top: 0;
    left: 2em;
`;

const LegendTitle = styled.h3`
`;

const LegendList = styled.ul`
    list-style: none;
    padding-inline-start: 0;
`;

const LegendListItem = styled.li`
    
`;

export class GraphExplorer extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: true,
        };
        this.setupForceDirectedGraph = this.setupForceDirectedGraph.bind(this);
        this.checkboxHandler = this.checkboxHandler.bind(this);
    }

    componentDidMount() {
        Promise.all([
            db.collection("graphs").findOne({identifier: this.props.graphID, size: this.props.graphSize}),
            db.collection("results").find({graphSize: this.props.graphSize, graphID: this.props.graphID}).toArray()
        ]).then(values => {
            let partialState = {loading: false};
            if (!values[0]) {
                console.log("Could not find graph of size " + this.props.graphSize + " and id " + this.props.graphID)
            } else {
                partialState['graph'] = values[0];
            }
            if (values[1].length === 0) {
                console.log("Could not find results for graph size " + this.props.graphSize + " and id " + this.props.graphID)
            } else {
                partialState['results'] = values[1];
            }
            this.setState(partialState);
        });
    }

    componentDidUpdate() {
        this.setupForceDirectedGraph();
    }

    setupForceDirectedGraph() {
        if (!this.state.loading) {
            explorerCanvasSetup();
            drawForceDirectedGraph(this.state.graph);
            removeHamiltonCycle();
            if(this.state.shownCycle != null){
                let result = this.state.results.find(result => result['algorithm'] === this.state.shownCycle);
                colorHamiltonCycle(result);
            }
        }
    }

    checkboxHandler(event){
        if(this.state.shownCycle === event.target.name){
            removeHamiltonCycle();
            this.setState({
                shownCycle: null
            })
        }else {
            this.setState({
                shownCycle: event.target.name
            })
        }
    }

    render() {
        return this.state.loading ?
            (<CenteredLoader>
                <div className="lds-ellipsis">
                    <div/>
                    <div/>
                    <div/>
                    <div/>
                </div>
            </CenteredLoader>) :
            (<ExplorerCanvas id={'graph-explorer'}>
                <ExplorerLegend>
                    <LegendTitle>Algorithms:</LegendTitle>
                    <LegendList>
                        {this.state.results.map(result => {
                            if (result['hamiltonian']) {
                                return (<LegendListItem key={result['algorithm']}>
                                    <input type={'checkbox'}
                                           onChange={this.checkboxHandler}
                                           name={result['algorithm']}
                                           checked={this.state.shownCycle === result['algorithm']}/>
                                    {algorithmDisplayNames[result['algorithm']]}
                                </LegendListItem>);
                            } else {
                                return (<LegendListItem key={result['algorithm']}>
                                    {algorithmDisplayNames[result['algorithm']]}
                                </LegendListItem>);
                            }
                        })}
                    </LegendList>
                    <DownloadButton selector={'#graph-explorer > svg'} text={'Download figure'}/>
                </ExplorerLegend>
            </ExplorerCanvas>);
    }
}
