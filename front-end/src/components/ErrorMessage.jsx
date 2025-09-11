import React from "react";

/**
 * ErrorMessage Component
 * Displays error messages with different colors based on error type
 *
 * @param {Object} props
 * @param {string} props.message - The error message to display
 * @param {string} props.type - The type of error ('server', 'auth', 'validation', 'network', 'general')
 * @param {boolean} props.show - Whether to show the error message
 * @param {function} props.onClose - Function to call when closing the error
 * @param {string} props.className - Additional CSS classes
 */
const ErrorMessage = ({
  message,
  type = "general",
  show = true,
  onClose,
  className = "",
}) => {
  if (!show || !message) return null;

  const getErrorStyles = (errorType) => {
    switch (errorType) {
      case "server":
        return {
          container: "bg-red-100 border-red-300 text-red-800",
          icon: "🔴",
          title: "שגיאת שרת",
        };
      case "auth":
        return {
          container: "bg-orange-100 border-orange-300 text-orange-800",
          icon: "🔐",
          title: "שגיאת אימות",
        };
      case "validation":
        return {
          container: "bg-yellow-100 border-yellow-300 text-yellow-800",
          icon: "⚠️",
          title: "שגיאת אימות נתונים",
        };
      case "network":
        return {
          container: "bg-blue-100 border-blue-300 text-blue-800",
          icon: "🌐",
          title: "שגיאת רשת",
        };
      case "success":
        return {
          container: "bg-green-100 border-green-300 text-green-800",
          icon: "✅",
          title: "הצלחה",
        };
      default:
        return {
          container: "bg-gray-100 border-gray-300 text-gray-800",
          icon: "❌",
          title: "שגיאה",
        };
    }
  };

  const styles = getErrorStyles(type);

  return (
    <div
      className={`rounded-lg border px-4 py-3 text-sm ${styles.container} ${className}`}
    >
      <div className="flex items-start">
        <span className="text-lg mr-2 flex-shrink-0">{styles.icon}</span>
        <div className="flex-1">
          <div className="font-semibold mb-1">{styles.title}</div>
          <div className="text-sm">{message}</div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="ml-2 text-lg hover:opacity-70 flex-shrink-0"
            aria-label="סגור הודעת שגיאה"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
};

/**
 * Hook for managing error states
 * @param {string} initialType - Initial error type
 * @returns {Object} Error state and handlers
 */
export const useErrorHandler = (initialType = "general") => {
  const [error, setError] = React.useState(null);
  const [errorType, setErrorType] = React.useState(initialType);

  const setServerError = (message) => {
    setError(message);
    setErrorType("server");
  };

  const setAuthError = (message) => {
    setError(message);
    setErrorType("auth");
  };

  const setValidationError = (message) => {
    setError(message);
    setErrorType("validation");
  };

  const setNetworkError = (message) => {
    setError(message);
    setErrorType("network");
  };

  const setGeneralError = (message) => {
    setError(message);
    setErrorType("general");
  };

  const setSuccess = (message) => {
    setError(message);
    setErrorType("success");
  };

  const clearError = () => {
    setError(null);
    setErrorType(initialType);
  };

  return {
    error,
    errorType,
    setServerError,
    setAuthError,
    setValidationError,
    setNetworkError,
    setGeneralError,
    setSuccess,
    clearError,
    hasError: !!error,
  };
};

/**
 * Utility function to determine error type from axios error
 * @param {Object} error - Axios error object
 * @returns {Object} Error type and message
 */
export const getErrorInfo = (error) => {
  if (!error) return { type: "general", message: "שגיאה לא ידועה" };

  // Network error (no response)
  if (!error.response) {
    if (
      error.code === "NETWORK_ERROR" ||
      error.message.includes("Network Error")
    ) {
      return {
        type: "network",
        message: "שגיאת רשת - בדוק את החיבור לאינטרנט",
      };
    }
    return {
      type: "network",
      message: "שגיאת רשת - השרת לא זמין כרגע",
    };
  }

  const status = error.response.status;
  const data = error.response.data;

  // Authentication errors
  if (status === 401) {
    return {
      type: "auth",
      message: data?.message || "שם משתמש או סיסמה שגויים",
    };
  }

  if (status === 403) {
    return {
      type: "auth",
      message: "אין לך הרשאה לבצע פעולה זו",
    };
  }

  // Validation errors
  if (status === 400) {
    return {
      type: "validation",
      message: data?.message || "נתונים לא תקינים",
    };
  }

  if (status === 409) {
    return {
      type: "validation",
      message: data?.message || "הנתונים כבר קיימים במערכת",
    };
  }

  // Server errors
  if (status >= 500) {
    return {
      type: "server",
      message: "שגיאת שרת - נסה שוב מאוחר יותר",
    };
  }

  // Other errors
  return {
    type: "general",
    message: data?.message || "שגיאה לא ידועה",
  };
};

export default ErrorMessage;
