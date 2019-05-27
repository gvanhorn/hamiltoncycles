import styled from "styled-components";
import React from "react";
import {algorithmDisplayNames, db} from "../../DataPlot";


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

    constructor(){
        super();
        this.state = {
            loading: true,
            results: []
        }
    }

    componentDidMount(){
        db.collection("results")
            .find({graphID: this.props.graphID, graphSize: this.props.graphSize})
            .toArray()
            .then(docs => {
                this.setState({loading: false, results: docs})
            })
    }

    render() {
        return (
            <ResultPane>
                <h3>Graph with identifier: {this.props.graphID}, of the {this.props.graphSize}-node graph test set</h3>
                {this.state.loading ? 'loading...' :
                    <ResultsTable>
                        <thead>
                        <tr>
                            <ResultsTableHeader>Algorithm</ResultsTableHeader>
                            <ResultsTableHeader>Cost (Iterations)</ResultsTableHeader>
                            <ResultsTableHeader>Cost (Iterations / graph size)</ResultsTableHeader>
                            <ResultsTableHeader>Cost (Nanoseconds)</ResultsTableHeader>
                        </tr>
                        </thead>
                        <tbody>
                        {this.state.results.map(result => {
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
