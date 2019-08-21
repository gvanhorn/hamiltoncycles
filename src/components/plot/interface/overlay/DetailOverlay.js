import React from "react";
import styled from 'styled-components';
import {CrossIcon} from "../../StyledPlotComponents";
import {ResultOverview} from "./ResultOverview";
import {GraphExplorer} from "./GraphExplorer";
import {db} from "../../DataPlot";

const Overlay = styled.div`
    position: absolute;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 100%;
    background: rgba(256, 256, 256, 90%);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 15;
`;

const OverlayContent = styled.div`
    position: relative;
    width: 80%;
    height: 80%;
    background: #FFF;
    border: 2px solid;
    border-radius: 10px;
    overflow: hidden;
`;

const closeOverlayButtonSize = 20;
const CloseOverlayButton = styled.button`
    position: absolute;
    top: 0;
    right: 0;
    margin: .5rem .5rem 0 0;
    background: none;
    border: none;
    cursor: pointer;
`;

const DetailTabList = styled.div`
    border-bottom: 1px solid #ccc;
    padding-top: .5rem;
    width: 100%;
    display: flex;
    justify-content: center;
`;

const DetailTab = styled.div`
    margin-bottom: -1px;
    padding: 0.5rem 0.75rem;
    cursor: pointer;
`;

const DetailTabActive = styled.div`
    margin-bottom: -1px;
    padding: 0.5rem 0.75rem;
    background-color: white;
    border: solid #ccc;
    border-width: 1px 1px 0 1px;
`;

const DetailTabContents = styled.div`
    width: 100%;
    height: 100%;
`;

const tabs = ["results", "explorer"];
// const tabs = ["results"];
const tabDisplayNames = {
    'results': "Results",
    'explorer': "Graph explorer"
};

export class DetailOverlay extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            activeTab: "explorer",
            loading: true
        };

        this.activateTab = this.activateTab.bind(this);
        this.sortResultsBy = this.sortResultsBy.bind(this);
        this.compareBy.bind(this);
    }

    activateTab(event) {
        this.setState({activeTab: event.target.dataset.tabname});
    }

    sortResultsBy(key) {
        let arrayCopy = [...this.state.results];
        arrayCopy.sort(this.compareBy(key));
        this.setState({results: arrayCopy});
    }

    compareBy(key) {
        return function (a, b) {
            if (a[key] < b[key]) return -1;
            if (a[key] > b[key]) return 1;
            return 0;
        };
    }

    componentDidMount() {
        Promise.all([
            db.collection("graphs").findOne({identifier: this.props.graphID, size: this.props.graphSize}),
            db.collection("results").find({graphSize: this.props.graphSize, graphID: this.props.graphID}).toArray()
        ]).then(values => {
            let partialState = {loading: false};
            if (!values[0]) {
                console.log("Could not find graph of size " + this.props.graphSize + " and id " + this.props.graphID)
            } else {
                partialState['graph'] = values[0];
            }
            if (values[1].length === 0) {
                console.log("Could not find results for graph size " + this.props.graphSize + " and id " + this.props.graphID)
            } else {
                partialState['results'] = values[1];
            }
            this.setState(partialState);
        });
    }

    render() {
        return (
            <Overlay>
                <OverlayContent>
                    <CloseOverlayButton onClick={this.props.closeHandler}><CrossIcon width={closeOverlayButtonSize}
                                                                                     height={closeOverlayButtonSize}/></CloseOverlayButton>
                    <DetailTabList>
                        {tabs.map((tabName) => {
                            if (this.state.activeTab === tabName) {
                                return (
                                    <DetailTabActive key={tabName}>{tabDisplayNames[tabName]}</DetailTabActive>);
                            }
                            return (<DetailTab key={tabName} data-tabname={tabName}
                                               onClick={this.activateTab}>{tabDisplayNames[tabName]}</DetailTab>);
                        })}
                    </DetailTabList>
                    <DetailTabContents>
                        <ResultOverview graphID={this.props.graphID}
                                        graphSize={this.props.graphSize}
                                        results={this.state.results}
                                        active={this.state.activeTab === 'results'}
                                        loading={this.state.loading} sortFunction={this.sortResultsBy}/>
                        <GraphExplorer graphID={this.props.graphID}
                                       graphSize={this.props.graphSize}
                                       results={this.state.results}
                                       graph={this.state.graph}
                                       active={this.state.activeTab === 'explorer'}
                                       loading={this.state.loading}/>
                    </DetailTabContents>
                </OverlayContent>
            </Overlay>
        );
    }
}