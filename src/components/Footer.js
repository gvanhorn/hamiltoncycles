import React from 'react';
import styled from 'styled-components';

const StyledFooter = styled.footer`
    font-size: 12px;
    background: silver;
    text-align: right;
    margin: 0;
    padding: .5em 1em;
`;

const FooterText = styled.p`
    margin: 0;
`;


export class Footer extends React.Component{

    render(){
        return (
            <StyledFooter>
                <FooterText>Site maintained by <a href={'mailto:contact@gijsvanhorn.nl'}>Gijs van Horn</a></FooterText>
                <FooterText>Icons made by <a href={'https://www.flaticon.com/authors/dave-gandy'} target={'_blank'} rel={'noopener noreferrer'}>Dave Gandy</a> from www.flaticon.com</FooterText>
            </StyledFooter>
        )
    }
}