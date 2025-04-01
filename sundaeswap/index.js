// SundaeSwap V2
const { sumTokens2 } = require("../helper/chain/cardano");
const lockedAssetsAddresses = ["addr1w9qzpelu9hn45pefc0xr4ac4kdxeswq7pndul2vuj59u8tqaxdznu", "addr1wxaptpmxcxawvr3pzlhgnpmzz3ql43n2tc8mn3av5kx0yzs09tqh8"]

async function tvl() {
    const lockedAssets = await sumTokens2({
        owners: lockedAssetsAddresses
    })
    return lockedAssets
}

module.exports = {
    timetravel: false,
    cardano: {
        tvl
    }
}
