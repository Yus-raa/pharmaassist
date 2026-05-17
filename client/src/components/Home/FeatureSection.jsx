import {
  Truck,
  ShieldCheck,
  Pill,
  Bot,
  CalendarHeart,
  Stethoscope,
} from "lucide-react";

const FeatureSection = () => {

  const features = [
    {
      icon: ShieldCheck,

      title: "Secure Payment",

      description:
        "100% secure payment with SSL encryption.",
    },

    {
      icon: CalendarHeart,

      title: "Smart Search",

      description:
        "Retrieves medicines based on user intent rather than exact keywords.",
    },

    {
      icon: Truck,

      title: "Free Shipping",

      description:
        "Free shipping on orders over 5000",
    },

    {
      icon: Bot,

      title: "AI Health Assistant",

      description:
        "Get smart medicine guidance, healthcare support, and instant answers through our AI chatbot.",
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-white to-[#F8FFFF]">

      <div className="container mx-auto px-4">

        {/* SECTION HEADER */}
        <div className="text-center mb-14">

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 text-green-700 text-sm font-medium mb-5">

            <Pill size={16} />

            Why Choose PharmaAssist
          </div>

          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-5 leading-tight">

            Smart Healthcare <br />
            Designed for Everyone
          </h2>

          <p className="max-w-3xl mx-auto text-lg text-gray-500 leading-relaxed">

            PharmaAssist combines healthcare,
            pharmacy services, and intelligent
            technology to simplify medicine
            management and improve patient care.
          </p>
        </div>

        {/* FEATURES GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-7">

          {features.map(
            (
              feature,
              index
            ) => (

              <div
                key={index}

                className="group relative overflow-hidden bg-white border border-green-100 rounded-3xl p-8 shadow-sm hover:shadow-2xl transition-all duration-500"
              >

                {/* BACKGROUND EFFECT */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-green-50 rounded-full blur-3xl opacity-70 group-hover:scale-125 transition-transform duration-700" />

                {/* ICON */}
                <div className="relative z-10 w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg mb-6 group-hover:scale-110 transition-transform duration-300">

                  <feature.icon className="w-8 h-8 text-white" />
                </div>

                {/* CONTENT */}
                <div className="relative z-10">

                  <h3 className="text-xl font-bold text-gray-800 mb-3">

                    {feature.title}
                  </h3>

                  <p className="text-gray-500 leading-relaxed text-sm">

                    {feature.description}
                  </p>
                </div>

                {/* BOTTOM ACCENT */}
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 to-emerald-400 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
              </div>
            )
          )}
        </div>

        {/* EXTRA INFO CARD */}
        <div className="mt-14 bg-gradient-to-r from-green-600 to-emerald-600 rounded-3xl p-8 md:p-10 text-white shadow-xl relative overflow-hidden">

          <div className="absolute top-0 right-0 w-72 h-72 bg-white/10 rounded-full blur-3xl" />

          <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">

            <div>

              <div className="flex items-center gap-3 mb-4">

                <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center">

                  <Stethoscope size={28} />
                </div>

                <h3 className="text-3xl font-bold">

                  Your Digital Healthcare Partner
                </h3>
              </div>

              <p className="text-green-50 max-w-3xl leading-relaxed">

                From online medicine ordering to
                AI-powered healthcare assistance,
                PharmaAssist is built to make
                healthcare more accessible,
                intelligent, and convenient.
              </p>
            </div>

            <button className="px-7 py-4 rounded-2xl bg-white text-green-700 font-semibold hover:bg-green-50 transition-all duration-300 shadow-lg">

              Explore Services
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;