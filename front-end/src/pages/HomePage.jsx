import Navbar from "@components/Navbar";
import DateTime from "@components/DateTime";
import UpdatesCards from "@components/UpdatesCards";
import ThemeDemo from "@components/ThemeDemo";

const HomePage = () => {
  return (
    <div className="theme-bg-primary min-h-screen transition-colors duration-300">
      <Navbar />
      <DateTime />
      <UpdatesCards />
      <ThemeDemo />
    </div>
  );
};

export default HomePage;
