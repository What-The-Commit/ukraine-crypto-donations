import fetch from "node-fetch";

class CryptoCompare {
    /**
     * @returns {float}
     */
    async fetchUsdPriceForSymbol(symbol) {
        const response = await fetch(`https://min-api.cryptocompare.com/data/price?fsym=${symbol}&tsyms=USD`);
        const responseData = await response.json();

        return responseData.USD;
    }
}

export default CryptoCompare;