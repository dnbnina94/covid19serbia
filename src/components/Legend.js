import { Component } from "react";
import { BEZ_PODATAKA, COLOR_SCHEME } from "../consts";
import { formatTitle } from "../utilities";
import '../css/Legend.scss';

class Legend extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        let date = '';
        if (this.props.date) {
            const year = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(this.props.date);
            const month = new Intl.DateTimeFormat('en', { month: 'short' }).format(this.props.date);
            const day = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(this.props.date);

            date = `${day}. ${month} ${year}`;
        }
        const flags = this.props.flags.map((key, index) => {
            if (key.checked) {
                const value = this.props.values && this.props.values.find(v => v.key === key.flag);
            const colorLegendStyle = {
                backgroundColor: COLOR_SCHEME[index]
            };
            return (
                <div className="d-flex align-items-center justfy-content-center" key={key.flag}>
                    <div className="color-label" style={colorLegendStyle}></div>
                    <div className="pl-1 flex-grow-1">
                        {formatTitle(key.flag)}
                        {this.props.values ? <span>: </span> : ''}
                        {this.props.values ? <b>{value ? value.y1 : BEZ_PODATAKA}</b> : ''}
                    </div>
                </div>
            );
            }
        })
        return (
            <div className="Legend px-1 py-2 p-md-1">
                {date}
                {flags}
            </div>
        );
    }
}

export default Legend;