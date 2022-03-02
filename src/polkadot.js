import {ApiPromise, WsProvider} from '@polkadot/api';
import BN from "bn.js";

    class Polkadot {
    constructor(address) {
        this.address = address;
    }

    async fetchBalance() {
        const wsProvider = new WsProvider('wss://rpc.polkadot.io');
        const api = await ApiPromise.create({provider: wsProvider});

        const { data: balanceObject } = await api.query.system.account(this.address);

        const balance = balanceObject.free;
        const decimals = api.registry.chainDecimals;
        const base = new BN(10).pow(new BN(decimals));
        const dm = new BN(balance).divmod(base);

        return parseFloat(dm.div.toString() + "." + dm.mod.toString())
    }
}

export default Polkadot;