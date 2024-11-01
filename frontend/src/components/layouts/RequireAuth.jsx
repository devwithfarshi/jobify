import Cookie from "js-cookie";
import { Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { useEffect } from "react";
import { toast } from "sonner";
import AuthService from "../../services/AuthService";
const RequireAuth = () => {
  const location = useLocation();
  const { isAuthenticated, loadUser, logOut, isLoadingUser, setIsLoadingUser } =
    useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    const token = Cookie.get("token");
    (async () => {
      setIsLoadingUser(true);
      try {
        if (token) {
          const { data } = await AuthService.me();
          loadUser(data);
        } else {
          navigate("/login");
          toast.error("Please login to access the dashboard");
        }
      } catch (error) {
        navigate("/login");
        logOut();
        toast.error("Please login to access the dashboard");
        console.log("Error while fetching user data : ", error);
      } finally {
        setIsLoadingUser(false);
      }
    })();
  }, []);
  if (isLoadingUser) {
    return (
      <div className="grid place-items-center min-h-screen">
        <h2 className="text-4xl font-semibold btn-shine">Jobify</h2>
      </div>
    );
  }
  return isAuthenticated ? (
    <Outlet />
  ) : (
    <Navigate to={"/login"} replace state={{ from: location }} />
  );
};
export default RequireAuth;
