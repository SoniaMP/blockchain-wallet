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
        Escribe tu frase semilla en el campo de abajo para recuperar tu
        billetera (debería incluir 12 palabras separadas por espacios)
      </Alert>

      <TextField
        fullWidth
        rows={6}
        multiline
        onChange={seedAdjust}
        placeholder="Introduce tu frase semilla"
      />

      <Button
        variant="contained"
        disabled={
          seedPhrase.split(" ").length !== 12 || seedPhrase.slice(-1) === " "
        }
        onClick={recoverWallet}
      >
        Recuperar Billetera
      </Button>

      {nonValid && (
        <Typography color="error">Frase semilla inválida</Typography>
      )}
    </Stack>
  );
};

export default RecoverAccount;
