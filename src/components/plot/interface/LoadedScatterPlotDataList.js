import React from "react";
import styled from 'styled-components';
import {CrossIcon, DownloadIcon} from "../StyledPlotComponents";

const Component = styled.div`
    border-left: 1px solid;
    display: block;
    padding: 0 0 0 .5em;
    margin: 0;
`;

const DownloadButton = styled.button`
    margin: .5em 0 0 .5em;
    padding: .5em;
    border: .5px solid;
    cursor: pointer;
    background: white;
    
    &:hover {
        background: radial-gradient(#FFF, #CCC);
    }
`;

const DownloadButtonText = styled.span`
    margin: auto .5em auto 0;
`;

const DataContainer = styled.div`
    display: flex;
    align-items: flex-start;
    margin: .5em 0 0 0;
    padding: 0;
    flex-wrap: wrap;
    overflow: auto;
`;

const DataSet = styled.div`
    flex-shrink: 0;
    display: grid;
    grid-template-columns: 80% 20%;
    border: 1px solid;
    padding: .5em;
    margin: 0 0 0 .5em;
`;

const DataSetLabel = styled.p`
    grid-column-start: 1;
    margin: .5em 0 0 0;
`;

const crossIconSize = '1em';
const RemoveFromPlotButton = styled.button`
    grid-column-start: 2;
    border: none;
    background: transparent;
    cursor: pointer;
    margin: .5em 0 0 0;
`;

const DerivedDataSetInput = styled.input`
    grid-column-start: 2;
    margin: 1em 0 0 .5em;
    width: 1em;
    height: 1em;
`;

export class LoadedScatterPlotDataList extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            loadedData: this.props.loadedData
        };

        this.checkboxHandler = this.checkboxHandler.bind(this);
        this.closeHandler = this.closeHandler.bind(this);
        this.downloadHandler = this.downloadHandler.bind(this);
    }

    render() {
        return (
            <Component id={'loaded-data-list'}>
                <DownloadButton onClick={this.downloadHandler}><DownloadButtonText>Download the current figure</DownloadButtonText><DownloadIcon width={'1.5em'} height={'1.5em'}/></DownloadButton>
                <DataContainer>
                    {this.state.loadedData.map(dataSet => {
                            if (!dataSet.visible) {
                                return null;
                            }

                            let displayName = this.props.algorithms.find(algorithm => {
                                return algorithm.algorithmName === dataSet.algorithmName
                            }).algorithmDisplayName;

                            let title = displayName + ", " + dataSet.graphSize;
                            return (
                                <DataSet key={title}
                                         className={'datablock'}
                                         data-algorithm={dataSet.algorithmName}
                                         data-graphsize={dataSet.graphSize}>

                                    <DataSetLabel>{title}</DataSetLabel>
                                    <RemoveFromPlotButton onClick={this.closeHandler}>
                                        <CrossIcon width={crossIconSize} height={crossIconSize}/>
                                    </RemoveFromPlotButton>

                                    <DataSetLabel>Show scatter data</DataSetLabel>
                                    <DerivedDataSetInput type={'checkbox'}
                                                         onChange={this.checkboxHandler}
                                                         name={'scatter'}
                                                         checked={dataSet.scatterVisible}/>
                                    <DataSetLabel>Show average</DataSetLabel>
                                    <DerivedDataSetInput type={'checkbox'}
                                                         onChange={this.checkboxHandler}
                                                         name={'mean'}
                                                         checked={dataSet.meanVisible}/>
                                    <DataSetLabel>Show median</DataSetLabel>
                                    <DerivedDataSetInput type={'checkbox'}
                                                         onChange={this.checkboxHandler}
                                                         name={'median'}
                                                         checked={dataSet.medianVisible}/>
                                </DataSet>
                            );
                        }
                    )}
                </DataContainer>
            </Component>
        );
    }

    downloadHandler(){
        let svg = document.querySelector('#plot-canvas svg');
        let saveSVG = require('save-svg-as-png');
        saveSVG.saveSvgAsPng(svg, "diagram.png", {encoderOptions: 1, backgroundColor: '#FFF'});
    }

    closeHandler(event){
        let datablock = event.target.closest('.datablock');
        let algorithm = datablock.dataset.algorithm;
        let graphsize = datablock.dataset.graphsize;
        this.props.hideAllDataFunction(algorithm, parseInt(graphsize));
    }

    checkboxHandler(event){
        let datablock = event.target.closest('.datablock');
        let algorithm = datablock.dataset.algorithm;
        let graphsize = datablock.dataset.graphsize;
        let type = event.target.name;
        this.props.toggleVisibilityFunction(algorithm, parseInt(graphsize), type);
    }
}