import React, { Component } from "react";
import Map from './Map';
import HorizontalBarChart from './HorizontalBarChart';
import Map3 from "./Map3";
import '../css/MapWrapper.scss';
import { REGION_COLOR_SCHEME, COLOR_SCHEME, REGIONAL_COVID_DATA } from '../consts';
import ChartTitle from "./ChartTitle";
import { formatDate2 } from "../utilities";
const serbiaGeo = require('../serbia.geojson.json');
const serbiaGeoDistricts = require('../sr_a2.geojson.json');

class MapWrapper2 extends Component {
    constructor(props) {
        super(props);

        const self = this;

        const mapFilters = [
            {
                targetField: 'region',
                territories: function() {
                    return Array.from(new Set(self.props.data.map(d => d.region)))
                },
                map: function() {
                    return serbiaGeo.features
                }
            },
            {
                targetField: 'district',
                territories: function(r) {
                    return Array.from(new Set(self.props.data.filter(d => d.region === r).map(d => d.district)))
                },
                map: function(r) {
                    return serbiaGeoDistricts.features.filter(i => {
                        return r === i.properties.NAME_1
                    })
                }
            }
        ];

        let dates = this.props.data.reduce((acc, curr) => {
            return acc.concat(curr.data.map(d => d.date));
        }, []);
        dates.sort((a,b) => {
            const aDate = new Date(a);
            const bDate = new Date(b);
            return aDate < bDate ? -1 : 1;
        });

        dates = Array.from(new Set(dates));
        const minDate = new Date(dates[0]); 
        const maxDate = new Date(dates[dates.length-1]);

        this.state = {
            mapFilters: mapFilters,
            selectedFilter: 0,
            selectedTerritory: null,
            targetName: "NAME_2",
            minDate: minDate,
            maxDate: maxDate,
            startDate: new Date(minDate.valueOf())
        }

        this.dateChangeHandler = this.dateChangeHandler.bind(this);
        this.handleMapChange = this.handleMapChange.bind(this);
        this.showWholeMap = this.showWholeMap.bind(this);

        this.barWrapper = React.createRef();
        this.chartWrapper = React.createRef();
    }

    setData() {
        const self = this;
        const mapFilter = this.state.mapFilters[this.state.selectedFilter];
        const territories = mapFilter.territories(this.state.selectedTerritory);

        let regionData = territories
        .map(r => {
            return {
                key: r,
                values: self.props.data.filter(d => {
                    return d[mapFilter.targetField].toLowerCase() === r.toLowerCase();
                }).reduce((acc, curr) => {
                    return acc.concat(curr.data);
                }, [])
            }
        });
        const startDate = formatDate2(self.state.startDate);
        regionData = regionData.map(rd => {
            return {
                ...rd,
                value: rd.values
                .filter(v => {
                    // const date = new Date(v.date);
                    // return date.valueOf() == self.state.startDate.valueOf() 
                    return v.date === startDate
                })
                .reduce((acc, curr) => {
                    return acc + (+curr.value)
                }, 0)
            }
        })
        .filter(rd => {
            return rd.values.length !== 0
        });

        this.setState((state) => {
            return {
                regionData: regionData,
                map: mapFilter.map(state.selectedTerritory)
            }
        });
    }

    handleMapChange(p) {
        if (p.properties.NAME_2 === "Grad Beograd") {
            return;
        }
        this.setState((state) => {
            const nextFilter = (state.selectedFilter + 1) % state.mapFilters.length;
            if (nextFilter === 1) {
                process.nextTick(() => {
                    this.setData();
                });
                return {
                    selectedFilter: nextFilter,
                    selectedTerritory: nextFilter !== 0 ? p.properties.NAME_2 : null
                }
            }
        });
    }

    dateChangeHandler(date1, date2) {
        this.setState({
            startDate: date1        
        });
        process.nextTick(() => {
            this.setData();
        })
    }

    componentDidMount() {
        this.setData();

        this.setState({
            dataReady: true
        });
    }

    showWholeMap() {
        this.setState(() => {
            process.nextTick(() => {
                this.setData();
            });
            return {
                selectedFilter: 0,
                selectedTerritory: null
            }
        });
    }

    render() {
        const selectedTerritory = this.state.selectedTerritory ? 
            'Okrug: ' + this.state.selectedTerritory : 
            'Svi okruzi';
        const barChartTitle = this.state.selectedTerritory ?
            'Broj samoizolovanih po opštinama' : 
            'Broj samoizolovanih po okruzima';
        
        return (
            <div className="MapWrapper row flex-grow-1 pt-3">
                <div className="col-md-5">
                    <div className="row">
                        <div className="col-md-12 p-5 mb-5 d-block d-md-none shadow-sm border-radius-1 bg-dark-blue color-white smaller-font">
                            <p className="data-info">
                                Prikazani podaci odnose se na broj ljudi u obaveznoj samoizolaciji na terotirji 
                                Republike Srbije po datumima.
                            </p>
                            <p className="data-info pt-5">
                                Izvor: Ministarstvo Unutrašnjih poslova Republike Srbije
                            </p>
                        </div>
                    </div>
                    <div className="map-wrapper-2 bg-white shadow-sm d-flex flex-column border-radius-1" ref={this.chartWrapper}>
                        <ChartTitle 
                            datePickerAvailable={true}
                            downloadAvailable={true}
                            downloadRef={this.chartWrapper}
                            minDate={this.state.minDate}
                            maxDate={this.state.maxDate}
                            noDateRange={true}
                            dateChangeHandler={this.dateChangeHandler}
                            title={selectedTerritory}
                        />
                        <div className="map-container w-100 flex-grow-1 p-5 p-md-2 position-relative">
                            <div 
                                onClick={this.showWholeMap} 
                                className={`map-back-btn map-back-btn-blue ${this.state.selectedFilter === 1 ? 'map-back-btn-visible' : ''}`}
                            >
                                Prikaz cele mape
                            </div>
                            {this.state.dataReady &&
                                <Map3
                                    data={this.state.regionData} 
                                    geoData={this.state.map} 
                                    geoDataTargetName={this.state.targetName} 
                                    handleMapChange={this.handleMapChange}
                                    color={COLOR_SCHEME[1]}
                                    selectedFilter={this.state.selectedFilter}
                                />
                            }
                        </div>
                    </div>
                </div>
                <div className="col-md-7 my-5 my-md-0">
                    <div className="grid-layout-2 h-100 mb-0">
                        <div className="row">
                            <div className="col-md-12 d-none d-md-block p-2 shadow-sm border-radius-1 bg-dark-blue color-white smaller-font">
                                <p className="data-info">
                                    Prikazani podaci odnose se na broj ljudi u obaveznoj samoizolaciji na terotirji 
                                    Republike Srbije po datumima.
                                </p>
                                <p className="data-info pt-1">
                                    Klikom na neki od okruga, moguće je videti statistiku za opštine koje pripadaju tom okrugu.
                                </p>
                            </div>
                        </div>
                        <div className="row">
                            <div className="horizontal-barchart-wrapper col-md-12 bg-white shadow-sm p-0 h-100 border-radius-1" ref={this.barWrapper}>
                                {this.state.dataReady &&
                                    <HorizontalBarChart 
                                        data={this.state.regionData}
                                        title={barChartTitle}
                                        startDate={this.state.startDate}
                                        valueExtractor={(d) => d.value}
                                        color={COLOR_SCHEME[0]}
                                    />
                                }
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        );      
    }
}

export default MapWrapper2;