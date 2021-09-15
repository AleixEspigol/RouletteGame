import React, { Component } from 'react';

class PlaceBets extends Component {
  render() {
    const listBets = this.props.bets.map((bet) =>
      <p key={bet.betType}>{bet.betAmount/1000000000000000000} ethers {this.props.sintaxis(bet.betType, bet.number)}</p>
    );
    return (
      <div className="header">
        <h2>PLACE YOUR BETS</h2>
        <h4 id="minBet">Minimum bet: {this.props.minBet} ethers</h4>
        <h4 id="maxBet">Maximum bet: {this.props.maxBet} ethers</h4>
        {this.props.isManager === true && <img id="settings" src="settings.png" height="15" alt="paramsSettings" onClick={this.props.function}/>}
        <h4>YOUR BETS:</h4>
        {listBets}
      </div>
    );
  }
}

export default PlaceBets;
