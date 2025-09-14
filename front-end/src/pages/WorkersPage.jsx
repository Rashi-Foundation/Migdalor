import EmployeeItem from "@components/employees/EmployeeItem";
import Navbar from "@components/Navbar";

const WorkersPage = () => {
  return (
    <div className="theme-bg-primary min-h-screen transition-colors duration-300">
      <Navbar />
      <div className="responsive-container">
        <EmployeeItem />
      </div>
    </div>
  );
};

export default WorkersPage;
