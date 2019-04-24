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
`;

const MenuButton = styled.button`
    position: absolute;
    top: -${buttonSize}px;
    margin-left: -${buttonSize / 2}px;
    left: 50%;    
    padding: 0;
    border: 0;
    background: transparent;
    cursor: pointer;
`;

const MenuContent = styled.div`
`;

export class VerticalScrollMenu extends Component {

    constructor(props) {
        super(props);

        this.state = {
            visible: false
        };

        this.toggleMenu = this.toggleMenu.bind(this);
    }

    toggleMenu() {
        if (this.state.visible) {
            this.setState({visible: false})
        } else {
            this.setState({visible: true})
        }
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
                    </MenuButton>
                    <MenuContent>{this.props.children}</MenuContent>
                </Menu>
            </MenuWrapper>
        );
    }
}