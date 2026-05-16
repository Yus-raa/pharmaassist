import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  Bot,
  Pill,
  Package,
  Sparkles,
} from "lucide-react";
import { useNavigate } from "react-router-dom";



const HeroSection = () => {
  const [query, setQuery] = useState("");
  
const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    // later we will connect this to AI + product search
    console.log("AI Query:", query);
  };

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-green-50 via-white to-blue-50 border border-green-100">

      {/* background glow */}
      <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_top_right,rgba(34,197,94,0.15),transparent_60%)]" />

      <div className="relative px-6 md:px-16 py-20">

        {/* top badge */}
        <div className="flex items-center gap-2 text-green-700 mb-4">
          <Sparkles className="w-4 h-4" />
          <span className="text-sm font-medium">
            AI Powered Healthcare Assistant
          </span>
        </div>

        {/* main heading */}
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight max-w-3xl">
          Your Personal <span className="text-green-600">Pharmacy AI</span> for
          smarter healthcare decisions
        </h1>

        <p className="text-gray-600 mt-5 max-w-2xl text-lg">
          Search medicines, understand symptoms, manage prescriptions, and get
          guided healthcare support — all in one intelligent system.
        </p>

        {/* AI search bar (core feature placeholder) */}
        <div className="mt-10 flex justify-start">
  <button
    onClick={() => navigate("/?ai=open")}
    className="flex items-center gap-3 px-8 py-4 rounded-2xl bg-green-600 text-white font-semibold text-lg shadow-lg hover:bg-green-700 transition"
  >
    <Bot className="w-5 h-5" />
    Ask PharmaAssist AI
  </button>
</div>

        {/* quick actions */}
<div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl">

  <Link
    to="/products"
    className="group p-5 bg-white/90 backdrop-blur rounded-2xl border border-emerald-100 hover:border-emerald-200 hover:shadow-lg transition-all duration-300"
  >
    <div className="w-11 h-11 rounded-xl bg-emerald-100 flex items-center justify-center mb-3">
      <Pill className="w-5 h-5 text-emerald-600" />
    </div>

    <h3 className="font-semibold text-slate-800 group-hover:text-emerald-700 transition">
      Browse Medicines
    </h3>

    <p className="text-sm text-slate-500 mt-1 leading-relaxed">
      Find OTC medicines, supplements, and healthcare essentials.
    </p>
  </Link>

  <Link
    to="/orders"
    className="group p-5 bg-white/90 backdrop-blur rounded-2xl border border-emerald-100 hover:border-emerald-200 hover:shadow-lg transition-all duration-300"
  >
    <div className="w-11 h-11 rounded-xl bg-cyan-100 flex items-center justify-center mb-3">
      <Package className="w-5 h-5 text-cyan-600" />
    </div>

    <h3 className="font-semibold text-slate-800 group-hover:text-cyan-700 transition">
      Track Orders
    </h3>

    <p className="text-sm text-slate-500 mt-1 leading-relaxed">
      Monitor deliveries, payment updates, and order history.
    </p>
  </Link>

  <button
    onClick={() => navigate("/?ai=open")}
    className="group text-left p-5 bg-white/90 backdrop-blur rounded-2xl border border-emerald-100 hover:border-emerald-200 hover:shadow-lg transition-all duration-300"
  >
    <div className="w-11 h-11 rounded-xl bg-violet-100 flex items-center justify-center mb-3">
      <Bot className="w-5 h-5 text-violet-600" />
    </div>

    <h3 className="font-semibold text-slate-800 group-hover:text-violet-700 transition">
      PharmaAssist AI
    </h3>

    <p className="text-sm text-slate-500 mt-1 leading-relaxed">
      Chat with AI for symptom guidance and medicine suggestions.
    </p>
  </button>

</div>
      </div>
    </div>
  );
};

export default HeroSection;