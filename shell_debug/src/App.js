import React, { Component } from "react";
import AddWindowButton, { MenuItem } from "./AddWindowButton";
import Window from "./Window";
import Button from "./Button";
import GBDKGame from "./GBDKGame";
import GBDKTileMap from "./GBDKTileMap";
import GBDKTileSet from "./GBDKTileSet";
import GBDKSpriteData from "./GBDKSpriteData";
import GBDKSprites from "./GBDKSprites";
import g from "./gbdkjs-instance";
import "./App.css";

const clone = data => JSON.parse(JSON.stringify(data));

const DEFAULT_WINDOWS = [
  {
    x: 50,
    y: 50,
    type: "GAME"
  },
  {
    x: 250,
    y: 50,
    type: "SCREEN_BUFFER"
  },
  {
    x: 546,
    y: 50,
    type: "WINDOW_BUFFER"
  },
  {
    x: 842,
    y: 50,
    type: "SPRITE_DATA"
  },
  {
    x: 66,
    y: 254,
    type: "BKG_DATA"
  },
  {
    x: 250,
    y: 366,
    type: "SPRITES"
  }
];

const windowTypes = {
  GAME: "Game",
  SCREEN_BUFFER: "Screen Buffer",
  WINDOW_BUFFER: "Window Buffer",
  BKG_DATA: "Tile Data",
  SPRITE_DATA: "Sprite Data",
  SPRITES: "Sprites"
};

class GBDKWindow extends Component {
  constructor() {
    super();
    this.state = {
      title: ""
    };
  }

  setTitle = title => {
    this.setState({ title });
  };

  render() {
    const { x, y, z, onMove, onClose, type } = this.props;
    const { title } = this.state;
    return (
      <Window
        x={x}
        y={y}
        z={z}
        title={title ? title : windowTypes[this.props.type]}
        onMove={onMove}
        onClose={onClose}
      >
        {type === "GAME" && <GBDKGame canvas={g.get_canvas()} />}
        {type === "SCREEN_BUFFER" &&
          <GBDKTileMap
            canvas={g.get_buffer_canvas()}
            tiles={g.get_bkg_tiles()}
            setTitle={this.setTitle}
          />}
        {type === "WINDOW_BUFFER" &&
          <GBDKTileMap
            canvas={g.get_window_canvas()}
            tiles={g.get_win_tiles()}
            setTitle={this.setTitle}
          />}
        {type === "BKG_DATA" &&
          <GBDKTileSet
            canvas={g.get_bkg_data_canvas()}
            setTitle={this.setTitle}
          />}
        {type === "SPRITE_DATA" &&
          <GBDKSpriteData
            canvas={g.get_sprite_data_canvas()}
            setTitle={this.setTitle}
          />}
        {type === "SPRITES" &&
          <GBDKSprites
            canvas={g.get_sprite_canvas()}
            tiles={g.get_sprite_tiles()}
            props={g.get_sprite_props()}
            setTitle={this.setTitle}
          />}
      </Window>
    );
  }
}

class App extends Component {
  constructor() {
    super();

    try {
      const storedState = JSON.parse(localStorage.getItem("state"));
      if (!storedState || storedState.windows.length === 0) {
        throw Error("No Stored State");
      }
      this.state = {
        windows: storedState.windows
      };
    } catch (e) {
      this.state = {
        windows: clone(DEFAULT_WINDOWS)
      };
    }
  }

  openWindow = type => {
    this.setState(
      {
        windows: [].concat(this.state.windows || [], {
          x: 30,
          y: 20,
          z: 2,
          type
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
    this.setState(
      {
        windows: this.state.windows.filter((w, i) => {
          return i !== index;
        })
      },
      () => this.saveState()
    );
  };

  resetWindows = () => {
    this.setState(
      {
        windows: clone(DEFAULT_WINDOWS)
      },
      () => this.saveState()
    );
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
        <AddWindowButton>
          {Object.keys(windowTypes).map((key, index) =>
            <MenuItem
              key={key}
              value={key}
              onClick={() => {
                this.openWindow(key);
              }}
            >
              {windowTypes[key]}
            </MenuItem>
          )}
        </AddWindowButton>
        <Button onClick={this.resetWindows}>Reset</Button>
        {windows &&
          windows.map((w, index) =>
            <GBDKWindow
              key={index}
              x={w.x}
              y={w.y}
              z={w.z}
              type={w.type}
              onMove={(x, y) => this.moveWindow(index, x, y)}
              onClose={() => this.closeWindow(index)}
            />
          )}
      </div>
    );
  }
}

export default App;
