import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  // Hide pagination if only 1 page exists
  if (totalPages <= 1) return null;

  // Generate page numbers dynamically
  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;

    // If total pages are small, show all
    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Near start
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }

        pages.push("...");
        pages.push(totalPages);
      }

      // Near end
      else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push("...");

        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      }

      // Middle pages
      else {
        pages.push(1);
        pages.push("...");

        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }

        pages.push("...");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const pages = getPageNumbers();

  return (
    <div className="flex items-center justify-center gap-2 mt-10 flex-wrap">
      {/* Previous Button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`flex items-center justify-center w-10 h-10 rounded-xl border transition-all duration-200
          ${
            currentPage === 1
              ? "cursor-not-allowed border-gray-200 text-gray-300 bg-gray-100"
              : "border-[#A6D6D6] text-[#0F766E] bg-white hover:bg-[#E6F7F7] hover:shadow-md"
          }`}
      >
        <ChevronLeft size={18} />
      </button>

      {/* Page Numbers */}
      {pages.map((page, index) => (
        <React.Fragment key={index}>
          {page === "..." ? (
            <span className="px-2 text-gray-400 font-medium">...</span>
          ) : (
            <button
              onClick={() => onPageChange(page)}
              className={`w-10 h-10 rounded-xl font-medium transition-all duration-200
                ${
                  currentPage === page
                    ? "bg-[#0F766E] text-white shadow-md scale-105"
                    : "bg-white border border-[#D6EEEE] text-gray-700 hover:bg-[#F0FAFA] hover:border-[#A6D6D6]"
                }`}
            >
              {page}
            </button>
          )}
        </React.Fragment>
      ))}

      {/* Next Button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`flex items-center justify-center w-10 h-10 rounded-xl border transition-all duration-200
          ${
            currentPage === totalPages
              ? "cursor-not-allowed border-gray-200 text-gray-300 bg-gray-100"
              : "border-[#A6D6D6] text-[#0F766E] bg-white hover:bg-[#E6F7F7] hover:shadow-md"
          }`}
      >
        <ChevronRight size={18} />
      </button>
    </div>
  );
};

export default Pagination;