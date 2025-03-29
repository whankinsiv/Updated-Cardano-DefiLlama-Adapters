const { getAssets } = require('../helper/chain/cardano/blockfrost')

async function tvl() {
    const [ammLockedAssets, ammLockedAssets2] = await Promise.all([
        getAssets("addr1x8srqftqemf0mjlukfszd97ljuxdp44r372txfcr75wrz26rnxqnmtv3hdu2t6chcfhl2zzjh36a87nmd6dwsu3jenqsslnz7e"),
        getAssets("addr1z8srqftqemf0mjlukfszd97ljuxdp44r372txfcr75wrz2auzrlrz2kdd83wzt9u9n9qt2swgvhrmmn96k55nq6yuj4qw992w9"),
    ]);

    // Merge the two arrays and sum quantities for duplicate units
    const combinedAssets = [...ammLockedAssets, ...ammLockedAssets2].reduce((acc, asset) => {
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
