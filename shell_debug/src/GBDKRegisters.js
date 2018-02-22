import React, { Component } from "react";
import decHex from "./lib/decHex";
import decBin from "./lib/decBin";
import "./GBDKRegisters.css";

class GBDKRegisters extends Component {
  constructor() {
    super();
    this.state = {
      registers: {
        SCX_REG: 0,
        SCY_REG: 0,
        WX_REG: 0,
        WY_REG: 0,
        LYC_REG: 0,
        LCDC_REG: 0,
        BGP_REG: 0,
        OBP0_REG: 0,
        OBP1_REG: 0
      }
    };
  }

  componentDidMount() {
    requestAnimationFrame(this.tick);
  }

  tick = () => {
    const g = this.props.gbdk;
    this.setState({
      registers: {
        SCX_REG: g.SCX_REG,
        SCY_REG: g.SCY_REG,
        WX_REG: g.WX_REG,
        WY_REG: g.WY_REG,
        LYC_REG: g.LYC_REG,
        LCDC_REG: g.LCDC_REG,
        BGP_REG: g.BGP_REG,
        OBP0_REG: g.OBP0_REG,
        OBP1_REG: g.OBP1_REG
      }
    });
    requestAnimationFrame(this.tick);
  };

  render() {
    const { registers } = this.state;
    return (
      <table className="GBDKRegisters">
        <tbody>
          {Object.keys(registers).map(register =>
            <tr key={register}>
              <th>
                {register}
              </th>
              <td>
                {registers[register]}
              </td>
              <td>
                {decHex(registers[register])}
              </td>
              <td>
                {decBin(registers[register])}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    );
  }
}

export default GBDKRegisters;
