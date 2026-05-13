import React, { useEffect, useState } from "react";
import {
  X,
  Search,
  Sparkles,
  Pill,
  Stethoscope,
} from "lucide-react";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
  fetchAIFilteredProducts,
} from "../../store/slices/productSlice.js";

import { toggleAIModal } from "../../store/slices/popupSlice.js";

const exampleQueries = [
  "Medicine for headache and fever",
  "Sugar free cough syrup",
  "Skincare products for dry skin",
  "First aid essentials",
  "Baby care products",
  "Protein supplements for gym",
];

const AISearchModal = () => {
  const [userPrompt, setUserPrompt] = useState("");

  const dispatch = useDispatch();
  const location = useLocation();

  const { aiSearching } = useSelector((state) => state.product);

  const { isAIPopupOpen } = useSelector((state) => state.popup);

  // Close modal on ESC key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") {
        dispatch(toggleAIModal());
      }
    };

    window.addEventListener("keydown", handleEsc);

    return () => window.removeEventListener("keydown", handleEsc);
  }, [dispatch]);

  useEffect(() => {
  const params = new URLSearchParams(location.search);

  const search = params.get("search");

  if (search) {
    setUserPrompt(search);
  }
}, [location.search]);

  // Prevent rendering when modal closed
  if (!isAIPopupOpen) return null;

  const handleSearch = async (e) => {
    e.preventDefault();

    if (!userPrompt.trim()) return;

    await dispatch(
  fetchAIFilteredProducts({
    userPrompt,
  })
);

    dispatch(toggleAIModal());
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-sm p-4">
      {/* Modal */}
      <div className="relative w-full max-w-2xl mx-auto my-10 rounded-3xl bg-white shadow-2xl border border-[#D6EEEE] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Decorative Top Gradient */}
        <div className="h-2 bg-gradient-to-r from-[#0F766E] via-[#14B8A6] to-[#A6D6D6]" />

        <div className="p-6 md:p-8">
          {/* Header */}
          <div className="flex items-start justify-between gap-4 mb-6">
            <div className="flex items-center gap-4">
              
              {/* Icon */}
              <div className="w-14 h-14 rounded-2xl bg-[#E6F7F7] flex items-center justify-center shadow-sm">
                <Sparkles className="w-7 h-7 text-[#0F766E]" />
              </div>

              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  Smart Pharmacy Search
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  Describe your needs naturally and PharmaAssist will
                  help find relevant healthcare products.
                </p>
              </div>
            </div>

            {/* Close */}
            <button
              onClick={() => dispatch(toggleAIModal())}
              className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="space-y-5">
            
            {/* Input */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />

              <input
                type="text"
                placeholder="e.g. 'Pain relief medicine for body aches'"
                value={userPrompt}
                onChange={(e) => setUserPrompt(e.target.value)}
                autoFocus
                required
                className="w-full rounded-2xl border border-[#D6EEEE] bg-[#FAFEFE] py-4 pl-12 pr-4 text-gray-700 placeholder:text-gray-400 outline-none transition-all focus:border-[#14B8A6] focus:ring-4 focus:ring-[#14B8A6]/10"
              />
            </div>

            {/* Search Button */}
            <button
              type="submit"
              disabled={aiSearching || !userPrompt.trim()}
              className={`w-full rounded-2xl py-4 font-semibold text-white transition-all duration-200 flex items-center justify-center gap-2
              
              ${
                aiSearching
                  ? "bg-[#0F766E]/80 cursor-not-allowed"
                  : "bg-[#0F766E] hover:bg-[#115E59] hover:shadow-lg"
              }`}
            >
              {aiSearching ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />

                  <span>Searching healthcare products...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />

                  <span>Search Smartly</span>
                </>
              )}
            </button>
          </form>

          {/* Feature Tags */}
          <div className="flex flex-wrap gap-3 mt-6">
            <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-[#F0FAFA] text-[#0F766E] text-sm">
              <Pill className="w-4 h-4" />
              Medicine Search
            </div>

            <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-[#F0FAFA] text-[#0F766E] text-sm">
              <Stethoscope className="w-4 h-4" />
              Symptom-Based Queries
            </div>

            <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-[#F0FAFA] text-[#0F766E] text-sm">
              <Sparkles className="w-4 h-4" />
              Smart Recommendations
            </div>
          </div>

          {/* Examples */}
          <div className="mt-8">
            <p className="text-sm font-medium text-gray-600 mb-3">
              Try searching for:
            </p>

            <div className="flex flex-wrap gap-3">
              {exampleQueries.map((example) => (
                <button
                  key={example}
                  type="button"
                  onClick={() => setUserPrompt(example)}
                  className="rounded-full border border-[#D6EEEE] bg-white px-4 py-2 text-sm text-gray-700 transition-all hover:border-[#14B8A6] hover:bg-[#F0FAFA]"
                >
                  {example}
                </button>
              ))}
            </div>
          </div>

          {/* Disclaimer */}
          <div className="mt-8 rounded-2xl bg-amber-50 border border-amber-200 p-4">
            <p className="text-sm text-amber-800 leading-relaxed">
              PharmaAssist provides AI-assisted product search and
              recommendations. It does not replace professional medical
              advice, diagnosis, or treatment.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AISearchModal;