import { createContext, useEffect, useState } from "react";
import { toast } from "sonner";
import useAuth from "../hooks/useAuth";
import CompanyServices from "../services/CompanyServices";

export const CompanyContext = createContext();

const CompanyProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [companies, setCompanies] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    totalDocs: 0,
    limit: 10,
  });
  const [loading, setLoading] = useState(true);

  // fetch companies from the server
  const fetchCompanies = async (page = 1) => {
    setLoading(true);
    try {
      let query = `page=${page}&limit=${pagination.limit}`;
      const response = await CompanyServices.getAllCompanies(query);
      const { docs, totalPages, totalDocs } = response.data;
      setCompanies(docs);
      setPagination((prev) => ({
        ...prev,
        page,
        totalPages,
        totalDocs,
      }));
    } catch (error) {
      console.error("Failed to fetch companies:", error);
      toast.error("Failed to fetch companies. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // without login, no need to fetch companies
    if (!isAuthenticated) return;
    if (companies.length === 0) {
      fetchCompanies();
    }
  }, [isAuthenticated]);

  const handlePageChange = (event, newPage) => {
    fetchCompanies(newPage);
  };

  // handle delete company
  const handleDelete = async (companyId) => {
    try {
      const res = await CompanyServices.deleteCompany(companyId);
      if (res.success) {
        setCompanies((prevCompanies) =>
          prevCompanies.filter((company) => company._id !== companyId)
        );
        setPagination((prev) => ({
          ...prev,
          totalDocs: prev.totalDocs - 1,
        }));
        toast.success("Company deleted successfully");
      }
    } catch (error) {
      console.error("Failed to delete company:", error);
      toast.error("Failed to delete company. Please try again.");
    }
  };

  // handle create company
  const handleCreate = async (formData) => {
    try {
      const response = await CompanyServices.createCompany(formData);
      if (response.success) {
        setCompanies((prevCompanies) => [response.data, ...prevCompanies]);
        setPagination((prev) => ({
          ...prev,
          totalDocs: prev.totalDocs + 1,
        }));
      }
      return response;
    } catch (error) {
      return error;
    }
  };

  // handle update company
  const handleUpdate = async (companyId, formData) => {
    try {
      const response = await CompanyServices.updateCompany(companyId, formData);
      if (response.success) {
        setCompanies((prevCompanies) =>
          prevCompanies.map((company) =>
            company._id === companyId ? response.data : company
          )
        );
      }
      return response;
    } catch (error) {
      return error;
    }
  };

  return (
    <CompanyContext.Provider
      value={{
        companies,
        pagination,
        loading,
        fetchCompanies,
        handlePageChange,
        handleDelete,
        handleCreate,
        handleUpdate,
      }}
    >
      {children}
    </CompanyContext.Provider>
  );
};

export default CompanyProvider;
