import React, { Component } from 'react';
import '../css/HorizontalBarChart.scss';
import * as d3 from 'd3';
import ChartTitle from './ChartTitle';

class HorizontalBarChart extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        this.props.data.sort((a, b) => {
            const aVal = this.props.valueExtractor(a);
            const bVal = this.props.valueExtractor(b);
            return aVal < bVal ? 1 : aVal === bVal && a.key > b.key ? 1 : -1;
        });
        const max = d3.max(this.props.data, d => this.props.valueExtractor(d));     
        const bars =
            <div className="horizontal-bar-wrapper w-100 mb-1 px-5 pt-5 pb-4 px-md-2 pt-md-2 pb-md-0">
                    {this.props.data.map(d => {
                        const width = max ? 100*this.props.valueExtractor(d)/max : 0;
                        return (
                            <div className="horizontal-bar-wrapper-row" key={d.key+this.props.startDate+this.props.endDate}>
                                <div className="horizontal-bar-wrapper-column pr-4 pr-md-2">
                                    <p className="label">{d.key}</p>
                                </div>
                                <div className=" horizontal-bar-wrapper-column w-100">
                                    <div className="">
                                        <div className="horizontal-bar position-relative" style={{width: `${width}%`, backgroundColor: this.props.color}}>
                                            {/* <div className={width < 10 ? 'value value-outer' : 'value value-inner'}>{d.count}</div> */}
                                        </div>
                                    </div>
                                </div>
                                <div className="horizontal-bar-wrapper-column pl-4 pl-md-2">
                                    <p className="label">{this.props.valueExtractor(d)}</p>
                                </div>
                            </div>
                        );
                    })}
            </div>

        return (
            <div className="HorizontalBarChart w-100">
                <ChartTitle title={this.props.title} />
                {bars}
            </div>
        );
    }
}

export default HorizontalBarChart;
