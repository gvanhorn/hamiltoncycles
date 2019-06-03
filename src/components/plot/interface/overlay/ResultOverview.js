import styled from "styled-components";
import React from "react";
import {algorithmDisplayNames} from "../../DataPlot";


const ResultPane = styled.div`
    display: block;
    padding-top: 2rem;
    text-align: center;
`;

const ResultsTable = styled.table`
    table-layout: fixed;
    width: 100%;
    border-collapse: collapse;
`;

const ResultsTableHeader = styled.th`
    border-bottom: 1px solid;
    cursor: pointer;
`;

const ResultsTableDatum = styled.td`
    border-left: 1px solid;
`;

const ResultsTableRow = styled.tr`
    &:hover {
        background-color: #c6e2ff;
    }
`;

export class ResultOverview extends React.Component {

    constructor() {
        super();
        this.state = {
            loading: true,
            results: []
        };
    }

    render() {
        return (
            <ResultPane style={this.props.active ? {display: 'block'} : {display: 'none'}}>
                <h3>Graph with identifier: {this.props.graphID}, of the {this.props.graphSize}-node graph test set</h3>
                {this.props.loading ? 'loading...' :
                    <ResultsTable>
                        <thead>
                        <tr>
                            <ResultsTableHeader>Algorithm</ResultsTableHeader>
                            <ResultsTableHeader onClick={() => this.props.sortFunction('iterations')}>Cost
                                (Iterations)</ResultsTableHeader>
                            <ResultsTableHeader onClick={() => this.props.sortFunction('relativeCost')}>Cost (Iterations
                                / graph size)</ResultsTableHeader>
                            <ResultsTableHeader onClick={() => this.props.sortFunction('nanoseconds')}>Cost
                                (Nanoseconds)</ResultsTableHeader>
                        </tr>
                        </thead>
                        <tbody>
                        {this.props.results.map(result => {
                            return (
                                <ResultsTableRow key={result['algorithm']}>
                                    <th>{algorithmDisplayNames[result['algorithm']]}</th>
                                    <ResultsTableDatum>{result['iterations']}</ResultsTableDatum>
                                    <ResultsTableDatum>{result['relativeCost']}</ResultsTableDatum>
                                    <ResultsTableDatum>{result['nanoseconds']}</ResultsTableDatum>
                                </ResultsTableRow>
                            )
                        })}
                        </tbody>
                    </ResultsTable>
                }
            </ResultPane>
        );
    }
}
