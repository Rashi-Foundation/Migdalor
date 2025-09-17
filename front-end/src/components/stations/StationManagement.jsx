import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Plus, Edit2, Trash2, Save, X, AlertCircle } from "lucide-react";
import { http } from "../../api/http";
import { useMe } from "@hooks/useMe";

const Alert = ({ children, type = "info" }) => {
  const bgColor =
    type === "error"
      ? "bg-red-100 dark:bg-red-900/20"
      : type === "success"
      ? "bg-green-200 dark:bg-green-900/30"
      : "bg-blue-100 dark:bg-blue-900/20";
  const borderColor =
    type === "error"
      ? "border-red-500"
      : type === "success"
      ? "border-green-600"
      : "border-blue-500";
  const textColor =
    type === "error"
      ? "text-red-900 dark:text-red-300"
      : type === "success"
      ? "text-green-900 dark:text-green-100"
      : "text-blue-800 dark:text-blue-300";
  return (
    <div
      className={`${bgColor} border-l-4 ${borderColor} ${textColor} p-4 mb-4 rounded-r-md shadow-sm transition-colors duration-300`}
      role="alert"
    >
      {children}
    </div>
  );
};

const StationForm = ({ station, onSave, onCancel, isEditing }) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    station_name: "",
    department: "",
    product_name: "",
  });

  useEffect(() => {
    if (station && isEditing) {
      setFormData({
        station_name: station.station_name || "",
        department: station.department || "",
        product_name: station.product_name || "",
      });
    } else {
      setFormData({
        station_name: "",
        department: "",
        product_name: "",
      });
    }
  }, [station, isEditing]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="theme-bg-primary p-6 rounded-lg shadow-xl w-full max-w-md theme-border-primary border">
        <h2 className="text-xl font-bold mb-4 theme-text-primary">
          {isEditing
            ? t("stationManagement.editStation")
            : t("stationManagement.addStation")}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium theme-text-primary mb-1">
                {t("stationManagement.stationName")} *
              </label>
              <input
                type="text"
                value={formData.station_name}
                onChange={(e) =>
                  setFormData({ ...formData, station_name: e.target.value })
                }
                className="w-full px-3 py-2 theme-border-primary border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 theme-bg-secondary theme-text-primary"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium theme-text-primary mb-1">
                {t("stationManagement.department")} *
              </label>
              <input
                type="text"
                value={formData.department}
                onChange={(e) =>
                  setFormData({ ...formData, department: e.target.value })
                }
                className="w-full px-3 py-2 theme-border-primary border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 theme-bg-secondary theme-text-primary"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium theme-text-primary mb-1">
                {t("stationManagement.productName")} *
              </label>
              <input
                type="text"
                value={formData.product_name}
                onChange={(e) =>
                  setFormData({ ...formData, product_name: e.target.value })
                }
                className="w-full px-3 py-2 theme-border-primary border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 theme-bg-secondary theme-text-primary"
                required
              />
            </div>
          </div>
          <div className="flex justify-end space-x-2 mt-6">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 theme-text-tertiary hover:theme-text-primary transition-colors"
            >
              {t("common.cancel")}
            </button>
            <button
              type="submit"
              className="px-4 py-2 theme-accent text-white rounded-md theme-accent-hover transition-colors"
            >
              {isEditing ? t("common.save") : t("common.add")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const StationManagement = () => {
  const { t } = useTranslation();
  const { me } = useMe();
  const isAdmin = !!me?.isAdmin;

  const [stations, setStations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingStation, setEditingStation] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const fetchStations = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const { data } = await http.get("/stations");
      setStations(data);
    } catch (err) {
      setError(
        t("stationManagement.errorLoading") +
          ": " +
          (err.response?.data?.message || err.message)
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStations();
  }, []);

  const handleAddStation = () => {
    setEditingStation(null);
    setShowForm(true);
  };

  const handleEditStation = (station) => {
    setEditingStation(station);
    setShowForm(true);
  };

  const handleSaveStation = async (formData) => {
    try {
      setIsLoading(true);
      setError(null);

      if (editingStation) {
        // Update existing station
        await http.put(`/stations/${editingStation._id}`, formData);
        setSuccessMessage(t("stationManagement.stationUpdated"));
      } else {
        // Create new station
        await http.post("/stations", formData);
        setSuccessMessage(t("stationManagement.stationCreated"));
      }

      await fetchStations();
      setShowForm(false);
      setEditingStation(null);
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message;
      if (errorMessage.includes("already exists")) {
        setError(t("stationManagement.stationExists"));
      } else {
        setError(t("stationManagement.errorCreating") + ": " + errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteStation = async (station) => {
    try {
      setIsLoading(true);
      setError(null);
      await http.delete(`/stations/${station._id}`);
      setSuccessMessage(t("stationManagement.stationDeleted"));
      await fetchStations();
      setDeleteConfirm(null);
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message;
      if (errorMessage.includes("active assignments")) {
        setError(t("stationManagement.hasAssignments"));
      } else {
        setError(t("stationManagement.errorDeleting") + ": " + errorMessage);
      }
      // Close the delete modal when there's an error
      setDeleteConfirm(null);
    } finally {
      setIsLoading(false);
    }
  };

  const clearMessages = () => {
    setError(null);
    setSuccessMessage("");
  };

  if (!isAdmin) {
    return (
      <div className="p-6">
        <Alert type="error">{t("stationManagement.adminOnly")}</Alert>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold theme-text-primary">
          {t("stationManagement.title")}
        </h1>
        <button
          onClick={handleAddStation}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <Plus size={20} />
          {t("stationManagement.addStation")}
        </button>
      </div>

      {error && (
        <Alert type="error">
          <div className="flex items-start justify-between">
            <div className="flex items-start">
              <AlertCircle
                className="text-red-700 dark:text-red-400 mr-3 mt-0.5 flex-shrink-0"
                size={20}
              />
              <div>
                <div className="font-semibold text-red-900 dark:text-red-300 mb-1">
                  {t("common.error")}
                </div>
                <div className="text-red-900 dark:text-red-300">{error}</div>
              </div>
            </div>
            <button
              onClick={clearMessages}
              className="ml-4 text-red-700 hover:text-red-900 dark:text-red-400 dark:hover:text-red-200 flex-shrink-0"
              title={t("common.close")}
            >
              <X size={18} />
            </button>
          </div>
        </Alert>
      )}

      {successMessage && (
        <Alert type="success">
          <div className="flex items-start justify-between">
            <div className="flex items-start">
              <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
              <div>
                <div className="font-semibold text-green-900 dark:text-green-300 mb-1">
                  {t("common.success")}
                </div>
                <div className="text-green-900 dark:text-green-300">
                  {successMessage}
                </div>
              </div>
            </div>
            <button
              onClick={clearMessages}
              className="ml-4 text-green-700 hover:text-green-900 dark:text-green-400 dark:hover:text-green-200 flex-shrink-0"
              title={t("common.close")}
            >
              <X size={18} />
            </button>
          </div>
        </Alert>
      )}

      {isLoading && !stations.length ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 theme-text-primary">{t("common.loading")}</p>
        </div>
      ) : (
        <div className="theme-bg-primary rounded-lg shadow overflow-hidden theme-border-primary border">
          {stations.length === 0 ? (
            <div className="text-center py-8">
              <AlertCircle
                size={48}
                className="mx-auto theme-text-tertiary mb-4"
              />
              <p className="theme-text-primary">
                {t("stationManagement.noStations")}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y theme-border-primary">
                <thead className="theme-bg-tertiary">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium theme-text-primary uppercase tracking-wider">
                      {t("stationManagement.stationId")}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium theme-text-primary uppercase tracking-wider">
                      {t("stationManagement.stationName")}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium theme-text-primary uppercase tracking-wider">
                      {t("stationManagement.department")}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium theme-text-primary uppercase tracking-wider">
                      {t("stationManagement.productName")}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium theme-text-primary uppercase tracking-wider">
                      {t("stationManagement.actions")}
                    </th>
                  </tr>
                </thead>
                <tbody className="theme-bg-primary divide-y theme-border-primary">
                  {stations.map((station) => (
                    <tr
                      key={station._id}
                      className="hover:theme-bg-tertiary transition-colors duration-200"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium theme-text-primary">
                        {station.station_id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm theme-text-primary">
                        {station.station_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm theme-text-primary">
                        {station.department}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm theme-text-primary">
                        {station.product_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEditStation(station)}
                            className="text-blue-600 hover:text-blue-900 transition-colors duration-200"
                            title={t("stationManagement.editStation")}
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(station)}
                            className="text-red-600 hover:text-red-900 transition-colors duration-200"
                            title={t("stationManagement.deleteStation")}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {showForm && (
        <StationForm
          station={editingStation}
          onSave={handleSaveStation}
          onCancel={() => {
            setShowForm(false);
            setEditingStation(null);
          }}
          isEditing={!!editingStation}
        />
      )}

      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="theme-bg-primary p-6 rounded-lg shadow-xl max-w-md w-full theme-border-primary border">
            <div className="flex items-center mb-4">
              <AlertCircle className="text-red-600 mr-3" size={24} />
              <h3 className="text-lg font-medium theme-text-primary">
                {t("stationManagement.confirmDelete")}
              </h3>
            </div>
            <p className="text-sm theme-text-primary mb-6">
              {t("stationManagement.deleteWarning")}
            </p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 theme-text-tertiary hover:theme-text-primary transition-colors"
              >
                {t("common.cancel")}
              </button>
              <button
                onClick={() => handleDeleteStation(deleteConfirm)}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                {t("stationManagement.deleteStation")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StationManagement;
