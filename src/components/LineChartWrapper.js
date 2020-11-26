import { Component } from "react";
import LineChart from '../components/LineChart';
import Options from "./Options";

class LineChartWrapper extends Component {
    constructor(props) {
        super(props);

        this.state = {
            currentData: 0
        };

        this.onChangeHandler = this.onChangeHandler.bind(this);
    }

    onChangeHandler(index) {
        this.setState({
            currentData: index
        });
    }

    render() {
        return (
            <div className="LineChartWrapper row mt-4">
                <div className="col-md-8">
                    {this.props.data.length !== 0 && 
                        <LineChart 
                            data={this.props.data[this.state.currentData].data} 
                            title={this.props.data[this.state.currentData].description} 
                        />
                    }
                </div>
                <div className="col-md-4">
                    <div className="position-relative overflow-auto h-100">
                        <div className="bg-white shadow-sm p-2 position-absolute">
                            <Options
                                options={this.props.data.map(item => item.description)}
                                current={this.state.currentData}
                                type="radio"
                                onChangeHandler={this.onChangeHandler}
                            />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default LineChartWrapper;