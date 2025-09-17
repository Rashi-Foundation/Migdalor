import { useState } from "react";
import Navbar from "@components/Navbar";
import StationNavigation from "@components/stations/StationNavigation";
import AssignmentComp from "@components/stations/AssinmentComp";
import StationManagement from "@components/stations/StationManagement";
import { useMe } from "@hooks/useMe";

const StationPage = () => {
  const [activeSection, setActiveSection] = useState("assignment");
  const [showAssignmentForm, setShowAssignmentForm] = useState(false);
  const { me } = useMe();
  const isAdmin = !!me?.isAdmin;

  const renderContent = () => {
    if (activeSection === "assignment") {
      return (
        <div className="theme-bg-secondary transition-colors duration-300 p-4 sm:p-6 lg:p-5 overflow-y-auto">
          <AssignmentComp
            showForm={isAdmin && showAssignmentForm}
            onCloseForm={() => setShowAssignmentForm(false)}
            isAdmin={isAdmin}
          />
        </div>
      );
    } else if (activeSection === "management") {
      return <StationManagement />;
    }
    return null;
  };

  return (
    <div className="theme-bg-primary min-h-screen transition-colors duration-300">
      <Navbar />
      <div className="responsive-container py-4 theme-bg-primary">
        <StationNavigation
          activeSection={activeSection}
          onSectionChange={setActiveSection}
        />
        {renderContent()}
      </div>
    </div>
  );
};

export default StationPage;
