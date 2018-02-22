import React, { Component } from "react";
import getCoords from "./lib/getCoords";
import decHex from "./lib/decHex";

const S_PALETTE = 0x10;
const S_FLIPX = 0x20;
const S_FLIPY = 0x40;

export default class GBDKSprites extends Component {
  constructor() {
    super();
    this.state = {
      tile: -1
    };
  }

  componentDidMount() {
    requestAnimationFrame(this.tick);
  }

  tick = () => {
    const canvas = this.refs.canvas;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      const gCanvas = this.props.canvas;
      canvas.width = gCanvas.width;
      canvas.height = gCanvas.height;
      ctx.drawImage(gCanvas, 0, 0);
      requestAnimationFrame(this.tick);
    }
  };

  onMouseMove = e => {
    const { tiles, props } = this.props;
    const pos = getCoords(e.currentTarget);
    const x = e.pageX - pos.left;
    const tX = Math.floor(x / 8) % 40;
    const tile = tX;
    this.setState({ tile });
    this.props.setTitle(
      `${tile} (${decHex(tile)}) = ${tiles[tile]} (${decHex(tiles[tile])}) ` +
        (props[tile] & S_PALETTE ? "OBP1" : "OBP0") +
        (props[tile] & S_FLIPX ? " FLIPX" : "") +
        (props[tile] & S_FLIPY ? " FLIPY" : "")
    );
  };

  onMouseLeave = e => {
    this.setState({
      tile: -1
    });
    this.props.setTitle("");
  };

  render() {
    const { tile } = this.state;

    return (
      <div onMouseMove={this.onMouseMove} onMouseLeave={this.onMouseLeave}>
        <canvas ref="canvas" />
        {tile > -1 &&
          <div
            className="GBTile"
            style={{
              left: tile % 40 * 8,
              top: 0,
              height: 16
            }}
          />}
      </div>
    );
  }
}
