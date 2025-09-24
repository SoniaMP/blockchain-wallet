import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import { MenuItem, Select } from "@mui/material";

import logo from "./assets/logo.png";
import "./App.css";
import Home from "./components/Home";
import RecoverAccount from "./components/RecoverAccount";
import CreateAccount from "./components/CreateAccount";
import WalletView from "./components/WalletView";

const App = () => {
  const [wallet, setWallet] = useState(null);
  const [seedPhrase, setSeedPhrase] = useState("");
  const [selectedChain, setSelectedChain] = useState("0x1");

  return (
    <div className="App">
      <div className="Content">
        <header>
          <div className="headerContent">
            <img src={logo} alt="Logo" className="headerLogo" />
            <Select
              value={selectedChain}
              onChange={(e) => setSelectedChain(e.target.value)}
            >
              <MenuItem value="0x1">Ethereum</MenuItem>
              <MenuItem value="0x13881">Mumbai Testnet</MenuItem>
              <MenuItem value="0xAA36A7">Sepolia Testnet</MenuItem>
            </Select>
          </div>
        </header>

        {wallet && seedPhrase ? (
          <Routes>
            <Route
              path="/wallet"
              element={
                <WalletView
                  wallet={wallet}
                  setWallet={setWallet}
                  seedPhrase={seedPhrase}
                  setSeedPhrase={setSeedPhrase}
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
                />
              }
            />
          </Routes>
        )}
      </div>
    </div>
  );
};

export default App;
