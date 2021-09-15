//SPDX-License-Identifier: UNLICENSED
pragma solidity 0.6.6;
pragma experimental ABIEncoderV2;

library SafeMath {

  function mul(uint256 _a, uint256 _b) internal pure returns (uint256 c) {
    if (_a == 0) {
      return 0;
    }

    c = _a * _b;
    assert(c / _a == _b);
    return c;
  }

  function div(uint256 _a, uint256 _b) internal pure returns (uint256) {
    return _a / _b;
  }

  function sub(uint256 _a, uint256 _b) internal pure returns (uint256) {
    if (_a <= _b) {
      return 0;
    } else {
      return _a - _b;
    }
  }

  function add(uint256 _a, uint256 _b) internal pure returns (uint256 c) {
    c = _a + _b;
    assert(c >= _a);
    return c;
  }
}

contract RouletteApp {

    using SafeMath for uint; //using our safe math library

    /*
    There are different types of bets:
    0: number
    1: even or odd --> 0 even, 1 for odd
    2: color --> 0 for red and 1 for black
    */

    //struct of a bet
    struct Bet{
        uint256 betType;
        uint256 number;
        uint256 betAmount;
        address user;
    }

    Bet[] public listBets;
    address payable public manager; //address of the creator of the contract
    address RandomAddress; //Random smart contract address
    uint256 public minBet; //minimum bet
    uint256 public maxBet; //maximum bet
    uint256 public maximumAmount; //maximum number of ethers in the smart contract
    uint256 public winningNumber;
    uint256 public necessaryBalance; //balance required to be able to pay the bets
    uint256 public depositContract; //number of ethers that contract has
    uint256[] public rangeOfNumbers; //range of numbers to choose according to the bet
    uint256[] rewards; //rewards depend on the type of bet
    uint256[] public winningNumbers; //list with the last winning numbers
    mapping (address => uint256) public winners; //list with the amount earned of the winners

    event needMoney(uint256 balance);

    constructor() public payable{
        manager=msg.sender;
        depositContract=msg.value;
        RandomAddress=0x4cc2FBe841e04E2E563f8e65fA83cAD659CB066e;
        necessaryBalance = 0;
        rangeOfNumbers=[36,1,1];
        rewards=[36,2,2];
        minBet= 100000000000000000; // 0.1 ether
        maxBet= 4000000000000000000; // 4 ethers
        maximumAmount = maxBet.mul(36); // maxBet*36
    }

    receive() external payable {
        depositContract=depositContract.add(msg.value);
    }

    function bet(uint256 betType, uint256 number, uint256 betAmount) public payable{
        require(betType >= 0 && betType <=2, "Incorrect type of bet"); //are there a correct type of bet?
        require(number >= 0 && number <= rangeOfNumbers[betType], "Incorrect number entered"); //number entered is correct?
        require(betAmount <= msg.value, "No money to place the bet"); //user has money place the bet?
        require(betAmount >= minBet && betAmount <= maxBet, "Incorrect bet amount"); //is there a correct bet amount?

        uint prizeForBet=0;
        prizeForBet=betAmount.mul(rewards[betType]);
        necessaryBalance = necessaryBalance.add(prizeForBet);

        depositContract=depositContract.add(betAmount); //earn money of the bets

        if(necessaryBalance <= depositContract){ //contract has money to pay the bets?
          listBets.push(Bet({
            betType: betType,
            number: number,
            betAmount : betAmount,
            user: msg.sender

          }));
        } else {
          emit needMoney(necessaryBalance);

          msg.sender.transfer(betAmount);  //return the value of the bet
          depositContract=depositContract.sub(betAmount);

          necessaryBalance=necessaryBalance.sub(prizeForBet);
        }
    }


    function calculateRandomNumber() public{
        (bool success, bytes memory returnData)=RandomAddress.call(abi.encodeWithSignature("getRandomNumber(uint256)", depositContract));
    }


    function toUint256(bytes memory _bytes) internal pure returns (uint256 value) {
        assembly {
            value := mload(add(_bytes, 0x20))
        }
    }

    function spin() public{
        require(listBets.length > 0, "There aren't bets"); //is there any bet?

        //Calculate random number
        (bool success1, bytes memory returnData1) = RandomAddress.call(abi.encodeWithSignature("getRandomResult()"));
        if(success1 == true){
            winningNumber= toUint256(returnData1);
            winningNumber=winningNumber%36;
            winningNumbers.push(winningNumber);

            //check in the different bets if there is a winner
            for(uint i = 0; i < listBets.length; i++){
                bool winningBet = false;
                Bet memory betUser = listBets[i]; //temporal variable where save the bet of a user

                //bet of number
                if(betUser.betType == 0){
                    winningBet=(betUser.number == winningNumber);
                }
                //bet of even or odd
                else if (betUser.betType == 1){
                    //bet of even
                    if(betUser.number == 0 && winningNumber != 0){
                        winningBet = (winningNumber % 2 == 0);
                    }
                    //bet of odd
                    if(betUser.number == 1 && winningNumber != 0){
                        winningBet = (winningNumber % 2 == 1);
                    }
                }
                //bet of color
                else if(betUser.betType == 2 && winningNumber != 0){
                    //bet of red
                    if(betUser.number == 0){
                        if ((winningNumber >=1 && winningNumber <= 10) || (winningNumber >= 20 && winningNumber <= 28) || winningNumber == 19) {
                            winningBet = (winningNumber % 2 == 1);
                        } else {
                            winningBet = (winningNumber % 2 == 0);
                        }
                    //bet of black
                    } else {
                        if ((winningNumber <= 10 && winningNumber != 0) || (winningNumber >= 20 && winningNumber <= 28) || winningNumber == 19) {
                            winningBet = (winningNumber % 2 == 0);
                        } else {
                            winningBet = (winningNumber % 2 == 1);
                        }
                    }
                }
                //in the case of being a winner
                if(winningBet){
                    //we calculate the prize for each of the winners
                    uint256 prize = betUser.betAmount.mul(rewards[betUser.betType]);
                    winners[betUser.user]=winners[betUser.user].add(prize);
                }
            }
            delete listBets;
            necessaryBalance=0;

            uint256 minBalance = minBet.mul(36);
            uint256 deposit = depositContract.sub(maximumAmount);
            if (depositContract > maximumAmount && deposit > minBalance){
                earnMoney();
            }
        }
    }

    function payReward() public {
        uint256 prize = winners[msg.sender];

        require(prize > 0, "There aren't a prize");
        require(prize <= depositContract, "No money to pay the prize");

        depositContract=depositContract.sub(prize);

        winners[msg.sender]=0;
        msg.sender.transfer(prize);
    }

    function earnMoney() public {
        uint deposit = depositContract.sub(maximumAmount);

        if(deposit > 0){
            manager.transfer(deposit);
            depositContract= depositContract.sub(deposit);
        }
    }

    function getDeposit() public { //returns the entire deposit of the contract
        require(msg.sender == manager, "You need to be the manager");
        selfdestruct(manager); //return the entire balance of the contract to the creator
    }

    function setBettingSettings(uint256 maxB, uint256 minB) public {
        require(msg.sender == manager, "You need to be the manager");
        minBet=minB;
        maxBet=maxB;
        maximumAmount = maxBet.mul(36);
    }

    function getWinningNumbers() public returns (uint256[] memory){
        return winningNumbers;
    }


    function getListBets() public returns (Bet[] memory){
        return listBets;
    }

}
