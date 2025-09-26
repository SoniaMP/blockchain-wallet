import React from "react";
import { Alert, Box, Button, Stack, Typography } from "@mui/material";

const CreateAccount = ({ onWalletCreated }) => {
  const [seedPhrase, setSeedPhrase] = React.useState("");

  function generateWallet() {
    const newSeedPhrase =
      "carpet, cat, flower, chair, foot, river, make, image, amazing, three, say, shoe";
    setSeedPhrase(newSeedPhrase);
  }

  function handleWalletCreated() {
    if (seedPhrase) {
      onWalletCreated(seedPhrase);
    }
  }

  return (
    <Box padding={2}>
      <Typography variant="h5">Crear una nueva cuenta</Typography>
      <Button variant="contained" onClick={generateWallet} fullWidth>
        Generar frase semilla
      </Button>
      {seedPhrase && (
        <Stack spacing={2} mt={2} alignItems="center">
          <Typography variant="h5">Tu frase semilla:</Typography>
          <Typography>{seedPhrase}</Typography>
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
    </Box>
  );
};

export default CreateAccount;
