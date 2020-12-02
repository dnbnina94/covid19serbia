import { Component } from "react";
import { ReactComponent as Coronavirus } from '../img/svg/coronavirus.svg';
import { ReactComponent as Respirator } from '../img/svg/respirator.svg';
import { ReactComponent as Skull } from '../img/svg/skull.svg';
import { ReactComponent as Cross } from '../img/svg/cross.svg';
import '../css/GeneralStatisticsBox.scss';
import { formatTitle } from "../utilities";

const svgComponents = {
    coronavirus: Coronavirus,
    respirator: Respirator,
    skull: Skull,
    cross: Cross
};

class GeneralStatisticsBox extends Component {
    constructor(props) {
        super(props);

        this.state = {
            speed: 100,
            value: 0
        }

        this.updateCounter = this.updateCounter.bind(this);
    }

    updateCounter() {
        const inc = +this.props.value / +this.state.speed;
        if (this.state.value < this.props.value) {
            this.setState((state) => {
                return {
                    value: state.value + inc,
                    countTimeout: setTimeout(this.updateCounter, 1)
                }
            });
        } else {
            this.setState({
                value: this.props.value
            })
        }
    }

    componentDidMount() {
        this.updateCounter();
    }

    componentWillUnmount() {
        clearTimeout(this.state.countTimeout);
    }

    render() {
        const classes = `holder h-100 position-relative bg-${this.props.bg} ${this.props.borderRadius ? 'border-radius-1' : ''} p-2`;
        const Icon = svgComponents[this.props.icon];
        let prevDescription = `
            ${this.props.value > this.props.prevValue ? 'više' : 'manje'} 
            u odnosu na juče
        `;

        return (
            <div className="GeneralStatisticsBox color-white">
                <div className={classes}>
                    <p className="mb-1">{this.props.description}</p>
                    <h2 id="asdf" className="font-bold">
                        {/* {this.props.value} */}
                        {Math.trunc(this.state.value)}
                    </h2>
                    {this.props.prevValue && 
                        <p className="mt-1">
                            <span>za </span>
                            <b>{Math.abs(this.props.value - this.props.prevValue)}</b>
                            <span>{prevDescription}</span>
                        </p>
                    }
                    <Icon className="statistics-box-icon" />
                </div>
            </div>
        )
    }
}

export default GeneralStatisticsBox;