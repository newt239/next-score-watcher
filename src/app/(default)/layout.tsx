import BottomBar from "./_components/BottomBar";
import Header from "./_components/Header";

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      {children}
      <BottomBar />
    </>
  );
}
