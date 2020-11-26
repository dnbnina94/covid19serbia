import { Component } from "react";
import React from 'react';
import GeneralStatisticsBox from "./GeneralStatisticsBox";
import '../css/DailyStatistics.scss';
import {connect} from 'react-redux';
import store from '../redux/store';
import { fetchingDataHandler } from '../redux/actions/data';
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

        // this.state = {
        //     counter: 0
        // }

        // this.changeData = this.changeData.bind(this);

        if (this.props.data.length === 0) {
            store.dispatch(fetchingDataHandler(DAILY_COVID_DATA));
        }
    }

    // changeData() {
    //     this.setState(prevState => {
    //         return{
    //              ...prevState,
    //              counter : prevState.counter+1
    //         }
    //     })
    // }

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

        let statisticBoxes = [];
        flags.forEach(flag => {
            const statistics = this.props.data.find(item => flag.dataType === item.description);
            if (statistics) {
                statisticBoxes.push(
                    React.createElement(GeneralStatisticsBox, {
                        bg: flag.color, 
                        value: statistics.data[statistics.data.length-1].value,
                        prevValue: statistics.data[statistics.data.length-2].value,
                        icon: flag.icon,
                        description: flag.desc,
                        key: flag.dataType
                    })
                )
            }
        });
        
        return (
            <div className="DailyStatistics col-md-9 px-3 py-2">
                <p className="font-headline">Dnevna statistika</p>
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
        data: state.data[DAILY_COVID_DATA]
    }
}

export default connect(mapStateToProps)(DailyStatistics);