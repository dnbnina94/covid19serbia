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
            legendStepSize: 2,
            selectedTerritory: null,
            canSelect: true
        }

        this.hideTooltip = this.hideTooltip.bind(this);

        this.chartRef = React.createRef();
        this.tooltipRef = React.createRef();
        this.mapWrapper = React.createRef();
    }

    redrawChart() {
        this.hideTooltip();

        d3.select(this.chartRef.current).select("svg").remove();

        const width = this.props.width,
              height = window.innerWidth >= 768 ? this.mapWrapper.current.clientHeight : width*this.state.widthHeightRatio;

        const colorScale = d3
            .scaleSequential()
            .domain([
                0,
                d3.max(this.props.data, d => d.values.length)
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

        const rectWrapper = chart.append("g")
            .selectAll("path")
            .data(this.props.geoData)
            .enter()
            .append("path")
            .attr("d", path2)
            .attr("class", "path")
            .attr("fill", "white")

        rectWrapper
            .transition()
            .delay((d,i) => i * 15)
            .duration(500)
            .attr("fill", f => {
                try {
                    const value = this.props.data.find(d => d.key.toLowerCase() === f.properties[this.props.geoDataTargetName].toLowerCase());
                    return colorScale(value.values.length);
                } catch {
                    return "#ccc"
                }
            });

        const tooltip = self.tooltipRef.current;
        
        rectWrapper
            .on("touchstart mousemove", (event,p) => {
                // if (event.type === "touchstart") {
                //     if (event.cancelable) {
                //         event.preventDefault();
                //     }
                // }
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
                let value, brMus, brZen;
                try {
                    const selectedData = self.props.data.find(d => d.key === p.properties[this.props.geoDataTargetName]);
                    value = selectedData.values.length;
                    brMus = selectedData.values.reduce((acc, curr) => {
                        return curr.sex === "M" ? acc+1 : acc
                    },0);
                    brZen = selectedData.values.reduce((acc, curr) => {
                        return curr.sex === "F" ? acc+1 : acc
                    },0);
                } catch {
                    value = brMus = brZen = "bez podataka";
                }
                tooltip.classList.remove("custom-tooltip-hidden");
                tooltip.innerHTML = `
                    <span class='font-headline'>${p.properties[this.props.geoDataTargetName]}:</span><br/>
                    <span>Ukupan broj obolelih: ${value}</span><br/>
                    <span>Broj obolelih žena: ${brZen}</span><br/>
                    <span>Broj obolelih muškaraca: ${brMus}</span>
                `
            })
            .on("mouseleave", (event,p) => {
                d3.select(`#text-${self.props.geoData.indexOf(p)}`).attr("class", "map-label map-label-hidden");
                tooltip.classList.add("custom-tooltip-hidden");
            })
            .on("click", (event, p) => {
                event.preventDefault();
                if (this.props.selectedFilter !== 1) {
                    tooltip.classList.add("custom-tooltip-hidden");
                    self.props.handleMapChange(p);
                }
                // (this.props.selectedFilter !== 1) && tooltip.classList.add("custom-tooltip-hidden");
            })
            .on("touchend", (event,p) => {
                if (!event.cancelable) { 
                    return;
                }
                event.preventDefault();
                if (this.props.selectedFilter === 0 && !this.state.canSelect) {
                    return;
                }
                if (this.props.selectedFilter !== 1) {
                    this.setState(() => {
                        return {
                            canSelect: false
                        }
                    });
                    setTimeout(() => {
                        tooltip.classList.add("custom-tooltip-hidden");
                        self.props.handleMapChange(p);
    
                        this.setState(() => {
                            return {
                                canSelect: true
                            }
                        });
                    }, 500);
                }
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

    hideTooltip = () => {
        const tooltip = this.tooltipRef.current;
        tooltip.classList.add("custom-tooltip-hidden");
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
        const mapLegendStyle = {
            background: `linear-gradient(${this.props.colors[1]}, ${this.props.colors[0]})`
        }
        const max = Math.max(...this.props.data.map(d => d.values.length));
        let legendData = _.range(0,max,Math.ceil(max/this.state.legendStepSize));
        legendData.push(max);

        legendData = legendData.map((d,i) => {
            const top = (100/this.state.legendStepSize)*(legendData.length-1-i);
            return (
            <div className="map-legend-item position-absolute pr-1" key={i} style={{top: `${top}%`}}>{d}</div>
            )
        })

        return (
            <div className="Map h-100" ref={this.mapWrapper}>
                <div ref={this.chartRef}></div>
                <div className="map-legend position-absolute" style={mapLegendStyle}>
                    {legendData}
                </div>
                <div className="custom-tooltip custom-tooltip-hidden position-absolute p-5 p-md-0" ref={this.tooltipRef}></div>
            </div>
        )
    }
}

export default withResizeDetector(Map);