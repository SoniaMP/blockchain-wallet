import { styled, Typography } from "@mui/material";

export const SeedPhrase = styled(Typography)(({ theme }) => ({
  fontFamily: "monospace",
  fontSize: "small",
  wordBreak: "break-word",
  padding: theme.spacing(2),
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.background.paper,
}));
