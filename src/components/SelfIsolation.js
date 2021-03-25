import { Component } from "react";
import { connect } from "react-redux";
import serbiaGeo from '../serbia.geojson.json';
import serbiaGeoDistricts from '../sr_a2.geojson.json';
import { SELF_ISOLATION } from "../consts";
import { fetchingDataHandler } from "../redux/actions/data";
import store from "../redux/store";
import { formatDate, formatTime } from "../utilities";
import MapWrapper from "./MapWrapper";
import MapWrapper2 from "./MapWrapper2";

class SelfIsolation extends Component {
    constructor(props) {
        super(props);

        if (this.props.data.length === 0) {
            store.dispatch(fetchingDataHandler(SELF_ISOLATION));
        }

        this.state = {
            map: serbiaGeo.features,
        }
    }

    render() {
        const dateModified = this.props.dataInfo && new Date(this.props.dataInfo.last_modified);

        return (
            <div className="Selfisolation col-md-9 p-3 overflow-hidden main-page">
                <div className="d-flex flex-column h-100">
                    <div className="row">
                        <div className="col-md-12 mt-4 mb-5 my-md-0 d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between">
                            <p className="main-title font-headline">Samoizolacija</p>
                            {dateModified &&
                                <p className="main-title-info">Ažurirano {formatDate(dateModified)} u {formatTime(dateModified)}</p>
                            }
                        </div>
                    </div>
                    {
                        this.props.data.length !== 0 &&
                        <MapWrapper2 data={this.props.data} />
                    } 
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        data: state.data[SELF_ISOLATION].data,
        dataInfo: state.data[SELF_ISOLATION].dataInfo
    }
}

export default connect(mapStateToProps)(SelfIsolation);