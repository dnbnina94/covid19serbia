import { Component } from "react";
import { 
    BROJ_PREMINULIH_MUSKARACA, 
    BROJ_PREMINULIH_ZENA, 
    UKUPAN_BR_POZITIVNIH_OD_POCETKA, 
    UKUPAN_BR_PREMINULIH_OD_POCETKA, 
    UKUPAN_BR_TESTIRANIH_OD_POCETKA,
    BR_TESTIRANIH_LICA_SHORT, 
    BR_POZITIVNIH_LICA_SHORT,
    BR_PREMINULIH_ZENA_SHORT,
    BR_PREMINULIH_MUSKARACA_SHORT,
    BR_PREMINULIH_LICA_SHORT
} from "../consts";
import PieChart from "./PieChart";

class PieChartWrapper extends Component {
    constructor(props) {
        super(props);

        const flags = [
            {
                count: false,
                flags: [
                    {
                        flag: UKUPAN_BR_TESTIRANIH_OD_POCETKA,
                        desc:  BR_TESTIRANIH_LICA_SHORT,
                        color: '#3182BD'
                    },
                    {
                        flag: UKUPAN_BR_POZITIVNIH_OD_POCETKA,
                        desc: BR_POZITIVNIH_LICA_SHORT,
                        color: '#9ECAE1'
                    }
                ]
            },
            {
                count: false,
                flags: [
                    {
                        flag: UKUPAN_BR_POZITIVNIH_OD_POCETKA,
                        desc: BR_POZITIVNIH_LICA_SHORT,
                        color: "#FD8D3C" 
                    }, 
                    {
                        flag: UKUPAN_BR_PREMINULIH_OD_POCETKA,
                        desc: BR_PREMINULIH_LICA_SHORT,
                        color: "#FDD0A2"
                    }
                ]
            },
            {
                count: true,
                flags: [
                    {
                        flag: BROJ_PREMINULIH_ZENA,
                        desc: BR_PREMINULIH_ZENA_SHORT,
                        color: "#BCBDDC"
                    },
                    {
                        flag: BROJ_PREMINULIH_MUSKARACA,
                        desc: BR_PREMINULIH_MUSKARACA_SHORT,
                        color: "#756BB1"
                    }
                ]
            }
        ];

        let data = [];
        flags.forEach(flag => {
            data.push(
                this.props.data.filter(d => {
                    return flag.flags.map(f => f.flag).includes(d.description);
                }).map(d => {
                    const value = flag.count ? 
                                  d.data.reduce((acc, curr) => {
                                    return acc + curr.value
                                  },0) :
                                  d.data[d.data.length-1].value;
                    const f = flag.flags.find(f => f.flag === d.description);
                    return {
                        key: f.desc,
                        value: value,
                        color: f.color
                    }
                })
            )
        });

        this.state = {
            data: data
        }
    }

    componentDidMount() {
    }

    render() {
        const pieCharts = this.state.data.map((d,i) => {
            return (
                <div className="col-md-4" key={i}>
                    <div className="bg-white shadow-sm h-100">
                        <PieChart heightRatio={1.7} innerRadius={0.65} data={d} />
                    </div>
                </div>
            );
        })
        return (
            <div className="PieChartWrapper row mt-4">
                {pieCharts}
            </div>
        )
    }
}

export default PieChartWrapper;