import React, { Component } from "react";
import * as d3 from 'd3';
// import {connect} from 'react-redux';
import { COLOR_SCHEME } from "../consts";
import '../css/BarChart.scss';
import { withResizeDetector } from "react-resize-detector";

class BarChart extends Component {
    constructor(props) {
        super(props);

        this.state = {
            paddingLeft: 0,
            paddingRight: 0,
            paddingBottom: 5,
            paddingTop: 0,
            numOfTicksX: 5,
            numOfTicksY: 1,
            animationDuration: 1000,
            heightRatio: 1.7
        };

        this.chartRef = React.createRef();
        this.tooltip = React.createRef();
        this.barChartWrapper = React.createRef();
    }

    redrawChart() {
        
        d3.select(this.chartRef.current).select("svg").remove();

        const width  = this.props.width;
        // const height = width/this.state.heightRatio;
        const height = window.innerWidth >= 768 ? this.barChartWrapper.current.clientHeight : width/this.state.heightRatio;

        const chart = d3
            .select(this.chartRef.current)
            .append("svg")
            .attr("width", "100%")
            .attr("height", height)
            .attr("cursor", "pointer");

        const xScaler = d3
            .scaleBand()
            .domain(this.props.data.map(d => d.key))
            .range([this.state.paddingLeft, width - this.state.paddingRight]);

        const yScaler = d3
            .scaleLinear()
            .domain([0, d3.max(this.props.data, d => d.value)])
            .range([height - 0, this.state.paddingTop]);

        // this.props.data.map(d => {
        //     let x = xScaler(d.key) + xScaler.bandwidth()/4;
        //     console.log(x);
        // })

        chart
            .append("g")
            .selectAll("rect")
            .data(this.props.data)
            .enter()
            .append("rect")
            .attr("x", d => { 
                let x = xScaler(d.key) + xScaler.bandwidth()/4;
                return x;
            })
            .attr("y", d => height - 0)
            .attr("width", xScaler.bandwidth()/2)
            .attr("height", 0)
            .attr("fill", COLOR_SCHEME[1])
            .transition()
            .duration(1000)
            .attr("y", d=> yScaler(d.value))
            .attr("height", d => height - yScaler(d.value) - 0);

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
            .attr("height", height - 0)
            .attr("fill", "white")
            .attr("opacity", 0)
            .attr("pointer-events", "all")
            .on("touchmove mousemove", function(e,d) {
                d3
                .select(this)
                .attr("opacity", 0.5);

                self.tooltip.current.classList.remove('custom-tooltip-hidden');
                self.tooltip.current.innerHTML = `
                    <div>Starosna grupa: <b>${d.key}</b></div>
                    <div>Broj zaraženih: <b>${d.value}</b></div>
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
            .attr("opacity", 0)
            .text(d => d.key)
            .transition()
            .duration(500)
            .delay(700)
            .attr("opacity", 1);

    }

    componentDidUpdate(prevProps) {
        // console.log("BAR CHART", this.props.width);
        const redraw = prevProps.width !== this.props.width ||
                       prevProps.height !== this.props.height ||
                       prevProps.data !== this.props.data;
        
        if (redraw) {
            // process.nextTick(() => {
                this.redrawChart();
            // });
        }
    }

    render() {
        return (
            <div className="BarChart w-100 h-100 d-flex" ref={this.barChartWrapper}>
            {
                <div className="w-100 position-relative h-100">
                    <div className="d-block w-100 h-100" ref={this.chartRef}>
                        <div className="position-absolute custom-tooltip custom-tooltip-hidden" ref={this.tooltip}></div>
                    </div>
                </div>
            }
            </div>
        )
    }
}

// const mapStateToProps = (state) => {
//     return {
//         width: state.ui.width,
//         height: state.ui.height,
//     }
// }

// export default connect(mapStateToProps)(BarChart);
export default withResizeDetector(BarChart);