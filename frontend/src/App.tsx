import "./App.css";
import { Route, Routes } from "react-router-dom";
import MainPage from "./pages/MainPage";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import HistoryPage from "./pages/HistoryPage";
import ExchangePage from "./pages/ExchangePage";
import Layout from "./Layout/Layout";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<MainPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/exchange" element={<ExchangePage />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
