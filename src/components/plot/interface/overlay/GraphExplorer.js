import React from "react";
import styled from 'styled-components';
import {drawForceDirectedGraph, explorerCanvasSetup} from "../../../../d3/ExplorerHelper";

const ExplorerCanvas = styled.div`
    width: 100%;
    height: 100%;
`;

export class GraphExplorer extends React.Component {

    componentDidMount(){
        explorerCanvasSetup();
        if(this.props.graph) {
            drawForceDirectedGraph(this.props.graph);
        }
    }

    componentDidUpdate(){
        if(this.props.graph) {
            drawForceDirectedGraph(this.props.graph);
        }
    }

    render(){
        return (
            <ExplorerCanvas id={'graph-explorer'}/>
        )
    }
}
