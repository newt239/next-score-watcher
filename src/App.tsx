import { BrowserRouter, Route, Routes } from "react-router-dom";

import { Box } from "@chakra-ui/react";

import BottomBar from "#/components/block/BottomBar";
import Footer from "#/components/block/Footer";
import Header from "#/components/block/Header";
import ScrollTop from "#/components/block/ScrollTop";
import UpdateModal from "#/components/home/UpdateModal";
import useDeviceWidth from "#/hooks/useDeviceWidth";
import HomePage from "#/pages";
import AQLPage from "#/pages/aql";
import AQLBoardPage from "#/pages/aql/game_id";
import BoardPage from "#/pages/game_id/board";
import ConfigPage from "#/pages/game_id/config";
import OptionPage from "#/pages/option";
import WebhookPage from "#/pages/option/webhook";
import PlayerPage from "#/pages/player";
import QuizPage from "#/pages/quiz";
import RulePage from "#/pages/rule";

import "./globals.css";

function App() {
  const isDesktop = useDeviceWidth();

  return (
    <BrowserRouter>
      <Header />
      <ScrollTop />
      <Box sx={{ minH: "100vh" }}>
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
      </Box>
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
