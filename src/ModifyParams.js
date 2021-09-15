import React, { Component } from 'react';

class ModifyParams extends Component {

  handleSubmit(event) {
    event.preventDefault();
    this.props.function();
  }

  handleChange(event) {
    if(event.target.id === "min_bet"){
      this.props.update(event.target.value,1);
    } else {
      this.props.update(event.target.value,2)
    }
  }

  render() {
    return (
      <div id="myModalChangeParams" className="modal">
        <div className="modal-content">
          <span className="closeP">&times;</span>
            <h2>Modification of parameters</h2>
            <form onSubmit={this.handleSubmit.bind(this)}>
              <p>Minimum bet: <input type="number" id="min_bet" min="0.1" max="5" step="0.1" onChange={this.handleChange.bind(this)} required></input> ethers</p>
              <p>Maximum bet: <input type="number" id="max_bet" min="1" max="10" step="0.1" onChange={this.handleChange.bind(this)} required></input> ethers</p>
              <button id="cancel_params">Cancel</button>
              <input type="submit" value="Confirm"></input>
            </form>
        </div>
      </div>
    );
  }
}

export default ModifyParams;
