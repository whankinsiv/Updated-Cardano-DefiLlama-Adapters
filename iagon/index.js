const { sumTokensExport } = require("../helper/chain/cardano")
const { getAssets } = require("../helper/chain/cardano/blockfrost")
const { get } = require("../helper/http")
const iagTokenAddress = "5d16cc1a177b5d9ba9cfa9793b07e60f1fb70fea1f8aef064415d114494147"
const iagStaking = "addr1w9k25wa83tyfk5d26tgx4w99e5yhxd86hg33yl7x7ej7yusggvmu3"
async function pool2() {
    const poolValue = await get('https://api.iagon.com/api/v1/pools/tvl/total')
    return {
        cardano: parseFloat(poolValue.data.tvl)
    }
}

async function stake() {
    const [stakeAssets1, stakeAssets2, stakeAssets3] = await Promise.all([
        getAssets('addr1w9k25wa83tyfk5d26tgx4w99e5yhxd86hg33yl7x7ej7yusggvmu3'),                                                // Previous node contract
        getAssets('addr1zxkrtm5fcf43ukp8w8kstt65kelawutmht4a0aezl06rp43y2c4s7gthspjk2c4557c9zltqcssl4qz7x5syzf7yknhqma7zxx'),   // Current contract for node operators
        getAssets('addr1z8awewqwaek2m7w6c5vyycldf5tykw87w820da273a4smgpy2c4s7gthspjk2c4557c9zltqcssl4qz7x5syzf7yknhq6uv6j0'),   // Current contract for delegated stake
    ]);

    // Merge the 3 arrays and sum quantities for duplicate units
    const combinedAssets = [
        ...stakeAssets1,
        ...stakeAssets2,
        ...stakeAssets3
    ].reduce((acc, asset) => {
        const existingAsset = acc.find(a => a.unit === asset.unit);

        if (existingAsset) {
            existingAsset.quantity = (BigInt(existingAsset.quantity) + BigInt(asset.quantity)).toString();
        } else {
            acc.push({ ...asset });
        }

        return acc;
    }, []);

    const formattedData = combinedAssets.reduce((result, item) => {
        result[`cardano:${item.unit}`] = item.quantity;
        if (item.unit === "5d16cc1a177b5d9ba9cfa9793b07e60f1fb70fea1f8aef064415d114494147") {
            console.log(item.quantity);
        }
        return result;
    }, {});

    return formattedData
}

module.exports = {

    timetravel: false,
    cardano: {
        tvl: () => ({}),
        pool2,
        staking: stake
    }
}