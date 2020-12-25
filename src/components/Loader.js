import { Component } from 'react';
import '../css/Loader.scss';

class Loader extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="Loader d-flex align-items-center justify-content-center">
                <div className="loader-inner">Loading...</div>
            </div>
        )
    }
}

export default Loader;