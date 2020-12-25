import React, { Component } from 'react';
import '../css/HorizontalBarChart.scss';
import * as d3 from 'd3';

class HorizontalBarChart extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        this.props.data.sort((a, b) => {
            return a.values.length < b.values.length ? 1 : a.values.length === b.values.length && a.key > b.key ? 1 : -1;
        });
        const max = d3.max(this.props.data, d => d.values.length)
        const bars =
            <div className="horizontal-bar-wrapper w-100 mb-1">
                    {this.props.data.map(d => {
                        const width = 100*d.values.length/max;
                        return (
                            <div className="horizontal-bar-wrapper-row" key={d.key+this.props.startDate+this.props.endDate}>
                                <div className="horizontal-bar-wrapper-column pr-2">
                                    <p className="label">{d.key}</p>
                                </div>
                                <div className=" horizontal-bar-wrapper-column w-100">
                                    <div className="">
                                        <div className="horizontal-bar position-relative" style={{width: `${width}%`}}>
                                            {/* <div className={width < 10 ? 'value value-outer' : 'value value-inner'}>{d.count}</div> */}
                                        </div>
                                    </div>
                                </div>
                                <div className="horizontal-bar-wrapper-column pl-2">
                                    <p className="label">{d.values.length}</p>
                                </div>
                            </div>
                        );
                    })}
            </div>

        return (
            <div className="HorizontalBarChart position-absolute w-100">
                <p className="font-bold py-2 lh-1">{this.props.title}</p>
                {bars}
            </div>
        );
    }
}

export default HorizontalBarChart;
