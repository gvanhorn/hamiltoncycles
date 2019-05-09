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

    constructor(props) {
        super(props);

        this.state = {
            results: []
        };

        this.fetchJSONData = this.fetchJSONData.bind(this);
    }

    componentDidMount() {
        console.log("Result overview mounted");
        console.log(this.props);
        let dataSets = this.props.loadedData.filter(dataSet => {
            return (dataSet['graphSize'] === this.props.graphSize);
        });

        let results = [];
        dataSets.forEach(dataSet => {
            results.push(dataSet.data.find(result => {
                return result['graphID'] === this.props.graphID;
            }));
        });

        this.setState({results: results});

        // let dataUrl = window.location + "graphs/indexed-" + this.props.graphSize + "-node-test-set/" + this.props.graphID + ".json";
        // Promise.resolve(this.fetchJSONData(dataUrl)).then(
        //     graph => {
        //         this.setState({graph:graph, results: results});
        //     }
        // );
    }

    fetchJSONData(url) {
        console.log(url);
        return fetch(url)
            .then(response => response.json())
            .then((jsonData) => {
                this.setState({errorLoadingData: false});
                return jsonData;
            })
            .catch((error) => {
                console.log(error);
                this.setState({errorLoadingData: true});
            });
    }


    render() {
        return (
            <ResultPane>
                <h3>Graph with identifier: {this.props.graphID}, of the {this.props.graphSize}-node graph test set</h3>
                <ResultsTable>
                    <thead>
                    <tr>
                        <ResultsTableHeader>Algorithm</ResultsTableHeader>
                        <ResultsTableHeader>Cost (Iterations)</ResultsTableHeader>
                        <ResultsTableHeader>Cost (Iterations / graph size)</ResultsTableHeader>
                        <ResultsTableHeader>Cost (Milliseconds)</ResultsTableHeader>
                    </tr>
                    </thead>
                    <tbody>
                    {this.state.results.map(result => {
                        return (
                            <ResultsTableRow key={result['algorithm']}>
                                <th>{algorithmDisplayNames[result['algorithm']]}</th>
                                <ResultsTableDatum>{result['iterations']}</ResultsTableDatum>
                                <ResultsTableDatum>{result['relativeCost']}</ResultsTableDatum>
                                <ResultsTableDatum>{result['milliseconds']}</ResultsTableDatum>
                            </ResultsTableRow>
                        )
                    })}
                    </tbody>
                </ResultsTable>
            </ResultPane>
        );
    }
}
