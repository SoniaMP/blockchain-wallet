import React from "react";
import { Alert, Button, Stack, Typography } from "@mui/material";
import { Wallet } from "ethers";

import { SeedPhrase } from "../styled";

const CreateAccount = ({ onWalletCreated }) => {
  const [seedPhrase, setSeedPhrase] = React.useState("");

  function generateWallet() {
    const newSeedPhrase = Wallet.createRandom().mnemonic.phrase;
    setSeedPhrase(newSeedPhrase);
  }

  function handleWalletCreated() {
    if (seedPhrase) {
      onWalletCreated(seedPhrase);
    }
  }

  return (
    <Stack spacing={2}>
      <Typography variant="h5">Create a new account</Typography>
      <Button variant="contained" onClick={generateWallet} fullWidth>
        Generate seed phrase
      </Button>
      {seedPhrase && (
        <Stack spacing={2} mt={2} alignItems="center">
          <Typography variant="h6">Your seed phrase</Typography>
          <SeedPhrase>{seedPhrase}</SeedPhrase>
          <Alert severity="warning">
            <strong>Important:</strong> Keep this phrase in a safe place. You
            will need it to recover your account.
          </Alert>
          <Button
            variant="outlined"
            color="primary"
            onClick={handleWalletCreated}
            fullWidth
          >
            Open your new wallet
          </Button>
        </Stack>
      )}
    </Stack>
  );
};

export default CreateAccount;
