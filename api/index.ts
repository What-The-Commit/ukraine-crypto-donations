import { VercelRequest, VercelResponse } from "@vercel/node";
import Ethereum from "../src/ethereum";
import {ethers} from "ethers";
import Polkadot from "../src/polkadot";
import Bitcoin from "../src/bitcoin";
import CryptoCompare from "../src/cryptocompare";

export default async function (req: VercelRequest, res: VercelResponse) {
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

    res.status = 200;
    res.setHeader('Cache-Control', 'max-age=0, s-maxage=86400, stale-while-revalidate');
    res.json({
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
    });
}