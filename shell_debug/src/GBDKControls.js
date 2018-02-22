import React, { Component } from "react";
import cx from "classnames";
import "./GBDKControls.css";

const J_LEFT = 0x02;
const J_RIGHT = 0x01;
const J_UP = 0x04;
const J_DOWN = 0x08;
const J_START = 0x80;
const J_SELECT = 0x40;
const J_A = 0x10;
const J_B = 0x20;

class GBDKControls extends Component {
  constructor() {
    super();
    this.state = {
      joypad: 0
    };
  }

  componentDidMount() {
    requestAnimationFrame(this.tick);
  }

  tick = () => {
    const g = this.props.gbdk;
    this.setState({
      joypad: g.joypad()
    });
    requestAnimationFrame(this.tick);
  };

  setTitle = title => () => {
    this.props.setTitle(title);
  };

  clearTitle = () => {
    this.props.setTitle("");
  };

  render() {
    const { joypad } = this.state;
    return (
      <div className="GBDKControls">
        <div className="GBDKControls__Dpad">
          <div
            onMouseEnter={this.setTitle("Up (Arrow Up)")}
            onMouseLeave={this.clearTitle}
            className={cx("GBDKControls__Dpad__Up", {
              "GBDKControls--Selected": joypad & J_UP
            })}
          />
          <div
            onMouseEnter={this.setTitle("Down (Arrow Down)")}
            onMouseLeave={this.clearTitle}
            className={cx("GBDKControls__Dpad__Down", {
              "GBDKControls--Selected": joypad & J_DOWN
            })}
          />
          <div
            onMouseEnter={this.setTitle("Left (Arrow Left)")}
            onMouseLeave={this.clearTitle}
            className={cx("GBDKControls__Dpad__Left", {
              "GBDKControls--Selected": joypad & J_LEFT
            })}
          />
          <div
            onMouseEnter={this.setTitle("Right (Arrow Right)")}
            onMouseLeave={this.clearTitle}
            className={cx("GBDKControls__Dpad__Right", {
              "GBDKControls--Selected": joypad & J_RIGHT
            })}
          />
        </div>
        <div
          onMouseEnter={this.setTitle("Start (Enter)")}
          onMouseLeave={this.clearTitle}
          className={cx("GBDKControls__Start", {
            "GBDKControls--Selected": joypad & J_START
          })}
        />
        <div
          onMouseEnter={this.setTitle("Select (Shift)")}
          onMouseLeave={this.clearTitle}
          className={cx("GBDKControls__Select", {
            "GBDKControls--Selected": joypad & J_SELECT
          })}
        />
        <div
          onMouseEnter={this.setTitle("B (Ctrl)")}
          onMouseLeave={this.clearTitle}
          className={cx("GBDKControls__B", {
            "GBDKControls--Selected": joypad & J_B
          })}
        />
        <div
          onMouseEnter={this.setTitle("A (Alt)")}
          onMouseLeave={this.clearTitle}
          className={cx("GBDKControls__A", {
            "GBDKControls--Selected": joypad & J_A
          })}
        />
      </div>
    );
  }
}

export default GBDKControls;
