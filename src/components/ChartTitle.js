import React, { Component } from 'react';
import * as d3 from 'd3';
import domtoimage from 'dom-to-image';
import { saveAs } from 'file-saver';
import store from '../redux/store';
import { loadingStart, loadingStop } from "../redux/actions/ui";
import DatePicker from "./DatePicker";
import { ReactComponent as Download } from '../img/svg/download.svg';
import '../css/ChartTitle.scss';

class ChartTitle extends Component {
    constructor(props) {
        super(props);

        this.saveButtonRef = React.createRef();
    }

    componentDidMount() {
        const self = this;

        this.props.downloadAvailable && d3.select(this.saveButtonRef.current).on('click', function(){
            store.dispatch(loadingStart());
            domtoimage.toBlob(self.props.downloadRef.current, {
                filter: (node) => node !== self.saveButtonRef.current
            })
            .then(function (blob) {
                store.dispatch(loadingStop());
                saveAs(blob, self.props.title + '.png');
            });
        });
    }

    render() {
        return (
            <div className="ChartTitle d-flex p-5 p-md-2 justify-content-between chart-title">
                <div>
                    <p className="font-bold chart-title-headline">{this.props.title}</p>
                    {this.props.datePickerAvailable && <DatePicker
                        minDate={this.props.minDate}
                        maxDate={this.props.maxDate}
                        startDate={this.props.startDate}
                        endDate={this.props.endDate}
                        noDateRange={this.props.noDateRange}
                        dateChangeHandler={this.props.dateChangeHandler}
                    />}
                </div>
                {this.props.downloadAvailable && 
                    <div className="pl-5 pl-md-2" ref={this.saveButtonRef}>
                        <Download className="download-icon" />
                    </div>
                }
            </div>
        );
    }
}

export default ChartTitle;