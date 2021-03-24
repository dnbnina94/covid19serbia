import React, { Component } from "react";
import Map2 from "./Map2";
import GeneralStatisticsBox from './GeneralStatisticsBox';
import serbiaGeo from '../serbia.geojson.json';
import serbiaGeoDistricts from '../sr_a2.geojson.json';
import {capitalize} from '../utilities';
import { ReactComponent as Cross } from '../img/svg/cross.svg';
import '../css/AmbulancesWrapper.scss';
import '../css/MapWrapper.scss';
import ChartTitle from "./ChartTitle";

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
        this.showWholeMap = this.showWholeMap.bind(this);

        this.ambulancesInfoWrapper = React.createRef();
        this.chartWrapper = React.createRef();
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
            const nextFilter = (state.selectedFilter + 1) % state.mapFilters.length;
            if (nextFilter === 1) {
                process.nextTick(() => {
                    this.setData(p.properties.NAME_2);
                });
                return {
                    selectedFilter: nextFilter,
                    selectedTerritory: nextFilter !== 0 ? p.properties.NAME_2 : null
                }
            }
        });
    }

    showWholeMap() {
        this.setState(() => {
            process.nextTick(() => {
                this.setData();
            })
            return {
                selectedFilter: 0,
                selectedTerritory: null
            }
        });
    }

    render() {
        const ambulancesInfo = this.state.points.map((d,i) => {
            const selectedAmbulance = this.state.selectedAmbulance === i;
            return (
                <div className="ambulance-wrapper px-5 py-3 p-md-2" key={i} onMouseOver={() => {
                    this.handleAmbulanceChange(i);
                }} onMouseLeave={() => {
                    this.handleAmbulanceChange(null);
                }}>
                    <div className="d-flex align-items-center">
                        <Cross className="cross" />
                        <p className="ambulance-title font-bold pl-2 flex-1">{capitalize(d.name)}</p>
                    </div>
                    <div className="info d-flex pt-1">
                        <div className="filler"></div>
                        <a className="ambulance-link pl-2 flex-1" href={`https://www.google.com/maps?q=${d.coordinates[1]},${d.coordinates[0]}`} target="_blank">
                            <div>
                                {capitalize(d.address)} {d.addressNumber}, {capitalize(d.district)}
                            </div>
                            {d.phone && 
                                <div>tel: <b>{d.phone}</b></div>
                            }
                            {d.mobile &&
                                <div>mob: <b>{d.mobile}</b></div>
                            }
                            <b>Radno vreme:</b><br/>
                            <div>radni dani: {d.hoursWorkdays}, vikend: {d.hoursWeekend}</div>
                        </a>
                    </div>
                </div>
            );
        })
        return (
            <div className="AmbulancesWrapper row flex-grow-1 pt-3 mb-5 mb-md-0">
                <div className="ambulances-wrapper-map-wrapper col-md-7">
                    <div className="bg-white shadow-sm position-relative border-radius-1 h-100 d-flex flex-column" ref={this.chartWrapper}>
                        <ChartTitle
                            downloadAvailable={true}
                            downloadRef={this.chartWrapper}
                            title={this.state.selectedTerritory === null ? 'Svi okruzi' : `Okrug: ${this.state.selectedTerritory}`}
                        />
                        <div className="flex-grow-1 p-5 p-md-2">
                            <div 
                                onClick={this.showWholeMap} 
                                className={`map-back-btn map-back-btn-red ${this.state.selectedFilter === 1 ? 'map-back-btn-visible' : ''}`}
                            >
                                Prikaz cele mape
                            </div>
                            {this.state.dataReady &&
                                <Map2
                                    geoData = {this.state.map}
                                    points = {this.state.points}
                                    geoDataTargetName="NAME_2"
                                    selected={this.state.selectedAmbulance}
                                    handleMapChange={this.handleMapChange}
                                    selectedFilter={this.state.selectedFilter}
                                />
                            }
                        </div>
                    </div>
                </div>
                <div className="col-md-5 my-5 my-md-0">
                    <div className="ambulance-info-wrapper h-100 d-flex flex-column border-radius-1 bg-white shadow-sm">
                        <GeneralStatisticsBox 
                            bg="red"
                            value={this.state.points.length}
                            description="Broj ambulanti za selektovanu regiju:"
                        />
                        <div className="ambulance-info-wrapper-inner position-relative flex-grow-1 pb-2 pb-md-0" ref={this.ambulancesInfoWrapper}>
                            <div className="ambulance-info-wrapper-inner-inner h-100 w-100">
                                {ambulancesInfo.length ? 
                                    ambulancesInfo :
                                    <p className="p-5 p-md-2 ambulance-title">Nema ambulanti za selektovanu regiju.</p>
                                }
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-12 mt-4 mt-md-0 d-md-none"></div>
            </div>
        );      
    }
}

export default AmbulancesWrapper;