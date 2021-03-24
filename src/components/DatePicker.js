import React, { Component } from "react";
import '../css/DatePicker.scss';
import DatePicker from "react-datepicker";
import { ReactComponent as Next } from '../img/svg/next.svg';
import "react-datepicker/dist/react-datepicker.css";
import { ReactComponent as Calendar } from '../img/svg/calendar.svg';
import { formatDate } from "../utilities";

class CustomInput extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <button className="custom-input d-inline-flex align-items-center" onClick={this.props.onClick}>
                {formatDate(new Date(this.props.value))}
                <Next className="arrow-down" />
            </button>
        );
    }
}

// const CustomInput = ({ value, onClick }) => (
//     <button className="custom-input" onClick={onClick}>
//       {formatDate(new Date(value))}
//     </button>
// );

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
            <div className="DatePicker d-flex align-items-center">
                <Calendar className="calendar-icon pr-3 pr-md-1" />
                <DatePicker
                    customInput={<CustomInput />}
                    selected={this.state.startDate}
                    minDate={this.props.minDate}
                    maxDate={this.subDays(this.state.endDate, 1)}
                    onChange={(date) => this.onChangeHandler(date, 'startDate')}
                    startDate={this.state.startDate}
                    calendarClassName="custom-calendar"
                    popperModifiers={{
                        preventOverflow: {
                          enabled: true,
                        },
                    }}
                />
                {
                    !this.props.noDateRange &&
                    <div>
                        <span className="px-1">&ndash;</span>
                        <DatePicker
                            customInput={<CustomInput />}
                            selected={this.state.endDate}
                            maxDate={this.props.maxDate}
                            minDate={this.addDays(this.state.startDate, 1)}
                            onChange={(date) => this.onChangeHandler(date, 'endDate')}
                            startDate={this.state.endDate}
                            calendarClassName="custom-calendar"
                            popperModifiers={{
                                preventOverflow: {
                                enabled: true,
                                },
                            }}
                        />
                    </div>
                }
            </div>
        )
    }
}

export default CustomDatePicker;