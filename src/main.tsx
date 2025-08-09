import ReactDOM from "react-dom/client";
import AppRouter from "./routes/AppRouter";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./store/index.ts";
import { ToastContainer } from "react-toastify";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import "react-toastify/dist/ReactToastify.css";
import "./index.css";
import AppTheme from "./theme/AppTheme.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  // themeProvider

  <Provider store={store}>
    <AppTheme>
      <AppRouter />
    </AppTheme>
    <ToastContainer />
  </Provider>
);
