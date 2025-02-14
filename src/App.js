/* global Plotly:true */

import React, { Component } from "react";
import { cloneDeep } from "lodash";
import plotly from "plotly.js";
import createPlotlyComponent from "react-plotly.js/factory";

import Colorscale from "./lib/components/Colorscale.js";
import ColorscalePicker from "./lib/components/ColorscalePicker.js";
import { DEFAULT_SCALE } from "./lib/components/constants.js";

import map from "./plots/map.json";

import "./App.css";

const Plotly = createPlotlyComponent(plotly);

export default class App extends Component {
  constructor(props) {
    super(props);

    this.onChange = this.onChange.bind(this);
    this.toggleColorscalePicker = this.toggleColorscalePicker.bind(this);
    this.recolorData = this.recolorData.bind(this);

    this.state = {
      showColorscalePicker: false,
      colorscale: DEFAULT_SCALE,
      data: map.data,
      layout: map.layout,
      plotType: "map",
    };
  }

  recolorData = (dataToRecolor, colorscale, plotType) => {
    const data = cloneDeep(dataToRecolor);

    const plotlyColorscale = colorscale.map((x, i) => {
      return [i / (colorscale.length - 1), x];
    });

    data[0].marker.colorscale = plotlyColorscale;

    return data;
  };

  onChange = (colorscale) => {
    const data = this.recolorData(
      this.state.data,
      colorscale,
      this.state.plotType
    );

    this.setState({
      data: data,
      colorscale: colorscale,
    });
  };

  toggleColorscalePicker = () => {
    this.setState({ showColorscalePicker: !this.state.showColorscalePicker });
  };

  render() {
    let toggleButtonStyle = {};
    if (this.state.showColorscalePicker) {
      toggleButtonStyle = { borderColor: "#A2B1C6" };
    }

    return (
      <div className="App">
        <div
          onClick={this.toggleColorscalePicker}
          className="toggleButton"
          style={toggleButtonStyle}
        >
          <Colorscale
            colorscale={this.state.colorscale}
            onClick={() => {}}
            width={200}
          />
          Toggle Colorscale Picker
        </div>
        {this.state.showColorscalePicker && (
          <ColorscalePicker
            onChange={this.onChange}
            colorscale={this.state.colorscale}
            width={300}
          />
        )}
        <div className="plotContainer">
          <Plotly data={this.state.data} layout={this.state.layout} />
        </div>
      </div>
    );
  }
}
