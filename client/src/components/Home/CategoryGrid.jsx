import { Link } from "react-router-dom";

import {
  HeartPulse,
  Pill,
  ShieldPlus,
  Sparkles,
} from "lucide-react";

import { categories } from "../../data/products";

const CategoryGrid = () => {

  return (
    <section className="py-20 bg-gradient-to-b from-[#FAFEFE] to-white">

      <div className="container mx-auto px-4">

        {/* HEADER */}
        <div className="text-center mb-14">

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 text-green-700 font-medium text-sm mb-5">

            <ShieldPlus size={16} />

            Trusted Healthcare Essentials
          </div>

          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-5 leading-tight">

            Explore Health & <br />
            Wellness Categories
          </h2>

          <p className="text-lg text-gray-500 max-w-3xl mx-auto leading-relaxed">

            Browse medicines, wellness products,
            healthcare essentials, and daily care
            solutions carefully organized to help
            you and your family stay healthy.
          </p>
        </div>

        {/* CATEGORY GRID */}
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">

          {categories.map((category) => (

            <Link
              key={category.id}

              to={`/products?category=${category.name}`}

              className="group relative overflow-hidden rounded-3xl bg-white border border-green-100 shadow-sm hover:shadow-2xl transition-all duration-500"
            >

              {/* IMAGE */}
              <div className="relative overflow-hidden h-52">

                <img
                  src={category.image}

                  alt={category.name}

                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />

                {/* OVERLAY */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

                {/* ICON BADGE */}
                <div className="absolute top-4 left-4 w-11 h-11 rounded-2xl bg-white/90 backdrop-blur-md flex items-center justify-center shadow-md">

                  {category.name
                    .toLowerCase()
                    .includes("medicine") ? (
                    <Pill
                      size={20}
                      className="text-green-600"
                    />
                  ) : (
                    <HeartPulse
                      size={20}
                      className="text-green-600"
                    />
                  )}
                </div>

                {/* CATEGORY TITLE */}
                <div className="absolute bottom-4 left-4 right-4">

                  <h3 className="text-white text-xl font-bold leading-snug">

                    {category.name}
                  </h3>
                </div>
              </div>

              {/* CONTENT */}
              <div className="p-5">

                <div className="flex items-center justify-between">

                  <p className="text-sm text-gray-500 leading-relaxed">

                    Explore trusted healthcare
                    products and wellness
                    essentials.
                  </p>

                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center group-hover:bg-green-600 transition-all duration-300">

                    <Sparkles
                      size={18}
                      className="text-green-600 group-hover:text-white transition-colors duration-300"
                    />
                  </div>
                </div>
              </div>

              {/* HOVER GLOW */}
              <div className="absolute inset-0 border-2 border-transparent group-hover:border-green-200 rounded-3xl transition-all duration-500 pointer-events-none" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryGrid;