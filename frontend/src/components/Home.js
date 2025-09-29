import { Box, Button, Stack, Typography } from "@mui/material";
import MoneyIcon from "@mui/icons-material/MonetizationOnOutlined";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    <Stack spacing={2} alignItems="center" mt={4}>
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <Typography variant="h5">CodeWallet</Typography>
        <MoneyIcon fontSize="large" />
      </Box>
      <Typography>Crear una cuenta</Typography>
      <Button
        variant="contained"
        onClick={() => navigate("/createwallet")}
        fullWidth
      >
        Crear Wallet
      </Button>
      <Button
        variant="contained"
        onClick={() => navigate("/recover")}
        fullWidth
      >
        Accede con tu frase semilla
      </Button>
    </Stack>
  );
};

export default Home;
