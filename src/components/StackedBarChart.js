import React, { Component } from "react";
import { formatTitle } from "../utilities";
import * as d3 from 'd3';
import { withResizeDetector } from 'react-resize-detector';
import _ from "lodash";
import "../css/StackedBarChart.scss";
import { COLOR_SCHEME } from "../consts";
import Legend from "./Legend";

class StackedBarChart extends Component {
    constructor(props) {
        super(props);

        this.state = {
            padding: 40,
            paddingTop: 5,
            numOfTicksX: 5,
            animationDuration: 1000,
            heightRatio: 1.7
        };

        this.barChartRef = React.createRef();
        this.tooltipRef = React.createRef();
    }

    redrawChart() {
        const { width } = this.props;
        const height = width/this.state.heightRatio;

        d3.select(this.barChartRef.current).select("svg").remove();

        const chart = d3
            .select(this.barChartRef.current)
            .append("svg")
            .attr("width", width)
            .attr("height", height)
            .attr("cursor", "pointer");

        const xScaler = d3
            .scaleBand()
            .domain(this.props.data.map(d => d.date))
            .range([this.state.padding, width - this.state.padding]);

        const yScaler = d3
            .scaleLinear()
            .domain([0, d3.max(this.props.data, d => _.sumBy(d.values, d => d.value))])
            .range([height - this.state.padding, this.state.paddingTop]);

        var colorScaler = d3
            .scaleOrdinal()
            .domain(this.props.flags.map(k => k.flag))
            .range(COLOR_SCHEME);

        const modData = this.props.data.map(d => {
            return {
                ...d,
                values: d.values.map((v,index) => {
                    let y2 = 0;
                    for (let i=index+1; i<d.values.length; i++) {
                        y2 += d.values[i].value;
                    }
                    return {
                        key: v.key,
                        y1: v.value,
                        y2: y2
                    }
                })
            }
        });
        
        modData.forEach(d => {
            const bar = chart
                .append("g");
                
            d.values.forEach((v,i) => {
                bar
                    .append("rect")
                    .attr("fill", colorScaler(v.key))
                    .attr("x", xScaler(d.date))
                    .attr("y", height - this.state.padding)
                    .attr("width", xScaler.bandwidth())
                    .attr("height", 0)
                    .transition()
                    .duration(this.state.animationDuration)
                    .attr("y", yScaler(v.y1) - (height - yScaler(v.y2) - this.state.padding))
                    .attr("height", height - yScaler(v.y1) - this.state.padding);
            });
            bar
                .on("touchmove mousemove", () => {
                    bar.attr("fill-opacity", 0.5);
                    this.setState({
                        hoveredValues: d.values,
                        hoveredDate: new Date(d.date)
                    });
                })
                .on("touchend mouseleave", () => {
                    bar.attr("fill-opacity", null);
                    this.setState({
                        hoveredValues: null,
                        hoveredDate: null
                    });
                });
        });

        const xAxis = d3.axisBottom(xScaler)
            .tickValues(xScaler.domain().filter(function(d,i){ return !(i%10)}));

        chart
            .append("g")
            .attr("transform", "translate(0," + (height - this.state.padding) + ")")
            .call(xAxis);

        const yAxis = d3.axisLeft(yScaler)
            .ticks(this.state.numOfTicksY, "s");

        chart
            .append("g")
            .attr("transform", "translate(" + this.state.padding + ",0)")
            .call(yAxis);
    }

    componentDidUpdate(prevProps) {
        const redrawChart = 
            (prevProps.width !== this.props.width) ||
            (prevProps.flags !== this.props.flags)
        if (redrawChart) {
            this.redrawChart();
        }
    }

    render() {
        return (
            <div className="StackedBarChart bg-white shadow-sm">
                <p className="font-headline p-2">Histogram</p>
                <div className="w-100 position-relative" ref={this.barChartRef}>
                    <div className="custom-tooltip mx-5" ref={this.tooltipRef}>
                        <Legend date={this.state.hoveredDate} flags={this.props.flags} values={this.state.hoveredValues} />
                    </div>
                </div>
            </div>
        );
    }
}

export default withResizeDetector(StackedBarChart);