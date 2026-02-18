"use client";

import { useState } from "react";

export default function ContactPage() {
  const [msg, setMsg] = useState("");

  const sendMessage = () => {
    setMsg("Thank you! We will contact you soon 😊");
  };

  return (
    <main className="pt-28 bg-[#FAF6F0] min-h-screen px-6">
      <div className="max-w-5xl mx-auto py-16">

        <h1 className="text-4xl font-[var(--font-heading)] text-[#5A0F1C] mb-10 text-center">
          Contact Us
        </h1>

        <div className="grid md:grid-cols-2 gap-12">

          {/* CONTACT INFO */}
          <div className="bg-white p-8 rounded-3xl shadow-lg space-y-6">
            <h2 className="text-2xl font-semibold text-[#5A0F1C]">
              Get in touch
            </h2>

            <p className="text-gray-600">
              Have questions about orders, delivery or returns?  
              We're here to help 💛
            </p>

            <div className="space-y-3 text-gray-700">
              <p>📧 Email: sayondas2004s@gmail.com</p>
              <p>📞 Phone / WhatsApp: +91 9933614554</p>
              <p>📍 Location: West Bengal, India</p>
              <p>🕒 Support Hours: 10AM – 7PM (Mon–Sat)</p>
            </div>
          </div>

          {/* CONTACT FORM */}
          <div className="bg-white p-8 rounded-3xl shadow-lg">
            <h2 className="text-2xl font-semibold text-[#5A0F1C] mb-6">
              Send Message
            </h2>

            <div className="space-y-4">
              <input placeholder="Your Name" className="w-full p-3 border rounded-xl" />
              <input placeholder="Email Address" className="w-full p-3 border rounded-xl" />
              <textarea
                placeholder="Your Message"
                rows="5"
                className="w-full p-3 border rounded-xl"
              />

              <button
                onClick={sendMessage}
                className="w-full py-4 rounded-full text-white font-semibold
                bg-gradient-to-r from-[#5A0F1C] to-[#D4AF37]"
              >
                Send Message
              </button>

              {msg && (
                <p className="text-green-600 text-center mt-3">{msg}</p>
              )}
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
