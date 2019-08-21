import React from "react";
import styled from 'styled-components';
import {algorithmDisplayNames} from "../DataPlot";

const Component = styled.div`
    border-left: 1px solid;
    display: block;
    padding: 0 0 0 .5em;
    margin: 0;
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
    }

    render() {
        return (
            <Component id={'loaded-data-list'}>
                <DataContainer>
                    {this.state.loadedData.map(dataSet => {
                            if (!dataSet.visible) {
                                return null;
                            }

                            let displayName = algorithmDisplayNames[dataSet.algorithmName];

                            let title = displayName + ", " + dataSet.graphSize;
                            return (
                                <DataSet key={title}
                                         className={'datablock'}
                                         data-algorithm={dataSet.algorithmName}
                                         data-graphsize={dataSet.graphSize}>

                                    <DataSetLabel>{title}</DataSetLabel>
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