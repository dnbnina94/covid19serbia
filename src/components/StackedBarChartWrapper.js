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

        const self = this;

        let flags = [
            BROJ_POZITIVNIH_LICA,
            BROJ_TESTIRANIH_LICA,
            BROJ_HOSPITALIZOVANIH_LICA,
            BROJ_LICA_NA_RESPIRATORU,
            BROJ_PREMINULIH_LICA,
            UKUPAN_BR_POZITIVNIH_OD_POCETKA,
            UKUPAN_BR_TESTIRANIH_OD_POCETKA,
            UKUPAN_BR_PREMINULIH_OD_POCETKA,
            UKUPAN_BR_IZLECENIH_OD_POCETKA,
            BROJ_PREMINULIH_ZENA,
            BROJ_PREMINULIH_MUSKARACA
        ];
        const filteredData = this.props.data.filter(item => {
            return flags.includes(item.description);
        });

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

        let parsedData = [];

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
                const aIndex = flags.indexOf(a.key);
                const bIndex = flags.indexOf(b.key);
                return aIndex < bIndex ? -1 : 1;
            });
            parsedData.push(newParsedObj);
        });

        const endDate = new Date(maxDate);
        let startDate = new Date(endDate.valueOf());
        startDate.setDate(startDate.getDate() - 60);

        this.state = {
            flags: flags.map((f,i) => {
                return {
                    flag: f,
                    checked: i === 0 || i === 1
                }
            }),
            dataToShow: -60,
            dates: dates,
            data: parsedData,
            minDate: minDate,
            maxDate: maxDate,
            startDate: startDate,
            endDate: endDate
        }

        this.onChangeHandler = this.onChangeHandler.bind(this);
        this.dateChangeHandler = this.dateChangeHandler.bind(this);
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

    dateChangeHandler(date1, date2) {
        this.setState({
            startDate: date1,
            endDate: date2
        })
    }

    render() {
        const self = this;

        const allFlagsLabels = this.state.flags.map(f => f.flag);
        const checkedFlags = this.state.flags.filter(f => f.checked);
        const checkedFlagsLabels = checkedFlags.map(f => f.flag);
        const checkedFlagsValues = this.state.flags.map(f => f.checked);

        const dates = this.state.dates.filter(d => {
            const date = new Date(d);
            return date >= self.state.startDate && date <= self.state.endDate;
        });
        let data = this.state.data.filter(pd => {
            return dates.includes(pd.date);
        }).map(pd => {
            return {
                ...pd,
                values: pd.values.filter(v => {
                    return checkedFlagsLabels.includes(v.key);
                })
            }
        });

        return (
            <div className="StackedBarChartWrapper row mt-4">
                <div className="col-md-4">
                    <div className="bg-white shadow-sm overflow-auto position-relative h-100 border-radius-1">
                        <div className="p-2 position-absolute">
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
                    <StackedBarChart 
                        data={data} 
                        flags={this.state.flags}
                        minDate={this.state.minDate}
                        maxDate={this.state.maxDate}
                        startDate={this.state.startDate}
                        endDate={this.state.endDate}
                        dateChangeHandler={this.dateChangeHandler}
                    />
                </div>
            </div>
        );
    }
}

export default StackedBarChartWrapper;