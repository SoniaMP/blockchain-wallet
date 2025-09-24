const express = require("express");
const Moralis = require("moralis").default;
const app = express();
const cors = require("cors");

require("dotenv").config();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get("/getTokens", async (req, res) => {
  const { userAddress, chain } = req.query;
  console.log(userAddress, chain);

  if (!userAddress || !chain) {
    return res.status(400).json({ error: "Missing userAddress or chain" });
  }

  const tokens = await Moralis.EvmApi.token.getWalletTokenBalances({
    address: userAddress,
    chain,
  });

  const ntfs = await Moralis.EvmApi.nft.getWalletNFTs({
    address: userAddress,
    chain,
    mediaItems: true,
  });

  const myNtfs = ntfs.raw.result.map((e, i) => {
    if (
      e?.media?.media_collection?.high?.url &&
      !e.possible_spam &&
      e?.media?.category !== "video"
    ) {
      return e["media"]["media_collection"]["high"]["url"];
    }
  });

  const balance = await Moralis.EvmApi.balance.getNativeBalance({
    address: userAddress,
    chain,
  });

  const result = {
    tokens: tokens.raw,
    ntfs,
    myNtfs,
    balance: balance.raw.balance / 10 ** 18,
  };

  return res.status(200).json(result);
});

Moralis.start({
  apiKey: process.env.MORALIS_KEY,
}).then(() => {
  console.log("Moralis started");
  app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
  });
});
