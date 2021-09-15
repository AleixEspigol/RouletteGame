import React, { Component } from 'react';
import Web3 from 'web3';
import emailjs from 'emailjs-com';
import roulette from './roulette.js';
import './App.css';
import RouletteTable from './RouletteTable.js';
import PayReward from './PayReward.js';
import EarnMoney from './EarnMoney.js';
import DestroyContract from './DestroyContract.js';
import TransactionMessage from './TransactionMessage.js';


class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      account: 'Please connect to MetaMask',
      balance: 0,
      maxBet: 0,
      minBet: 0,
      totalAmount: 0,
      isManager : false,
      winningNumbers : [],
      depositContract : 0,
      maximumAmount : 0,
      winningNumber : null,
      bets : [],
      textInfo : "",
      necessaryBalance : 0
    }

    this.needMoney = this.needMoney.bind(this);
    this.updateParams = this.updateParams.bind(this);
    this.payReward = this.payReward.bind(this);
    this.earnMoney = this.earnMoney.bind(this);
    this.getDeposit = this.getDeposit.bind(this);
    this.showModal = this.showModal.bind(this);
  }

  async componentDidMount(){
    await this.loadWeb3();
  }

  async loadBlockchainData(){
    const web3 = new Web3(window.ethereum);
    const accounts = await window.ethereum.request({ method: 'eth_accounts' });
    const balance = await window.ethereum.request({ method: 'eth_getBalance', params:[accounts[0]] });

    var boolean=false;
    const manager = await roulette.methods.manager().call();
    if(accounts[0] === manager.toLowerCase()){
      boolean = true;
    }
    const minBet = await roulette.methods.minBet().call();
    const maxBet = await roulette.methods.maxBet().call();
    const winningNumbers = await roulette.methods.getWinningNumbers().call();
    const totalAmount = await roulette.methods.winners(accounts[0]).call();
    const maximumAmount = await roulette.methods.maximumAmount().call();
    const depositContract = await roulette.methods.depositContract().call();
    const bets = await roulette.methods.getListBets().call();
    const necessaryBalance = await roulette.methods.necessaryBalance().call();
    const winningNumber = await roulette.methods.winningNumber().call();
    this.setState({
      account: accounts[0], balance: Number(web3.utils.fromWei(balance)).toFixed(3), isManager: boolean, necessaryBalance : Number(web3.utils.fromWei(necessaryBalance)),
      winningNumber: winningNumber, bets: bets, maximumAmount: Number(web3.utils.fromWei(maximumAmount)),
      depositContract: Number(web3.utils.fromWei(depositContract)), winningNumbers: winningNumbers,
      minBet: Number(web3.utils.fromWei(minBet)), maxBet: Number(web3.utils.fromWei(maxBet)), totalAmount: Number(web3.utils.fromWei(totalAmount))
    });
  }

  async loadWeb3(){
    if(window.ethereum){
      window.web = new Web3(window.ethereum)
      await window.ethereum.request({ method: 'eth_requestAccounts' })
      .catch((error) => {
        if (error.code === 4001) {
          window.alert('Please connect to MetaMask.');
        }
      });
      await this.loadBlockchainData();
    }
    else if(window.web3){
      window.web3 = new Web3(window.web3.currentProvider);
    }
    else{
      window.alert('Non-Ethereum browser detected. Please install Metamask');
    }
  }

  needMoney(balance){
    let final_balance = balance/1000000000000000000;
    var templateParams = {
      balance: final_balance,
    };
    emailjs.send('gmail', 'roulette_contract', templateParams, 'user_jZyVswZ8ZHRTtKvBq3tiK')
      .then((result) => {
          console.log(result.text);
      }, (error) => {
          console.log(error.text);
      });
  }

  updateParams(params, type, actualAmount){
    if(type === 0){
      if(actualAmount > 0){
        this.setState({totalAmount: actualAmount});
      }
    } else if(type === 1){
      this.setState({winningNumber: actualAmount});
    }
    this.setState({textInfo: params});
  }

  payReward() {
    document.getElementById("myModalEarn").style.display = "none";
    this.setState({textInfo : "Loading..."});
    this.showModal("myModalM","closeM","");
    var self=this;
    roulette.methods.payReward().send({ from: this.state.account })
    .on('receipt', function(receipt){
      document.getElementById("myModalM").style.display = "none";
      self.setState({textInfo : "The transaction completed successfully"});
      self.showModal("myModalM","closeM","");
    })
    .on('error', function(error, receipt) {
      document.getElementById("myModalM").style.display = "none";
      self.setState({textInfo : "The transaction wasn't completed successfully"});
      self.showModal("myModalM","closeM","");
    });
  }

  earnMoney() {
    document.getElementById("myModalBalance").style.display = "none";
    this.setState({textInfo : "Loading..."});
    this.showModal("myModalM","closeM","");
    var self=this;
    roulette.methods.earnMoney().send({ from: this.state.account })
    .on('receipt', function(receipt){
      document.getElementById("myModalM").style.display = "none";
      self.setState({textInfo : "The transaction completed successfully"});
      self.showModal("myModalM","closeM","");
    })
    .on('error', function(error, receipt) {
      document.getElementById("myModalM").style.display = "none";
      self.setState({textInfo : "The transaction wasn't completed successfully"});
      self.showModal("myModalM","closeM","");
    });
  }

  getDeposit() {
    document.getElementById("myModalDestroy").style.display = "none";
    this.setState({textInfo : "Loading..."});
    this.showModal("myModalM","closeM","");
    var self=this;
    roulette.methods.getDeposit().send({ from: this.state.account })
    .on('receipt', function(receipt){
      document.getElementById("myModalM").style.display = "none";
      self.setState({textInfo : "The transaction completed successfully"});
      self.showModal("myModalM","closeM","");
    })
    .on('error', function(error, receipt) {
      document.getElementById("myModalM").style.display = "none";
      self.setState({textInfo : "The transaction wasn't completed successfully"});
      self.showModal("myModalM","closeM","");
    });
  }

  showModal(modal, span, cancel){
    var modalD = document.getElementById(modal);
    // Get the <span> element that closes the modal
    var spanD = document.getElementsByClassName(span)[0];
    var cancelD = document.getElementById(cancel);

    modalD.style.display = "block";
    //When the user clicks on 'cancel' close the modal
    if(cancelD !== null){
      cancelD.onclick = function() {
        modalD.style.display = "none";
        window.location.reload();
      }
    }
    // When the user clicks on 'x' close the modal
    spanD.onclick = function() {
      modalD.style.display = "none";
      window.location.reload();
    }
    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
      if (event.target === modalD) {
        modalD.style.display = "none";
        window.location.reload();
      }
    }
  }

  render(){
    var self=this;
    if(window.ethereum){
      window.ethereum.on('accountsChanged', function (accounts){
        self.loadBlockchainData();
      });
    }
    return(
      <div className="container">
      <header>
        <img id="logo" src="ethereum.png" alt="logo" height="140"/>
        {this.state.isManager === true && <h4 className="destroyCon" onClick={this.showModal.bind(this,"myModalDestroy","closeD","cancel_destroy")}>Destroy Contract</h4>}
        {this.state.isManager === true && <h4 className="earnMoney" onClick={this.showModal.bind(this,"myModalBalance","closeB","cancel_balance")}>Contract Balance</h4>}
        <h1 className="title">Roulette Game</h1>
        <div className="userInfo">
    			<p>Address: {this.state.account}</p>
    			<p>Account Balance: {this.state.balance} ethers</p>
          <div className="withdrawal">
            <p>Amount Earned: {this.state.totalAmount} ethers</p>
            <button id="withdrawalButton" disabled={(this.state.totalAmount<=0)} onClick={this.showModal.bind(this,"myModalEarn","closeE","cancel_earn")}>Withdrawal</button>
          </div>
        </div>
      </header>

    <RouletteTable
      winningNumbers={this.state.winningNumbers}
      minBet={this.state.minBet}
      maxBet={this.state.maxBet}
      isManager={this.state.isManager}
      account={this.state.account}
      depositContract={this.state.depositContract}
      totalAmount={this.state.totalAmount}
      function={this.showModal}
      needMoney={this.needMoney}
      bets={this.state.bets}
      winningNumber={this.state.winningNumber}
      update={this.updateParams}
      necessaryBalance={this.state.necessaryBalance}>
    </RouletteTable>

    <DestroyContract
      function={this.getDeposit}>
    </DestroyContract>

    <EarnMoney
      function={this.earnMoney}
      depositContract={this.state.depositContract}
      maximumAmount={this.state.maximumAmount}>
    </EarnMoney>

    <PayReward
      function={this.payReward}
      totalAmount={this.state.totalAmount}>
    </PayReward>

    <TransactionMessage
      text={this.state.textInfo}>
    </TransactionMessage>

  </div>
  );
  }
}

export default App;
