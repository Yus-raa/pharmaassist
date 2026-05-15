import { Link } from "react-router-dom";
import {
  Mail,
  Phone,
  MapPin,
  ShieldCheck,
  Activity,
  Facebook,
  Instagram,
  Twitter,
} from "lucide-react";

const Footer = () => {
  const footerLinks = {
    platform: [
      { name: "About PharmaAssist", path: "/about" },
      { name: "AI Health Assistant", path: "#" },
      
    ],
    services: [
      { name: "Order Medicines", path: "/products" },
      { name: "Track Orders", path: "/orders" },
      { name: "Consult Pharmacist", path: "#" },
    ],
    legal: [
      { name: "Privacy Policy", path: "#" },
      { name: "Terms of Use", path: "#" },
      { name: "Medical Disclaimer", path: "#" },
      { name: "Data Security", path: "#" },
    ],
  };

  const socialLinks = [
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Twitter, href: "#", label: "Twitter" },
  ];

  return (
    <footer className="bg-white dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800 mt-16">
      <div className="container mx-auto px-6 py-14">

        {/* TOP GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">

          {/* BRAND */}
          <div className="lg:col-span-1">
            <h2 className="text-2xl font-bold text-green-600 flex items-center gap-2">
              <Activity className="w-6 h-6" />
              PharmaAssist
            </h2>

            <p className="text-gray-500 mt-4 text-sm leading-relaxed">
              Your intelligent pharmacy companion for safe medicine ordering,
              prescription management, and AI-powered health assistance.
            </p>

            <div className="mt-5 space-y-3 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-green-600" />
                support@pharmaassist.com
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-green-600" />
                +92 300 0000000
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-green-600" />
                Karachi, Pakistan
              </div>
            </div>

            {/* TRUST BADGE */}
            <div className="mt-5 flex items-center gap-2 text-xs text-green-600 bg-green-50 dark:bg-green-950/30 px-3 py-2 rounded-lg w-fit">
              <ShieldCheck className="w-4 h-4" />
              Verified Pharmacy Platform
            </div>
          </div>

          {/* PLATFORM */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
              Platform
            </h3>
            <ul className="space-y-2">
              {footerLinks.platform.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-gray-500 hover:text-green-600 text-sm transition"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* SERVICES */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
              Services
            </h3>
            <ul className="space-y-2">
              {footerLinks.services.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-gray-500 hover:text-green-600 text-sm transition"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* LEGAL */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
              Legal & Safety
            </h3>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-gray-500 hover:text-green-600 text-sm transition"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* NEWSLETTER */}
        {/* <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6 mb-10 text-center">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Health Updates & Medicine Alerts
          </h3>
          <p className="text-gray-500 text-sm mt-1">
            Get safe medicine alerts, health tips, and pharmacy updates
          </p>

          <form className="mt-4 flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 text-sm"
            />
            <button
              type="submit"
              className="px-5 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition"
            >
              Subscribe
            </button>
          </form>
        </div> */}

        {/* BOTTOM */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-6 border-t border-gray-200 dark:border-gray-800">

          {/* SOCIAL */}
          <div className="flex items-center gap-3">
            {socialLinks.map((s) => (
              <a
                key={s.label}
                href={s.href}
                className="p-2 rounded-lg border border-gray-200 dark:border-gray-800 hover:border-green-500 transition"
              >
                <s.icon className="w-4 h-4 text-green-600" />
              </a>
            ))}
          </div>

          {/* COPYRIGHT */}
          <div className="text-center md:text-right text-xs text-gray-500">
            <p>© 2026 PharmaAssist. All rights reserved.</p>
            <p className="mt-1">Built for safe and intelligent healthcare access</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;