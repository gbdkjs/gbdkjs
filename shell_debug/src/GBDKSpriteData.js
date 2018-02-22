import React, { Component } from "react";
import getCoords from "./lib/getCoords";
import decHex from "./lib/decHex";

export default class GBDKSpriteData extends Component {
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
    const pos = getCoords(e.currentTarget);
    const x = e.pageX - pos.left;
    const y = e.pageY - pos.top;
    const tX = Math.floor(x / 8) % 16;
    const tY = Math.floor(y / 8);
    const tile = tX + 16 * tY;
    const palette = Math.floor(y / 8) < 16 ? "OBP0" : "OBP1";
    const tileLabel = (tX * 2 + tY % 2 + Math.floor(tY / 2) * 32) % 256;

    this.setState({ tile });
    this.props.setTitle(`${palette} ${tileLabel} (${decHex(tileLabel)})`);
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
              left: tile % 16 * 8,
              top: Math.floor(tile / 16) * 8
            }}
          />}
      </div>
    );
  }
}
