import React, { Component } from "react";
import Window from "./Window";
import logo from "./logo.svg";
import g from "./gbdkjs-instance";

const windowTypes = {
  GAME: {
    title: "Game",
    fn: g.get_canvas
  },
  SCREEN_BUFFER: {
    title: "Screen Buffer",
    fn: g.get_buffer_canvas
  }
};

class GBDKWindow extends Component {
  componentDidMount() {
    requestAnimationFrame(this.tick);
  }

  tick = () => {
    const canvas = this.refs.canvas;
    const ctx = canvas.getContext("2d");
    const gCanvas = windowTypes[this.props.type || "GAME"].fn();
    canvas.width = gCanvas.width;
    canvas.height = gCanvas.height;
    ctx.drawImage(gCanvas, 0, 0);
    requestAnimationFrame(this.tick);
  };

  render() {
    const { x, y, z, onMove, onClose } = this.props;
    return (
      <Window
        x={x}
        y={y}
        z={z}
        title={windowTypes[this.props.type || "GAME"].title}
        onMove={onMove}
        onClose={onClose}
      >
        <canvas ref="canvas" />
      </Window>
    );
  }
}

class App extends Component {
  constructor() {
    super();

    const storedState = JSON.parse(localStorage.getItem("state") || "{}");

    this.state = {
      windows: storedState.windows
    };
  }

  openWindow = () => {
    alert(this.refs.winType.value);
    this.setState(
      {
        windows: [].concat(this.state.windows || [], {
          x: 10,
          y: 10,
          z: 2,
          type: this.refs.winType.value
        })
      },
      () => this.saveState()
    );
  };

  moveWindow = (index, x, y) => {
    this.setState(
      {
        windows: this.state.windows.map((w, i) => {
          if (i === index) {
            w.x += x;
            w.y += y;
            w.z = 1;
          } else {
            w.z = 0;
          }
          return w;
        })
      },
      () => this.saveState()
    );
  };

  closeWindow = index => {
    this.setState({
      windows: this.state.windows.filter((w, i) => {
        return i !== index;
      })
    });
  };

  saveState = () => {
    localStorage.setItem(
      "state",
      JSON.stringify({
        windows: this.state.windows
      })
    );
  };

  render() {
    const { windows } = this.state;
    return (
      <div className="App">
        <h1>Test</h1>
        <select ref="winType">
          {Object.keys(windowTypes).map((key, index) => (
            <option key={key} value={key}>
              {windowTypes[key].title}
            </option>
          ))}
        </select>
        <button onClick={() => this.openWindow()}>+</button>
        {windows &&
          windows.map((w, index) => (
            <GBDKWindow
              key={index}
              x={w.x}
              y={w.y}
              z={w.z}
              type={w.type}
              onMove={(x, y) => this.moveWindow(index, x, y)}
              onClose={() => this.closeWindow(index)}
            />
          ))}
      </div>
    );
  }
}

export default App;
