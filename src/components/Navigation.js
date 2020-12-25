import { Component } from 'react';
import React from 'react';
import { Link } from 'react-router-dom';
import { ReactComponent as Cardiogram } from '../img/svg/cardiogram.svg';
import { ReactComponent as Pin } from '../img/svg/pin.svg';
import { ReactComponent as BarChart } from '../img/svg/bar-chart.svg';
import { ReactComponent as Cross } from '../img/svg/cross.svg';
import { ReactComponent as WorkFromHome } from '../img/svg/workfromhome.svg';
import { ReactComponent as Github } from '../img/svg/github.svg';
import { ReactComponent as Envelope } from '../img/svg/envelope.svg';
import '../css/Navigation.scss';
import hospital from '../img/workfromhome.png';

class Navigation extends Component {
    constructor(props) {
        super(props);

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
                    label: "COVID-19 Ambulante",
                    component: Cross,
                    link: '/ambulante'
                }
            ]
        };
    }

    render() {
        const navMenuItems = this.state.navMenuItems.map(item => {
            return <li className="p-1 d-flex align-items-center" key={item.label}>
                    <Link to={item.link} className="custom-link">
                        {React.createElement(item.component, {className: "navigation-menu-icon"})}
                        <span className="pl-2">{item.label}</span>
                    </Link>                    
                   </li>;
        });

        return (
            <div className="Navigation col-md-3 p-3 bg-white h-100 shadow-sm d-flex flex-column justify-content-between">
                <div>
                    <div className="bg-light-blue color-blue border-radius-1 p-2 d-flex align-items-center">
                        <Cardiogram className="cardiogram-icon" />
                        <p className="font-headline pl-2">COVID19 Srbija</p>
                    </div>
                    <ul className="navigation-menu p-2 font-bold">
                        {navMenuItems}
                    </ul>
                </div>
                <div className="linear-gradient-light-blue border-radius-1 color-blue p-2 text-center overflow-hidden">
                    {/* <img className="w-100" src={hospital} alt="Doctors taking care of a sick patient" /> */}
                    <WorkFromHome className="bottom-img" />
                    <div className="position-relative" style={{zIndex: 1}}>
                        <div className="info-button px-2 py-1 font-headline">
                            <Link to="/info" className="custom-link">
                                Informacije o projektu
                            </Link>   
                        </div>
                        <div className="d-flex justify-content-center pt-1">
                            <a href="https://github.com/dnbnina94/covid19serbia" target="_blank">
                                <Github className="bottom-icon github-icon" />
                            </a>
                            <a href="mailto:nina.grujic.94@gmail.com" className="ml-1">
                                <Envelope className="bottom-icon envelope-icon" />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Navigation;
