import React,{Component} from 'react';
import styled from 'styled-components';
import {PlotComponentHeader} from './StyledPlotComponents';

const Canvas = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
`;

export class PlotCanvas extends Component {

    render() {
        return (
            <Canvas id={'plot-canvas'}>
                <PlotComponentHeader>Relative time-cost of algorithms</PlotComponentHeader>
            </Canvas>
        )
    }

}