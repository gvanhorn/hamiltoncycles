import React from "react";
import styled from 'styled-components';
import {drawForceDirectedGraph, explorerCanvasSetup} from "../../../../d3/ExplorerHelper";
import {db} from "../../DataPlot";

const ExplorerCanvas = styled.div`
    width: 100%;
    height: 100%;
`;

export class GraphExplorer extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            loading: true,
        };
        this.setupForceDirectedGraph = this.setupForceDirectedGraph.bind(this);
    }

    componentDidMount(){
        db.collection("graphs")
            .findOne({identifier: this.props.graphID, size: this.props.graphSize})
            .then(graph => {
                if(graph){
                    this.setState({loading: false, graph: graph});
                }else{
                    console.log("Could not find graph of size " + this.props.graphSize + " and id " + this.props.graphID)
                }
            });
    }

    componentDidUpdate(){
        this.setupForceDirectedGraph();
    }

    setupForceDirectedGraph(){
        if(!this.state.loading) {
            explorerCanvasSetup();
            console.log(this.state.graph);
            drawForceDirectedGraph(this.state.graph, []);
        }
    }

    render(){
        return this.state.loading ? 'loading grpah' : (<ExplorerCanvas id={'graph-explorer'}/>);
    }
}
