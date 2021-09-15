import React, { Component } from 'react';

class TransactionMessage extends Component {
  render() {
    return (
      <div id="myModalM" className="modal">
        <div className="modal-content">
          <span className="closeM">&times;</span>
            <h2>{this.props.text}</h2>
        </div>
      </div>
    );
  }
}

export default TransactionMessage;
