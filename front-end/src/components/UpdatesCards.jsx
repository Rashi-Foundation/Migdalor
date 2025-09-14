import { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import serverUrl from "@config/api";
import { useNavigate, createSearchParams, Link } from "react-router-dom";
import ErrorMessage, { useErrorHandler, getErrorInfo } from "./ErrorMessage";

// This will be moved inside the component to use translations
const UpdatesSection = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [values, setValues] = useState({
    inactiveWorkers: 0,
    activeWorkers: 0,
    dailyDefects: 0,
    inactiveStations: 0,
  });

  const { error, errorType, clearError, setNetworkError, setServerError } =
    useErrorHandler();

  // Move SECTIONS_META inside component to use translations
  const SECTIONS_META = [
    {
      key: "inactiveWorkers",
      name: t("updatesCards.inactiveWorkers"),
      color: "#FDF5F5",
      to: () => ({
        pathname: "/employees",
        search: `?${createSearchParams({ status: "לא פעיל" })}`,
      }),
    },
    {
      key: "activeWorkers",
      name: t("updatesCards.activeWorkers"),
      color: "#E9F7F5",
      to: () => ({
        pathname: "/employees",
        search: `?${createSearchParams({ status: "פעיל" })}`,
      }),
    },
    {
      key: "dailyDefects",
      name: t("updatesCards.dailyDefects"),
      color: "#F5F8FD",
      to: null,
    },
    {
      key: "inactiveStations",
      name: t("updatesCards.inactiveStations"),
      color: "#FDFCF5",
      to: null,
    },
  ];

  const sections = useMemo(
    () =>
      SECTIONS_META.map((m) => ({
        ...m,
        value: values[m.key] ?? 0,
      })),
    [values, SECTIONS_META]
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        clearError();
        const response = await fetch(`${serverUrl}/api/dashboard-data`);
        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();

        setValues({
          inactiveWorkers: data.inactiveWorkers ?? 0,
          activeWorkers: data.activeWorkers ?? 0,
          dailyDefects: data.dailyDefects ?? 0,
          inactiveStations: data.inactiveStations ?? 0,
        });
      } catch (err) {
        const errorInfo = getErrorInfo(err);

        if (errorInfo.type === "network") {
          setNetworkError(errorInfo.message);
        } else if (errorInfo.type === "server") {
          setServerError(errorInfo.message);
        } else {
          setServerError(t("updatesCards.dashboardError"));
        }
      }
    };

    fetchData();
  }, []);

  if (error) {
    return (
      <div className="p-5 font-sans">
        <ErrorMessage
          message={error}
          type={errorType}
          show={!!error}
          onClose={clearError}
        />
      </div>
    );
  }

  return (
    <div className="responsive-container py-4 sm:py-6 font-sans">
      <div className="responsive-grid">
        {sections.map((section, index) => {
          const canNavigate = typeof section.to === "function";
          const handleClick = () => {
            if (!canNavigate) return;
            const to = section.to();
            navigate(to);
          };

          return (
            <div
              key={index}
              className="responsive-card flex flex-col justify-between items-center text-center transition-all duration-300 hover:theme-shadow-lg hover:scale-105 touch-target"
            >
              <h2 className="responsive-text font-semibold theme-text-primary mb-3 sm:mb-4 lg:mb-5">
                {section.name}
              </h2>
              <div className="flex flex-col items-center">
                <span className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-1 theme-text-primary">
                  {section.value}
                </span>
                {section.today && (
                  <span className="text-xs sm:text-sm theme-text-secondary">
                    {section.today}
                  </span>
                )}
              </div>

              {canNavigate ? (
                <button
                  onClick={handleClick}
                  className="mt-2 text-xs sm:text-sm theme-text-primary hover:theme-accent focus:outline-none underline transition-colors duration-200 touch-target"
                >
                  {t("updatesCards.viewDetails")}
                </button>
              ) : (
                // If there's no target, show disabled look or hide:
                <span className="mt-2 text-xs sm:text-sm theme-text-tertiary cursor-not-allowed">
                  {t("updatesCards.noDetails")}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default UpdatesSection;
