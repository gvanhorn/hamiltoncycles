import React from "react";
import styled from 'styled-components';
import {CrossIcon} from "./StyledPlotComponents";

const Component = styled.div`
    display: block;
    padding: 0 0 0 .5em;
    margin: 0;
`;

const ComponentTitle = styled.h3`
    margin: .5em;
`;

const DataContainer = styled.div`
    display: flex;
    align-items: flex-start;
    padding: .5em;
`;

const DataSet = styled.div`
    display: grid;
    grid-template-columns: 80% 20%;
    border: 1px solid;
    padding: .5em;
    margin: .5em;
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
            loadedScatterPlotData: this.props.loadedScatterPlotData
        }
    }

    render() {
        return (
            <Component id={'loaded-data-list'}>
                <ComponentTitle>Currently in figure</ComponentTitle>
                <DataContainer>
                    {this.state.loadedScatterPlotData.map(scatterDataSet => {
                            let displayName = this.props.algorithms.find(algorithm => {
                                return algorithm.algorithmName === scatterDataSet.algorithmName
                            }).algorithmDisplayName;

                            let title = displayName + ", " + scatterDataSet.graphSize;
                            return (
                                <DataSet key={title}>
                                    <DataSetLabel>{title}</DataSetLabel>
                                    <RemoveFromPlotButton>
                                        <CrossIcon width={crossIconSize} height={crossIconSize}/>
                                    </RemoveFromPlotButton>
                                    <DataSetLabel>Show average</DataSetLabel>
                                    <DerivedDataSetInput type={'checkbox'}
                                                         name={scatterDataSet.algorithmName + '-average'}/>
                                    <DataSetLabel>Show median</DataSetLabel>
                                    <DerivedDataSetInput type={'checkbox'} name={scatterDataSet.algorithmName + '-median'}/>
                                </DataSet>
                            );
                        }
                    )}
                </DataContainer>
            </Component>
        );
    }
}