import { useState } from "react";
import { Wallet } from "ethers";
import { Alert, Button, Stack, TextField, Typography } from "@mui/material";

const RecoverAccount = ({ onWalletRecovered }) => {
  const [seedPhrase, setSeedPhrase] = useState("");
  const [nonValid, setNonValid] = useState(false);

  function seedAdjust(e) {
    setSeedPhrase(e.target.value);
    setNonValid(false);
  }

  function recoverWallet() {
    let recoveredWallet = null;
    try {
      recoveredWallet = Wallet.fromPhrase(seedPhrase).address;
    } catch (error) {
      console.error("Error recovering wallet:", error);
      setNonValid(true);
    }

    if (recoveredWallet) {
      onWalletRecovered(recoveredWallet, seedPhrase);
    }
  }

  return (
    <Stack spacing={2}>
      <Alert severity="info">
        Write your seed phrase in the field below to recover your wallet (it
        should include 12 words separated by spaces)
      </Alert>

      <TextField
        fullWidth
        rows={6}
        multiline
        onChange={seedAdjust}
        placeholder="Insert your seed phrase here"
      />

      <Button
        variant="contained"
        disabled={
          seedPhrase.split(" ").length !== 12 || seedPhrase.slice(-1) === " "
        }
        onClick={recoverWallet}
      >
        Recover Wallet
      </Button>

      {nonValid && <Typography color="error">Invalid seed phrase</Typography>}
    </Stack>
  );
};

export default RecoverAccount;
