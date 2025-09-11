import React, { useMemo, useState } from "react";

const PAGE_SIZE = 12;

const EmployeeList = ({
  filteredEmployees = [],
  selectedEmployee,
  setSelectedEmployee,
}) => {
  const [page, setPage] = useState(1); // 1-based

  const total = filteredEmployees.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  // Clamp page if filters change
  if (page > totalPages) {
    setPage(totalPages);
  }

  const pageItems = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    const end = start + PAGE_SIZE;
    return filteredEmployees.slice(start, end);
  }, [filteredEmployees, page]);

  const goPrev = () => setPage((p) => Math.max(1, p - 1));
  const goNext = () => setPage((p) => Math.min(totalPages, p + 1));

  return (
    <div className="flex flex-col h-full">
      {/* Title */}
      <div className="theme-bg-tertiary theme-border-primary border-b px-4 py-2 rounded-t-lg transition-colors duration-300">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold theme-text-primary">
            רשימת עובדים ({total})
          </h2>
        </div>
      </div>

      {/* List: only 10 items */}
      <div className="flex-grow theme-bg-secondary rounded-b-lg theme-shadow-sm transition-colors duration-300">
        {total === 0 ? (
          <p className="p-4 text-center theme-text-tertiary">לא נמצאו עובדים</p>
        ) : (
          <ul className="divide-y theme-border-primary">
            {pageItems.map((emp, idxOnPage) => {
              const key =
                emp._id ??
                emp.person_id ??
                `${emp.first_name}-${emp.last_name}-${idxOnPage}`;
              const isSelected =
                selectedEmployee &&
                (selectedEmployee._id ?? selectedEmployee.person_id) ===
                  (emp._id ?? emp.person_id);

              const absoluteIndex = (page - 1) * PAGE_SIZE + idxOnPage;

              return (
                <li
                  key={key}
                  onClick={() => setSelectedEmployee(emp)}
                  className={`flex items-center justify-between cursor-pointer px-4 py-3 transition-colors duration-200 ${
                    isSelected
                      ? "theme-accent text-white"
                      : "hover:theme-bg-tertiary theme-text-primary"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-8 h-8 flex items-center justify-center rounded-full text-sm font-semibold ${
                        isSelected
                          ? "bg-white theme-text-primary"
                          : "theme-bg-tertiary theme-text-primary"
                      }`}
                    >
                      {absoluteIndex + 1}
                    </span>
                    <span>
                      {emp.first_name} {emp.last_name}
                    </span>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* Slider pager (mobile-friendly) */}
      {totalPages > 1 && (
        <div className="px-4 py-3 theme-bg-secondary theme-border-primary border-t rounded-b-lg transition-colors duration-300">
          <div className="flex items-center gap-3">
            <button
              onClick={goPrev}
              disabled={page === 1}
              className={`px-3 py-1 rounded theme-border-primary border transition-colors duration-200 ${
                page === 1
                  ? "theme-text-tertiary theme-bg-tertiary cursor-not-allowed"
                  : "hover:theme-bg-tertiary theme-text-primary"
              }`}
            >
              -
            </button>

            <input
              type="range"
              min={1}
              max={totalPages}
              value={page}
              onChange={(e) => setPage(Number(e.target.value))}
              className="flex-1"
            />

            <button
              onClick={goNext}
              disabled={page === totalPages}
              className={`px-3 py-1 rounded theme-border-primary border transition-colors duration-200 ${
                page === totalPages
                  ? "theme-text-tertiary theme-bg-tertiary cursor-not-allowed"
                  : "hover:theme-bg-tertiary theme-text-primary"
              }`}
            >
              +
            </button>
          </div>
          <div className="text-center text-xs theme-text-tertiary mt-1">
            מציג {Math.min((page - 1) * PAGE_SIZE + 1, total)}–
            {Math.min(page * PAGE_SIZE, total)} מתוך {total}
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeList;
