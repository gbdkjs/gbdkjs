import React, { Component } from "react";

export default class GBDKTileMap extends Component {
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

  render() {
    return <canvas ref="canvas" />;
  }
}
