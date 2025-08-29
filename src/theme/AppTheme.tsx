import * as React from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import type { ThemeOptions } from "@mui/material/styles";
import { inputsCustomizations } from "./customizations/inputs";
import { dataDisplayCustomizations } from "./customizations/dataDisplay";
import { feedbackCustomizations } from "./customizations/feedback";
import { navigationCustomizations } from "./customizations/navigation";
import { surfacesCustomizations } from "./customizations/surfaces";
import { colorSchemes, typography, shadows, shape } from "./themePrimitives";

interface AppThemeProps {
  children: React.ReactNode;
  /**
   * This is for the docs site. You can ignore it or remove it.
   */
  disableCustomTheme?: boolean;
  themeComponents?: ThemeOptions["components"];
}

export default function AppTheme(props: AppThemeProps) {
  const { children, disableCustomTheme, themeComponents } = props;
  const theme = React.useMemo(() => {
    return disableCustomTheme
      ? {}
      : createTheme({
          // For more details about CSS variables configuration, see https://mui.com/material-ui/customization/css-theme-variables/configuration/
          cssVariables: {
            colorSchemeSelector: "data-mui-color-scheme",
            cssVarPrefix: "template",
          },
          palette: {
            mode: "light",
            primary: {
              main: "#1976d2",
              contrastText: "#ffffff",
            },
            secondary: {
              main: "#8392ab",
            },
            background: {
              default: "#f8f9fa",
              paper: "#ffffff",
            },
            text: {
              primary: "#3447",
              secondary: "#333",
            },
            action: {
              selected: "#e9ecef",
              hover: "#f1f3f5",
            },
            divider: "#e9ecef",
          },
          components: {
            MuiIconButton: {
              styleOverrides: {
                root: ({ theme }) => ({
                  transition: "all 0.3s ease",
                  borderRadius: 8,
                  padding: 8,
                  "&:hover": {
                    backgroundColor:
                      theme.palette.mode === "dark"
                        ? theme.palette.primary.main
                        : "#d32f2f",
                    color: "#fff",
                  },
                  "&:focus": {
                    outline: "none",
                    boxShadow: "none",
                  },
                }),
              },
            },
            MuiTab: {
              styleOverrides: {
                root: ({ theme }) => ({
                  transition: "all 0.3s ease",
                  borderRadius: 8,
                  padding: 8,
                  "&:hover": {
                    backgroundColor: "transparent",
                  },
                  "&:focus": {
                    outline: "none",
                    boxShadow: "none",
                  },
                }),
              },
            },
            MuiDrawer: {
              styleOverrides: {
                paper: ({ theme }) => ({
                  background:
                    theme.palette.mode === "dark"
                      ? "linear-gradient(135deg, #1f1f1f, #2c2c2c)"
                      : "linear-gradient(135deg, #f5f7fa, #c3cfe2)",
                  borderRight: "none",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                }),
              },
            },
            MuiListItemButton: {
              styleOverrides: {
                root: ({ theme }) => ({
                  borderRadius: 8,
                  transition: "all 0.3s ease",
                  "&:hover": {
                    backgroundColor:
                      theme.palette.mode === "dark" ? "#2c2f33" : "#e0e7ff",
                    transform: "scale(1.02)",
                  },
                }),
              },
            },
            MuiButton: {
              styleOverrides: {
                root: {
                  "&:focus": {
                    outline: "none",
                    boxShadow: "none",
                  },
                  transition: "all 0.3s ease",
                  "&:hover": {
                    backgroundColor: "#c3cfe2",
                    color: "#fff",
                    borderColor: "#c3cfe2",
                  },
                },
              },
            },
            MuiListItemText: {
              styleOverrides: {
                primary: {
                  fontWeight: 500,
                  fontSize: "0.95rem",
                },
              },
            },
            MuiInputBase: {
              styleOverrides: {
                input: {
                  color: "#000",
                },
              },
            },

            // Aquí se integran tus overrides externos
            ...themeComponents,
          },
        });
  }, [disableCustomTheme, themeComponents]);
  if (disableCustomTheme) {
    return <React.Fragment>{children}</React.Fragment>;
  }
  return (
    <ThemeProvider theme={theme} disableTransitionOnChange>
      {children}
    </ThemeProvider>
  );
}
