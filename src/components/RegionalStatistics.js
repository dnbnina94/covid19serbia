import React, { Component } from "react";
import { connect } from "react-redux";
import { REGIONAL_COVID_DATA } from "../consts";
import { fetchingDataHandler } from "../redux/actions/data";
import store from "../redux/store";
import MapWrapper from "./MapWrapper";
const serbiaGeo = require('../serbia.geojson.json');

class RegionalStatistics extends Component {
    constructor(props) {
        super(props);

        store.dispatch(fetchingDataHandler(REGIONAL_COVID_DATA));
    }

    render() {
        return (
            <div className="RegionalStatistics col-md-9 px-3 pt-2 pb-4 h-100">
                <div className="d-flex flex-column h-100">
                    <p className="font-headline pb-2">Statistika po regionima</p>
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
        data: state.data[REGIONAL_COVID_DATA]
    }
}

export default connect(mapStateToProps)(RegionalStatistics);