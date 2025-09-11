import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

const DateTime = () => {
  const { i18n } = useTranslation();
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const locale = i18n.language === "he" ? "he-IL" : "en-US";
  const formattedDateTime = currentDateTime.toLocaleString(locale, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="text-center text-2xl text-gray-700 my-4">
      {formattedDateTime}
    </div>
  );
};

export default DateTime;
