import React from 'react';
import { Container } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './components/Home/Home';
import Navbar from './components/Navbar/Navbar';
import Auth from './components/Auth/Auth';
import PostDetails from './components/PostDetails/PostDetails';

const theme = createTheme({
  palette: {
    primary: { main: "#0E7C66" },
    secondary: { main: "#FF7A59" },
    background: { default: "#f7f8fc" },
  },
  shape: {
    borderRadius: 12,
  },
  typography: {
    fontFamily:
      'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji"',
    h1: { fontWeight: 700 },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 700 },
    button: { textTransform: "none", fontWeight: 600 },
  },
  components: {
    MuiPaper: {
      defaultProps: { elevation: 2 },
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 15,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
        },
      },
    },
  },
});

const App = () => {
  const user = JSON.parse(localStorage.getItem('profile'));
  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <Container maxWidth="xl">
          <Navbar />
          <Routes>
            <Route path="/" element={<Navigate to="/posts" />} />
            <Route path="/posts" element={<Home />} />
            <Route path="/posts/search" element={<Home />} />
            <Route path="/posts/:id" element={<PostDetails />} />
            <Route path="/auth" element={!user ? <Auth /> : <Navigate to="/posts" />} />
          </Routes>
        </Container>
      </ThemeProvider>
    </BrowserRouter>
  );
};

export default App;
