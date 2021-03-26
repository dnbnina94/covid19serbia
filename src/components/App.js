import { Component } from 'react';
import {connect} from 'react-redux';
import '../css/main.scss';
import store from '../redux/store';
import { withResizeDetector } from "react-resize-detector";
import { menuOpened, menuClosed, updateWidth, updateHeight } from "../redux/actions/ui";
import Navigation from './Navigation';
import Loader from './Loader';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import DailyStatistics from './DailyStatistics';
import RegionalStatistics from './RegionalStatistics';
import CovidAmbulance from './CovidAmbulances';
import Info from './Info';
import SelfIsolation from './SelfIsolation';
import { ReactComponent as Cardiogram } from '../img/svg/cardiogram.svg';

import empty from '../img/empty.png';
import {
   ERROR_404_MAIN,
   ERROR_404_SUB
} from "../consts";
import ErrorComponent from './ErrorComponent';

class App extends Component {
    constructor(props) {
        super(props);

        this.toggleMenu = this.toggleMenu.bind(this);
    }

    toggleMenu = () => {
        this.props.menuOpened ? store.dispatch(menuClosed()) : store.dispatch(menuOpened());
    }

    render() {
        return (
            <Router>
                 <div className="App row h-100">
                    {(this.props.fetching || this.props.loading) && <Loader />}
                    <div className="navigation-header d-block d-md-none bg-white p-5 w-100">
                        <div className="bg-light-blue color-blue border-radius-1 p-5 p-md-2 d-flex align-items-center justify-content-between w-100">
                            <div className="d-flex align-items-center">
                                <Cardiogram className="cardiogram-icon" />
                                <p className="menu-title font-headline pl-5 pl-md-2">COVID19 Srbija</p>
                            </div>
                            <div className={`hamburger-wrapper ${this.props.menuOpened ? 'hamburger-wrapper-opened' : ''}`} onClick={this.toggleMenu}>
                                <div className={`hamburger-item hamburger-item-1`}></div>
                                <div className={`hamburger-item hamburger-item-2`}></div>
                                <div className={`hamburger-item hamburger-item-3`}></div>
                            </div>
                        </div>
                    </div>
                    <Navigation />
                    <div className="d-none d-md-block col-md-3"></div>
                    <Switch>
                        <Route path="/" exact component={DailyStatistics} />
                        <Route path="/statistika-po-regionima" component={RegionalStatistics} />
                        <Route path="/ambulante" component={CovidAmbulance} />
                        <Route path="/samoizolacija" component={SelfIsolation} />
                        <Route path="/info" component={Info} />
                        <Route path="" component={() => 
                            <div className="col-md-9 p-3 overflow-hidden main-page">
                                <ErrorComponent img={empty} mainText={ERROR_404_MAIN} subText={ERROR_404_SUB} />
                            </div>
                        }/>
                    </Switch>
                </div>
            </Router>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        fetching: state.data.fetching,
        loading: state.ui.loading,
        menuOpened: state.ui.menuOpened
    }
}

export default withResizeDetector(connect(mapStateToProps)(App));