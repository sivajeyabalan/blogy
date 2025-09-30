import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { createStore, applyMiddleware, compose } from "redux";
import { thunk } from "redux-thunk";
import { persistStore, persistReducer } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";
import storage from "redux-persist/lib/storage";
import { ThemeProvider, createTheme } from "@mui/material/styles"; // Import ThemeProvider
import reducers from "./reducers";
import App from "./App";
import "./index.css";

const theme = createTheme();

// Configure redux-persist
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["posts"], // Only persist the posts reducer
};

const persistedReducer = persistReducer(persistConfig, reducers);

const container = document.getElementById("root");
const root = createRoot(container);

// Add store ID to track if store is being recreated
const storeId = Math.random().toString(36).substr(2, 9);
console.log("🏪 Creating Redux store with ID:", storeId);

const store = createStore(persistedReducer, compose(applyMiddleware(thunk)));
const persistor = persistStore(store);

// Log store creation
console.log("🏪 Redux store created:", store.getState());

root.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <ThemeProvider theme={theme}>
        <App />
      </ThemeProvider>
    </PersistGate>
  </Provider>
);
