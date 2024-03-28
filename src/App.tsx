import { BrowserRouter, Route, Routes } from "react-router-dom";

import { Box, ChakraProvider } from "@chakra-ui/react";

import Header from "~/features/components/Header";
import HomePage from "~/pages";
import AQLPage from "~/pages/aql";
import AQLBoardPage from "~/pages/aql/game_id";
import ConfigPage from "~/pages/game_id/config";
import OptionPage from "~/pages/option";
import WebhookPage from "~/pages/option/webhook";
import PlayerPage from "~/pages/players";
import QuizPage from "~/pages/quiz";
import RulePage from "~/pages/rules";

import { Footer } from "~/components/ui/card";
import ScrollTop from "~/features/components/ScrollTop";
import UpdateModal from "~/features/components/UpdateModal";
import GamesPage from "~/pages/games";

import "~/globals.css";
import "~/index.css";

function App() {
  return (
    <ChakraProvider resetCSS={false}>
      <BrowserRouter>
        <Header />
        <ScrollTop />
        <Box sx={{ minH: "100vh" }}>
          <Routes>
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
          </Routes>
        </Box>
        <Footer />
        <UpdateModal />
      </BrowserRouter>
    </ChakraProvider>
  );
}

export default App;
