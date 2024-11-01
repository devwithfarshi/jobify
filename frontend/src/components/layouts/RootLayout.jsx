import { Outlet, ScrollRestoration } from "react-router-dom";

const RootLayout = () => {
  return (
    <>
      <header>Header</header>
      <main>
        <Outlet />
        <ScrollRestoration />
      </main>
      <footer>Footer</footer>
    </>
  );
};
export default RootLayout;
