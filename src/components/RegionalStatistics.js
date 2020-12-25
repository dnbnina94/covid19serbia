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
    }

    render() {
        let dateModified = this.props.dataInfo && new Date(this.props.dataInfo.last_modified);
        return (
            <div className="RegionalStatistics col-md-9 px-3 pt-2 pb-4 h-100">
                <div className="d-flex flex-column h-100">
                    <div className="row">
                        <div className="col-md-12 d-flex justify-content-between">
                            <p className="font-headline">Statistika po regionima</p>
                            {dateModified &&
                                <p className="">Ažurirano {formatDate(dateModified)} u {formatTime(dateModified)}</p>
                            }
                        </div>
                    </div>
                    {/* <p className="font-headline pb-2">Statistika po regionima</p> */}
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