import React, { Component } from "react";
import "./Window.css";

class Window extends Component {
  constructor() {
    super();
    this.state = {
      dragging: false
    };
  }

  componentWillMount() {
    window.addEventListener("mousemove", this.moveDrag);
    window.addEventListener("mouseup", this.endDrag);
  }

  componentWillUnmount() {
    window.removeEventListener("mousemove", this.moveDrag);
    window.removeEventListener("mouseup", this.endDrag);
  }

  startDrag = () => {
    this.setState({ dragging: true });
  };

  endDrag = () => {
    this.setState({ dragging: false });
  };

  moveDrag = e => {
    if (this.state.dragging) {
      this.props.onMove(e.movementX, e.movementY);
    }
  };

  render() {
    const { children, x, y, z, title } = this.props;
    return (
      <div
        className="Window"
        style={{
          top: y,
          left: x,
          zIndex: z
        }}
      >
        <div className="Window__Titlebar" onMouseDown={this.startDrag}>
          {title}
          <div className="Window__Close" onClick={this.props.onClose}>
            x
          </div>
        </div>
        <div className="Window__Content">
          {children}
        </div>
      </div>
    );
  }
}

export default Window;
