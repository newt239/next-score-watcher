import { BrowserRouter, Route, Routes } from "react-router-dom";

import { Box } from "@chakra-ui/react";

import Header from "./components/Header";
import UpdateModal from "./components/home/UpdateModal";
import WebhookPage from "./pages/option/webhook";
import RulePage from "./pages/rule";

import ScrollTop from "#/blocks/ScrollTop";
import BottomBar from "#/components/BottomBar";
import Footer from "#/components/Footer";
import useDeviceWidth from "#/hooks/useDeviceWidth";
import HomePage from "#/pages";
import AQLPage from "#/pages/aql";
import AQLBoardPage from "#/pages/aql/game_id";
import BoardPage from "#/pages/game_id/board";
import ConfigPage from "#/pages/game_id/config";
import OptionPage from "#/pages/option";
import PlayerPage from "#/pages/player";
import QuizPage from "#/pages/quiz";

import "./globals.css";

function App() {
  const isDesktop = useDeviceWidth();

  return (
    <BrowserRouter>
      <Header />
      <ScrollTop />
      <Routes>
        <Route element={<HomePage />} index />
        <Route path=":game_id">
          <Route element={<ConfigPage />} path="config" />
          <Route element={<BoardPage />} path="board" />
        </Route>
        <Route path="aql">
          <Route element={<AQLPage />} index />
          <Route element={<AQLBoardPage />} path=":game_id" />
        </Route>
        <Route element={<RulePage />} path="rule" />
        <Route element={<PlayerPage />} path="player" />
        <Route element={<QuizPage />} path="quiz" />
        <Route path="option">
          <Route element={<OptionPage />} index />
          <Route element={<WebhookPage />} path="webhook" />
        </Route>
      </Routes>
      <Footer />
      {!isDesktop && (
        <>
          <Box sx={{ height: "10vh" }} />
          <BottomBar />
        </>
      )}
      <UpdateModal />
    </BrowserRouter>
  );
}

export default App;
