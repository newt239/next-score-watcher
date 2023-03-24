import GameList from "#/components/home/GameList";
import Hero from "#/components/home/Hero";
import OtherRules from "#/components/home/OtherRules";
import RuleList from "#/components/home/RuleList";
import Term from "#/components/home/Term";
import UpdateModal from "#/components/home/UpdateModal";

const HomePage: React.FC = () => {
  return (
    <>
      <Hero />
      <GameList />
      <RuleList />
      <OtherRules />
      <Term />
      <UpdateModal />
    </>
  );
};

export default HomePage;
