import React, { Component } from 'react';
import roulette from './roulette.js';
import Web3 from 'web3';
import WinningNumbers from './WinningNumbers.js';
import MakeBet from './MakeBet.js';
import ModifyParams from './ModifyParams.js';
import PlaceBets from './PlaceBets.js';
import Spin from './Spin.js';

class RouletteTable extends Component {
  constructor(props){
    super(props);
    this.state = {
      betNumber: 0,
      betText: '',
      typeBet: null,
      showNumber : false,
      amountEarned: 0,
      betAmount : 0,
      minBet : 0,
      maxBet : 0,
      winner : false,
    }
    this.updateParams = this.updateParams.bind(this);
    this.bet = this.bet.bind(this);
    this.modifyParams = this.modifyParams.bind(this);
    this.spin = this.spin.bind(this);
    this.colorNumbers = this.colorNumbers.bind(this);
    this.betSintaxis = this.betSintaxis.bind(this);
  }

  async componentDidUpdate(prevProps) {
    const web3 = new Web3(window.ethereum);
    var actualAmount = await roulette.methods.winners(this.props.account).call();
    var actualNumber = await roulette.methods.winningNumber().call();
    let result = Number(web3.utils.toWei(this.props.totalAmount.toString(), 'ether'));
    let amountWinned = actualAmount-result;
    if(Number(web3.utils.fromWei(actualAmount)) > this.props.totalAmount){
      this.setState({winner: true, amountEarned: Number(web3.utils.fromWei(amountWinned.toString()))});
      if(this.state.winner === true){
        var text = `CONGRATULATION YOU WIN ${this.state.amountEarned} ethers!`;
        document.getElementById("myModalM").style.display = "none";
        this.props.update(text, 0, Number(web3.utils.fromWei(actualAmount)));
        this.props.update(text, 1, actualNumber);
        this.props.function("myModalM","closeM","");
      }
    } else if((this.props.winningNumber != actualNumber) && (this.state.winner === false) && (prevProps.winningNumber != null) && (Number(web3.utils.fromWei(actualAmount)) === this.props.totalAmount)){
      document.getElementById("myModalM").style.display = "none";
      this.props.update("Oh you have lost... try and see if you have more luck next time!",1,actualNumber);
      this.props.function("myModalM","closeM","");
    }
  }

  updateParams(params,type) {
    if(type === 0){
      this.setState({ betAmount: params});
    } else if (type === 1) {
      this.setState({ minBet: params});
    } else {
      this.setState({ maxBet: params});
    }
  }

  bet() {
    document.getElementById("myModal").style.display = "none";
    this.props.update("Loading...");
    this.props.function("myModalM","closeM","");
    var self=this;
    var betAmount = this.state.betAmount*1000000000000000000;
    roulette.methods.bet(this.state.typeBet, this.state.betNumber, betAmount.toString()).send({from: this.props.account, value: betAmount})
    .on('receipt', function(receipt){
      const web3 = new Web3(window.ethereum);
      roulette.methods.necessaryBalance().call().then(function(number){
        document.getElementById("myModalM").style.display = "none";
        var actualNecessaryBalance = Number(web3.utils.fromWei(number));
        if(self.props.necessaryBalance <= self.props.depositContract && self.props.necessaryBalance != actualNecessaryBalance){
          self.props.update("The transaction completed successfully");
          self.props.function("myModalM","closeM","");
        } else {
          self.props.update("There aren't enough funds to accept the transaction");
          self.props.function("myModalM","closeM","");
        }
      });
    })
    .on('error', function(error, receipt) {
      document.getElementById("myModalM").style.display = "none";
      self.props.update("The transaction wasn't completed successfully");
      self.props.function("myModalM","closeM","");
    });
    roulette.events.needMoney()
    .on('data', async function(event){
      self.props.needMoney(event.returnValues.balance);
    });
  }

  modifyParams() {
    document.getElementById("myModalChangeParams").style.display = "none";
    this.props.update("Loading...");
    this.props.function("myModalM","closeM","");
    var self=this;
    var maxBet = this.state.maxBet*1000000000000000000;
    var minBet = this.state.minBet*1000000000000000000;
    roulette.methods.setBettingSettings(maxBet.toString(), minBet.toString()).send({ from: this.props.account })
    .on('receipt', function(receipt){
      document.getElementById("myModalM").style.display = "none";
      self.props.update("The transaction completed successfully");
      self.props.function("myModalM","closeM","");
    })
    .on('error', function(error, receipt) {
      document.getElementById("myModalM").style.display = "none";
      self.props.update("The transaction wasn't completed successfully");
      self.props.function("myModalM","closeM","");
    });
  }

