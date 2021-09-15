import Web3 from 'web3';
import { CONTRACT_ABI, CONTRACT_ADDRESS } from './contracts/RouletteContract.js';

const web3 = new Web3(window.ethereum);

export default new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);
