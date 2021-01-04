import React from "react";
import styled from 'styled-components';
import {colorHamiltonCycle, drawForceDirectedGraph, explorerCanvasSetup, labelNodes, removeHamiltonCycle} from "../../../../d3/ExplorerHelper";
import {algorithmDisplayNames} from "../../DataPlot";
import {DownloadButton} from "../DownloadButton";

const ExplorerCanvas = styled.div`
    position: relative;
    width: 100%;
    height: 100%;
`;

const CenteredLoader = styled.div`
    position: relative;
    margin: auto auto;
`;

const ExplorerLegend = styled.div`
    position: absolute;
    top: 0;
    left: 2em;
    display: flex;
    flex-direction: column;
`;

const LegendTitle = styled.h3`
`;

const LegendList = styled.ul`
    list-style: none;
    padding-inline-start: 0;
`;

const LegendListItem = styled.li`
    
`;

export class GraphExplorer extends React.Component {

  constructor (props) {
    super(props);
    this.state = {
      loading: true,
      labelType: 'degree',
    };
    this.setupForceDirectedGraph = this.setupForceDirectedGraph.bind(this);
    this.checkboxHandler = this.checkboxHandler.bind(this);
    this.radioHandler = this.radioHandler.bind(this);
  }

  componentDidUpdate () {
    this.setupForceDirectedGraph();
  }

  setupForceDirectedGraph () {
    if (!this.props.loading) {
      explorerCanvasSetup();
      drawForceDirectedGraph(this.props.graph);
      removeHamiltonCycle();
      if (this.state.shownCycle != null) {
        let result = this.props.results.find(result => result['algorithm'] === this.state.shownCycle);
        colorHamiltonCycle(result);
      }
    }
  }

  checkboxHandler (event) {
    if (this.state.shownCycle === event.target.name) {
      removeHamiltonCycle();
      this.setState({
        shownCycle: null
      })
    } else {
      this.setState({
        shownCycle: event.target.name
      })
    }
  }

  radioHandler (event) {
      this.setState({
          labelType: event.target.value
      })
    labelNodes(event.target.value)
  }

  render () {
    return this.props.loading ?
      (<CenteredLoader>
        <div className="lds-ellipsis">
          <div/>
          <div/>
          <div/>
          <div/>
        </div>
      </CenteredLoader>) :
      (<ExplorerCanvas id={'graph-explorer'} style={this.props.active ? {display: 'block'} : {display: 'none'}}>
        <ExplorerLegend>
          <LegendTitle>Algorithms:</LegendTitle>
          <LegendList>
            {this.props.results.map(result => {
              if (result['hamiltonian']) {
                return (<LegendListItem key={result['algorithm']}>
                  <input type={'checkbox'}
                         onChange={this.checkboxHandler}
                         name={result['algorithm']}
                         checked={this.state.shownCycle === result['algorithm']}/>
                  {algorithmDisplayNames[result['algorithm']]}
                </LegendListItem>);
              } else {
                return (<LegendListItem key={result['algorithm']}>
                  {algorithmDisplayNames[result['algorithm']]}
                </LegendListItem>);
              }
            })}
          </LegendList>
          <LegendTitle>Node labels:</LegendTitle>
          <span>
            <input type={'radio'} name={'labeltype'} id={'id'} value={'id'} onChange={this.radioHandler} checked={this.state.labelType === 'id'}/>
            <label htmlFor={'id'}>identifier</label>
          </span>
          <span>
              <input type={'radio'} name={'labeltype'} id={'degree'} value={'degree'} onChange={this.radioHandler} checked={this.state.labelType === 'degree'}/>
              <label htmlFor={'degree'}>degree</label>
          </span>
          <DownloadButton selector={'#graph-explorer > svg'} text={'Download figure'}/>
        </ExplorerLegend>
      </ExplorerCanvas>);
  }
}
