import React, { Component } from "react";
import * as d3 from "d3";
import { withResizeDetector } from 'react-resize-detector';
import { COLOR_SCHEME } from "../consts";
import '../css/PieChart.scss';
import { format } from "d3";
import { formatTitle } from "../utilities";
import ChartTitle from "./ChartTitle";

class PieChart extends Component {
    constructor(props) {
        super(props);

        this.state = {
            padding: 40,
            paddingTop: 5,
            numOfTicksX: 5,
            numOfTicksY: 5,
            animationDuration: 1000,
            innerRadius: 0.65
        };

        this.pieChartRef = React.createRef();
        this.tooltip = React.createRef();
    }

    redrawChart() {
        const { width } = this.props;
        const height = width/this.props.heightRatio;

        d3.select(this.pieChartRef.current).select("svg").remove();

        const chart = d3
            .select(this.pieChartRef.current)
            .append("svg")
            .attr("viewBox", [-width / 2, -height / 2, width, height])
            .attr("cursor", "pointer")

        const pie = d3
            .pie()
            .sort(null)
            .value(d => d.value);

        const arcs = pie(this.props.data);

        const radius = Math.min(width, height) / 2;
        const arc = d3.arc().innerRadius(radius * this.props.innerRadius).outerRadius(radius - 1);

        let sum = 0;
        this.props.data.forEach(d => {
            sum += d.value;
        });

        const self = this;
        chart
            .selectAll("path")
            .data(arcs)
            .join("path")
            .attr("fill", (d,i) => this.props.data[i].color)
            .on("touchmove mousemove", (event,d) => {
                const tooltip = self.tooltip.current;
                tooltip.innerHTML = (d.value/sum * 100).toFixed(2) + '%';
                tooltip.classList.remove("custom-tooltip-hidden");
            })
            .on("touchend mouseleave", function() {
                const tooltip = self.tooltip.current;
                // tooltip.innerHTML = '';
                tooltip.classList.add("custom-tooltip-hidden");
            })
            .transition().delay((d,i) => i * 500).duration(500)
            .attrTween('d', function(d) {
                var i = d3.interpolate(d.startAngle+0.01, d.endAngle);
                return function(t) {
                    d.endAngle = i(t);
                  return arc(d);
                }
            });
        
    }

    componentDidUpdate(prevProps) {
        // console.log("PIE CHART", this.props.width);
        const redraw = prevProps.width !== this.props.width ||
                       prevProps.data !== this.props.data;
        if (redraw) {
            this.redrawChart();
        }
    }

    render() {
        const legend = this.props.data.map((d,i) => {
            const classes = `d-flex 
                             align-items-center 
                             ${i === this.props.data.length-1 ? '' : this.props.small ? '' : 'pb-1'}
                            `;
            return (
                <div className={classes} key={d.key}>
                    <div className="legend-color" style={{backgroundColor: d.color}}></div>
                    <div className="legend-label pl-1">{formatTitle(d.key)}</div>
                </div>
            )
        });
        const title = formatTitle(this.props.data.map(f => f.key).join("_U_ODNOSU_NA_"));
        const chartLegendClass = `pie-chart-legend
                                    ${this.props.small ? 'pie-chart-legend-small' : ''} 
                                    px-${this.props.small ? '5' : '5'}
                                    pt-${this.props.small ? '5' : '5'}
                                    pb-5
                                    px-md-${this.props.small ? '3' : '2'} 
                                    pt-md-${this.props.small ? '2' : '3'} 
                                    pb-md-2`;
        const chartClass = `PieChart 
                            ${this.props.small ? 'PieChart-small' : ''}
                            h-100 
                            d-flex 
                            flex-column`;
        return (
            <div className={chartClass}>
                {!this.props.hideTitle && <ChartTitle title={title} />}
                <div className={`d-flex flex-column justify-content-between ${this.props.small ? 'mt-5 mt-md-2' : 'mt-5 mt-md-3'}`} style={{flex: "1"}}>
                    <div className="w-100 position-relative flex-grow-1 d-flex align-items-center justify-content-between">
                        <div className="d-block w-100" ref={this.pieChartRef}></div>
                        <div className="custom-tooltip custom-tooltip-hidden position-absolute font-headline" ref={this.tooltip}></div>
                    </div>
                    <div className={chartLegendClass}>
                        {legend}
                    </div>
                </div>
            </div>
        )
    }
}

export default withResizeDetector(PieChart);