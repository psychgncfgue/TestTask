import { Box, CircularProgress, useTheme } from "@mui/material";

interface OverlayLoaderProps {
  visible: boolean;
}

export default function OverlayLoader({ visible }: OverlayLoaderProps) {
  const theme = useTheme();

  if (!visible) return null;

  return (
    <Box
      sx={{
        position: "absolute",
        inset: 0,
        backgroundColor: theme.palette.action.disabledBackground || "rgba(255,255,255,0.6)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 10,
      }}
    >
      <CircularProgress
        sx={{
          color: theme.palette.primary.main,
        }}
      />
    </Box>
  );
}