import { BrowserRouter, Route, Routes } from "react-router-dom";

import { ChakraProvider } from "@chakra-ui/react";

import NotFound from "~/NotFound";
import HomePage from "~/pages";
import AQLPage from "~/pages/aql";
import AQLBoardPage from "~/pages/aql/[game_id]";
import GamesPage from "~/pages/games";
import BoardPage from "~/pages/games/[game_id]/board";
import ConfigPage from "~/pages/games/[game_id]/config";
import OptionPage from "~/pages/option";
import WebhookPage from "~/pages/option/webhook";
import PlayerPage from "~/pages/players";
import QuizPage from "~/pages/quizes";
import RulePage from "~/pages/rules";

import ScrollTop from "~/features/components/ScrollTop";
import UpdateModal from "~/features/components/UpdateModal";
import Layout from "~/layouts/default";

import "~/globals.css";

function App() {
  return (
    <ChakraProvider>
      <BrowserRouter>
        <ScrollTop />
        <Routes>
          <Route element={<BoardPage />} path="/games/:game_id/board" />
          <Route element={<AQLBoardPage />} path="/aql/:game_id" />
          <Route element={<Layout />} path="/">
            <Route element={<HomePage />} index />
            <Route path="games">
              <Route element={<GamesPage />} index />
              <Route element={<ConfigPage />} path=":game_id/config" />
            </Route>
            <Route element={<RulePage />} path="rules" />
            <Route element={<PlayerPage />} path="players" />
            <Route element={<QuizPage />} path="quizes" />
            <Route path="aql">
              <Route element={<AQLPage />} index />
            </Route>
            <Route path="option">
              <Route element={<OptionPage />} index />
              <Route element={<WebhookPage />} path="webhook" />
            </Route>
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
        <UpdateModal />
      </BrowserRouter>
    </ChakraProvider>
  );
}

export default App;
