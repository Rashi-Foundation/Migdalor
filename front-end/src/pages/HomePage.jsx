import Navbar from "@components/Navbar";
import DateTime from "@components/DateTime";
import UpdatesCards from "@components/UpdatesCards";
import ProductionEfficiencyChart from "@components/ProductionEfficiencyChart";
import DepartmentPerformanceOverview from "@components/DepartmentPerformanceOverview";

const HomePage = () => {
  return (
    <div className="theme-bg-primary min-h-screen transition-colors duration-300">
      <Navbar />
      <DateTime />

      {/* Original Updates Cards */}
      <UpdatesCards />

      {/* New Enhanced Components */}
      <div className="responsive-container py-4 sm:py-6 lg:py-8">
        <div className="responsive-grid mb-6">
          {/* Production Efficiency Chart */}
          <div className="sm:col-span-1 lg:col-span-1">
            <ProductionEfficiencyChart />
          </div>

          {/* Department Performance Overview - Wider */}
          <div className="sm:col-span-1 lg:col-span-2">
            <DepartmentPerformanceOverview />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
