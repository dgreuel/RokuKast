import React, { Component } from "react";

type Props = {
    ipAddress: string
}

type State = {
    ipAddress: string
}

export class Options extends Component<Props, State> {

    constructor(props) {
        super(props);
        this.state = {
            ipAddress: props.ipAddress
        }
        this.handleSave = this.handleSave.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
    }

    handleSave() {
        console.log(`Saving IP Address: ${this.state.ipAddress}`);
        localStorage['ipAddress'] = this.state.ipAddress;
    }

    handleInputChange = (e) => {
        this.setState({ipAddress: e.target.value});
    }

    render() {
        const state = this.state;
        return (
            <div>
                <form className="center-block text-center padding-top-lg input-group">
                    <p>
                        <label htmlFor="ip_address">... or enter an IP address manually</label>
                        <input type="text" className="text-center input-medium" value={state.ipAddress} onChange={this.handleInputChange}/>
                    </p>
                </form>
                <div className="status hidden" id="status">Options saved.</div>
                <div className="settingsbuttons">
                    <button className="btn btn-default btn-sm" onClick={this.handleSave}>
                        <i className="fa fa-save"></i> Save
                    </button>
                    <a className="btn btn-default btn-sm" href="popup.html">
                        <i className="fa fa-arrow-left"></i> Go back
                    </a>
                </div>
            </div>
        )
    }
}

export default Options;