import React, { Component } from "react";
import * as d3 from 'd3';
import { withResizeDetector } from "react-resize-detector";
import { COLOR_SCHEME } from "../consts";
import '../css/BarChart.scss';

class BarChart extends Component {
    constructor(props) {
        super(props);

        this.state = {
            paddingLeft: 0,
            paddingRight: 0,
            paddingBottom: 5,
            paddingTop: 10,
            numOfTicksX: 5,
            numOfTicksY: 1,
            animationDuration: 1000,
            heightRatio: 1.7
        };

        this.chartRef = React.createRef();
        this.tooltip = React.createRef();
    }

    redrawChart() {

        const { width } = this.props;
        const height = width/this.state.heightRatio;

        d3.select(this.chartRef.current).select("svg").remove();

        const chart = d3
            .select(this.chartRef.current)
            .append("svg")
            .attr("width", width)
            .attr("height", height)
            .attr("cursor", "pointer");

        const xScaler = d3
            .scaleBand()
            .domain(this.props.data.map(d => d.key))
            .range([this.state.paddingLeft, width - this.state.paddingRight]);

        const yScaler = d3
            .scaleLinear()
            .domain([0, d3.max(this.props.data, d => d.value)])
            .range([height - this.state.paddingBottom, this.state.paddingTop]);

        chart
            .append("g")
            .selectAll("rect")
            .data(this.props.data)
            .enter()
            .append("rect")
            .attr("x", d => xScaler(d.key))
            .attr("y", d => yScaler(d.value))
            .attr("width", xScaler.bandwidth())
            .attr("height", d => height - yScaler(d.value) - this.state.paddingBottom)
            .attr("fill", COLOR_SCHEME[1]);

        const self = this;

        chart
            .append("g")
            .selectAll("rect")
            .data(this.props.data)
            .enter()
            .append("rect")
            .attr("x", d => xScaler(d.key))
            .attr("y", 0)
            .attr("width", xScaler.bandwidth())
            .attr("height", height - this.state.paddingBottom)
            .attr("fill", "white")
            .attr("opacity", 0)
            .attr("pointer-events", "all")
            .on("touchmove mousemove", function(e,d) {
                d3
                .select(this)
                .attr("opacity", 0.5);

                self.tooltip.current.classList.remove('custom-tooltip-hidden');
                self.tooltip.current.innerHTML = `
                    <p class='lh-1'>Starosna grupa: <b>${d.key}</b></p>
                    <p>Broj zaraženih: <b>${d.value}</b></p>
                `
            })
            .on("touchend mouseleave", function (e,d) {
                d3
                .select(this)
                .attr("opacity", 0);

                self.tooltip.current.classList.add('custom-tooltip-hidden');
            });

        chart
            .selectAll("text")
            .data(this.props.data)
            .enter()
            .append("text")
            .attr("x", d => xScaler(d.key) + xScaler.bandwidth()/2)
            .attr("y", d => yScaler(d.value) - 2)
            .attr("class", "x-label")
            .text(d => d.key);

        // const xAxis = d3.axisBottom(xScaler);

        // chart
        //     .append("g")
        //     .attr("transform", "translate(0," + (height - this.state.paddingBottom) + ")")
        //     .call(xAxis);

        // const yAxis = d3.axisLeft(yScaler)
            // .ticks(this.state.numOfTicksY, "s");

        // chart
        //     .append("g")
        //     .attr("transform", "translate(" + this.state.paddingLeft + ",0)")
        //     .call(yAxis);

    }

    componentDidUpdate(prevProps) {
        const redrawChart = prevProps.width !== this.props.width;
        
        if (redrawChart) {
            this.redrawChart();
        }
    }

    render() {
        return (
            <div className="BarChart h-100 py-2">
                <div className="w-100 position-relative h-100" ref={this.chartRef}>
                    <div className="position-absolute custom-tooltip custom-tooltip-hidden" ref={this.tooltip}>AA</div>
                </div>
            </div>
        )
    }
}

export default withResizeDetector(BarChart);