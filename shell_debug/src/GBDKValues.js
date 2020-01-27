import React, { Component } from "react";
import "./GBDKValues.css";

class GBDKValues extends Component {
  constructor() {
    super();
    this.state = {
      values: {}
    };
  }

  componentDidMount() {
    requestAnimationFrame(this.tick);
  }

  tick = () => {
    const g = this.props.gbdk;
    this.setState({
      values: g.debugValues
    });
    requestAnimationFrame(this.tick);
  };

  render() {
    const { values } = this.state;
    return (
      <table className="GBDKValues">
        <tbody>
          {Object.keys(values).length === 0 && <div>
            Define values using<br />
            LOG_VALUE("name", value);
          </div>}
          {Object.keys(values).map(key =>
            <tr key={key}>
              <th>
                {key}
              </th>
              <td>
                {values[key]}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    );
  }
}

export default GBDKValues;
