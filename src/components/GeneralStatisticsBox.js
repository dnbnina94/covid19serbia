import { Component } from "react";
import { ReactComponent as Coronavirus } from '../img/svg/coronavirus.svg';
import { ReactComponent as Respirator } from '../img/svg/respirator.svg';
import { ReactComponent as Skull } from '../img/svg/skull.svg';
import '../css/GeneralStatisticsBox.scss';
import { formatTitle } from "../utilities";

const svgComponents = {
    coronavirus: Coronavirus,
    respirator: Respirator,
    skull: Skull
};

class GeneralStatisticsBox extends Component {
    constructor(props) {
        super(props);

        this.state = {
            speed: 100,
            value: 0
        }
    }

    componentDidMount() {
        const self = this;

        const inc = +this.props.value / +this.state.speed;

        const updateCounter = () => {
            if (self.state.value < self.props.value) {
                self.setState((state) => {
                    return {
                        value: state.value + inc
                    }
                });
                setTimeout(updateCounter, 1);
            } else {
                self.setState({
                    value: self.props.value
                })
            }
        }

        updateCounter();
    }

    render() {
        const classes = `holder h-100 position-relative bg-${this.props.bg} border-radius-1 p-2`;
        const Icon = svgComponents[this.props.icon];
        let prevDescription = `
            ${this.props.value > this.props.prevValue ? 'više' : 'manje'} 
            u odnosu na juče
        `;

        return (
            <div className="GeneralStatisticsBox col-md-4 px-1 color-white">
                <div className={classes}>
                    <p className="mb-1">{formatTitle(this.props.description)}</p>
                    <h2 id="asdf" className="font-bold">
                        {/* {this.props.value} */}
                        {Math.trunc(this.state.value)}
                    </h2>
                    <p className="mt-1">
                        <span>za </span>
                        <b>{Math.abs(this.props.value - this.props.prevValue)}</b>
                        <span>{prevDescription}</span>
                    </p>
                    <Icon className="statistics-box-icon" />
                </div>
            </div>
        )
    }
}

export default GeneralStatisticsBox;