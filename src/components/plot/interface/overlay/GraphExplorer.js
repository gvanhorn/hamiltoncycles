import React from "react";
import styled from 'styled-components';
import {drawForceDirectedGraph, explorerCanvasSetup} from "../../../../d3/ExplorerHelper";

const ExplorerCanvas = styled.div`
    width: 100%;
    height: 100%;
`;

export class GraphExplorer extends React.Component {

    constructor(props){
        super(props);
        this.setupForceDirectedGraph = this.setupForceDirectedGraph.bind(this);
    }

    componentDidMount(){
        explorerCanvasSetup();
        this.setupForceDirectedGraph();
    }

    componentDidUpdate(){
        this.setupForceDirectedGraph();
    }

    setupForceDirectedGraph(){
        if(this.props.graph) {
            let hamiltonCycles = {};
            this.props.results.forEach(result =>{
                hamiltonCycles[result['algorithm']] = result['path']
            });
            drawForceDirectedGraph(this.props.graph, hamiltonCycles);
        }
    }

    render(){
        return (
            <ExplorerCanvas id={'graph-explorer'}/>
        )
    }
}
