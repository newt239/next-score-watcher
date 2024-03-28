import { BrowserRouter, Route, Routes } from "react-router-dom";

import { ChakraProvider } from "@chakra-ui/react";

import HomePage from "~/pages";
import AQLPage from "~/pages/aql";
import AQLBoardPage from "~/pages/aql/game_id";
import ConfigPage from "~/pages/game_id/config";
import OptionPage from "~/pages/option";
import WebhookPage from "~/pages/option/webhook";
import PlayerPage from "~/pages/players";
import QuizPage from "~/pages/quiz";
import RulePage from "~/pages/rules";

import Footer from "~/features/components/Footer";
import ScrollTop from "~/features/components/ScrollTop";
import UpdateModal from "~/features/components/UpdateModal";
import Layout from "~/layouts/default";
import BoardPage from "~/pages/game_id/board";
import GamesPage from "~/pages/games";

import "~/globals.css";
import "~/index.css";

function App() {
  return (
    <ChakraProvider resetCSS={false}>
      <BrowserRouter>
        <ScrollTop />
        <div>
          <Routes>
            <Route element={<BoardPage />} path="/games/:game_id/board" />
            <Route element={<Layout />} path="/">
              <Route element={<HomePage />} index />
              <Route path="games">
                <Route element={<GamesPage />} index />
                <Route element={<ConfigPage />} path=":game_id/config" />
              </Route>
              <Route path="aql">
                <Route element={<AQLPage />} index />
                <Route element={<AQLBoardPage />} path=":game_id" />
              </Route>
              <Route element={<RulePage />} path="rules" />
              <Route element={<PlayerPage />} path="players" />
              <Route element={<QuizPage />} path="quizes" />
              <Route path="option">
                <Route element={<OptionPage />} index />
                <Route element={<WebhookPage />} path="webhook" />
              </Route>
            </Route>
          </Routes>
        </div>
        <Footer />
        <UpdateModal />
      </BrowserRouter>
    </ChakraProvider>
  );
}

export default App;
