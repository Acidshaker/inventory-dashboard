import { Box, CssBaseline, Typography, Divider } from "@mui/material";
import Loader from "../components/shared/Loader";
import Header from "../components/layouts/Header";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <CssBaseline />
      <Loader />

      {/* Layout base con flex vertical */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100vh",
        }}
      >
        {/* Header fijo */}
        <Box
          sx={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000 }}
        >
          <Header />
        </Box>

        {/* Espaciador para altura del Header */}
        <Box sx={{ height: "64px" }} />

        {/* Contenido central con scroll si se desborda */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            overflowY: "auto",
            px: 3,
            py: 2,
            bgcolor: "#fafafa",
          }}
        >
          {children}
        </Box>

        {/* Espaciador para altura del Footer */}
        <Box sx={{ height: "60px" }} />

        {/* Footer fijo */}
        <Box
          sx={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            textAlign: "center",
            p: 2,
            bgcolor: "#f5f5f5",
            borderTop: "1px solid #ccc",
            zIndex: 1000,
          }}
        >
          <Divider sx={{ mb: 1 }} />
          <Typography variant="body2" color="textSecondary">
            © {new Date().getFullYear()} Leader
          </Typography>
        </Box>
      </Box>
    </>
  );
};

export default DashboardLayout;
