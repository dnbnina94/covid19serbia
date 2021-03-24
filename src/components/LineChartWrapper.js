import { Component } from "react";
import LineChart from '../components/LineChart';
import { dateToString } from "../utilities";
import Options from "./Options";
import '../css/OptionsWrapper.scss';

class LineChartWrapper extends Component {
    constructor(props) {
        super(props);

        const dates = this.props.data.reduce((acc, curr) => {
            return acc.concat(curr.data.map(d => new Date(d.date)));
        }, []);

        const minDate = dates.reduce(function (a, b) { return a < b ? a : b; }); 
        const maxDate = dates.reduce(function (a, b) { return a > b ? a : b; });

        this.state = {
            currentData: 0,
            data: this.props.data,
            minDate: minDate,
            maxDate: maxDate
        };

        this.onChangeHandler = this.onChangeHandler.bind(this);
        this.dateChangeHandler = this.dateChangeHandler.bind(this);
    }

    onChangeHandler(index) {
        this.setState({
            currentData: index
        });
    }

    dateChangeHandler(date1, date2) {
        this.setState({
            data: this.props.data.map(d => {
                return {
                    ...d,
                    data: d.data.filter(d => {
                        const date = new Date(d.date);
                        return date >= date1 && date <= date2
                    })
                }
            })
        });
    }

    render() {
        return (
            <div className="LineChartWrapper row mt-4">
                <div className="col-md-8">
                    {this.state.data.length !== 0 &&
                        <LineChart 
                            data={this.state.data[this.state.currentData].data} 
                            title={this.state.data[this.state.currentData].description}
                            minDate={this.state.minDate}
                            maxDate={this.state.maxDate}
                            dateChangeHandler={this.dateChangeHandler}
                        />
                    }
                </div>
                <div className="col-md-4">
                    <div className="border-radius-1 options-wrapper position-relative bg-white shadow-sm mb-5 mb-md-0">
                        <div className="options-wrapper-inner p-5 p-md-2">
                            <Options
                                options={this.state.data.map(item => item.description)}
                                current={this.state.currentData}
                                type="radio"
                                onChangeHandler={this.onChangeHandler}
                            />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default LineChartWrapper;