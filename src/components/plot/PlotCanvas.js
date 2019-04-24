import React,{Component} from 'react';
import styled from 'styled-components';

const Canvas = styled.div`
    width: 100%;
    height: 100%;
`;

export class PlotCanvas extends Component {

    render() {
        return (
            <Canvas id={'plot-canvas'}>
                {this.props.children}
            </Canvas>
        )
    }

}