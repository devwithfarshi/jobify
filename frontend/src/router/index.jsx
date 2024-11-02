import { createBrowserRouter } from "react-router-dom";
import RequireAuth from "../components/layouts/RequireAuth";
import RootLayout from "../components/layouts/RootLayout";
import AuthProvider from "../context/AuthContext";
import CompanyProvider from "../context/CompanyContext";
import Login from "../pages/Auth/Login";
import Dashboard from "../pages/Dashboard";
import Company from "../pages/Dashboard/Company";
import CompanyEdit from "../pages/Dashboard/Company/CompanyEdit";
import CreateNewCompany from "../pages/Dashboard/Company/CreateNewCompany";
import Jobs from "../pages/Dashboard/Job";
import CreateNewJobs from "../pages/Dashboard/Job/CreateNewJobs";
import UpdateJobs from "../pages/Dashboard/Job/EditJob";
import CreateNewUser from "../pages/Dashboard/Users/CreateNewUser";
import Users from "../pages/Dashboard/Users";
import Home from "../pages/Home";
import JobDetails from "../pages/JobDetails";
import JobProvider from "../context/JobContext";

export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <AuthProvider>
        <CompanyProvider>
          <JobProvider>
            <RootLayout />
          </JobProvider>
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
