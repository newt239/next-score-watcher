import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "#/pages";
import useDeviceWidth from "#/hooks/useDeviceWidth";
import Header from "#/components/Header";
import BottomBar from "#/components/BottomBar";
import Footer from "#/components/Footer";
import { Container, Box } from "@chakra-ui/react";
import OptionPage from "#/pages/option";
import PlayerPage from "#/pages/player";
import QuizPage from "#/pages/quiz";
import ConfigPage from "#/pages/[game_id]/config";
import BoardPage from "#/pages/[game_id]/board";
import AQLPage from "./pages/aql";

import "#/styles/global.css";

function App() {
  const isDesktop = useDeviceWidth();

  return (
    <BrowserRouter>
      <Header />
      <Container sx={{ maxW: 1000, p: 5, margin: "auto" }}>
        <Routes>
          <Route index element={<HomePage />} />
          <Route path=":game_id">
            <Route path="config" element={<ConfigPage />} />
            <Route path="board" element={<BoardPage />} />
          </Route>
          <Route path="aql">
            <Route index element={<AQLPage />} />
            <Route path=":game_id" element={<AQLPage />} />
          </Route>
          <Route path="player" element={<PlayerPage />} />
          <Route path="quiz" element={<QuizPage />} />
          <Route path="option" element={<OptionPage />} />
        </Routes>
      </Container>
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
