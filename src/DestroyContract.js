import React, { Component } from 'react';

class DestroyContract extends Component {
  render() {
    return (
      <div id="myModalDestroy" className="modal">
        <div className="modal-content">
          <span className="closeD">&times;</span>
            <h2>Are you sure you want to destroy the smart contract?</h2>
            <button id="cancel_destroy">Cancel</button>
            <button id="accept_destroy" onClick={this.props.function}>Confirm</button>
        </div>
      </div>
    );
  }
}

export default DestroyContract;
