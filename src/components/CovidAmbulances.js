import {Component} from 'react';
import { connect } from 'react-redux';
import { COVID_AMBULANCES } from '../consts';
import { fetchingDataHandler } from '../redux/actions/data';
import store from '../redux/store';
import AmbulancesWrapper from './AmbulancesWrapper';

class CovidAmbulance extends Component {
    constructor(props) {
        super(props);

        if (this.props.data.length === 0) {
            store.dispatch(fetchingDataHandler(COVID_AMBULANCES));
        }
    }

    render() {
        return (
            <div className="CovidAmbulance col-md-9 px-3 pt-2 pb-4 h-100">
                <div className="d-flex flex-column h-100">
                    <p className="font-headline pb-2">COVID-19 ambulante</p>
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
        data: state.data[COVID_AMBULANCES]
    }
}

export default connect(mapStateToProps)(CovidAmbulance);