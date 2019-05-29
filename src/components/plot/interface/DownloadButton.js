import React from "react";
import {DownloadIcon} from "../StyledPlotComponents";
import styled from "styled-components";


const StyledButton = styled.button`
    margin: .5em 0 0 .5em;
    padding: .5em;
    border: .5px solid;
    cursor: pointer;
    background: white;
    
    &:hover {
        background-color: #c6e2ff;
    }
`;

const DownloadButtonText = styled.span`
    margin: auto .5em auto 0;
`;

export class DownloadButton extends React.Component{

    constructor(props){
        super(props);

        this.downloadHandler = this.downloadHandler.bind(this);
    }

    downloadHandler(){
        let svg = document.querySelector(this.props.selector);
        let saveSVG = require('save-svg-as-png');
        saveSVG.saveSvgAsPng(svg, "diagram.png", {encoderOptions: 1, backgroundColor: '#FFF'});
    }

    render() {
        return (
            <StyledButton onClick={this.downloadHandler}>
                <DownloadButtonText>{this.props.text}</DownloadButtonText>
                <DownloadIcon width={'1.5em'} height={'1.5em'}/>
            </StyledButton>
        )
    }
}