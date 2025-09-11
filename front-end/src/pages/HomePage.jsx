import Navbar from "@components/Navbar";
import DateTime from "@components/DateTime";
import UpdatesCards from "@components/UpdatesCards";

const HomePage = () => {
  return (
    <div className="theme-bg-primary min-h-screen transition-colors duration-300">
      <Navbar />
      <DateTime />
      <UpdatesCards />
    </div>
  );
};

export default HomePage;
