import React from "react";
import { useTranslation } from "react-i18next";
import { Users, Settings, Calendar, Wrench } from "lucide-react";

const StationNavigation = ({ activeSection, onSectionChange }) => {
  const { t } = useTranslation();

  const sections = [
    {
      id: "assignment",
      title: t("stationPage.assignmentSection"),
      icon: Users,
      color: "from-blue-500 to-blue-600",
      hoverColor: "hover:from-blue-600 hover:to-blue-700",
    },
    {
      id: "management",
      title: t("stationPage.managementSection"),
      icon: Settings,
      color: "from-purple-500 to-purple-600",
      hoverColor: "hover:from-purple-600 hover:to-purple-700",
    },
  ];

  return (
    <div className="theme-bg-secondary p-3 mb-3 rounded-lg shadow-sm theme-border-primary border">
      <div className="text-center mb-3">
        <h1 className="text-lg font-bold theme-text-primary">
          {t("stationPage.title")}
        </h1>
      </div>

      <div className="flex justify-center">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-w-lg w-full">
          {sections.map((section) => {
            const Icon = section.icon;
            const isActive = activeSection === section.id;

            return (
              <button
                key={section.id}
                onClick={() => onSectionChange(section.id)}
                className={`
                  group relative p-3 rounded-md transition-all duration-300 transform
                  ${
                    isActive
                      ? `bg-gradient-to-br ${section.color} text-white shadow-md scale-101`
                      : `theme-bg-primary theme-text-primary shadow-sm hover:shadow-sm ${section.hoverColor}`
                  }
                  hover:scale-101 active:scale-99
                `}
              >
                {/* Decorative elements */}
                <div className="absolute top-1 right-1 opacity-10">
                  <Calendar
                    size={12}
                    className={isActive ? "text-white" : "text-gray-400"}
                  />
                </div>
                <div className="absolute bottom-1 left-1 opacity-10">
                  <Wrench
                    size={10}
                    className={isActive ? "text-white" : "text-gray-400"}
                  />
                </div>

                {/* Main content */}
                <div className="relative z-10">
                  <div
                    className={`
                    w-8 h-8 rounded-full flex items-center justify-center mb-2 mx-auto
                    ${
                      isActive
                        ? "bg-white text-gray-600"
                        : `bg-gradient-to-br ${section.color} text-white`
                    }
                  `}
                  >
                    <Icon size={16} />
                  </div>

                  <h3
                    className={`
                    text-sm font-bold
                    ${isActive ? "text-white" : "theme-text-primary"}
                  `}
                  >
                    {section.title}
                  </h3>

                  {/* Active indicator */}
                  {isActive && (
                    <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-white rounded-full flex items-center justify-center">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                    </div>
                  )}

                  {/* Hover effect overlay */}
                  <div
                    className={`
                    absolute inset-0 rounded-md opacity-0 group-hover:opacity-10 transition-opacity duration-300
                    ${
                      isActive
                        ? "bg-white"
                        : `bg-gradient-to-br ${section.color}`
                    }
                  `}
                  ></div>
                </div>

                {/* Animated border */}
                <div
                  className={`
                  absolute inset-0 rounded-md border-2 transition-all duration-300
                  ${
                    isActive
                      ? "border-white border-opacity-30"
                      : `border-transparent group-hover:border-opacity-50 group-hover:border-gradient-to-r group-hover:${section.color}`
                  }
                `}
                ></div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Section indicator */}
      <div className="flex justify-center mt-2">
        <div className="flex space-x-1">
          {sections.map((section) => (
            <div
              key={section.id}
              className={`
                w-1.5 h-1.5 rounded-full transition-all duration-300
                ${
                  activeSection === section.id
                    ? `bg-gradient-to-r ${section.color} scale-110`
                    : "theme-bg-tertiary"
                }
              `}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StationNavigation;
