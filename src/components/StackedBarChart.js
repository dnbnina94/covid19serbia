import React, { Component } from "react";
import { formatDateDayMonth } from "../utilities";
import * as d3 from 'd3';
import { withResizeDetector } from 'react-resize-detector';
import _ from "lodash";
import "../css/StackedBarChart.scss";
import { COLOR_SCHEME } from "../consts";
import Legend from "./Legend";
import ChartTitle from "./ChartTitle";

class StackedBarChart extends Component {
    constructor(props) {
        super(props);

        this.state = {
            padding: 2.93,
            paddingMobile: 7.93,
            paddingTop: 5,
            numOfTicksX: 5,
            numOfTicksY: 5,
            animationDuration: 1000,
            heightRatio: 1.7
        };

        this.chartWrapper = React.createRef();
        this.barChartRef = React.createRef();
        this.tooltipRef = React.createRef();
    }

    redrawChart() {

        const { width } = this.props;
        const viewWidth = window.innerWidth/100;
        const padding = viewWidth*(window.innerWidth < 768 ? this.state.paddingMobile : this.state.padding);
        const height = width/this.state.heightRatio;

        d3.select(this.barChartRef.current).select("svg").remove();

        const chart = d3
            .select(this.barChartRef.current)
            .append("svg")
            .style("background-color", "white")
            .attr("class", "border-radius-1")
            .attr("width", width)
            .attr("height", height)
            .attr("cursor", "pointer");

        const xScaler = d3
            .scaleBand()
            .domain(this.props.data.map(d => d.date))
            .range([padding, width - padding]);

        const yScaler = d3
            .scaleLinear()
            .domain([0, d3.max(this.props.data, d => _.sumBy(d.values, d => d.value))])
            .range([height - padding, this.state.paddingTop]);

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
                    .attr("y", height - padding)
                    .attr("width", xScaler.bandwidth())
                    .attr("height", 0)
                    .transition()
                    .duration(this.state.animationDuration)
                    .attr("y", yScaler(v.y1) - (height - yScaler(v.y2) - padding))
                    .attr("height", height - yScaler(v.y1) - padding);
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

        const self = this;

        chart
            .append("g")
            .selectAll("rect")
            .data(modData)
            .enter()
            .append("rect")
            .attr("x", d => xScaler(d.date))
            .attr("y", 0)
            .attr("width", xScaler.bandwidth())
            .attr("height", height - padding)
            .attr("fill", "white")
            .attr("opacity", 0)
            .attr("pointer-events", "all")
            .on("touchmove mousemove", function(e,d) {
                d3
                .select(this)
                .attr("opacity", 0.5);

                self.setState({
                    hoveredValues: d.values,
                    hoveredDate: new Date(d.date)
                });
            })
            .on("touchend mouseleave", function (e,d) {
                d3
                .select(this)
                .attr("opacity", 0);

                self.setState({
                    hoveredValues: null,
                    hoveredDate: null
                });
            });

        const xAxis = d3.axisBottom(xScaler)
            .tickValues(xScaler.domain().filter(function(d,i){ return !(i%Math.ceil(modData.length/5))}))
            .tickFormat((x) => formatDateDayMonth(new Date(x)));

        chart
            .append("g")
            .attr("transform", "translate(0," + (height - padding) + ")")
            .attr("class", "x-axis")
            .call(xAxis);

        const yAxis = d3.axisLeft(yScaler)
            .ticks(this.state.numOfTicksY, "s");

        chart
            .append("g")
            .attr("transform", "translate(" + padding + ",0)")
            .attr("class", "y-axis")
            .call(yAxis);
    }

    componentDidUpdate(prevProps) {
        const redrawChart = 
            (prevProps.width !== this.props.width) ||
            (!_.isEqual(prevProps.flags, this.props.flags)) ||
            (!_.isEqual(prevProps.data, this.props.data))
        if (redrawChart) {
            this.redrawChart();
        }
    }

    render() {
        return (
            <div className="StackedBarChart bg-white shadow-sm border-radius-1" ref={this.chartWrapper}>
                <ChartTitle
                    datePickerAvailable={true}
                    downloadAvailable={true}
                    downloadRef={this.chartWrapper}
                    minDate={this.props.minDate}
                    maxDate={this.props.maxDate}
                    startDate={this.props.startDate}
                    endDate={this.props.endDate}
                    dateChangeHandler={this.props.dateChangeHandler}
                    title="Histogram"
                />
                <div className="w-100 position-relative mt-5 mt-md-2" ref={this.barChartRef}>
                    <div className="custom-tooltip" ref={this.tooltipRef}>
                        <Legend date={this.state.hoveredDate} flags={this.props.flags} values={this.state.hoveredValues} />
                    </div>
                </div>
            </div>
        );
    }
}

export default withResizeDetector(StackedBarChart);