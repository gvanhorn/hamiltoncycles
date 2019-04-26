import React from "react";
import styled from 'styled-components';

const StyledLoadScatterPlotDataComponent = styled.div`
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
    height: 2em;
`;

const StyledButton = styled.button`
    margin-top: 5px;
    padding: 5px;
    border: 0;
    cursor: pointer;
    grid-column-start: span 2;
    height: 2em;
`;

const loadingAnimationWidth = 100;
const loadingAnimationHeight = '2em';
const LoadingAnimationRow = styled.div`
    height: ${loadingAnimationHeight};
    grid-column-start: span 2;
    padding-left: 50%;
    margin-left: -${loadingAnimationWidth / 2}px;
`;

const ErrorMessage = styled.span`
    color: red;
`;


export class LoadScatterPlotDataComponent extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            algorithm: this.props.algorithms[0].algorithmName,
            graphSize: this.props.graphSizes[0]
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    render() {
        let loadingState = null;
        if (this.props.isLoading) {
            loadingState = (
                <div className="lds-ellipsis">
                    <div /><div /><div/><div/>
                </div>
            );
        }

        if (this.props.errorLoadingData) {
            loadingState = (
                <ErrorMessage>Error loading data</ErrorMessage>
            );
        }
        return (
            <StyledLoadScatterPlotDataComponent id={'load-scatter-data-component'}>
                <ComponentTitle>Add data to the figure</ComponentTitle>
                <StyledLabel>Algorithm:</StyledLabel>
                <StyledSelect value={this.state.algorithm} name='algorithm' onChange={this.handleChange}>
                    {this.props.algorithms.map(algorithm => (
                            <option key={algorithm.algorithmName}
                                    value={algorithm.algorithmName}>{algorithm.algorithmDisplayName}</option>
                        )
                    )}
                </StyledSelect>
                <StyledLabel>Graph size:</StyledLabel>
                <StyledSelect value={this.state.graphSize} name='graphSize' onChange={this.handleChange}>
                    {this.props.graphSizes.map(graphSize => (
                            <option key={graphSize} value={graphSize}>{graphSize}</option>
                        )
                    )}
                </StyledSelect>
                <StyledButton onClick={this.handleSubmit}>Add to plot</StyledButton>
                <LoadingAnimationRow>
                    {loadingState}
                </LoadingAnimationRow>
            </StyledLoadScatterPlotDataComponent>
        );
    }

    handleChange(event) {
        let partialState = {};
        let propertyName = event.target.name;
        let propertyValue = event.target.value;
        if (propertyName === 'graphSize'){
            propertyValue = parseInt(event.target.value);
        }

        partialState[propertyName] = propertyValue;
        this.setState(partialState);
    }

    handleSubmit() {
        this.props.loadDataFunction(this.state.algorithm, this.state.graphSize);
    }
}