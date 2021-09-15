import React, { Component } from 'react';

class WinningNumbers extends Component {

  render() {
    let lastWinners;
    if(this.props.winningNumbers.length-5 > 0){
      lastWinners = this.props.winningNumbers.slice(this.props.winningNumbers.length-5);
    } else {
      lastWinners = this.props.winningNumbers;
    }
    const listWinners = lastWinners.map((number) =>
      <tr key={number.toString()}>
        <td key={number.toString()} className={this.props.colorNumbers(number)}>
          <div key={number.toString()}>{number}</div>
        </td>
      </tr>
    );
    return (
      <div className="recentNumbers">
        <table className="winningNumbers">
          <tbody>
            <tr><td>Last Winning Numbers</td></tr>
            {listWinners}
          </tbody>
        </table>
      </div>
    );
  }
}

export default WinningNumbers;
