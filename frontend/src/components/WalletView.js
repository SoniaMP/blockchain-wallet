import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import TabContext from "@mui/lab/TabContext";
import TabPanel from "@mui/lab/TabPanel";
import { useCallback, useEffect, useState } from "react";
import LogoutIcon from "@mui/icons-material/Logout";
import { JsonRpcProvider, parseEther, Wallet } from "ethers";
import axios from "axios";

import { CHAINS_CONFIG } from "../chains";
import { SeedPhrase } from "../styled";

const SendForm = ({ onSend }) => {
  const [to, setTo] = useState("");
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");

  function handleSend() {
    if (!to || !amount || isNaN(amount) || Number(amount) < 0.001) {
      setError("Dirección o cantidad inválida (mínimo 0.001 ETH)");
      return;
    }

    setError("");
    onSend(to, amount);
  }

  return (
    <Stack spacing={2}>
      <TextField
        fullWidth
        label="Dirección de destino"
        value={to}
        onChange={(e) => setTo(e.target.value)}
        placeholder="0x..."
        error={!!error}
      />
      <TextField
        fullWidth
        label="Cantidad (ETH)"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="0.01"
        error={!!error}
        helperText={error}
      />
      <Button variant="contained" onClick={handleSend} fullWidth>
        Enviar
      </Button>
    </Stack>
  );
};

const WalletView = ({ wallet, seedPhrase, selectedChain, onLogout }) => {
  const [tokens, setTokens] = useState(null);
  const [nfts, setNfts] = useState(null);
  const [balance, setBalance] = useState(0);
  const [isLoading, setIsloading] = useState(false);
  const [hash, setHash] = useState("");
  const [selectedTab, setSelectedTab] = useState(0);

  function handleLogout() {
    onLogout();
  }

  const getAccountTokens = useCallback(async () => {
    if (!wallet || !seedPhrase || !selectedChain) return;

    setIsloading(true);
    const res = await axios.get("http://localhost:3001/getTokens", {
      params: { address: wallet, chain: selectedChain },
    });

    const response = res.data;

    if (response.tokens.length > 0) {
      setTokens(response.tokens);
    }

    if (response.nfts.length > 0) {
      setNfts(response.nfts);
    }

    setBalance(response.balance);
    setIsloading(false);
  }, [wallet, seedPhrase, selectedChain]);

  async function sendTransaction(to, amount) {
    const chain = CHAINS_CONFIG.find((c) => c.hex === selectedChain);
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
      }
    } catch (error) {
      console.error("Transaction error:", error);
      setHash("");
    } finally {
      setIsloading(false);
    }
  }

  function handleChangeTab(_, newValue) {
    setSelectedTab(newValue);
  }

  function getChainTicker() {
    const chain = CHAINS_CONFIG.find((c) => c.hex === selectedChain);
    return chain ? chain.ticker : "ETH";
  }

  useEffect(() => {
    getAccountTokens();
  }, [getAccountTokens]);

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="50vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Stack spacing={1}>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Typography variant="h5">Wallet</Typography>
        <Stack direction="row" spacing={1} alignItems="center">
          {wallet && (
            <Chip
              color="primary"
              label={`${wallet.slice(0, 6)}...${wallet.slice(38)}`}
              variant="outlined"
            />
          )}
          <IconButton onClick={handleLogout} color="primary">
            <LogoutIcon />
          </IconButton>
        </Stack>
      </Box>

      <Divider />

      <Typography>Frase semilla</Typography>
      <SeedPhrase>{seedPhrase}</SeedPhrase>

      <TabContext value={selectedTab}>
        <Tabs
          value={selectedTab}
          onChange={handleChangeTab}
          aria-label="basic tabs example"
        >
          <Tab label="Tokens" value={0} />
          <Tab label="NFTs" value={1} />
          <Tab label="Transfer" value={2} />
        </Tabs>
        <TabPanel value={0}>
          <Stack spacing={1}>
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
              <Alert severity="warning">
                <Typography>Todavía no tienes tokens</Typography>
              </Alert>
            )}
          </Stack>
        </TabPanel>
        <TabPanel value={1}>
          <Stack spacing={1}>
            {nfts ? (
              <Box sx={{ display: "flex", gap: 1, overflowX: "auto" }}>
                {nfts.map((nft, index) => (
                  <img
                    key={index}
                    src={nft.image}
                    alt={nft.name}
                    style={{ width: 100, height: 100 }}
                  />
                ))}
              </Box>
            ) : (
              <Alert severity="warning">
                <Typography>No tienes NFTs</Typography>
              </Alert>
            )}
          </Stack>
        </TabPanel>
        <TabPanel value={2}>
          <Stack spacing={2}>
            <Alert severity="info">
              Envía una transacción a otra dirección (el valor mínimo es 0.001
              ETH)
            </Alert>

            <Stack spacing={1} alignItems="center">
              <Typography>Balance</Typography>
              <Typography variant="h6" fontWeight={600}>
                {balance} {getChainTicker()}
              </Typography>
            </Stack>

            <SendForm onSend={sendTransaction} />
            {hash && (
              <Alert severity="success">
                <Typography>Transacción enviada. Hash: {hash}</Typography>
              </Alert>
            )}
          </Stack>
        </TabPanel>
      </TabContext>
    </Stack>
  );
};

export default WalletView;
