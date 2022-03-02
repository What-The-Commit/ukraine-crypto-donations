import fetch from "node-fetch";

class Bitcoin {
    constructor(blockcypherToken, address) {
        this.address = address;
        this.blockcypherToken = blockcypherToken;
    }

    /**
     * @returns {int}
     */
    async fetchBalance() {
        const response = await fetch(`https://api.blockcypher.com/v1/btc/main/addrs/${this.address}/balance`, {method: 'GET'});
        const responseData = await response.json();

        return responseData.total_received / 100000000;
    }
}

export default Bitcoin;