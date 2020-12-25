import { Component } from 'react';
import {connect} from 'react-redux';
import '../css/main.scss';
import Navigation from './Navigation';
import Loader from './Loader';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import DailyStatistics from './DailyStatistics';
import RegionalStatistics from './RegionalStatistics';
import CovidAmbulance from './CovidAmbulances';
import Info from './Info';

class App extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Router>
                 <div className="App row h-100">
                    {(this.props.fetching || this.props.loading) && <Loader />}
                    <Navigation />
                    <div className="col-md-3"></div>
                    <Switch>
                        <Route path="/" exact component={DailyStatistics} />
                        <Route path="/statistika-po-regionima" component={RegionalStatistics} />
                        <Route path="/ambulante" component={CovidAmbulance} />
                        <Route path="/info" component={Info} />
                    </Switch>
                </div>
            </Router>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        fetching: state.data.fetching,
        loading: state.ui.loading
    }
}

export default connect(mapStateToProps)(App);