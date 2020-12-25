import React, { Component } from "react";
import Map from './Map';
import HorizontalBarChart from './HorizontalBarChart';
import '../css/MapWrapper.scss';
import { REGION_COLOR_SCHEME } from '../consts';
import PieChart from './PieChart';
import BarChart from './BarChart';
import DatePicker from './DatePicker';
import { ReactComponent as Download } from '../img/svg/download.svg';
const serbiaGeo = require('../serbia.geojson.json');
const serbiaGeoDistricts = require('../sr_a2.geojson.json');

class MapWrapper extends Component {
    constructor(props) {
        super(props);

        this.handleMapChange = this.handleMapChange.bind(this);

        const pieChartFlags = [
            {
                flag: 'F',
                desc: 'Broj pozitivnih žena',
                color: "#BCBDDC"
            },
            {
                flag: 'M',
                desc: 'Broj pozitivnih muškaraca',
                color: "#756BB1"
            }
        ];

        const ageGroupFlags = [
            {
                bottomVal: 0,
                upperVal: 2
            },
            {
                bottomVal: 2,
                upperVal: 9
            },
            {
                bottomVal: 9,
                upperVal: 12
            },
            {
                bottomVal: 12,
                upperVal: 19
            },
            {
                bottomVal: 19,
                upperVal: 30
            },
            {
                bottomVal: 30,
                upperVal: 40
            },
            {
                bottomVal: 40,
                upperVal: 50
            },
            {
                bottomVal: 50,
                upperVal: 65
            },
            {
                bottomVal: 65,
                upperVal: Infinity
            }
        ];

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
            pieChartFlags: pieChartFlags,
            ageGroupFlags: ageGroupFlags,
            selectedFilter: 0,
            selectedTerritory: null,
            targetName: "NAME_2",
            minDate: minDate,
            maxDate: maxDate,
            startDate: new Date(minDate.valueOf()),
            endDate: new Date(maxDate.valueOf())
        }

        this.dateChangeHandler = this.dateChangeHandler.bind(this);

        this.barWrapper = React.createRef();
    }

    setData() {
        const self = this;
        const mapFilter = this.state.mapFilters[this.state.selectedFilter];
        const territories = mapFilter.territories(this.state.selectedTerritory);
        const regionData = territories
        .map(r => {
            return {
                key: r,
                values: self.props.data.filter(d => {
                    return d[mapFilter.targetField].toLowerCase() === r.toLowerCase();
                }).reduce((acc, curr) => {
                    return acc.concat(curr.data);
                }, [])
            }
        })
        .map(rd => {
            return {
                ...rd,
                values: rd.values.filter(v => {
                    const date = new Date(v.date);
                    return date >= self.state.startDate && date <= self.state.endDate
                })
            }
        })
        .filter(rd => {
            return rd.values.length !== 0
        });

        const pieChartData = this.state.pieChartFlags
        .map(f => {
            let value = regionData.reduce((acc, curr) => {
                return acc + curr.values.reduce((acc,curr) => {return acc + (curr.sex === f.flag ? 1 : 0)}, 0);
            },0)
            return {
                key: f.desc,
                value: value, 
                color: f.color
            }
        });

        const ageData = this.state.ageGroupFlags
        .map(f => {
            const value = regionData.reduce((acc, curr) => {
                return acc + curr.values.reduce((acc, curr) => {return acc + (curr.age >= f.bottomVal && curr.age < f.upperVal ? 1 : 0)}, 0);
            }, 0)
            return {
                key: `${f.bottomVal}${f.upperVal === Infinity ? '+' : '-'+f.upperVal}`,
                value: value
            }
        });

        this.setState((state) => {
            return {
                regionData: regionData,
                pieChartData: pieChartData,
                ageData: ageData,
                map: mapFilter.map(state.selectedTerritory)
            }
        })
    }

    componentDidMount() {
        this.setData();

        this.setState({
            dataReady: true
        })
    }

    handleMapChange(p) {
        const self = this;
        this.setState((state) => {
            const nextFilter = (state.selectedFilter + 1) % state.mapFilters.length
            return {
                selectedFilter: nextFilter,
                selectedTerritory: nextFilter !== 0 ? p.properties.NAME_2 : null
            }
        });
        process.nextTick(() => {
            this.setData();
        })
    }

    dateChangeHandler(date1, date2) {
        this.setState({
            startDate: date1,
            endDate: date2
        });
        process.nextTick(() => {
            this.setData();
        })
    }

    render() {
        const selectedTerritory = this.state.selectedTerritory ? 
            'Okrug: ' + this.state.selectedTerritory : 
            'Svi okruzi';
        const barChartTitle = this.state.selectedTerritory ?
            'Broj obolelih po opštinama' : 
            'Broj obolelih po okruzima';

        this.barWrapper.current && this.barWrapper.current.scrollTo(0,0);

        return (
            <div className="MapWrapper row flex-grow-1 pt-2">
                <div className="col-md-5">
                    <div className="bg-white shadow-sm h-100 d-flex flex-column border-radius-1">
                        <div className="d-flex justify-content-between align-items-center p-2 position-relative chart-title">
                            <div>
                                <p className="title font-bold">{selectedTerritory}</p>
                                <DatePicker
                                    minDate={this.state.minDate}
                                    maxDate={this.state.maxDate}
                                    dateChangeHandler={this.dateChangeHandler}
                                />
                            </div>
                            <div ref={this.saveButtonRef}>
                                <Download className="download-icon" />
                            </div>
                        </div>
                        <div className="map-container w-100 flex-grow-1 p-2 position-relative">
                            {this.state.dataReady &&
                                <Map
                                    data={this.state.regionData} 
                                    geoData={this.state.map} 
                                    geoDataTargetName={this.state.targetName}
                                    colors={REGION_COLOR_SCHEME}
                                    handleMapChange={this.handleMapChange} 
                                />
                            }
                        </div>
                    </div>
                </div>
                <div className="col-md-7">
                    <div className="grid-layout h-100">
                        <div className="row">
                            <div className="col-md-12 bg-white shadow-sm overflow-auto h-100" ref={this.barWrapper}>
                                {this.state.dataReady &&
                                    <HorizontalBarChart 
                                        data={this.state.regionData}
                                        title={barChartTitle}
                                        startDate={this.state.startDate}
                                        endDate={this.state.endDate}
                                    />
                                }
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-12 bg-white shadow-sm">
                                <p className="font-bold py-2 lh-1">Broj obolelih prema polu i starosnim grupama</p>
                                <div className="row">
                                    <div className="col-md-5 p-0">
                                        {this.state.dataReady &&
                                            <PieChart 
                                                small={true}
                                                hideTitle={true}
                                                heightRatio={2}
                                                innerRadius={0.65} 
                                                data={this.state.pieChartData} 
                                            />
                                        }
                                    </div>
                                    <div className="col-md-7">
                                        {
                                            this.state.dataReady &&
                                            <BarChart data={this.state.ageData} />
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );      
    }
}

export default MapWrapper;