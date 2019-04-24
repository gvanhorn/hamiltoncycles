import React from "react";
import styled from 'styled-components';


const StyledLoadScatterPlotDataComponent = styled.div`
    border-bottom: 1px solid;
    padding: 5px;
    width: fit-content;
`;

const StyledLabel = styled.label`
    margin: 0 5px 0 10px;
`;

const StyledButton = styled.button`
    margin: 0 0 0 10px;
    padding: 5px;
    border: 0;
    cursor: pointer;
`;

export class LoadScatterPlotDataComponent extends React.Component {

    render(){
        return (
            <StyledLoadScatterPlotDataComponent>
                <StyledLabel>Algorithm: </StyledLabel>
                <select>
                    {this.props.algorithms.map(algorithm => (
                            <option value={algorithm.id}>{algorithm.displayName}</option>
                        )
                    )}
                </select>
                <StyledLabel>Graph size:</StyledLabel>
                <select>
                    {this.props.graphSizes.map(graphSize => (
                            <option value={graphSize}>{graphSize}</option>
                        )
                    )}
                </select>
                <StyledButton>Add to plot</StyledButton>
            </StyledLoadScatterPlotDataComponent>
        )
    }
}