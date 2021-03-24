import { Component } from 'react';
import {connect} from 'react-redux';
import React from 'react';
import { Link } from 'react-router-dom';
import { ReactComponent as Cardiogram } from '../img/svg/cardiogram.svg';
import { ReactComponent as Pin } from '../img/svg/pin.svg';
import { ReactComponent as BarChart } from '../img/svg/bar-chart.svg';
import { ReactComponent as Cross } from '../img/svg/cross.svg';
import { ReactComponent as StayHome } from '../img/svg/isolation.svg';
import { ReactComponent as WorkFromHome } from '../img/svg/doctor-nav.svg';
import { ReactComponent as Github } from '../img/svg/github.svg';
import { ReactComponent as Envelope } from '../img/svg/envelope.svg';
import store from "../redux/store";
import { menuClosed } from "../redux/actions/ui";
import '../css/Navigation.scss';
// import hospital from '../img/workfromhome.png';

class Navigation extends Component {
    constructor(props) {
        super(props);

        this.closeMenu = this.closeMenu.bind(this);

        this.state = {
            navMenuItems: [
                {
                    label: "Dnevna statistika",
                    component: BarChart,
                    link: '/'
                },
                {
                    label: "Statistika po regionima",
                    component: Pin,
                    link: '/statistika-po-regionima'
                },
                {
                    label: "Samoizolacija",
                    component: StayHome,
                    link: '/samoizolacija'
                },
                {
                    label: "COVID-19 Ambulante",
                    component: Cross,
                    link: '/ambulante'
                }
            ]
        };
    }

    closeMenu = () => {
        store.dispatch(menuClosed());
    }

    render() {
        const navMenuItems = this.state.navMenuItems.map(item => {
            return <li className="px-1 py-3 p-md-1 d-flex align-items-center" key={item.label}>
                    <Link to={item.link} className="custom-link d-flex align-items-center" onClick={this.closeMenu}>
                        {React.createElement(item.component, {className: "navigation-menu-icon mr-2 mr-md-0"})}
                        <span className="pl-5 pl-md-2 nav-item-label">{item.label}</span>
                    </Link>                    
                   </li>;
        });

        return (
            <div className={`Navigation ${this.props.menuOpened ? 'Navigation-opened' : ''} col-md-3 p-5 p-md-3 bg-white h-100 shadow-sm flex-column justify-content-between`}>
                <div>
                    <div className="bg-light-blue color-blue border-radius-1 p-5 p-md-2 d-flex align-items-center">
                        <Cardiogram className="cardiogram-icon" />
                        <p className="menu-title font-headline pl-5 pl-md-2">COVID19 Srbija</p>
                    </div>
                    <ul className="navigation-menu mt-5 mt-md-0 p-5 p-md-2 font-bold">
                        {navMenuItems}
                    </ul>
                </div>
                <div className="linear-gradient-light-blue border-radius-1 color-blue p-5 p-md-2 text-center overflow-hidden">
                    {/* <img className="w-100" src={hospital} alt="Doctors taking care of a sick patient" /> */}
                    <WorkFromHome className="bottom-img" />
                    <div className="position-relative" style={{zIndex: 1}}>
                        <div className="info-button px-2 py-3 py-md-1 font-headline">
                            <Link to="/info" className="custom-link nav-item-label">
                                Informacije o projektu
                            </Link>   
                        </div>
                        <div className="d-flex justify-content-center pt-1">
                            <a href="https://github.com/dnbnina94/covid19serbia" target="_blank">
                                <Github className="bottom-icon github-icon" />
                            </a>
                            <a href="mailto:nina.grujic.94@gmail.com" className="ml-3 ml-md-1">
                                <Envelope className="bottom-icon envelope-icon" />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        menuOpened: state.ui.menuOpened
    }
}

export default connect(mapStateToProps)(Navigation);
