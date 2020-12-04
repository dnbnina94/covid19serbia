import React, { Component } from "react";
import '../css/DatePicker.scss';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { formatDate } from "../utilities";

const CustomInput = ({ value, onClick }) => (
    <button className="custom-input" onClick={onClick}>
      {formatDate(new Date(value))}
    </button>
);

class CustomDatePicker extends Component {
    constructor(props) {
        super(props);

        this.state = {
            startDate: this.props.startDate ? this.props.startDate : this.props.minDate,
            endDate: this.props.endDate ? this.props.endDate : this.props.maxDate
        }

        this.onChangeHandler = this.onChangeHandler.bind(this);
        this.addDays = this.addDays.bind(this);
        this.subDays = this.subDays.bind(this);
    }

    onChangeHandler(date, str) {
        if (str === "startDate") {
            this.setState({
                startDate: date
            });
            this.props.dateChangeHandler(date, this.state.endDate);
        } else {
            this.setState({
                endDate: date
            });
            this.props.dateChangeHandler(this.state.startDate, date);
        }
    }

    subDays(date, value) {
        const retDate = new Date(date.valueOf());
        retDate.setDate(retDate.getDate() - value);
        return retDate;
    }

    addDays(date, value) {
        const retDate = new Date(date.valueOf());
        retDate.setDate(retDate.getDate() + value);
        return retDate;
    }

    render() {
        const self = this;
        return (
            <div className="DatePicker d-flex">
                <DatePicker
                    customInput={<CustomInput />}
                    selected={this.state.startDate}
                    minDate={this.props.minDate}
                    maxDate={this.subDays(this.state.endDate, 1)}
                    onChange={(date) => this.onChangeHandler(date, 'startDate')}
                    startDate={this.state.startDate}
                />
                <span className="px-1">&ndash;</span>
                <DatePicker
                    customInput={<CustomInput />}
                    selected={this.state.endDate}
                    maxDate={this.props.maxDate}
                    minDate={this.addDays(this.state.startDate, 1)}
                    onChange={(date) => this.onChangeHandler(date, 'endDate')}
                    startDate={this.state.endDate}
                />
            </div>
        )
    }
}

export default CustomDatePicker;