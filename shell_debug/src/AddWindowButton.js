import React, { Component } from "react";
import Button from "./Button";
import "./AddWindowButton.css";

export class MenuItem extends Component {
  render() {
    const { onClick, children } = this.props;
    return (
      <div className="AddWindow__Menu__Item" onClick={onClick}>
        {children}
      </div>
    );
  }
}

export default class AddWindowButton extends Component {
  constructor() {
    super();
    this.state = {
      open: false
    };
  }

  toggle = () => {
    this.setState({
      open: !this.state.open
    });
  };

  render() {
    const { children } = this.props;
    const { open } = this.state;
    return (
      <div className="AddWindowButton">
        <Button onClick={this.toggle}>+ Panel</Button>
        {open &&
          <div>
            <div className="AddWindow__MenuOverlay" onClick={this.toggle} />
            <div className="AddWindow__Menu" onClick={this.toggle}>
              {children}
            </div>
          </div>}
      </div>
    );
  }
}
