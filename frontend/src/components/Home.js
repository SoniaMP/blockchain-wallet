import { Box, Button, Typography } from "@mui/material";
import MoneyIcon from "@mui/icons-material/MonetizationOnOutlined";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
        <Typography variant="h3">CodeWallet</Typography>
        <MoneyIcon fontSize="large" />
      </Box>
      <Typography>Bienvenido a tu Wallet</Typography>
      <Button variant="contained" onClick={() => navigate("/yourwallet")}>
        Ir a tu Wallet
      </Button>
    </div>
  );
};

export default Home;
