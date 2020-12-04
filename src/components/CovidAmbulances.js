import {Component} from 'react';
import { connect } from 'react-redux';
import { COVID_AMBULANCES } from '../consts';
import { fetchingDataHandler } from '../redux/actions/data';
import store from '../redux/store';
import { formatDate, formatTime } from '../utilities';
import AmbulancesWrapper from './AmbulancesWrapper';

class CovidAmbulance extends Component {
    constructor(props) {
        super(props);

        if (this.props.data.length === 0) {
            store.dispatch(fetchingDataHandler(COVID_AMBULANCES));
        }
    }

    render() {
        let dateModified = this.props.dataInfo && new Date(this.props.dataInfo.last_modified);
        return (
            <div className="CovidAmbulance col-md-9 px-3 pt-2 pb-4 h-100">
                <div className="d-flex flex-column h-100">
                    <div className="row">
                        <div className="col-md-12 d-flex justify-content-between">
                            <p className="font-headline">COVID-19 ambulante</p>
                            {dateModified &&
                                <p className="">Ažurirano {formatDate(dateModified)} u {formatTime(dateModified)}</p>
                            }
                        </div>
                    </div>
                    {
                        this.props.data.length !== 0 &&
                        <AmbulancesWrapper data={this.props.data} />
                    }      
                    </div> 
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        data: state.data[COVID_AMBULANCES].data,
        dataInfo: state.data[COVID_AMBULANCES].dataInfo
    }
}

export default connect(mapStateToProps)(CovidAmbulance);