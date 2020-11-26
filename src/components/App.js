import { Component } from 'react';
import '../css/main.scss';
import Navigation from './Navigation';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import DailyStatistics from './DailyStatistics';
import RegionalStatistics from './RegionalStatistics';
import { REGIONAL_COVID_DATA } from '../consts';

class App extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Router>
                 <div className="App row h-100">
                    <Navigation />
                    <div className="col-md-3"></div>
                    <Switch>
                        <Route path="/" exact component={DailyStatistics} />
                        <Route path="/statistika-po-regionima" component={RegionalStatistics} />
                    </Switch>
                </div>
            </Router>
        );
    }
}

export default App;