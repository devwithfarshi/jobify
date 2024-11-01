import { Outlet, ScrollRestoration, useLocation } from "react-router-dom";
import Header from "../shared/Header";
import Sidebar from "../shared/Sidebar";
import useAuth from "../../hooks/useAuth";

const RootLayout = () => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  return (
    <>
      {!location.pathname.startsWith("/dashboard") && <Header />}
      {isAuthenticated && location.pathname.startsWith("/dashboard") && (
        <Sidebar />
      )}
      <main
        className={`duration-150 ${
          isAuthenticated && location.pathname.startsWith("/dashboard")
            ? "xl:pl-[300px]"
            : ""
        }`}
      >
        <Outlet />
        <ScrollRestoration />
      </main>
      <footer>Footer</footer>
    </>
  );
};
export default RootLayout;
