import React, { Component } from "react";
import { withResizeDetector } from "react-resize-detector";
import * as d3 from 'd3';
import _ from 'lodash';
import '../css/Map.scss';

class Map extends Component {
    constructor(props) {
        super(props);

        this.state = {
            widthHeightRatio: 1.34,
            legendStepSize: 2
        }

        this.chartRef = React.createRef();
        this.tooltipRef = React.createRef();
    }

    redrawChart() {
        const width = this.props.width,
              height = this.props.width*this.state.widthHeightRatio;  

        d3.select(this.chartRef.current).select("svg").remove();

        const colorScale = d3
            .scaleSequential()
            .domain([
                0,
                d3.max(this.props.data, d => d.count)
            ])
            .range(this.props.colors);
        
        const projection2 = d3
            .geoMercator()
            .fitSize([width, height], {type:"FeatureCollection", features: this.props.geoData});
        
        const path2 = d3
            .geoPath()
            .projection(projection2);

        const chart = d3
            .select(this.chartRef.current)
            .append("svg")
            .attr("width", width)
            .attr("height", height)
            .attr("cursor", "pointer");

        const self = this;

        chart.append("g")
            .selectAll("path")
            .data(this.props.geoData)
            .enter()
            .append("path")
            .attr("d", path2)
            .attr("fill", "gray")
            .attr("fill", f => {
                try {
                    const value = this.props.data.find(d => d.key.toLowerCase() === f.properties[this.props.geoDataTargetName].toLowerCase());
                    return colorScale(value.count);
                } catch {
                    return "gray"
                }
            })
            .on("touchmove mousemove", (event,p) => {
                const tooltip = self.tooltipRef.current;
                let value
                try {
                    value = self.props.data.find(d => d.key === p.properties[this.props.geoDataTargetName]).count;
                } catch {
                    value = "bez podataka"
                }
                tooltip.classList.remove("custom-tooltip-hidden");
                tooltip.innerHTML = `
                    <p class='font-headline'>${p.properties[this.props.geoDataTargetName]}:</p>
                    <span>Broj zaraženih: ${value}</span>
                `
            })
            .on("touchend mouseleave", () => {
                const tooltip = self.tooltipRef.current;
                tooltip.classList.add("custom-tooltip-hidden");
            })
            .on("click", (event, p) => {
                self.props.handleMapChange(p);
            });

        chart.selectAll("text")
            .data(this.props.geoData)
            .enter()
            .append("text")
            .attr("class", "map-label")
            .attr("transform", d => { return "translate(" + path2.centroid(d)+ ")"; })
            .attr("y", d => d.properties.dontCenterY ? "-1em" : ".35em" )
            .text(d => { return d.properties[this.props.geoDataTargetName]; });
    }

    componentDidUpdate(prevProps) {
        const redraw = prevProps.width !== this.props.width ||
                       prevProps.geoData !== this.props.geoData;

        if (redraw) {
            this.redrawChart();
        }
    }

    render() {
        const mapLegendStyle = {
            background: `linear-gradient(${this.props.colors[1]}, ${this.props.colors[0]})`
        }
        const max = Math.max(...this.props.data.map(d => d.count));
        let legendData = _.range(0,max,Math.ceil(max/this.state.legendStepSize));
        legendData.push(max);

        legendData = legendData.map((d,i) => {
            const top = (100/this.state.legendStepSize)*(legendData.length-1-i);
            return (
            <div className="map-legend-item position-absolute pr-1" key={i} style={{top: `${top}%`}}>{d}</div>
            )
        })

        return (
            <div className="Map">
                <div ref={this.chartRef}></div>
                <div className="map-legend position-absolute mt-3 mr-2" style={mapLegendStyle}>
                    {legendData}
                </div>
                <div className="custom-tooltip custom-tooltip-hidden position-absolute ml-2 mb-2" ref={this.tooltipRef}></div>
            </div>
        )
    }
}

export default withResizeDetector(Map);