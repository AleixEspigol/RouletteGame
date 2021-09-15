import React, { Component } from 'react';

class MakeBet extends Component {

  handleSubmit(event) {
    event.preventDefault();
    this.props.function();
  }

  handleChange(event) {
    this.props.update(event.target.value,0)
  }

  render() {
    return (
      <div id="myModal" className="modal">
        <div className="modal-content">
          <span className="close">&times;</span>
            <h2>How much do you want to bet on {this.props.betText}?</h2>
            <form onSubmit={this.handleSubmit.bind(this)}>
              <p><input type="number" id="bet_amount" min={this.props.minBet} max={this.props.maxBet} step="0.1" onChange={this.handleChange.bind(this)} required></input> ethers</p>
              <button id="cancel_bet">Cancel</button>
              <input type="submit" value="Confirm"></input>
            </form>
        </div>
      </div>
    );
  }
}

export default MakeBet;
