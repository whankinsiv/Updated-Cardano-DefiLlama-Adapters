const { sumTokens2 } = require('../helper/chain/cardano');
const { getAddressesUTXOs, getScriptsDatum, getPolicyAssets, assetsAddresses } = require('../helper/chain/cardano/blockfrost');

const INVEST_UNITS_ADDRESS = "addr1w8gdpwxszrtvlqutsmnexyshkxfa4x0q7e87d026hhdjljc2drj9d";
const GOVERNANCE_STAKING_ADDRESS = "addr1wxn9kx9w0gjzfkyuejqtt834z04gd9yrans6hy0xt5vunpslcg4j7";

async function tvl() {
    const INVEST_UNITS_UTXOs = await getAddressesUTXOs(INVEST_UNITS_ADDRESS);

    const contractAddressPromises = INVEST_UNITS_UTXOs.map(async (utxo) => {
        const UTXO_DATUM = await getScriptsDatum(utxo.data_hash);
        if (UTXO_DATUM?.json_value?.fields?.[0]?.fields?.[1]) {
            const FUND_POLICY = UTXO_DATUM.json_value.fields[0].fields[1].bytes;
            const POLICY_ASSETS = await getPolicyAssets(FUND_POLICY);
            const FUND_ID = POLICY_ASSETS.find(asset => asset.asset.endsWith("46756e644944"))?.asset;
            if (FUND_ID) {
                const addresses = await assetsAddresses(FUND_ID);
                return addresses[0]?.address;
            }
        }
    });

    const CONTRACT_ADDRESSES = (await Promise.all(contractAddressPromises)).filter(Boolean);

    return sumTokens2({ owners: CONTRACT_ADDRESSES });
}

function stake() {
    return sumTokens2({ owner: GOVERNANCE_STAKING_ADDRESS });
}

module.exports = {
    timetravel: false,
    cardano: {
        tvl,
        staking: stake
    },
};