import { useContext } from "react";
import { JobContext } from "../context/JobContext";

const useJob = () => useContext(JobContext);
export default useJob;