  calculateRandomNumber() {
    this.props.update("Loading...");
    this.props.function("myModalM","closeM","");
    var self=this;
    roulette.methods.calculateRandomNumber().send({ from: this.props.account, gas: '200000' })
    .on('receipt', function(receipt){
      document.getElementById("myModalM").style.display = "none";
      self.props.function("myModalSpin","closeS","cancel_spin");
    })
    .on('error', function(error, receipt) {
      document.getElementById("myModalSpin").style.display = "none";
      self.props.update("The transaction wasn't completed successfully");
      self.props.function("myModalM","closeM","");
    });
  }

  spin() {
    document.getElementById("myModalSpin").style.display = "none";
    this.props.update("Loading...");
    this.props.function("myModalM","closeM","");
    var self=this;
    roulette.methods.spin().send({ from: this.props.account, gas: '700000' })
    .on('receipt', function(receipt){
      document.getElementById("myModalM").style.display = "none";
      self.props.update("The transaction completed successfully");
      self.props.function("myModalM","closeM","");
      self.setState({showNumber:true, winner:false});
    })
    .on('error', function(error, receipt) {
      document.getElementById("myModalM").style.display = "none";
      self.props.update("The transaction wasn't completed successfully");
      self.props.function("myModalM","closeM","");
    });
  }

  showBet(textNumber, number, typeBet) {
    this.setState({betText: textNumber, betNumber: number, typeBet: typeBet});
    this.props.function("myModal","close","cancel_bet")
  }

  colorNumbers(number){
    if(number == 0){
      return "green";
    }
    if ((number >= 1 && number <= 10) || (number >= 20 && number <= 28) || number == 19) {
        if(number % 2 === 1){
          return "red";
        } else {
          return "black";
        }
    } else {
        if(number % 2 === 0){
          return "red";
        } else {
          return "black";
        }
    }
  }

  betSintaxis(betType, number){
    if(betType === "0"){
      return "on number "+number;
    } else if(betType === "1"){
      if(number === "0"){
        return "on Even number";
      } else {
        return "on Odd number";
      }
    } else{
      if(number === "0"){
        return "on Red number";
      } else {
        return "on Black number";
      }
    }
  }

