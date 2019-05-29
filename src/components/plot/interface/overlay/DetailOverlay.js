import React from "react";
import styled from 'styled-components';
import {CrossIcon} from "../../StyledPlotComponents";
import {ResultOverview} from "./ResultOverview";
import {GraphExplorer} from "./GraphExplorer";

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

    constructor(props){
        super(props);

        this.state = {
            activeTab: "explorer"
        };

        this.activateTab = this.activateTab.bind(this);
    }

    activateTab(event){
        this.setState({activeTab: event.target.dataset.tabname});
    }

    render(){
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
                        {(this.state.activeTab === 'results') ? (
                            <ResultOverview graphID={this.props.graphID}
                                            graphSize={this.props.graphSize}/>
                        ) : ''}
                        {(this.state.activeTab === 'explorer') ? (
                            <GraphExplorer graphID={this.props.graphID} graphSize={this.props.graphSize}/>
                        ) : ''}
                    </DetailTabContents>
                </OverlayContent>
            </Overlay>
        );
    }
}