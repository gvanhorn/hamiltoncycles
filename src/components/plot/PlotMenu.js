import React, {Component} from 'react';
import styled from 'styled-components';
import {ArrowIcon} from './StyledPlotComponents';

const menuHeight = 250;
const buttonSize = 24;

const MenuWrapper = styled.nav`
    width: 100%;
    height: 100%;
    margin: ${props => props.isOpen ? `-${menuHeight}px` : `0`} 0 0 0;
    transition: margin .5s;
`;

const Menu = styled.div`
    position: relative;
    width: 100%;
    height: ${menuHeight}px;
    background: white;
    border-top: 1px solid;
`;

const MenuButton = styled.button`
    position: absolute;
    top: -${2 * buttonSize}px;
    margin-left: -${buttonSize / 2}px;
    left: 50%;    
    padding: 0;
    border: 0;
    background: transparent;
    cursor: pointer;
    display: flex;
    justify-content: flex-start;
`;

const MenuButtonLabel = styled.span`
    padding-top: .5em;
    padding-left: .5em;
`;

const MenuContent = styled.div`
    position: relative;
    height: ${menuHeight}px;
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
    padding: 0 0 1em 2em;
    overflow: auto;
`;

export class PlotMenu extends Component {

    constructor(props) {
        super(props);

        this.state = {
            visible: false
        };

        this.toggleMenu = this.toggleMenu.bind(this);
    }

    toggleMenu() {
        this.setState({visible: !this.state.visible})
    }

    render() {
        return (
            <MenuWrapper className={'plot-menu-wrapper'} isOpen={this.state.visible}>
                <Menu className={'plot-menu'}>
                    <MenuButton onClick={this.toggleMenu}>
                            <span>
                                <ArrowIcon width={buttonSize} height={buttonSize}
                                           transform={this.state.visible ? 'rotate(90)' : 'rotate(-90)'}/>
                            </span>
                            <MenuButtonLabel>{this.state.visible ? 'Close menu' : 'Open menu'}</MenuButtonLabel>
                    </MenuButton>
                    <MenuContent>
                        {this.props.children}
                    </MenuContent>
                </Menu>
            </MenuWrapper>
        );
    }
}