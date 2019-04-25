import React from "react";
import styled from 'styled-components';
import {CrossIcon} from "./StyledPlotComponents";

const Component = styled.div`
    border-left: 1px solid;
    display: block;
    padding: 0 0 0 .5em;
    margin: 0;
    height: 250px;
`;

const ComponentTitle = styled.h3`
    margin: .5em;
`;

const DataContainer = styled.div`
    display: flex;
    align-items: flex-start;
    padding: .5em;
    flex-wrap: wrap;
    overflow: auto;
`;

const DataSet = styled.div`
    flex-shrink: 0;
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
        };

        this.hideScatterData = this.hideScatterData.bind(this);
    }

    render() {
        return (
            <Component id={'loaded-data-list'}>
                <ComponentTitle>Currently in figure</ComponentTitle>
                <DataContainer>
                    {this.state.loadedScatterPlotData.map(scatterDataSet => {
                            if (!scatterDataSet.visible) {
                                return null;
                            }
                            let displayName = this.props.algorithms.find(algorithm => {
                                return algorithm.algorithmName === scatterDataSet.algorithmName
                            }).algorithmDisplayName;

                            let title = displayName + ", " + scatterDataSet.graphSize;
                            return (
                                <DataSet key={title}>
                                    <DataSetLabel>{title}</DataSetLabel>
                                    <RemoveFromPlotButton onClick={this.hideScatterData}
                                                          data-algorithm={scatterDataSet.algorithmName}
                                                          data-graphsize={scatterDataSet.graphSize}>
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

    hideScatterData(event){
        let algorithm = event.target.dataset.algorithm;
        let graphsize = event.target.dataset.graphsize;
        this.props.toggleScatterDataFunction(algorithm, parseInt(graphsize));
    }
}