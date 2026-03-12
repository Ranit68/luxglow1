"use client";

import { useState } from "react";
import { Clock, Mail, MapPin, Phone } from "lucide-react";

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const sendMessage = async () => {
    if (!form.name || !form.email || !form.message) {
      return;
    }

    setLoading(true);

    setTimeout(() => {
      setSuccess("Message sent successfully! We will contact you soon.");
      setForm({
        name: "",
        email: "",
        message: "",
      });
      setLoading(false);
    }, 1500);
  };

  return (
    <main className="min-h-screen bg-[#FAF6F0] px-4 pt-28">
      <div className="mx-auto max-w-6xl py-16">
        <div className="mb-14 text-center">
          <h1 className="text-4xl font-semibold text-[#5A0F1C] md:text-5xl">
            Contact Us
          </h1>

          <p className="mt-3 text-gray-500">
            We&apos;d love to hear from you. Our team is always ready to help.
          </p>
        </div>

        <div className="grid gap-12 md:grid-cols-2">
          <div className="space-y-8 rounded-3xl bg-white p-10 shadow-xl">
            <h2 className="text-2xl font-semibold text-[#5A0F1C]">
              Get In Touch
            </h2>

            <p className="text-gray-600">
              Questions about orders, delivery, or returns? Reach out anytime -
              we&apos;re happy to assist you.
            </p>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <Mail className="text-[#5A0F1C]" />
                <div>
                  <p className="font-medium">Email</p>
                  <p className="text-gray-500">sayondas2004s@gmail.com</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Phone className="text-[#5A0F1C]" />
                <div>
                  <p className="font-medium">Phone / WhatsApp</p>
                  <p className="text-gray-500">+91 9933614554</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <MapPin className="text-[#5A0F1C]" />
                <div>
                  <p className="font-medium">Location</p>
                  <p className="text-gray-500">West Bengal, India</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Clock className="text-[#5A0F1C]" />
                <div>
                  <p className="font-medium">Support Hours</p>
                  <p className="text-gray-500">10AM - 7PM (Mon-Sat)</p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-3xl bg-white p-10 shadow-xl">
            <h2 className="mb-6 text-2xl font-semibold text-[#5A0F1C]">
              Send Message
            </h2>

            <div className="space-y-5">
              <input
                placeholder="Your Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="input-modern"
              />

              <input
                type="email"
                placeholder="Email Address"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="input-modern"
              />

              <textarea
                rows="5"
                placeholder="Your Message"
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="input-modern resize-none"
              />

              <button
                onClick={sendMessage}
                disabled={loading}
                className="w-full rounded-full bg-gradient-to-r from-[#5A0F1C] to-[#D4AF37] py-4 font-semibold text-white transition hover:scale-[1.02]"
              >
                {loading ? "Sending..." : "Send Message"}
              </button>

              {success && <p className="text-center text-green-600">{success}</p>}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
