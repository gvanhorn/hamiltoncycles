import React from "react";
import styled from 'styled-components';
import {CrossIcon} from "../StyledPlotComponents";

const PopUpWrapper = styled.div`
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

const PopUpContent = styled.div`
    width: 80%;
    height: 80%;
    background: #FFF;
    border: 2px solid;
    border-radius: 10px;
`;

const ClosePopUpButton = styled.button`
    background: none;
    border: none;
    float: right;
    cursor: pointer;
`;

export class DetailOverlay extends React.Component {

    constructor(props){
        super(props);

        this.state = {
            isOpen: this.props.isOpen,
            graphID : 0,
            graphSize: 16,
            results: [{"graphID": 0, "averageDegree": 0.125, "hamiltonian": false, "iterations": 3, "relativeCost": 0.09375, "milliseconds": 0, "path": null, "algorithm": "cetal"}]
        };

        this.fetchJSONData = this.fetchJSONData.bind(this);
    }

    componentDidMount(){
        if(this.state.errorLoadingData){
            console.log("Error loading data")
        }else {
            let dataUrl = window.location + "graphs/indexed-" + this.state.graphSize + "-node-test-set/" + this.state.graphID + ".json";
            Promise.resolve(this.fetchJSONData(dataUrl)).then(
                graph => {
                    this.setState({graph:graph});
                }
            );
        }
    }

    fetchJSONData(url) {
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

    render(){
        return (
            <PopUpWrapper isOpen={this.state.isOpen}>
                <PopUpContent>
                    <ClosePopUpButton onClick={this.props.closeHandler}><CrossIcon width={20} height={20}/></ClosePopUpButton>
                </PopUpContent>
            </PopUpWrapper>
        );
    }
}