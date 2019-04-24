import React from "react";
import styled from 'styled-components';


const StyledLoadScatterPlotDataComponent = styled.div`
    border-right: 1px solid;
    padding: 0 .5em 0 0;
    margin: 0;
    display: grid;
    grid-template-columns: 50% 50%;
`;

const ComponentTitle = styled.h3`
    margin: .5em;
    grid-column-start: span 2;
`;

const StyledLabel = styled.label`
    margin: 0.5em 0;
`;

const StyledSelect = styled.select`
    margin: 0.5em 0;
`;

const StyledButton = styled.button`
    margin-top: 5px;
    padding: 5px;
    border: 0;
    cursor: pointer;
    grid-column-start: span 2;
`;

export class LoadScatterPlotDataComponent extends React.Component {

    render(){
        return (
            <StyledLoadScatterPlotDataComponent id={'load-scatter-data-component'}>
                <ComponentTitle>Add data to the figure</ComponentTitle>
                <StyledLabel>Algorithm:</StyledLabel>
                <StyledSelect>
                    {this.props.algorithms.map(algorithm => (
                            <option value={algorithm.id}>{algorithm.displayName}</option>
                        )
                    )}
                </StyledSelect>
                <StyledLabel>Graph size:</StyledLabel>
                <StyledSelect>
                    {this.props.graphSizes.map(graphSize => (
                            <option value={graphSize}>{graphSize}</option>
                        )
                    )}
                </StyledSelect>
                <StyledButton>Add to plot</StyledButton>
            </StyledLoadScatterPlotDataComponent>
        )
    }
}