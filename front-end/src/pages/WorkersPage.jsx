import EmployeeItem from "@components/employees/EmployeeItem";
import Navbar from "@components/Navbar";

const WorkersPage = () => {
  return (
    <div className="theme-bg-primary min-h-screen transition-colors duration-300">
      <Navbar />
      <EmployeeItem />
    </div>
  );
};

export default WorkersPage;
