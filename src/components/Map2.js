import React, { Component } from "react";
import * as d3 from "d3";
import { withResizeDetector } from "react-resize-detector";
import CrossPin from '../img/svg/crosspin.svg';
import '../css/Map.scss';

class Map2 extends Component {
    constructor(props) {
        super(props);

        this.state = {
            widthHeightRatio: 1.34,
            legendStepSize: 2
        }

        this.chartRef = React.createRef();
        this.mapWrapper = React.createRef();
    }

    redrawChart() {
        d3.select(this.chartRef.current).select("svg").remove();

        const self = this;
        const width = this.props.width,
              height = this.mapWrapper.current.clientHeight;

        this.projection = d3
            .geoMercator()
            .fitSize([width, height], {type:"FeatureCollection", features: this.props.geoData});

        const path2 = d3
            .geoPath()
            .projection(self.projection);

        this.chart = d3
            .select(this.chartRef.current)
            .append("svg")
            .attr("width", width)
            .attr("height", height)
            .attr("cursor", "pointer")
            .style("overflow", "visible");

        const rectWrapper = this.chart.selectAll("g")
            .data(this.props.geoData)
            .enter()
            .append("g")
            .on("touchmove mousemove", function(event, d) {
                const index = self.props.geoData.indexOf(d);
                d3.select(`#text-${index}`).attr("class", "map-label").raise();
            })
            .on("touchend mouseleave", function(event, d) {
                const index = self.props.geoData.indexOf(d);
                d3.select(`#text-${index}`).attr("class", "map-label map-label-hidden");
            })
            .on("click", function(event, d) {
                self.props.handleMapChange(d);
            });

        rectWrapper
            .append("path")
            .attr("d", path2)
            .attr("class", "path")
            .attr("fill", "white")
            .attr("stroke", "white")
            .transition()
            .duration(500)
            .attr("fill", "#ddd");

        this.chart.selectAll("text")
            .data(this.props.geoData)
            .enter()
            .append("text")
            .attr("id", (d,i) => `text-${i}`)
            .attr("class", "map-label map-label-hidden")
            .attr("transform", d => { return "translate(" + path2.centroid(d)+ ")"; })
            .attr("y", d => ".35em" )
            .text(d => { return d.properties[this.props.geoDataTargetName]; });

        this.chart
            .selectAll("circle")
            .data(this.props.points)
            .enter()
            .append("circle")
            .attr("id", (d,i) => `circle-${i}`)
            .attr("cx", function (d) { return self.projection(d.coordinates)[0]; })
		    .attr("cy", function (d) { return self.projection(d.coordinates)[1]; })
            .attr("r", "0.2rem")
            .attr("class", "pin-location pin-location-invisible")
            .transition()
            .delay((d,i) => 450 + i * 500/self.props.points.length)
            .attr("class", "pin-location");

        this.chart
            .selectAll("image")
            .data(this.props.points)
            .enter()
            .append("image")
            .attr("id", (d,i) => `pin-${i}`)
            .attr("class", "pin-hidden")
            .attr("xlink:href", CrossPin)
            .attr("x", function (d) { return self.projection(d.coordinates)[0] - 15 })
            .attr("y", function (d) { return self.projection(d.coordinates)[1] - 38 })
            .attr("width", 30)
            .attr("height", 40);             
        
    }

    updateSelected(prevVal) {
        if (this.props.selected !== null) {
            const selected = this.props.points[this.props.selected];
            const x = this.projection(selected.coordinates)[0];
            const y = this.projection(selected.coordinates)[1];

            d3.selectAll("circle").attr("class", "pin-location pin-location-hidden");
            d3.select(`#circle-${this.props.selected}`).attr("class", "pin-location pin-location-selected").raise();
            d3.select(`#pin-${this.props.selected}`).attr("class", "pin").raise();
        } else {
            d3.selectAll("circle").attr("class", "pin-location");
            d3.select(`#pin-${prevVal}`).attr("class", "pin-hidden");
        }
    }

    componentDidUpdate(prevProps) {
        const redraw = prevProps.width !== this.props.width ||
                    //    prevProps.height !== this.props.height ||
                       prevProps.geoData !== this.props.geoData
        const updateSelected = prevProps.selected !== this.props.selected;

        if (redraw) {
            this.redrawChart();
        }
        if (updateSelected) {
            this.updateSelected(prevProps.selected);
        }
    }

    render() {
        return (
            <div className="Map h-100" ref={this.mapWrapper}>
                <div ref={this.chartRef}></div>
            </div>
        );
    }
}

export default withResizeDetector(Map2);