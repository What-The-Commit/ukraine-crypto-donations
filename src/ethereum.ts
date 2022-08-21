import {ethers} from "ethers";
import fetch from "node-fetch";

class Ethereum {
    constructor(address, covalentApiKey) {
        this.address = address;
        this.covalentApiKey = covalentApiKey;
    }

    async fetchTransactions(pageNumber, pageSize) {
        const response = await fetch(`https://api.covalenthq.com/v1/1/address/${this.address}/transactions_v2/?quote-currency=USD&format=JSON&block-signed-at-asc=false&no-logs=false&page-number=${pageNumber}&page-size=${pageSize}&key=${this.covalentApiKey}`)

        if (response.status !== 200) {
            let error = new Error('Could not fetch transactions');
            error.responseStatus = response.status;
            error.responseBody = await response.text();

            throw error;
        }

        return await response.json();
    }

    getAddress(address) {
        if (address === null) {
            return '0x0000000000000000000000000000000000000000';
        }

        try {
            return ethers.utils.getAddress(address);
        } catch (error) {
            console.error(address);
            throw error;
        }
    }

    async fetchBalance() {
        let response = await this.fetchTransactions(1, 1000);
        let ethBalance = ethers.utils.parseEther('0');

        for (const item of response.data.items) {
            if (this.getAddress(item.to_address) !== this.address) {
                continue;
            }

            if (item.value === '0' && item.log_events.length > 0) {
                console.log(item);
                continue;
            }

            ethBalance = ethBalance.add(ethers.utils.parseUnits(item.value, 'wei'));
        }

        while (response.data.pagination.has_more === true) {
            let pageNumber = response.data.pagination.page_number;
            pageNumber++;
            response = await this.fetchTransactions(pageNumber, response.data.pagination.page_size);

            console.log(response.data.pagination);

            for (const item of response.data.items) {
                try {
                    if (this.getAddress(item.to_address) !== this.address) {
                        continue;
                    }
                } catch (error) {
                    if (error.reason === 'invalid address') {
                        continue;
                    }

                    throw error;
                }

                if (item.log_events.length > 0) {
                    console.log(item.log_events);
                }

                ethBalance = ethBalance.add(ethers.utils.parseUnits(item.value, 'wei'));
            }
        }

        return ethBalance;
    }
}

export default Ethereum;