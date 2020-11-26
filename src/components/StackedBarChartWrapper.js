import { Component } from "react";
import { 
    BROJ_PREMINULIH_MUSKARACA,
    BROJ_PREMINULIH_ZENA,
    BROJ_TESTIRANIH_LICA,
    BROJ_POZITIVNIH_LICA,
    UKUPAN_BR_POZITIVNIH_OD_POCETKA,
    BROJ_HOSPITALIZOVANIH_LICA,
    BROJ_LICA_NA_RESPIRATORU,
    UKUPAN_BR_TESTIRANIH_OD_POCETKA,
    BROJ_PREMINULIH_LICA,
    UKUPAN_BR_PREMINULIH_OD_POCETKA,
    UKUPAN_BR_IZLECENIH_OD_POCETKA
} from "../consts";
import StackedBarChart from "./StackedBarChart";
import Options from "./Options";

class StackedBarChartWrapper extends Component {
    constructor(props) {
        super(props);

        this.state = {
            flags: [  
                {
                    flag: BROJ_POZITIVNIH_LICA,
                    checked: true
                },
                {
                    flag: BROJ_TESTIRANIH_LICA,
                    checked: true
                },
                {
                    flag: BROJ_HOSPITALIZOVANIH_LICA,
                    checked: false
                },
                {
                    flag: BROJ_LICA_NA_RESPIRATORU,
                    checked: false
                },
                {
                    flag: BROJ_PREMINULIH_LICA,
                    checked: false
                },
                {
                    flag: UKUPAN_BR_POZITIVNIH_OD_POCETKA,
                    checked: false
                },
                {
                    flag: UKUPAN_BR_TESTIRANIH_OD_POCETKA,
                    checked: false
                },
                {
                    flag: UKUPAN_BR_PREMINULIH_OD_POCETKA,
                    checked: false
                },
                {
                    flag: UKUPAN_BR_IZLECENIH_OD_POCETKA,
                    checked: false
                },
                {
                    flag: BROJ_PREMINULIH_ZENA,
                    checked: false
                },
                {
                    flag: BROJ_PREMINULIH_MUSKARACA,
                    checked: false
                }
            ],
            dataToShow: -60,
        }

        this.onChangeHandler = this.onChangeHandler.bind(this);
    }

    onChangeHandler(index) {
        this.setState(state => {
            return {
                ...state,
                flags: state.flags.map((f,i) => {
                    return {
                        ...f,
                        checked: i === index ? !f.checked : f.checked
                    }
                })
            }
        });
    }

    render() {
        
        const allFlagsLabels = this.state.flags.map(f => f.flag);
        const checkedFlags = this.state.flags.filter(f => f.checked);
        const checkedFlagsLabels = checkedFlags.map(f => f.flag);
        const checkedFlagsValues = this.state.flags.map(f => f.checked);

        let parsedData = [];
        const filteredData = this.props.data.filter(item => {
            return checkedFlagsLabels.includes(item.description);
        });
        let dates = [];
        filteredData.forEach(item => {
            dates = dates.concat(item.data.map(d => d.date));
        })
        dates.sort((a,b) => {
            const aDate = new Date(a);
            const bDate = new Date(b);
            return aDate < bDate ? -1 : 1;
        });
        dates = Array.from(new Set(dates)).slice(this.state.dataToShow);
        dates.forEach(date => {
            let newParsedObj = {};
            newParsedObj.date = date;
            newParsedObj.values = [];
            filteredData.forEach(fd => {
                let val = fd.data.find(d => d.date === date);
                if (val) {
                    newParsedObj.values.push({
                        key: fd.description,
                        value: val.value
                    });
                }
            });
            newParsedObj.values.sort((a,b) => {
                const aIndex = checkedFlagsLabels.indexOf(a.key);
                const bIndex = checkedFlagsLabels.indexOf(b.key);
                return aIndex < bIndex ? -1 : 1;
            });
            parsedData.push(newParsedObj);
        });

        return (
            <div className="StackedBarChartWrapper row mt-4">
                <div className="col-md-4">
                    <div className="overflow-auto position-relative h-100">
                        <div className="bg-white shadow-sm p-2 position-absolute">
                            <Options
                                options={allFlagsLabels}
                                current={checkedFlagsValues}
                                type="checkbox"
                                onChangeHandler={this.onChangeHandler}
                            />
                        </div>
                    </div>                 
                </div>
                <div className="col-md-8">
                    <StackedBarChart data={parsedData} flags={this.state.flags} />
                </div>
            </div>
        );
    }
}

export default StackedBarChartWrapper;