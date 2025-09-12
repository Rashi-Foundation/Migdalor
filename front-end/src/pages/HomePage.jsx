import Navbar from "@components/Navbar";
import DateTime from "@components/DateTime";
import UpdatesCards from "@components/UpdatesCards";
import ProductionEfficiencyChart from "@components/ProductionEfficiencyChart";
import DepartmentPerformanceOverview from "@components/DepartmentPerformanceOverview";
import ProductionQualityDashboard from "@components/ProductionQualityDashboard";

const HomePage = () => {
  return (
    <div className="theme-bg-primary min-h-screen transition-colors duration-300">
      <Navbar />
      <DateTime />

      {/* Original Updates Cards */}
      <UpdatesCards />

      {/* New Enhanced Components */}
      <div className="p-5">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Production Efficiency Chart */}
          <div className="lg:col-span-1">
            <ProductionEfficiencyChart />
          </div>

          {/* Department Performance Overview */}
          <div className="lg:col-span-1">
            <DepartmentPerformanceOverview />
          </div>

          {/* Production Quality Dashboard */}
          <div className="lg:col-span-1">
            <ProductionQualityDashboard />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
