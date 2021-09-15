import React, { Component } from 'react';

class EarnMoney extends Component {
  render() {
    return (
      <div id="myModalBalance" className="modal">
        <div className="modal-content">
          <span className="closeB">&times;</span>
            <h2>Are you sure you want to withdraw money from the smart contract?</h2>
            <p>Smart contract balance: {this.props.depositContract} ethers</p>
            {((this.props.depositContract-this.props.maximumAmount)<0) &&<p className="error_messsage">There aren't enough funds to extract</p>}
            <button id="cancel_balance">Cancel</button>
            <button disabled={((this.props.depositContract-this.props.maximumAmount)<0)} id="accept_balance" onClick={this.props.function}>Confirm</button>
        </div>
      </div>
    );
  }
}

export default EarnMoney;
