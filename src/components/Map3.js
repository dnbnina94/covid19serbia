import React, { Component } from "react";
import { withResizeDetector } from "react-resize-detector";
import { COLOR_SCHEME, REGION_COLOR_SCHEME } from "../consts.js";
import * as d3 from 'd3';
import _ from 'lodash';
import '../css/Map.scss';

class Map3 extends Component {
    constructor(props) {
        super(props);

        this.state = {
            widthHeightRatio: 1.34,
            legendStepSize: 2,
            selectedTerritory: null,
            canSelect: true
        }

        this.chartRef = React.createRef();
        this.tooltipRef = React.createRef();
        this.mapWrapper = React.createRef();
    }

    redrawChart() {
        d3.select(this.chartRef.current).select("svg").remove();

        const width = this.props.width,
              height = window.innerWidth >= 768 ? this.mapWrapper.current.clientHeight : width*this.state.widthHeightRatio;

        var linearScaler = d3.scaleLinear()
            .domain([
                d3.min(this.props.data, d => d.value),
                d3.max(this.props.data, d => d.value)
            ])
            .range([0.2, 2]);
        
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

        const rectWrapper = chart.append("g")
            .selectAll("path")
            .data(this.props.geoData)
            .enter()
            .append("path")
            .attr("d", path2)
            .attr("fill", "white")
            .attr("stroke", COLOR_SCHEME[2]);        

        chart
            .selectAll("circle")
            .data(this.props.geoData)
            .enter()
            .append("circle")
            .attr("stroke", COLOR_SCHEME[1])
            .attr("fill", COLOR_SCHEME[3])
            .attr("fill-opacity", "0.6")
            .attr("style", "pointer-events: none")
            .attr("cx", function (d) {
                const coords = path2.centroid(d);
                return coords[0];
            })
		    .attr("cy", function (d) {
                const coords = path2.centroid(d);
                return coords[1];
            })
            .attr("r", 0)
            .transition()
            .duration(500)
            .attr("r", function(d) {
                const selectedData = self.props.data.find(p => p.key.includes(d.properties[self.props.geoDataTargetName]));
                return ((selectedData !== undefined) ? (selectedData.value !== 0 ? linearScaler(selectedData.value) : 0) : 0) + "rem";
            });

        const tooltip = self.tooltipRef.current;

        rectWrapper
            .on("touchstart mousemove", (event,p) => {
                if (this.props.selectedFilter === 0 && !this.state.canSelect) {
                    return;
                }
                d3.select(`#text-${self.props.geoData.indexOf(this.state.selectedTerritory)}`).attr("class", "map-label map-label-hidden");
                this.setState(() => {
                    return {
                        selectedTerritory: p
                    }
                });
                d3.select(`#text-${self.props.geoData.indexOf(p)}`).attr("class", "map-label");
                let value;
                try {
                    const selectedData = self.props.data.find(d => d.key.includes(p.properties[this.props.geoDataTargetName]));
                    value = selectedData.value;
                } catch {
                    value = "bez podataka";
                }
                tooltip.classList.remove("custom-tooltip-hidden");
                tooltip.innerHTML = `
                    <span class='font-headline'>${p.properties[this.props.geoDataTargetName]}:</span><br/>
                    <span>Ukupan broj samoizolovanih: ${value}</span><br/>
                `
            })
            .on("mouseleave", (event,p) => {
                d3.select(`#text-${self.props.geoData.indexOf(p)}`).attr("class", "map-label map-label-hidden");
                tooltip.classList.add("custom-tooltip-hidden");
            })
            .on("click", (event, p) => {
                event.preventDefault();
                (this.props.selectedFilter !== 1) && tooltip.classList.add("custom-tooltip-hidden");
                self.props.handleMapChange(p);
            })
            .on("touchend", (event,p) => {
                if (!event.cancelable) { 
                    return;
                }
                event.preventDefault();
                if (this.props.selectedFilter === 0 && !this.state.canSelect) {
                    return;
                }
                this.setState(() => {
                    return {
                        canSelect: false
                    }
                });
                setTimeout(() => {
                    (this.props.selectedFilter !== 1) && tooltip.classList.add("custom-tooltip-hidden");
                    self.props.handleMapChange(p);

                    this.setState(() => {
                        return {
                            canSelect: true
                        }
                    });
                }, 500);
            });

        chart.selectAll("text")
            .data(this.props.geoData)
            .enter()
            .append("text")
            .attr("id", (d,i) => `text-${i}`)
            .attr("class", "map-label map-label-hidden")
            .attr("transform", d => { return "translate(" + path2.centroid(d)+ ")"; })
            .attr("y", d => ".35em" )
            .text(d => { return d.properties[this.props.geoDataTargetName]; })
    }

    componentDidUpdate(prevProps) {
        const redraw = prevProps.width !== this.props.width ||
                       prevProps.height !== this.props.height ||
                       prevProps.geoData !== this.props.geoData ||
                       prevProps.data !== this.props.data;

        if (redraw) {
            // process.nextTick(() => {
                this.redrawChart();
            // });
        }
    }

    render() {
        return (
            <div className="Map h-100" ref={this.mapWrapper}>
                <div ref={this.chartRef}></div>
                <div className="custom-tooltip custom-tooltip-hidden position-absolute p-5 p-md-0" ref={this.tooltipRef}></div>
            </div>
        )
    }
}

export default withResizeDetector(Map3);