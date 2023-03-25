import { BrowserRouter, Routes, Route } from "react-router-dom";

import { Box } from "@chakra-ui/react";

import ScrollTop from "#/blocks/ScrollTop";
import BottomBar from "#/components/BottomBar";
import Footer from "#/components/Footer";
import Header from "#/components/Header";
import useDeviceWidth from "#/hooks/useDeviceWidth";
import HomePage from "#/pages";
import BoardPage from "#/pages/[game_id]/board";
import ConfigPage from "#/pages/[game_id]/config";
import AQLPage from "#/pages/aql";
import AQLBoardPage from "#/pages/aql/[game_id]";
import OptionPage from "#/pages/option";
import PlayerPage from "#/pages/player";
import QuizPage from "#/pages/quiz";

import "#/styles/globals.css";

function App() {
  const isDesktop = useDeviceWidth();

  return (
    <BrowserRouter>
      <Header />
      <ScrollTop />
      <Routes>
        <Route index element={<HomePage />} />
        <Route path=":game_id">
          <Route path="config" element={<ConfigPage />} />
          <Route path="board" element={<BoardPage />} />
        </Route>
        <Route path="aql">
          <Route index element={<AQLPage />} />
          <Route path=":game_id" element={<AQLBoardPage />} />
        </Route>
        <Route path="player" element={<PlayerPage />} />
        <Route path="quiz" element={<QuizPage />} />
        <Route path="option" element={<OptionPage />} />
      </Routes>
      <Footer />
      {!isDesktop && (
        <>
          <Box sx={{ height: "10vh" }} />
          <BottomBar />
        </>
      )}
    </BrowserRouter>
  );
}

export default App;
