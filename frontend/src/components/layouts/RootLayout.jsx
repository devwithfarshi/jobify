import { Outlet, ScrollRestoration } from "react-router-dom";
import Header from "../shared/Header";

const RootLayout = () => {
  return (
    <>
      <Header />
      <main>
        <Outlet />
        <ScrollRestoration />
      </main>
      <footer>Footer</footer>
    </>
  );
};
export default RootLayout;
