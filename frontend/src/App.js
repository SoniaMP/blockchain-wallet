import { useState } from "react";
import WalletIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import { Route, Routes, useNavigate } from "react-router-dom";
import { Box, IconButton, MenuItem, Select } from "@mui/material";
import { Wallet } from "ethers";

import "./App.css";
import Home from "./components/Home";
import RecoverAccount from "./components/RecoverAccount";
import CreateAccount from "./components/CreateAccount";
import WalletView from "./components/WalletView";
import { CHAINS_CONFIG } from "./chains";

const App = () => {
  const navigate = useNavigate();
  const [wallet, setWallet] = useState(null);
  const [seedPhrase, setSeedPhrase] = useState("");
  const [selectedChain, setSelectedChain] = useState("0xAA36A7");

  function handleCreateWallet(seedPhrase) {
    const wallet = Wallet.fromPhrase(seedPhrase).address;
    setWallet(wallet);
    setSeedPhrase(seedPhrase);
    navigate("/wallet");
  }

  function handleLogout(newWallet, newSeedPhrase) {
    setWallet(newWallet);
    setSeedPhrase(newSeedPhrase);
    navigate("/");
  }

  function handleRecoverWallet(recoveredWallet, seedPhrase) {
    setWallet(recoveredWallet);
    setSeedPhrase(seedPhrase);
    navigate("/wallet");
  }

  return (
    <Box
      sx={{
        maxWidth: 400,
        margin: "0 auto",
        backgroundColor: "#f5f5f5",
        minHeight: "100vh",
      }}
    >
      <header>
        <Box p={2}>
          <IconButton onClick={() => navigate("/")}>
            <WalletIcon color="primary" />
          </IconButton>
          <Select
            value={selectedChain}
            onChange={(e) => setSelectedChain(e.target.value)}
          >
            {CHAINS_CONFIG.map((chain) => (
              <MenuItem key={chain.hex} value={chain.hex}>
                {chain.name}
              </MenuItem>
            ))}
          </Select>
        </Box>
      </header>
      <Box p={4}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/wallet"
            element={
              <WalletView
                wallet={wallet}
                seedPhrase={seedPhrase}
                selectedChain={selectedChain}
                onLogout={handleLogout}
              />
            }
          />
          <Route
            path="/recover"
            element={
              <RecoverAccount
                setSeedPhrase={setSeedPhrase}
                setWallet={setWallet}
                onWalletRecovered={handleRecoverWallet}
              />
            }
          />
          <Route
            path="/createwallet"
            element={
              <CreateAccount
                setSeedPhrase={setSeedPhrase}
                setWallet={setWallet}
                onWalletCreated={handleCreateWallet}
              />
            }
          />
        </Routes>
      </Box>
    </Box>
  );
};

export default App;
