import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import DepartmentDropdown from "../DepartmentDropdown";
import ProductDropdown from "../ProductDropdown";
import axios from "axios";
import { Filter, Loader } from "lucide-react";
import serverUrl from "@config/api";

const StationItem = ({ onSelectStation, onAssignmentButtonClick, isAdmin }) => {
  const { t } = useTranslation();
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [selectedProduct, setSelectedProduct] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [stations, setStations] = useState([]);
  const [error, setError] = useState(null);
  const [selectedStation, setSelectedStation] = useState(null);

  const handleDepartmentChange = (event) => {
    setSelectedDepartment(event.target.value);
  };

  const handleProductChange = (event) => {
    setSelectedProduct(event.target.value);
  };

  useEffect(() => {
    fetchStations();
  }, []);

  const fetchStations = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${serverUrl}/api/stations`);
      setStations(response.data);
      setIsLoading(false);
    } catch {
      setError(t("stationItem.error"));
      setIsLoading(false);
    }
  };

  const filteredStations = stations.filter((station) => {
    if (selectedDepartment === "all" && selectedProduct === "all") {
      return true;
    } else if (selectedDepartment === "all") {
      return station.product_name === selectedProduct;
    } else if (selectedProduct === "all") {
      return station.department === selectedDepartment;
    } else {
      return (
        station.department === selectedDepartment &&
        station.product_name === selectedProduct
      );
    }
  });

  const handleStationClick = (station) => {
    setSelectedStation(station);
    onSelectStation(station);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="animate-spin text-blue-500 mr-2" size={24} />
        <span className="text-lg font-semibold">
          {t("stationItem.loading")}
        </span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-4 text-red-500 bg-red-100 border border-red-400 rounded-md">
        <p className="font-semibold">
          {t("stationItem.error")}: {error}
        </p>
        <p className="mt-2">{t("stationItem.tryAgainLater")}</p>
      </div>
    );
  }

  return (
    <div className="theme-bg-secondary theme-shadow-md rounded-lg p-4 sm:p-6 max-w-full sm:max-w-md mx-auto flex flex-col h-[500px] sm:h-[700px] transition-colors duration-300">
      <div className="flex-none">
        <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 theme-text-primary text-center">
          {t("stationItem.title")}
        </h1>
        <div className="mb-4 sm:mb-6 theme-bg-tertiary p-3 sm:p-4 rounded-md transition-colors duration-300">
          <h2 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3 flex items-center theme-text-primary">
            <Filter className="mr-2" size={18} />
            {t("stationItem.filter")}
          </h2>
          <div className="space-y-3 sm:space-y-4">
            <div className="flex flex-col">
              <label className="mb-1 text-sm font-medium theme-text-secondary">
                {t("stationItem.filterByDepartment")}
              </label>
              <DepartmentDropdown
                value={selectedDepartment}
                onChange={handleDepartmentChange}
                includeAllOption={true}
                className="p-2 theme-border-primary border rounded-md focus:ring-2 focus:ring-[var(--accent-primary)] focus:border-[var(--accent-primary)] text-sm sm:text-base theme-bg-secondary theme-text-primary transition-colors duration-200"
              />
            </div>
            <div className="flex flex-col">
              <label className="mb-1 text-sm font-medium theme-text-secondary">
                {t("stationItem.filterByProduct")}
              </label>
              <ProductDropdown
                value={selectedProduct}
                onChange={handleProductChange}
                includeAllOption={true}
                className="p-2 theme-border-primary border rounded-md focus:ring-2 focus:ring-[var(--accent-primary)] focus:border-[var(--accent-primary)] text-sm sm:text-base theme-bg-secondary theme-text-primary transition-colors duration-200"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex-grow overflow-y-auto">
        <ul className="space-y-2">
          {filteredStations.map((station) => (
            <li
              key={station._id}
              onClick={() => handleStationClick(station)}
              className={`cursor-pointer p-2 sm:p-3 rounded-md theme-shadow-sm transition duration-150 ease-in-out ${
                selectedStation && selectedStation._id === station._id
                  ? "theme-accent text-white"
                  : "theme-bg-tertiary hover:theme-bg-primary theme-text-primary"
              }`}
            >
              <div className="font-medium text-sm sm:text-base">
                {station.station_name}
              </div>
              <div className="text-xs sm:text-sm theme-text-tertiary mt-1">
                {station.department} - {station.product_name}
              </div>
            </li>
          ))}
        </ul>

        {filteredStations.length === 0 && (
          <p className="text-center theme-text-tertiary mt-4 text-sm sm:text-base">
            {t("stationItem.noStationsFound")}
          </p>
        )}
      </div>
      <div className="mt-4">
        <button
          onClick={() => isAdmin && onAssignmentButtonClick()}
          className={`w-full font-bold py-2 px-4 rounded flex items-center justify-center transition-all duration-200 ${
            selectedStation && isAdmin
              ? "theme-accent theme-accent-hover text-white cursor-pointer hover:scale-105"
              : "theme-bg-tertiary theme-text-tertiary cursor-not-allowed"
          }`}
          disabled={!selectedStation || !isAdmin}
          title={!isAdmin ? t("stationItem.adminsOnly") : ""}
        >
          {t("stationItem.performAssignment")}
        </button>
      </div>
    </div>
  );
};

export default StationItem;
