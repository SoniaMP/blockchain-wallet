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
      <Typography variant="h5">Crear una nueva cuenta</Typography>
      <Button variant="contained" onClick={generateWallet} fullWidth>
        Generar frase semilla
      </Button>
      {seedPhrase && (
        <Stack spacing={2} mt={2} alignItems="center">
          <Typography variant="h6">Tu frase semilla</Typography>
          <SeedPhrase>{seedPhrase}</SeedPhrase>
          <Alert severity="warning">
            Guarda esta frase en un lugar seguro. La necesitarás para recuperar
            tu cuenta.
          </Alert>
          <Button
            variant="outlined"
            color="primary"
            onClick={handleWalletCreated}
            fullWidth
          >
            Abre tu nueva billetera
          </Button>
        </Stack>
      )}
    </Stack>
  );
};

export default CreateAccount;
