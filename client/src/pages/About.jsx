import {
  Users,
  Target,
  Award,
  Heart,
  Pill,
  ShieldCheck,
  Brain,
  Stethoscope,
  Sparkles,
} from "lucide-react";

const About = () => {

  const values = [
    {
      icon: Heart,

      title: "Patient-Centered Care",

      description:
        "We prioritize patient wellbeing by making healthcare services and medicine access simpler and more reliable.",
    },

    {
      icon: ShieldCheck,

      title: "Trusted & Secure",

      description:
        "Your health data and transactions are protected with secure systems and trusted healthcare practices.",
    },

    {
      icon: Brain,

      title: "AI-Powered Assistance",

      description:
        "PharmaAssist integrates intelligent healthcare support to provide smarter medicine and wellness guidance.",
    },

    {
      icon: Award,

      title: "Quality Healthcare Services",

      description:
        "From pharmacy management to healthcare support, we focus on delivering reliable and efficient services.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FAFEFE] to-white pt-24">

      {/* HERO SECTION */}
      <section className="relative overflow-hidden">

        {/* BACKGROUND EFFECTS */}
        <div className="absolute top-0 left-0 w-72 h-72 bg-green-100 rounded-full blur-3xl opacity-40" />

        <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-100 rounded-full blur-3xl opacity-40" />

        <div className="max-w-7xl mx-auto px-4 py-16 relative z-10">

          <div className="text-center max-w-4xl mx-auto">

            {/* BADGE */}
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-green-100 text-green-700 font-medium text-sm mb-6">

              <Pill size={16} />

              About PharmaAssist
            </div>

            {/* TITLE */}
            <h1 className="text-5xl md:text-6xl font-bold text-gray-800 leading-tight mb-6">

              Transforming Healthcare <br />
              Through Smart Technology
            </h1>

            {/* DESCRIPTION */}
            <p className="text-xl text-gray-500 leading-relaxed">

              PharmaAssist is a modern healthcare
              and pharmacy management platform
              designed to simplify medicine access,
              healthcare support, and digital
              patient experiences through
              intelligent technology.
            </p>
          </div>
        </div>
      </section>

      {/* VALUES SECTION */}
      <section className="max-w-7xl mx-auto px-4 py-8">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          {values.map(
            (
              value,
              index
            ) => (

              <div
                key={index}

                className="group bg-white border border-green-100 rounded-3xl p-8 shadow-sm hover:shadow-2xl transition-all duration-500 relative overflow-hidden"
              >

                {/* GLOW EFFECT */}
                <div className="absolute top-0 right-0 w-40 h-40 bg-green-50 rounded-full blur-3xl opacity-60 group-hover:scale-125 transition-transform duration-700" />

                {/* ICON */}
                <div className="relative z-10 w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg mb-6">

                  <value.icon className="w-8 h-8 text-white" />
                </div>

                {/* CONTENT */}
                <div className="relative z-10">

                  <h3 className="text-2xl font-bold text-gray-800 mb-4">

                    {value.title}
                  </h3>

                  <p className="text-gray-500 leading-relaxed">

                    {value.description}
                  </p>
                </div>

                {/* BOTTOM BORDER */}
                <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-green-500 to-emerald-400 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
              </div>
            )
          )}
        </div>
      </section>

      {/* STORY SECTION */}
      <section className="max-w-7xl mx-auto px-4 py-16">

        <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-[2rem] p-10 md:p-14 text-white shadow-2xl relative overflow-hidden">

          {/* BACKGROUND SHAPES */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl" />

          <div className="absolute bottom-0 left-0 w-72 h-72 bg-white/10 rounded-full blur-3xl" />

          <div className="relative z-10">

            <div className="flex items-center gap-4 mb-6">

              <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center">

                <Stethoscope size={32} />
              </div>

              <div>

                <h2 className="text-4xl font-bold">
                  Our Mission
                </h2>

                <p className="text-green-100 mt-1">
                  Building smarter healthcare experiences
                </p>
              </div>
            </div>

            <p className="text-lg leading-relaxed text-green-50 max-w-5xl">

              PharmaAssist was created with the
              vision of modernizing healthcare and
              pharmacy management through
              technology. We aim to provide users
              with a seamless platform where they
              can access medicines, manage
              prescriptions, connect with healthcare
              professionals, and receive intelligent
              health guidance — all in one place.

              <br />
              <br />

              By combining healthcare services with
              AI-powered assistance, PharmaAssist
              strives to make healthcare more
              accessible, efficient, and user-friendly
              for everyone.
            </p>

            {/* STATS */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-12">

              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10">

                <div className="flex items-center gap-3 mb-3">

                  <Users size={24} />

                  <h3 className="text-3xl font-bold">
                    24/7
                  </h3>
                </div>

                <p className="text-green-100">
                  Healthcare support availability
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10">

                <div className="flex items-center gap-3 mb-3">

                  <Target size={24} />

                  <h3 className="text-3xl font-bold">
                    Smart
                  </h3>
                </div>

                <p className="text-green-100">
                  AI-driven healthcare assistance
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10">

                <div className="flex items-center gap-3 mb-3">

                  <Sparkles size={24} />

                  <h3 className="text-3xl font-bold">
                    Modern
                  </h3>
                </div>

                <p className="text-green-100">
                  Digital pharmacy management
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;