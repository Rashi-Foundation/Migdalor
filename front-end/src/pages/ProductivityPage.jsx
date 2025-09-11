import ShlokerCheck from "@components/reports/ShlokerCheck";
import Navbar from "@components/Navbar";
import ReportGenerator from "@components/reports/ReportGenerator";

const ProductivityPage = () => {
  return (
    <div className="theme-bg-primary min-h-screen transition-colors duration-300">
      <Navbar />
      <ShlokerCheck />
      <ReportGenerator />
    </div>
  );
};

export default ProductivityPage;
