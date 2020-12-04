import React, { Component } from "react";
import Map2 from "./Map2";
import GeneralStatisticsBox from './GeneralStatisticsBox';
import serbiaGeo from '../serbia.geojson.json';
import serbiaGeoDistricts from '../sr_a2.geojson.json';
import {capitalize} from '../utilities';
import { ReactComponent as Cross } from '../img/svg/cross.svg';
import '../css/AmbulancesWrapper.scss';

class AmbulancesWrapper extends Component {
    constructor(props) {
        super(props);

        const self = this;
        const mapFilters = [
            {
                data: function() {
                    return self.props.data
                },
                map: function() {
                    return serbiaGeo.features
                }
            },
            {
                data: function(r) {
                    return self.props.data.filter(d => {
                        return d.region.toLowerCase() === r.toLowerCase();
                    });
                },
                map: function(r) {
                    return serbiaGeoDistricts.features.filter(i => {
                        return r === i.properties.NAME_1
                    })
                }
            }
        ];

        this.state = {
            map: serbiaGeo.features,
            mapFilters: mapFilters,
            selectedFilter: 0,
            selectedAmbulance: null,
            selectedTerritory: null,
            dataReady: true,
            points: this.props.data
        }

        this.handleAmbulanceChange = this.handleAmbulanceChange.bind(this);
        this.handleMapChange = this.handleMapChange.bind(this);

        this.ambulancesInfoWrapper = React.createRef();
    }

    handleAmbulanceChange(ambIndex) {
        this.setState({
            selectedAmbulance: ambIndex
        });
    }

    setData(r) {
        const mapFilter = this.state.mapFilters[this.state.selectedFilter];
        const map = mapFilter.map(r);
        const points = mapFilter.data(r);
        this.setState({
            map: map,
            points: points
        });
        this.ambulancesInfoWrapper.current.scrollTo(0,0);
    }

    handleMapChange(p) {
        this.setState((state) => {
            const nextFilter = (state.selectedFilter + 1) % state.mapFilters.length
            return {
                selectedFilter: nextFilter,
                selectedTerritory: nextFilter !== 0 ? p.properties.NAME_2 : null
            }
        });
        this.setData(p.properties.NAME_2);
    }

    render() {
        const ambulancesInfo = this.state.points.map((d,i) => {
            const selectedAmbulance = this.state.selectedAmbulance === i;
            return (
                <div className="ambulance-wrapper p-2" key={i} onMouseOver={() => {
                    this.handleAmbulanceChange(i);
                }} onMouseLeave={() => {
                    this.handleAmbulanceChange(null);
                }}>
                    <div className="d-flex align-items-center">
                        <Cross className="cross" />
                        <p className="font-bold pl-2 flex-1">{capitalize(d.name)}</p>
                    </div>
                        <div className="info d-flex pt-1">
                            <div className="filler"></div>
                            <div className="pl-2 flex-1">
                                <p>
                                    {capitalize(d.address)} {d.addressNumber}, {capitalize(d.district)}
                                </p>
                                {d.phone && 
                                    <p>tel: <b>{d.phone}</b></p>
                                }
                                {d.mobile &&
                                    <p>mob: <b>{d.mobile}</b></p>
                                }
                                <b>Radno vreme:</b><br/>
                                <p>radni dani: {d.hoursWorkdays}, vikend: {d.hoursWeekend}</p>
                            </div>
                        </div>
                </div>
            );
        })
        return (
            <div className="AmbulancesWrapper row flex-grow-1 pt-2">
                <div className="col-md-7">
                    <div className="bg-white shadow-sm position-relative p-2 pb-3 h-100 d-flex flex-column">
                        <p className="font-bold pb-2 lh-1">
                            {this.state.selectedTerritory === null ? 'Svi okruzi' : `Okrug: ${this.state.selectedTerritory}`}
                        </p>
                        <div className="map-container flex-grow-1" style={{width: "68%", margin: "auto"}}>
                            {this.state.dataReady &&
                                <Map2
                                    geoData = {this.state.map}
                                    points = {this.state.points}
                                    geoDataTargetName="NAME_2"
                                    selected={this.state.selectedAmbulance}
                                    handleMapChange={this.handleMapChange}
                                />
                            }
                        </div>
                    </div>
                </div>
                <div className="col-md-5">
                    <div className="h-100 d-flex flex-column">
                        <GeneralStatisticsBox 
                            bg="red"
                            value={this.state.points.length}
                            description="Broj ambulanti za selektovanu regiju:"
                        />
                        <div className="bg-white shadow-sm position-relative flex-grow-1 overflow-auto" ref={this.ambulancesInfoWrapper}>
                            <div className="h-100 w-100 position-absolute">
                                {ambulancesInfo}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );      
    }
}

export default AmbulancesWrapper;