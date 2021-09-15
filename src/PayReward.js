import React, { Component } from 'react';

class PayReward extends Component {
  render() {
    return (
      <div id="myModalEarn" className="modal">
        <div className="modal-content">
          <span className="closeE">&times;</span>
            <h2>Are you sure you want to withdraw {this.props.totalAmount} ethers?</h2>
            {(this.props.amountEarned<=0) && <p className="error_messsage">There aren't enough funds to extract</p>}
            <button id="cancel_earn">Cancel</button>
            <button disabled={(this.props.totalAmount<=0)} id="accept_earn" onClick={this.props.function}>Confirm</button>
        </div>
      </div>
    );
  }
}

export default PayReward;
