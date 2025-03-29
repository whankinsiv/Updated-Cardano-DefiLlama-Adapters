const { getAssets } = require("../helper/chain/cardano/blockfrost");

async function tvl() {
    const [ammLockedAssets, orderBookLockedAssets] = await Promise.all([
        getAssets("addr1w9qzpelu9hn45pefc0xr4ac4kdxeswq7pndul2vuj59u8tqaxdznu"),
        getAssets("addr1wxaptpmxcxawvr3pzlhgnpmzz3ql43n2tc8mn3av5kx0yzs09tqh8"),
    ]);

    // Merge the two arrays and sum quantities for duplicate units
    const combinedAssets = [...ammLockedAssets, ...orderBookLockedAssets].reduce((acc, asset) => {
        const existingAsset = acc.find(a => a.unit === asset.unit);
        if (existingAsset) {
            existingAsset.quantity = (Number(existingAsset.quantity) + Number(asset.quantity)).toString();
        } else {
            acc.push({ ...asset });
        }
        return acc;
    }, []);

    const formattedData = combinedAssets.reduce((result, item) => {
        result[`cardano:${item.unit}`] = item.quantity;
        return result;
    }, {});

    return formattedData
}

module.exports = {
    timetravel: false,
    cardano: {
        tvl
    }
}
