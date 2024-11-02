import { Outlet, ScrollRestoration, useLocation } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import Header from "../shared/Header";
import Sidebar from "../shared/Sidebar";

const RootLayout = () => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  return (
    <>
      {!location.pathname.startsWith("/dashboard") &&
        !location.pathname.startsWith("/login") && <Header />}

      <main
        className={`duration-150 bg-gray-100 ${
          isAuthenticated && location.pathname.startsWith("/dashboard")
            ? " flex gap-4"
            : ""
        }`}
      >
        {isAuthenticated && location.pathname.startsWith("/dashboard") && (
          <Sidebar />
        )}
        <div className="h-screen overflow-auto flex-1">
          <Outlet />
        </div>
        <ScrollRestoration />
      </main>
    </>
  );
};
export default RootLayout;
