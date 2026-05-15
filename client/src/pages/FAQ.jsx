import { useState } from "react";

import {
  ChevronDown,
  ChevronUp,
  Pill,
  ShieldCheck,
  Truck,
  Bot,
  CalendarHeart,
  Stethoscope,
} from "lucide-react";
import { Link } from "react-router-dom";
const FAQ = () => {

  const [openItems, setOpenItems] =
    useState({});

  const faqs = [
    {
      icon: Pill,

      question:
        "How do I order medicines from PharmaAssist?",

      answer:
        "Browse healthcare products or medicines, add them to your cart, and proceed to checkout. Enter your shipping details and complete payment securely using Stripe.",
    },

    {
      icon: ShieldCheck,

      question:
        "Are payments and personal details secure?",

      answer:
        "Yes. PharmaAssist uses secure encrypted payment systems and protected authentication methods to keep your transactions and personal information safe.",
    },

    {
      icon: Truck,

      question:
        "How long does medicine delivery take?",

      answer:
        "Standard delivery usually takes 2–5 business days depending on your location. Delivery timelines may vary for certain healthcare products.",
    },

    {
      icon: Bot,

      question:
        "What is the AI Health Assistant feature?",

      answer:
        "Our AI Health Assistant helps users with medicine guidance, healthcare-related questions, and smart support for navigating healthcare services.",
    },

    {
      icon: CalendarHeart,

      question:
        "Can I book appointments with healthcare specialists?",

      answer:
        "Yes. PharmaAssist is designed to support appointment booking with healthcare professionals for consultations and health support.",
    },

    {
      icon: Stethoscope,

      question:
        "Can I track my orders after payment?",

      answer:
        "Absolutely. Users can view order history,  and order progress directly from the Orders section.",
    },
  ];

  const toggleItem = (
    index
  ) => {
    setOpenItems(
      (prev) => ({
        ...prev,

        [index]:
          !prev[index],
      })
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FAFEFE] to-white pt-24">

      {/* HERO */}
      <section className="relative overflow-hidden">

        {/* BG EFFECTS */}
        <div className="absolute top-0 left-0 w-72 h-72 bg-green-100 rounded-full blur-3xl opacity-40" />

        <div className="absolute bottom-0 right-0 w-80 h-80 bg-emerald-100 rounded-full blur-3xl opacity-40" />

        <div className="max-w-5xl mx-auto px-4 py-16 relative z-10">

          <div className="text-center">

            {/* BADGE */}
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-green-100 text-green-700 font-medium text-sm mb-6">

              <Pill size={16} />

              PharmaAssist Support
            </div>

            {/* TITLE */}
            <h1 className="text-5xl md:text-6xl font-bold text-gray-800 leading-tight mb-6">

              Frequently Asked <br />
              Questions
            </h1>

            {/* DESCRIPTION */}
            <p className="text-xl text-gray-500 leading-relaxed max-w-3xl mx-auto">

              Find answers to common questions
              about medicines, payments, delivery,
              AI healthcare assistance, and other
              PharmaAssist services.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="max-w-4xl mx-auto px-4 pb-20">

        <div className="space-y-5">

          {faqs.map(
            (
              faq,
              index
            ) => (

              <div
                key={index}

                className="group bg-white border border-green-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
              >

                {/* QUESTION */}
                <button
                  onClick={() =>
                    toggleItem(
                      index
                    )
                  }

                  className="w-full px-6 py-6 text-left flex items-center justify-between gap-4 hover:bg-green-50/50 transition-all duration-300"
                >

                  <div className="flex items-start gap-4">

                    {/* ICON */}
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center flex-shrink-0 shadow-md">

                      <faq.icon className="w-6 h-6 text-white" />
                    </div>

                    {/* TEXT */}
                    <div>

                      <h3 className="text-lg md:text-xl font-semibold text-gray-800 leading-snug">

                        {faq.question}
                      </h3>
                    </div>
                  </div>

                  {/* TOGGLE ICON */}
                  <div className="flex-shrink-0">

                    {openItems[
                      index
                    ] ? (
                      <ChevronUp className="w-6 h-6 text-green-600" />
                    ) : (
                      <ChevronDown className="w-6 h-6 text-gray-500 group-hover:text-green-600 transition-colors duration-300" />
                    )}
                  </div>
                </button>

                {/* ANSWER */}
                {openItems[
                  index
                ] && (

                  <div className="px-6 pb-6">

                    <div className="ml-16 border-l-2 border-green-100 pl-5">

                      <p className="text-gray-500 leading-relaxed text-base">

                        {faq.answer}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )
          )}
        </div>

        {/* HELP CARD */}
        <div className="mt-14 bg-gradient-to-r from-green-600 to-emerald-600 rounded-[2rem] p-10 text-white shadow-2xl relative overflow-hidden">

          {/* BACKGROUND */}
          <div className="absolute top-0 right-0 w-72 h-72 bg-white/10 rounded-full blur-3xl" />

          <div className="relative z-10 text-center">

            <div className="w-20 h-20 rounded-3xl bg-white/20 flex items-center justify-center mx-auto mb-6">

              <ShieldCheck size={38} />
            </div>

            <h2 className="text-4xl font-bold mb-4">

              Still Need Help?
            </h2>

            <p className="text-green-50 max-w-2xl mx-auto leading-relaxed mb-8">

              Our healthcare support team is here
              to help you with medicines, orders,
              payments, and healthcare services.
            </p>

            <Link
  to="/contact"
  className="inline-flex items-center justify-center px-8 py-4 rounded-2xl bg-white text-green-700 font-semibold hover:bg-green-50 transition-all duration-300 shadow-lg"
>
  Contact Support
</Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FAQ;