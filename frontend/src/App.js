import { useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import { Box, IconButton, MenuItem, Select } from "@mui/material";
import { Wallet } from "ethers";

import logo from "./assets/logo.png";
import "./App.css";
import Home from "./components/Home";
import RecoverAccount from "./components/RecoverAccount";
import CreateAccount from "./components/CreateAccount";
import WalletView from "./components/WalletView";
import { CHAINS_CONFIG } from "./utils";

const App = () => {
  const navigate = useNavigate();
  const [wallet, setWallet] = useState(null);
  const [seedPhrase, setSeedPhrase] = useState("");
  const [selectedChain, setSelectedChain] = useState("0x1");

  function handleWalletCreated(seedPhrase) {
    const wallet = Wallet.fromPhrase(seedPhrase).address;
    setWallet(wallet);
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
            <img src={logo} alt="Logo" className="headerLogo" />
          </IconButton>
          <Select
            value={selectedChain}
            onChange={(e) => setSelectedChain(e.target.value)}
          >
            {CHAINS_CONFIG.map((chain) => (
              <MenuItem key={chain.value} value={chain.value}>
                {chain.name}
              </MenuItem>
            ))}
          </Select>
        </Box>
      </header>
      <Box p={2}>
        {wallet && seedPhrase ? (
          <Routes>
            <Route
              path="/wallet"
              element={
                <WalletView
                  wallet={wallet}
                  seedPhrase={seedPhrase}
                  selectedChain={selectedChain}
                />
              }
            />
          </Routes>
        ) : (
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/recover"
              element={
                <RecoverAccount
                  setSeedPhrase={setSeedPhrase}
                  setWallet={setWallet}
                />
              }
            />
            <Route
              path="/yourwallet"
              element={
                <CreateAccount
                  setSeedPhrase={setSeedPhrase}
                  setWallet={setWallet}
                  onWalletCreated={handleWalletCreated}
                />
              }
            />
          </Routes>
        )}
      </Box>
    </Box>
  );
};

export default App;
