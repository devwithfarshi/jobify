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
import Company from "../pages/Dashboard/Company";
import CreateNewCompany from "../pages/Dashboard/Company/CreateNewCompany";
import CompanyEdit from "../pages/Dashboard/Company/CompanyEdit";
import Users from "../pages/Dashboard/users/Users";
import CreateNewUser from "../pages/Dashboard/users/CreateNewUser";
import JobDetails from "../pages/JobDetails";
import CompanyProvider from "../context/CompanyContext";

export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <AuthProvider>
        <CompanyProvider>
          <RootLayout />
        </CompanyProvider>
      </AuthProvider>
    ),
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "/job-details/:jobId",
        element: <JobDetails />,
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
