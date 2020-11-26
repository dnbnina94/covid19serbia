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
                upperVal: 45
            },
            {
                bottomVal: 45,
                upperVal: 65
            },
            {
                bottomVal: 65,
                upperVal: Infinity
            }
        ];

        const regions = serbiaGeo.features.map(f => {
            return f.properties.name;
        });
        // const regions = Array.from(new Set(this.props.data.map(d => d.region)));

        const self = this;
        const regionData = regions.map(r => {
            return {
                key: r,
                count: self.props.data.filter(d => {
                    return d.region.toLowerCase() === r.toLowerCase();
                }).reduce((acc, curr) => {
                    return acc + curr.data.length;
                }, 0),
                values: self.props.data.filter(d => {
                    return d.region.toLowerCase() === r.toLowerCase();
                }).reduce((acc, curr) => {
                    return acc.concat(curr.data);
                }, [])
            }
        });

        const pieChartData = pieChartFlags.map(f => {
            let value = regionData.reduce((acc, curr) => {
                return acc + curr.values.reduce((acc,curr) => {return acc + (curr.sex === f.flag ? 1 : 0)}, 0);
            },0)
            return {
                key: f.desc,
                value: value, 
                color: f.color
            }
        });

        const ageData = ageGroupFlags.map(f => {
            const value = regionData.reduce((acc, curr) => {
                return acc + curr.values.reduce((acc, curr) => {return acc + (curr.age >= f.bottomVal && curr.age < f.upperVal ? 1 : 0)}, 0);
            }, 0)
            return {
                key: `${f.bottomVal}${f.upperVal === Infinity ? '+' : '-'+f.upperVal}`,
                value: value
            }
        });

        this.state = {
            map: serbiaGeo.features,
            targetName: 'name',
            regionData: regionData,
            pieChartData: pieChartData,
            ageData: ageData
        }
    }

    componentDidMount() {
        
    }

    handleMapChange(p) {
        const regions = Array.from(new Set(this.props.data.filter(d => d.region === p.properties.name).map(d => d.district)));
        const self = this;
        const regionData = regions.map(r => {
            return {
                key: r,
                count: self.props.data.filter(d => {
                    return d.district.toLowerCase() === r.toLowerCase();
                }).reduce((acc, curr) => {
                    return acc + curr.data.length;
                }, 0),
                values: self.props.data.filter(d => {
                    return d.district.toLowerCase() === r.toLowerCase();
                }).reduce((acc, curr) => {
                    return acc.concat(curr.data);
                }, [])
            }
        });

        console.log(regionData)

        this.setState({
            map: serbiaGeoDistricts.features.filter(i => {
                    return p.properties.name === i.properties.NAME_1
            }),
            regionData: regionData,
            targetName: 'NAME_2'
        });
    }

    render() {
        return (
            <div className="MapWrapper row flex-grow-1">
                <div className="col-md-5">
                    <div className="bg-white shadow-sm position-relative p-2 pb-3 h-100 d-flex flex-column">
                        <p className="font-headline pb-2">Svi okruzi</p>
                        <div className="map-container w-100 flex-grow-1">
                            <Map 
                                data={this.state.regionData} 
                                geoData={this.state.map} 
                                geoDataTargetName={this.state.targetName}
                                colors={REGION_COLOR_SCHEME}
                                handleMapChange={this.handleMapChange} 
                            />
                        </div>
                    </div>
                </div>
                <div className="col-md-7">
                    <div className="grid-layout h-100">
                        <div className="row">
                            <div className="col-md-12 bg-white shadow-sm overflow-auto h-100">
                                <HorizontalBarChart 
                                    data={this.state.regionData}
                                    title="Broj obolelih po okruzima" 
                                />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-12 bg-white shadow-sm">
                                <p className="font-headline pt-2 lh-1">Broj obolelih prema polu i starosnim grupama</p>
                                <div className="row">
                                    <div className="col-md-5 pt-1 p-0">
                                        <PieChart 
                                            small={true}
                                            hideTitle={true}
                                            heightRatio={2}
                                            innerRadius={0.65} 
                                            data={this.state.pieChartData} 
                                        />
                                    </div>
                                    <div className="col-md-7">
                                        <BarChart data={this.state.ageData} />
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