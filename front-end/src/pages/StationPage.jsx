import { useState } from "react";
import Navbar from "@components/Navbar";
import StationNavigation from "@components/stations/StationNavigation";
import StationItem from "@components/stations/StationItem";
import AssignmentComp from "@components/stations/AssinmentComp";
import StationManagement from "@components/stations/StationManagement";
import { useMe } from "@hooks/useMe";

const StationPage = () => {
  const [activeSection, setActiveSection] = useState("assignment");
  const [selectedStation, setSelectedStation] = useState(null);
  const [showAssignmentForm, setShowAssignmentForm] = useState(false);
  const { me } = useMe();
  const isAdmin = !!me?.isAdmin;

  const renderContent = () => {
    if (activeSection === "assignment") {
      return (
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            gap: "2px",
            height: "calc(100vh - 120px)",
          }}
        >
          <div
            className="theme-bg-tertiary transition-colors duration-300"
            style={{
              flex: "1",
              padding: "20px",
              overflowY: "auto",
            }}
          >
            <StationItem
              onSelectStation={setSelectedStation}
              onAssignmentButtonClick={() => setShowAssignmentForm(true)}
              isAdmin={isAdmin}
            />
          </div>
          <div
            className="theme-bg-secondary transition-colors duration-300"
            style={{
              flex: "3",
              padding: "20px",
              overflowY: "auto",
            }}
          >
            <AssignmentComp
              selectedStation={selectedStation}
              showForm={isAdmin && showAssignmentForm}
              onCloseForm={() => setShowAssignmentForm(false)}
              isAdmin={isAdmin}
            />
          </div>
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
      <div className="px-6 py-4 theme-bg-primary">
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
