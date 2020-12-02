import { Component } from "react";
import React from 'react'
import * as d3 from 'd3';
import { formatTitle } from "../utilities";
import '../css/LineChart.scss';
import { withResizeDetector } from 'react-resize-detector';

class LineChart extends Component {
    constructor(props) {
        super(props);

        this.state = {
            padding: 40,
            paddingTop: 0,
            tooltipCircleR: 5,
            numOfTicksX: 5,
            numOfTicksY: 5,
            tooltipLineStrokeWidth: 1,
            tooltipLineStrokeDasharray: "10,5",
            animationDuration: 1000,
            heightRatio: 1.7
        };

        this.lineChartRef = React.createRef();
        this.tooltipRef = React.createRef();
    }

    length(arg) {
        return d3.create("svg:path").attr("d", arg).node().getTotalLength();
    }

    bisect(mouseX, xScaler) {
        const bisectPrepdData = this.props.data.map(item => {
            return {
                ...item, 
                date: new Date(item.date)
            }
        });
        const date = xScaler.invert(mouseX);
        const index = d3.bisector(d => d.date).left(
            bisectPrepdData,
            date,
            1
        );
        const a = bisectPrepdData[index - 1];
        const b = bisectPrepdData[index];
        return b && (date - a.date > b.date - date) ? b : a;
    }

    redrawChart() {

        const { width } = this.props;
        const height = width/this.state.heightRatio;

        d3.select(this.lineChartRef.current).select("svg").remove();

        const chart = d3
            .select(this.lineChartRef.current)
            .append("svg")
            .attr("width", width)
            .attr("height", height)
            .attr("cursor", "pointer");
        
        const xScaler = d3
            .scaleTime()
            .domain(
                d3.extent(this.props.data, (d) => {
                    return new Date(d.date);
                })
            )
            .range([this.state.padding, width - this.state.padding]);
        
        const yScaler = d3
            .scaleLinear()
            .domain([0, d3.max(this.props.data, (d) => d.value)])
            .range([height - this.state.padding, this.state.paddingTop + this.state.tooltipCircleR]);

        const line = d3.line()
            .defined(d => !isNaN(d.value))
            .x(d => xScaler(new Date(d.date)))
            .y(d => yScaler(d.value));

        const l = this.length(line(this.props.data));

        chart
            .append("path")
            .datum(this.props.data)
            .attr("class", "line")
            .attr("d", line)
            .attr("stroke-dasharray", `0,${l}`)
            .transition()
            .duration(this.state.animationDuration)
            .ease(d3.easeLinear)
            .attr("stroke-dasharray", `${l},${l}`);

        const yAxis = d3.axisLeft(yScaler)
            .ticks(this.state.numOfTicksY, "s");

        chart
            .append("g")
            .attr("transform", "translate(" + this.state.padding + ",0)")
            .attr("class", "tick")
            .call(yAxis);

        const xAxis = d3.axisBottom(xScaler)
            .ticks(this.state.numOfTicksX);

        chart
            .append("g")
            .attr("transform", "translate(0," + (height - this.state.padding) + ")")
            .attr("class", "tick")
            .call(xAxis);

        const self = this;
        const circle = chart.append("circle");
        const dashedLine = chart.append("line");
        setTimeout(() => {

            chart.on("touchmove mousemove", function(event) {
                const {date, value} = self.bisect(d3.pointer(event, this)[0], xScaler);
                
                const year = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(date);
                const month = new Intl.DateTimeFormat('en', { month: 'short' }).format(date);
                const day = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(date);

                const tooltip = self.tooltipRef.current;

                tooltip.classList.remove("custom-tooltip-hidden");
                tooltip.innerHTML = `${day}. ${month} ${year}, <b>${value}</b>`

                circle
                    .attr("class", "tooltip-circle")
                    .attr("r", self.state.tooltipCircleR)
                    .attr("cx", xScaler(date))
                    .attr("cy", yScaler(value));

                dashedLine
                    .attr("class", "tooltip-line")
                    .attr("stroke-width", self.state.tooltipLineStrokeWidth)
                    .attr("stroke-dasharray", self.state.tooltipLineStrokeDasharray)
                    .attr("x1", xScaler(date))
                    .attr("x2", xScaler(date))
                    .attr("y1", 0)
                    .attr("y2", height - self.state.padding);
                
            });
    
            chart.on("touchend mouseleave", () => {
                const tooltip = self.tooltipRef.current;
                tooltip.classList.add("custom-tooltip-hidden");
                circle
                    .attr("class", "tooltip-circle-hidden");
                dashedLine
                    .attr("class", "tooltip-line-hidden")
            });

        }, this.state.animationDuration);
    }

    componentDidUpdate(prevProps) {
        const redraw = prevProps.width !== this.props.width ||
                       prevProps.data !== this.props.data;
        if (redraw) {
            this.redrawChart();
        }
    }

    render() {
        return (
            <div className="LineChart bg-white shadow-sm">
                <p className="font-bold p-2">{formatTitle(this.props.title)}</p>
                <div className="w-100 position-relative" ref={this.lineChartRef}>
                    <div className="custom-tooltip custom-tooltip-hidden px-5" ref={this.tooltipRef}></div>
                </div>
            </div>
        )
    }
}

export default withResizeDetector(LineChart);