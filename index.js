import env from 'dotenv';
import Ethereum from "./src/ethereum.js";
import {ethers} from "ethers";
import Polkadot from "./src/polkadot.js";
import Bitcoin from "./src/bitcoin.js";
import filesystem from "fs";
import CryptoCompare from "./src/cryptocompare.js";

env.config();

const cryptoCompare = new CryptoCompare();

const bitcoin = new Bitcoin(process.env.BLOCKCYPHER_TOKEN, process.env.UKRAINE_ADDRESS_BTC);
const ethereum = new Ethereum(process.env.UKRAINE_ADDRESS_ETH, process.env.COVALENT_API_KEY);
const polkadot = new Polkadot(process.env.UKRAINE_ADDRESS_DOT);

const ethBalance = await ethereum.fetchBalance();
const dotBalance = await polkadot.fetchBalance();
const btcBalance = await bitcoin.fetchBalance();

const ethUsd = await cryptoCompare.fetchUsdPriceForSymbol('ETH');
const dotUsd = await cryptoCompare.fetchUsdPriceForSymbol('DOT');
const btcUsd = await cryptoCompare.fetchUsdPriceForSymbol('BTC');

filesystem.writeFileSync('balance.json', JSON.stringify({
    eth: {
        native: ethers.utils.formatEther(ethBalance),
        usd: ethers.utils.formatEther(ethBalance) * ethUsd
    },
    dot: {
        native: dotBalance,
        usd: dotBalance * dotUsd
    },
    btc: {
        native: btcBalance,
        usd: btcBalance * btcUsd
    }
}));

process.exit();