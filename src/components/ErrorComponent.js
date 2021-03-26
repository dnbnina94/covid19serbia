import { Component } from 'react';
// import { ReactComponent as Ie } from '../img/ie.png';
import "../css/ErrorComponent.scss";

class ErrorComponent extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="ErrorComponent">
                <div className="d-flex flex-column align-items-center text-center">
                    <img className="error-component-img" src={this.props.img} />
                    <p className="error-component-main-title font-bold py-5 py-md-1">{this.props.mainText}</p>
                    <p className="error-component-sub-title">{this.props.subText}</p>
                </div>
            </div>
        )
    }
}

export default ErrorComponent;