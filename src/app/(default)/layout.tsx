import BottomBar from "#/app/(default)/_components/BottomBar";
import Header from "#/app/(default)/_components/Header";

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
