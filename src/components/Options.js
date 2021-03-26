import { Component } from "react";
import { formatTitle } from "../utilities";
import "../css/Options.scss";
import { COLOR_SCHEME } from "../consts";

class Options extends Component {
    constructor(props) {
        super(props);

        this.onChange = this.onChange.bind(this);
    }

    onChange(event) {
        this.props.onChangeHandler(+event.target.value);
    }

    render() {
        const options = this.props.options.map((title, index) => {
            const checkmarkClass = `
                                    checkmark 
                                    ${this.props.type === 'radio' ? 'checkmark-radio' : 'checkmark-checkbox'}
                                   `;
            let checkmarkStyle = {};
            if (this.props.type === "checkbox") {
                checkmarkStyle.backgroundColor = this.props.current[index] ? COLOR_SCHEME[index] : '';
            }
            return (
                <li className={`list-group-item border-0 px-0 pt-0 ${index === this.props.options.length-1 ? 'pb-0' : 'pb-2 pb-md-1'}`} key={title + this.props.type}>
                    <label className="custom-input">
                        {this.props.type === "radio" && 
                            <input 
                                type="radio" 
                                name="option" 
                                value={index}
                                checked={this.props.current === index}
                                onChange={this.onChange}
                            />}
                        {this.props.type === "checkbox" && 
                            <input 
                                type="checkbox" 
                                name="option" 
                                value={index}
                                checked={this.props.current[index]}
                                onChange={this.onChange}
                            />
                        }
                        <span className={checkmarkClass} style={checkmarkStyle}></span>
                        <span className="pl-4 pl-md-2 label">{formatTitle(title)}</span>
                    </label>
                </li>
            )
        });

        return (
            <div className="Options">
                <ul className="list-group">
                    {options}
                </ul>
            </div>
        )
    }
}

export default Options;