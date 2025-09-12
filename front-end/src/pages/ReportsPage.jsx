import ReportGenerator from "@components/reports/ReportGenerator";
import Navbar from "@components/Navbar";

const ReportsPage = () => {
  return (
    <div className="theme-bg-primary min-h-screen transition-colors duration-300">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <ReportGenerator />
      </div>
    </div>
  );
};

export default ReportsPage;
