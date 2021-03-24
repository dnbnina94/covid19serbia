import { Component } from "react";
import React from 'react';
import GeneralStatisticsBox from "./GeneralStatisticsBox";
import '../css/DailyStatistics.scss';
import {connect} from 'react-redux';
import store from '../redux/store';
import { fetchingDataHandler } from '../redux/actions/data';
import { formatDate, formatTime, formatTitle } from '../utilities';
import { 
    BROJ_LICA_NA_RESPIRATORU, 
    BROJ_POZITIVNIH_LICA, 
    BROJ_PREMINULIH_LICA, 
    BR_POZITIVNIH_LICA_SHORT, 
    BR_PREMINULIH_LICA_SHORT, 
    BR_LICA_NA_RESPIRATORU_SHORT,
    DAILY_COVID_DATA
} from '../consts';
import LineChartWrapper from "./LineChartWrapper";
import StackedBarChartWrapper from "./StackedBarChartWrapper";
import PieChartWrapper from "./PieChartWrapper";

class DailyStatistics extends Component {
    constructor(props) {
        super(props);
        
        if (this.props.data.length === 0) {
            store.dispatch(fetchingDataHandler(DAILY_COVID_DATA));
        }
    }

    render() {
        const flags = [{
            dataType: BROJ_POZITIVNIH_LICA,
            desc: BR_POZITIVNIH_LICA_SHORT,
            color: "mint",
            icon: "coronavirus"
        }, {
            dataType: BROJ_LICA_NA_RESPIRATORU,
            desc: BR_LICA_NA_RESPIRATORU_SHORT,
            color: "purple-blue",
            icon: "coronavirus"
        }, {
            dataType: BROJ_PREMINULIH_LICA,
            desc: BR_PREMINULIH_LICA_SHORT,
            color: "orange",
            icon: "coronavirus"
        }];
        const statisticBoxes = flags.map(flag => {
            const statistics = this.props.data.find(item => flag.dataType === item.description);
            if (statistics) {
                const value = statistics.data[statistics.data.length-1].value;
                const prevValue = statistics.data[statistics.data.length-2].value;
                const prevDescription = `${value > prevValue ? 'više' : 'manje'} u odnosu na juče`;
                const InfoText = props => <span>
                    <span>za </span>
                    <b>{Math.abs(value - prevValue)}</b>
                    <span> {prevDescription}</span>
                </span>;

                return (
                    <div className="col-md-4 px-1"  key={flag.dataType}>
                        <GeneralStatisticsBox
                            bg={flag.color} 
                            value={value}
                            prevValue={prevValue}
                            icon={flag.icon}
                            description={`${formatTitle(flag.desc)}:`}
                            borderRadius={true}
                            infoText={InfoText}
                        />
                    </div>
                )
            }
        });

        let dateModified = this.props.dataInfo && new Date(this.props.dataInfo.last_modified);
        
        return (
            <div className="DailyStatistics col-md-9 p-3 overflow-hidden">
                <div className="row">
                    <div className="col-md-12 mt-4 mb-5 my-md-0 d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center">
                        <p className="main-title font-headline">Dnevna statistika</p>
                        {dateModified &&
                            <p className="main-title-info">Ažurirano {formatDate(dateModified)} u {formatTime(dateModified)}</p>
                        }
                    </div>
                </div>
                {
                    this.props.data.length !== 0 && (
                        <div className="pt-3">
                            <div className="statistics-boxes-wrapper row mx-5 mx-md-1">
                                {statisticBoxes}
                            </div>
                            <LineChartWrapper data={this.props.data} />
                            <PieChartWrapper data={this.props.data} />
                            <StackedBarChartWrapper data={this.props.data} />
                        </div>
                    )
                }
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        data: state.data[DAILY_COVID_DATA].data,
        dataInfo: state.data[DAILY_COVID_DATA].dataInfo
    }
}

export default connect(mapStateToProps)(DailyStatistics);