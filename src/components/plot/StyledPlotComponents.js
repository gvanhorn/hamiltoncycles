import styled from "styled-components";
import React from 'react';

export const PlotComponentHeader = styled.h2`
    position: absolute;
    top: 0;
    left: 50%;
    transform: translate(-50%, 0);
    font-size: 1.5em;
    color: black;
`;

const NoClickSvg = styled.svg`
    pointer-events: none;
`;

export class ArrowIcon extends React.Component{
   render(){
       return(
           <svg xmlns="http://www.w3.org/2000/svg" width={this.props.width} height={this.props.height} viewBox="0 0 284.936 284.936" transform={this.props.transform}><path d="M277.515 135.9L144.464 2.857C142.565.955 140.375 0 137.9 0c-2.472 0-4.659.955-6.562 2.857l-14.277 14.275c-1.903 1.903-2.853 4.089-2.853 6.567 0 2.478.95 4.664 2.853 6.567L229.268 142.47 117.062 254.677c-1.903 1.903-2.853 4.093-2.853 6.564 0 2.477.95 4.667 2.853 6.57l14.277 14.271c1.902 1.905 4.089 2.854 6.562 2.854 2.478 0 4.665-.951 6.563-2.854l133.051-133.044c1.902-1.902 2.851-4.093 2.851-6.567s-.949-4.664-2.851-6.571z"/><path d="M170.732 142.471c0-2.474-.947-4.665-2.857-6.571L34.833 2.857C32.931.955 30.741 0 28.267 0S23.602.955 21.7 2.857L7.426 17.133C5.52 19.036 4.57 21.222 4.57 23.7c0 2.478.95 4.664 2.856 6.567L119.63 142.471 7.426 254.677c-1.906 1.903-2.856 4.093-2.856 6.564 0 2.477.95 4.667 2.856 6.57l14.273 14.271c1.903 1.905 4.093 2.854 6.567 2.854s4.664-.951 6.567-2.854l133.042-133.044c1.91-1.902 2.857-4.093 2.857-6.567z"/></svg>
       );
   }
}

export class CrossIcon extends React.Component{
    render(){
        return(
            <NoClickSvg xmlns="http://www.w3.org/2000/svg" width={this.props.width} height={this.props.height} viewBox="0 0 339.177 339.177"><path d="M247.244 169.59l83.938-83.938c5.332-5.327 7.994-11.798 7.994-19.414 0-7.614-2.669-14.084-7.994-19.414L292.355 7.993C287.026 2.665 280.556 0 272.944 0c-7.617 0-14.085 2.665-19.417 7.993L169.59 91.931 85.651 7.993C80.325 2.665 73.854 0 66.237 0c-7.611 0-14.083 2.665-19.414 7.993L7.994 46.824C2.667 52.15 0 58.624 0 66.238c0 7.616 2.664 14.084 7.994 19.414l83.937 83.938-83.937 83.938C2.667 258.859 0 265.327 0 272.945c0 7.61 2.664 14.082 7.994 19.41l38.83 38.828c5.33 5.332 11.803 7.994 19.414 7.994 7.616 0 14.084-2.669 19.414-7.994l83.939-83.938 83.944 83.938c5.328 5.332 11.793 7.994 19.417 7.994 7.611 0 14.082-2.669 19.411-7.994l38.82-38.828c5.332-5.324 7.994-11.8 7.994-19.41 0-7.618-2.662-14.086-7.994-19.417l-83.939-83.938z"/></NoClickSvg>
        )
    }
}

export class DownloadIcon extends React.Component{
    render(){
        return (
            <NoClickSvg xmlns="http://www.w3.org/2000/svg" width={this.props.width} height={this.props.height} viewBox="0 0 475.078 475.077"><path d="M467.083 318.627c-5.324-5.328-11.8-7.994-19.41-7.994H315.195l-38.828 38.827c-11.04 10.657-23.982 15.988-38.828 15.988-14.843 0-27.789-5.324-38.828-15.988l-38.543-38.827H27.408c-7.612 0-14.083 2.669-19.414 7.994C2.664 323.955 0 330.427 0 338.044v91.358c0 7.614 2.664 14.085 7.994 19.414 5.33 5.328 11.801 7.99 19.414 7.99h420.266c7.61 0 14.086-2.662 19.41-7.99 5.332-5.329 7.994-11.8 7.994-19.414v-91.358c0-7.617-2.662-14.089-7.995-19.417zm-107.058 96.214c-3.621 3.617-7.905 5.424-12.854 5.424s-9.227-1.807-12.847-5.424c-3.614-3.617-5.421-7.898-5.421-12.844 0-4.948 1.807-9.236 5.421-12.847 3.62-3.62 7.898-5.431 12.847-5.431s9.232 1.811 12.854 5.431c3.613 3.61 5.421 7.898 5.421 12.847 0 4.945-1.808 9.227-5.421 12.844zm73.084 0c-3.614 3.617-7.898 5.424-12.848 5.424-4.948 0-9.229-1.807-12.847-5.424-3.613-3.617-5.42-7.898-5.42-12.844 0-4.948 1.807-9.236 5.42-12.847 3.617-3.62 7.898-5.431 12.847-5.431s9.233 1.811 12.848 5.431c3.617 3.61 5.427 7.898 5.427 12.847 0 4.945-1.807 9.227-5.427 12.844z"/><path d="M224.692 323.479c3.428 3.613 7.71 5.421 12.847 5.421 5.141 0 9.418-1.808 12.847-5.421l127.907-127.908c5.899-5.519 7.234-12.182 3.997-19.986-3.23-7.421-8.847-11.132-16.844-11.136h-73.091V36.543c0-4.948-1.811-9.231-5.421-12.847-3.62-3.617-7.901-5.426-12.847-5.426h-73.096c-4.946 0-9.229 1.809-12.847 5.426-3.615 3.616-5.424 7.898-5.424 12.847V164.45h-73.089c-7.998 0-13.61 3.715-16.846 11.136-3.234 7.801-1.903 14.467 3.999 19.986l127.908 127.907z"/></NoClickSvg>
        )
    }
}