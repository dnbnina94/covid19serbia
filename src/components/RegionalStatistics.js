import React, { Component } from "react";
import { connect } from "react-redux";
import { REGIONAL_COVID_DATA } from "../consts";
import { fetchingDataHandler } from "../redux/actions/data";
import store from "../redux/store";
import { formatDate, formatTime } from "../utilities";
import MapWrapper from "./MapWrapper";

class RegionalStatistics extends Component {
    constructor(props) {
        super(props);
        if (this.props.data.length === 0) {
            store.dispatch(fetchingDataHandler(REGIONAL_COVID_DATA));
        }

        const pieChartFlags = [
            {
                flag: 'F',
                desc: 'Broj pozitivnih žena',
                color: "#BCBDDC"
            },
            {
                flag: 'M',
                desc: 'Broj pozitivnih muškaraca',
                color: "#756BB1"
            }
        ];

        const ageGroupFlags = [
            {
                bottomVal: 0,
                upperVal: 2
            },
            {
                bottomVal: 2,
                upperVal: 9
            },
            {
                bottomVal: 9,
                upperVal: 12
            },
            {
                bottomVal: 12,
                upperVal: 19
            },
            {
                bottomVal: 19,
                upperVal: 30
            },
            {
                bottomVal: 30,
                upperVal: 40
            },
            {
                bottomVal: 40,
                upperVal: 50
            },
            {
                bottomVal: 50,
                upperVal: 65
            },
            {
                bottomVal: 65,
                upperVal: Infinity
            }
        ];

        this.state = {
            pieChartFlags: pieChartFlags,
            ageGroupFlags: ageGroupFlags
        }
    }

    render() {
        let dateModified = this.props.dataInfo && new Date(this.props.dataInfo.last_modified);

        return (
            <div className="RegionalStatistics col-md-9 p-3 h-100">
                <div className="d-flex flex-column h-100">
                    <div className="row">
                        <div className="col-md-12 mt-4 mb-5 my-md-0 d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between">
                            <p className="main-title font-headline">Statistika po regionima</p>
                            {dateModified &&
                                <p className="main-title-info">Ažurirano {formatDate(dateModified)} u {formatTime(dateModified)}</p>
                            }
                        </div>
                    </div>
                    {
                        this.props.data.length !== 0 &&
                        <MapWrapper data={this.props.data} />
                    }      
                </div> 
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        data: state.data[REGIONAL_COVID_DATA].data,
        dataInfo: state.data[REGIONAL_COVID_DATA].dataInfo
    }
}

export default connect(mapStateToProps)(RegionalStatistics);