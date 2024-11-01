import { createBrowserRouter } from "react-router-dom";
import RootLayout from "../components/layouts/RootLayout";
import Home from "../pages/Home";
import Login from "../pages/Auth/Login";
import Dashboard from "../pages/Dashboard/Dashboard";
import RequireAuth from "../components/layouts/RequireAuth";
import AuthProvider from "../context/AuthContext";
import Jobs from "../pages/Dashboard/job/Jobs";
import CreateNewJobs from "../pages/Dashboard/job/CreateNewJobs";
import UpdateJobs from "../pages/Dashboard/job/EditJob";
import Company from "../pages/Dashboard/company/Company";
import CreateNewCompany from "../pages/Dashboard/company/CreateNewCompany";
import CompanyEdit from "../pages/Dashboard/company/CompanyEdit";
import Users from "../pages/Dashboard/users/Users";
import CreateNewUser from "../pages/Dashboard/users/CreateNewUser";

export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <AuthProvider>
        <RootLayout />
      </AuthProvider>
    ),
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "/dashboard",
        element: <RequireAuth />,
        children: [
          {
            index: true,
            element: <Dashboard />,
          },
          {
            path: "jobs",
            element: <Jobs />,
          },
          {
            path: "jobs/new",
            element: <CreateNewJobs />,
          },
          {
            path: "jobs/edit/:jobId",
            element: <UpdateJobs />,
          },
          {
            path: "companies",
            element: <Company />,
          },
          {
            path: "companies/new",
            element: <CreateNewCompany />,
          },
          {
            path: "companies/edit/:companyId",
            element: <CompanyEdit />,
          },
          {
            path: "users",
            element: <Users />,
          },
          {
            path: "users/new",
            element: <CreateNewUser />,
          },
        ],
      },
      {
        path: "login",
        element: <Login />,
      },
    ],
  },
]);
