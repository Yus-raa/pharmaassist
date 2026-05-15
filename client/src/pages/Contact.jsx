import { useState } from "react";
import { axiosInstance } from "../lib/axios";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  Pill,
  HeartPulse,
  ShieldCheck,
  Clock3,
} from "lucide-react";

import { toast } from "react-toastify";

const Contact = () => {

  const [formData, setFormData] =
    useState({
      name: "",
      email: "",
      subject: "",
      message: "",
    });

  const [loading, setLoading] =
  useState(false);

const handleSubmit = async (
  e
) => {

  e.preventDefault();

  try {

    setLoading(true);

    const { data } =
      await axiosInstance.post(
        "/contact/send",
        formData
      );

    toast.success(
      data.message
    );

    setFormData({
      name: "",
      email: "",
      subject: "",
      message: "",
    });

  } catch (error) {

    toast.error(
      error.response?.data
        ?.message ||
        "Failed to send message"
    );

  } finally {

    setLoading(false);
  }
};
//
  const contactInfo = [
    {
      icon: Mail,

      title: "Support Email",

      value:
        "support@pharmaassist.com",

      description:
        "Reach our healthcare support team anytime.",
    },

    {
      icon: Phone,

      title: "Phone Support",

      value:
        "+92 300 1234567",

      description:
        "Available for medicine and order assistance.",
    },

    {
      icon: MapPin,

      title: "Location",

      value:
        "Karachi, Pakistan",

      description:
        "Serving healthcare needs nationwide.",
    },

    {
      icon: Clock3,

      title: "Working Hours",

      value:
        "24/7 Assistance",

      description:
        "Healthcare support whenever you need it.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FAFEFE] to-white pt-24">

      {/* HERO SECTION */}
      <section className="relative overflow-hidden">

        {/* BACKGROUND EFFECTS */}
        <div className="absolute top-0 left-0 w-80 h-80 bg-green-100 rounded-full blur-3xl opacity-40" />

        <div className="absolute bottom-0 right-0 w-80 h-80 bg-emerald-100 rounded-full blur-3xl opacity-40" />

        <div className="max-w-7xl mx-auto px-4 py-16 relative z-10">

          <div className="text-center">

            {/* BADGE */}
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-green-100 text-green-700 font-medium text-sm mb-6">

              <Pill size={16} />

              PharmaAssist Healthcare Support
            </div>

            {/* TITLE */}
            <h1 className="text-5xl md:text-6xl font-bold text-gray-800 leading-tight mb-6">

              Contact <span className="text-green-600">PharmaAssist</span>
            </h1>

            {/* DESCRIPTION */}
            <p className="text-xl text-gray-500 max-w-3xl mx-auto leading-relaxed">

              Need help with medicines, healthcare
              services, appointments, or your
              orders? Our healthcare support team
              is here to assist you.
            </p>
          </div>
        </div>
      </section>

      {/* MAIN CONTENT */}
      <section className="max-w-7xl mx-auto px-4 pb-20">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

          {/* LEFT SIDE */}
          <div className="space-y-8">

            {/* INTRO CARD */}
            <div className="bg-white border border-green-100 rounded-[2rem] p-8 shadow-sm">

              <div className="flex items-center gap-4 mb-6">

                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg">

                  <HeartPulse className="w-8 h-8 text-white" />
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-gray-800">

                    Your Health Partner
                  </h2>

                  <p className="text-gray-500">

                    Trusted healthcare support with PharmaAssist
                  </p>
                </div>
              </div>

              <p className="text-gray-600 leading-relaxed">

                We are committed to providing a
                seamless digital healthcare
                experience through secure medicine
                ordering, AI-powered assistance,
                healthcare consultations, and fast
                support services.
              </p>
            </div>

            {/* CONTACT INFO */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

              {contactInfo.map(
                (
                  item,
                  index
                ) => (

                  <div
                    key={index}

                    className="bg-white border border-green-100 rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all duration-300"
                  >

                    <div className="w-14 h-14 rounded-2xl bg-green-100 flex items-center justify-center mb-5">

                      <item.icon className="w-7 h-7 text-green-600" />
                    </div>

                    <h3 className="text-lg font-semibold text-gray-800 mb-1">

                      {item.title}
                    </h3>

                    <p className="text-green-600 font-medium mb-2 break-words">

                      {item.value}
                    </p>

                    <p className="text-sm text-gray-500 leading-relaxed">

                      {item.description}
                    </p>
                  </div>
                )
              )}
            </div>

            {/* SECURITY CARD */}
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-[2rem] p-8 text-white shadow-2xl relative overflow-hidden">

              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />

              <div className="relative z-10">

                <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center mb-5">

                  <ShieldCheck size={34} />
                </div>

                <h3 className="text-3xl font-bold mb-4">

                  Secure Healthcare Communication
                </h3>

                <p className="text-green-50 leading-relaxed">

                  Your messages and healthcare
                  information are securely handled
                  through protected communication
                  systems.
                </p>
              </div>
            </div>
          </div>

          {/* CONTACT FORM */}
          <div className="bg-white border border-green-100 rounded-[2rem] p-8 md:p-10 shadow-sm h-fit">

            <div className="mb-8">

              <h2 className="text-3xl font-bold text-gray-800 mb-3">

                Send Us a Message
              </h2>

              <p className="text-gray-500">

                Fill out the form below and our
                healthcare support team will get
                back to you shortly.
              </p>
            </div>

            <form
              onSubmit={
                handleSubmit
              }

              className="space-y-6"
            >

              {/* NAME + EMAIL */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                <div>

                  <label className="block text-sm font-medium text-gray-700 mb-2">

                    Full Name
                  </label>

                  <input
                    type="text"

                    placeholder="Enter your name"

                    value={
                      formData.name
                    }

                    onChange={(
                      e
                    ) =>
                      setFormData(
                        {
                          ...formData,

                          name:
                            e
                              .target
                              .value,
                        }
                      )
                    }

                    className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                    required
                  />
                </div>

                <div>

                  <label className="block text-sm font-medium text-gray-700 mb-2">

                    Email Address
                  </label>

                  <input
                    type="email"

                    placeholder="Enter your email"

                    value={
                      formData.email
                    }

                    onChange={(
                      e
                    ) =>
                      setFormData(
                        {
                          ...formData,

                          email:
                            e
                              .target
                              .value,
                        }
                      )
                    }

                    className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                    required
                  />
                </div>
              </div>

              {/* SUBJECT */}
              <div>

                <label className="block text-sm font-medium text-gray-700 mb-2">

                  Subject
                </label>

                <input
                  type="text"

                  placeholder="What can we help you with?"

                  value={
                    formData.subject
                  }

                  onChange={(
                    e
                  ) =>
                    setFormData(
                      {
                        ...formData,

                        subject:
                          e
                            .target
                            .value,
                      }
                    )
                  }

                  className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  required
                />
              </div>

              {/* MESSAGE */}
              <div>

                <label className="block text-sm font-medium text-gray-700 mb-2">

                  Message
                </label>

                <textarea
                  rows="7"

                  placeholder="Describe your issue or question..."

                  value={
                    formData.message
                  }

                  onChange={(
                    e
                  ) =>
                    setFormData(
                      {
                        ...formData,

                        message:
                          e
                            .target
                            .value,
                      }
                    )
                  }

                  className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all resize-none"
                  required
                />
              </div>

              {/* SUBMIT BUTTON */}
              <button
  type="submit"
  disabled={loading}
  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-4 rounded-2xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-3 disabled:opacity-70"
>
  {loading ? (
    <>
      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />

      Sending...
    </>
  ) : (
    <>
      <Send size={20} />

      Send Message
    </>
  )}
</button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;