import {
  CircularProgress,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import LogoutIcon from "@mui/icons-material/Logout";
import { JsonRpcProvider, parseEther, Wallet } from "ethers";
import axios from "axios";

import { CHAINS_CONFIG } from "../utils";

const WalletView = ({ wallet, seedPhrase, selectedChain, onWalletChange }) => {
  const navigate = useNavigate();
  const [tokens, setTokens] = useState(null);
  const [ntfs, setNtfs] = useState(null);
  const [balance, setBalance] = useState(0);
  const [isLoading, setIsloading] = useState(true);
  const [hash, setHash] = useState("");

  function handleLogout() {
    onWalletChange(null, "");
    navigate("/");
  }

  async function getAccountTokens() {
    const res = await axios.get("http://localhost:3001/getTokens", {
      params: { address: wallet, chain: selectedChain },
    });

    const response = res.data;
    console.log("Tokens response:", response);

    if (response.tokens.length > 0) {
      setTokens(response.tokens);
    }

    if (response.nfts.length > 0) {
      setNtfs(response.nfts);
    }

    setBalance(response.balance);
  }

  async function sendTransaction(to, amount) {
    const chain = CHAINS_CONFIG.find((c) => c.value === selectedChain);
    console.log("Selected chain:", chain);
    const provider = new JsonRpcProvider(chain.rpcUrl);
    const privateKey = Wallet.fromPhrase(seedPhrase).privateKey;
    const wallet = new Wallet(privateKey, provider);
    const tx = {
      to,
      value: parseEther(amount),
    };

    setIsloading(true);
    try {
      const transactionResponse = await wallet.sendTransaction(tx);

      setHash(transactionResponse.hash);
      const receipt = await transactionResponse.wait();

      if (receipt.status === 1) {
        getAccountTokens();
        console.log("Transaction successful:", receipt);
      } else {
        console.log("Transaction failed:", receipt);
      }
    } catch (error) {
      console.error("Transaction error:", error);
      setHash("");
    } finally {
      setIsloading(false);
    }
  }

  if (isLoading) {
    return <CircularProgress />;
  }

  return (
    <Stack spacing={2} alignItems="center" mt={4}>
      <IconButton onClick={handleLogout}>
        <LogoutIcon />
      </IconButton>
      <Typography variant="h5">Wallet View</Typography>
      <Tooltip title={`Wallet: ${wallet}`}>
        <Typography>
          Wallet: {wallet.slice(0, 6)}...{wallet.slice(38)}
        </Typography>
      </Tooltip>

      <Divider />

      <Tooltip title={`Seed Phrase: ${seedPhrase}`}>
        <Typography>Seed Phrase: {seedPhrase}</Typography>
      </Tooltip>
      <Tooltip title={`Selected Chain: ${selectedChain}`}>
        <Typography>Selected Chain: {selectedChain}</Typography>
      </Tooltip>

      <Tooltip title="Tokens list">
        <Typography>
          Tokens:
          {tokens ? (
            <>
              <List>
                {tokens.map((token, index) => (
                  <ListItemAvatar key={index}>
                    <img
                      src={token.logo}
                      title={token.symbol}
                      alt={token.name}
                      style={{ width: 32, height: 32 }}
                    />
                  </ListItemAvatar>
                ))}
                {tokens.map((token, index) => (
                  <ListItem key={index}>
                    <ListItemText
                      primary={
                        Number(token.balance) / 10 ** Number(token.decimals)
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </>
          ) : (
            "Todavía no tienes tokens"
          )}
        </Typography>
      </Tooltip>
      <Typography>
        NFTs: {ntfs ? JSON.stringify(ntfs) : "No NFTs loaded"}
      </Typography>
    </Stack>
  );
};

export default WalletView;
