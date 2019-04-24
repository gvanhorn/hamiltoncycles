import React,{Component} from 'react';
import {PlotCanvas} from "./PlotCanvas";
import {VerticalScrollMenu} from "./VerticalScrollMenu";
import styled from 'styled-components';
import {PlotComponentHeader} from "./StyledPlotComponents";

const Window = styled.div`
    width: 100%;
    height: 100vh;
    overflow: hidden;
`;

export class PlotWrapper extends Component {

    constructor(props){
        super(props);

        let algorithms = ['Cetal'];
        let graphSizes = [16];
        let lineTypes = ['Average', 'Median'];

        this.state = {
            algorithms: algorithms,
            graphSizes: graphSizes,
            lineTypes: lineTypes
        }
    }

    render() {

        return (
            <Window id={'plot-wrapper'}>
                <PlotCanvas/>
                <VerticalScrollMenu>
                    <PlotComponentHeader>Select the data to plot</PlotComponentHeader>
                </VerticalScrollMenu>
            </Window>
        )
    }
}