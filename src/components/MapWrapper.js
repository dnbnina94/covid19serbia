import Map from './Map';
import HorizontalBarChart from './HorizontalBarChart';
import '../css/MapWrapper.scss';
import { REGION_COLOR_SCHEME } from '../consts';
import PieChart from './PieChart';
import BarChart from './BarChart';
const { Component } = require("react");
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

        this.state = {
            mapFilters: mapFilters,
            pieChartFlags: pieChartFlags,
            ageGroupFlags: ageGroupFlags,
            selectedFilter: 0,
            selectedTerritory: null,
            targetName: "NAME_2"
        }
    }

    setData(r) {
        const self = this;
        const mapFilter = this.state.mapFilters[this.state.selectedFilter];
        const territories = mapFilter.territories(r);
        const regionData = territories.map(r => {
            return {
                key: r,
                count: self.props.data.filter(d => {
                    return d[mapFilter.targetField].toLowerCase() === r.toLowerCase();
                }).reduce((acc, curr) => {
                    return acc + curr.data.length;
                }, 0),
                values: self.props.data.filter(d => {
                    return d[mapFilter.targetField].toLowerCase() === r.toLowerCase();
                }).reduce((acc, curr) => {
                    return acc.concat(curr.data);
                }, [])
            }
        });

        const pieChartData = this.state.pieChartFlags.map(f => {
            let value = regionData.reduce((acc, curr) => {
                return acc + curr.values.reduce((acc,curr) => {return acc + (curr.sex === f.flag ? 1 : 0)}, 0);
            },0)
            return {
                key: f.desc,
                value: value, 
                color: f.color
            }
        });

        const ageData = this.state.ageGroupFlags.map(f => {
            const value = regionData.reduce((acc, curr) => {
                return acc + curr.values.reduce((acc, curr) => {return acc + (curr.age >= f.bottomVal && curr.age < f.upperVal ? 1 : 0)}, 0);
            }, 0)
            return {
                key: `${f.bottomVal}${f.upperVal === Infinity ? '+' : '-'+f.upperVal}`,
                value: value
            }
        });

        this.setState({
            regionData: regionData,
            pieChartData: pieChartData,
            ageData: ageData,
            map: mapFilter.map(r)
        })
    }

    componentDidMount() {
        this.setData();

        this.setState({
            dataReady: true
        })
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
        const selectedTerritory = this.state.selectedTerritory ? 
            'Okrug: ' + this.state.selectedTerritory : 
            'Svi okruzi';
        const barChartTitle = this.state.selectedTerritory ?
            'Broj obolelih po opštinama' : 
            'Broj obolelih po okruzima';
        return (
            <div className="MapWrapper row flex-grow-1">
                <div className="col-md-5">
                    <div className="bg-white shadow-sm position-relative p-2 pb-3 h-100 d-flex flex-column">
                        <p className="font-bold pb-2 lh-1">{selectedTerritory}</p>
                        <div className="map-container w-100 flex-grow-1">
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
                            <div className="col-md-12 bg-white shadow-sm overflow-auto h-100">
                                {this.state.dataReady &&
                                    <HorizontalBarChart 
                                        data={this.state.regionData}
                                        title={barChartTitle}
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