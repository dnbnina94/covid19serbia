import { Component } from 'react';
import React from 'react';
import { Link } from 'react-router-dom';
import { ReactComponent as Cardiogram } from '../img/svg/cardiogram.svg';
import { ReactComponent as Pin } from '../img/svg/pin.svg';
import { ReactComponent as BarChart } from '../img/svg/bar-chart.svg';
import '../css/Navigation.scss';
import hospital from '../img/hospital.png';

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
                        <p className="font-headline pl-2">COVID19 Statistika</p>
                    </div>
                    <ul className="navigation-menu p-2 font-bold">
                        {navMenuItems}
                    </ul>
                </div>
                <div className="linear-gradient-light-blue border-radius-1 color-blue px-2 py-3 text-center">
                    <img className="w-100" src={hospital} alt="Doctors taking care of a sick patient" />
                </div>
            </div>
        )
    }
}

export default Navigation;
