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

    componentDidUpdate(prevProps) {
        const self = this;
        if (prevProps.value !== this.props.value) {
            this.setState({
                value: 0
            })
            process.nextTick(() => {
                self.updateCounter();
            }) 
        }
    }

    render() {
        const classes = `holder ${this.props.borderRadius ? '' : 'holder-ambulances'} h-100 position-relative bg-${this.props.bg} border-radius-1 p-5 p-md-2`;
        const Icon = svgComponents[this.props.icon];
        const InfoText = this.props.infoText;
        return (
            <div className={`GeneralStatisticsBox color-white ${this.props.borderRadius ? 'mb-5' : ''} mb-md-0`}>
                <div className={classes}>
                    {
                        this.props.description &&
                        <p className={`${this.props.borderRadius ? 'mb-1' : 'mb-2 mb-md-1 general-box-2-title'}`}>{this.props.description}</p>
                    }
                    <h2 className="font-bold">
                        {/* {this.props.value} */}
                        {Math.trunc(this.state.value)}
                    </h2>
                    {this.props.infoText && 
                        <p className="mt-1">
                            <InfoText />
                        </p>
                    }
                    {Icon &&
                        <Icon className="statistics-box-icon" />
                    }
                </div>
            </div>
        )
    }
}

export default GeneralStatisticsBox;