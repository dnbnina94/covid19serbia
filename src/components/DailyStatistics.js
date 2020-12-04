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
            icon: "respirator"
        }, {
            dataType: BROJ_PREMINULIH_LICA,
            desc: BR_PREMINULIH_LICA_SHORT,
            color: "orange",
            icon: "skull"
        }];
        const statisticBoxes = flags.map(flag => {
            const statistics = this.props.data.find(item => flag.dataType === item.description);
            if (statistics) {
                return (
                    <div className="col-md-4 px-1"  key={flag.dataType}>
                        <GeneralStatisticsBox
                            bg={flag.color} 
                            value={statistics.data[statistics.data.length-1].value}
                            prevValue={statistics.data[statistics.data.length-2].value}
                            icon={flag.icon}
                            description={`${formatTitle(flag.desc)}:`}
                            borderRadius={true}
                        />
                    </div>
                )
            }
        });

        let dateModified = this.props.dataInfo && new Date(this.props.dataInfo.last_modified);
        
        return (
            <div className="DailyStatistics col-md-9 px-3 py-2">
                <div className="row">
                    <div className="col-md-12 d-flex justify-content-between">
                        <p className="font-headline">Dnevna statistika</p>
                        {dateModified &&
                            <p className="">Ažurirano {formatDate(dateModified)} u {formatTime(dateModified)}</p>
                        }
                    </div>
                </div>
                {
                    this.props.data.length !== 0 && (
                        <div className="py-2">
                            <div className="statistics-boxes-wrapper row mx-1">
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