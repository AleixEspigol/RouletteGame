import React, { Component } from 'react';

class Spin extends Component {
  render() {
    return (
      <div id="myModalSpin" className="modal">
        <div className="modal-content">
          <span className="closeS">&times;</span>
            <h2>Are you sure you want to spin the roulette?</h2>
            <button id="cancel_spin">Cancel</button>
            <button id="accept_spin" onClick={this.props.function}>Confirm</button>
        </div>
      </div>
    );
  }
}

export default Spin;