  render() {
    const divStyle = {
      background: this.colorNumbers(this.props.winningNumber),
    };
    return (
      <div className="tableRoulette">
        <PlaceBets
          sintaxis={this.betSintaxis}
          bets={this.props.bets}
          minBet={this.props.minBet}
          maxBet={this.props.maxBet}
          isManager={this.props.isManager}
          function={this.props.function.bind(this,"myModalChangeParams","closeP","cancel_params")}>
        </PlaceBets>
      	<div className="betsTable">
          <table  border="0" cellSpacing="0" cellPadding="0">
            <tbody>
          	 <tr>
          	  <td rowSpan="4">
                <img id="roulette" src="roulette.png" alt="roulette"/>
                {(this.state.showNumber === true)&& <div className="winnerNumber" style={divStyle}>{this.props.winningNumber}</div>}</td>
              <td className="zb" rowSpan="5"><div></div></td>
          		<td rowSpan="3" id="zero" onClick={this.showBet.bind(this,"number 0", 0, 0)}><div>0</div></td>
          		<td className="red" onClick={this.showBet.bind(this,"number 3", 3, 0)}><div>3</div></td>
          		<td className="black" onClick={this.showBet.bind(this,"number 6", 6, 0)}><div>6</div></td>
          		<td className="red" onClick={this.showBet.bind(this,"number 9", 9, 0)}><div>9</div></td>
          		<td className="red" onClick={this.showBet.bind(this,"number 12", 12, 0)}><div>12</div></td>
          		<td className="black" onClick={this.showBet.bind(this,"number 15", 15, 0)}><div>15</div></td>
          		<td className="red" onClick={this.showBet.bind(this,"number 18", 18, 0)}><div>18</div></td>
          		<td className="red" onClick={this.showBet.bind(this,"number 21", 21, 0)}><div>21</div></td>
          		<td className="black" onClick={this.showBet.bind(this,"number 24", 24, 0)}><div>24</div></td>
          		<td className="red" onClick={this.showBet.bind(this,"number 27", 27, 0)}><div>27</div></td>
          		<td className="red" onClick={this.showBet.bind(this,"number 30", 30, 0)}><div>30</div></td>
          		<td className="black" onClick={this.showBet.bind(this,"number 33", 33, 0)}><div>33</div></td>
          		<td className="red" onClick={this.showBet.bind(this,"number 36", 36, 0)}><div>36</div></td>
          	</tr>
          	<tr>
          	  <td className="black" onClick={this.showBet.bind(this,"number 2", 2, 0)}><div>2</div></td>
          	  <td className="red" onClick={this.showBet.bind(this,"number 5", 5, 0)}><div>5</div></td>
          		<td className="black" onClick={this.showBet.bind(this,"number 8", 8, 0)}><div>8</div></td>
          		<td className="black" onClick={this.showBet.bind(this,"number 11", 11, 0)}><div>11</div></td>
          		<td className="red" onClick={this.showBet.bind(this,"number 14", 14, 0)}><div>14</div></td>
          		<td className="black" onClick={this.showBet.bind(this,"number 17", 17, 0)}><div>17</div></td>
          		<td className="black" onClick={this.showBet.bind(this,"number 20", 20, 0)}><div>20</div></td>
          		<td className="red" onClick={this.showBet.bind(this,"number 23", 23, 0)}><div>23</div></td>
          		<td className="black" onClick={this.showBet.bind(this,"number 26", 26, 0)}><div>26</div></td>
          		<td className="black" onClick={this.showBet.bind(this,"number 29", 29, 0)}><div>29</div></td>
          		<td className="red" onClick={this.showBet.bind(this,"number 32", 32, 0)}><div>32</div></td>
          		<td className="black" onClick={this.showBet.bind(this,"number 35", 35, 0)}><div>35</div></td>
          	</tr>
          	<tr>
          	  <td className="red" onClick={this.showBet.bind(this,"number 1", 1, 0)}><div>1</div></td>
          		<td className="black" onClick={this.showBet.bind(this,"number 4", 4, 0)}><div>4</div></td>
          		<td className="red" onClick={this.showBet.bind(this,"number 7", 7, 0)}><div>7</div></td>
          		<td className="black" onClick={this.showBet.bind(this,"number 10", 10, 0)}><div>10</div></td>
          		<td className="black" onClick={this.showBet.bind(this,"number 13", 13, 0)}><div>13</div></td>
          		<td className="red" onClick={this.showBet.bind(this,"number 16", 16, 0)}><div>16</div></td>
          		<td className="red" onClick={this.showBet.bind(this,"number 19", 19, 0)}><div>19</div></td>
          		<td className="black" onClick={this.showBet.bind(this,"number 22", 22, 0)}><div>22</div></td>
          		<td className="red" onClick={this.showBet.bind(this,"number 25", 25, 0)}><div>25</div></td>
          		<td className="black" onClick={this.showBet.bind(this,"number 28", 28, 0)}><div>28</div></td>
          		<td className="black" onClick={this.showBet.bind(this,"number 31", 31, 0)}><div>31</div></td>
          		<td className="red" onClick={this.showBet.bind(this,"number 34", 34, 0)}><div>34</div></td>
          	</tr>
          	<tr>
          	  <td rowSpan="2">&nbsp;</td>
          		<td colSpan="4" className="lor" onClick={this.showBet.bind(this,"even number", 0, 1)}>Even</td>
          		<td colSpan="2" className="a_red" onClick={this.showBet.bind(this,"red number", 0, 2)}>Red</td>
          		<td colSpan="2" className="a_black" onClick={this.showBet.bind(this,"black number", 1, 2)}>Black</td>
          		<td colSpan="4" className="lor" onClick={this.showBet.bind(this,"odd number", 1, 1)}>Odd</td>
          		<td>&nbsp;</td>
          	</tr>
            <tr>
              <td><button id="spin" disabled={(this.props.bets.length<=0)} onClick={this.calculateRandomNumber.bind(this)}>Spin</button></td>
            </tr>
          </tbody>
      	</table>
      </div>
      <WinningNumbers
        winningNumbers={this.props.winningNumbers}
        colorNumbers={this.colorNumbers}>
      </WinningNumbers>

      <MakeBet
        minBet={this.props.minBet}
        maxBet={this.props.maxBet}
        betText={this.state.betText}
        function={this.bet}
        update={this.updateParams}>
      </MakeBet>

      <ModifyParams
        function={this.modifyParams}
        totalAmount={this.props.totalAmount}
        update={this.updateParams}>
      </ModifyParams>

      <Spin
        function={this.spin}>
      </Spin>

    </div>
   );
  }
}

export default RouletteTable;
