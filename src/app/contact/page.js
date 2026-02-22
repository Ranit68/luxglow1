"use client";

import { useState } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Clock
} from "lucide-react";

export default function ContactPage() {

  const [form,setForm]=useState({
    name:"",
    email:"",
    message:"",
  });

  const [loading,setLoading]=useState(false);
  const [success,setSuccess]=useState("");

  const sendMessage = async () => {

    if(!form.name || !form.email || !form.message)
      return;

    setLoading(true);

    /* 👉 Later connect EmailJS / backend */
    setTimeout(()=>{
      setSuccess(
        "✅ Message sent successfully! We will contact you soon."
      );
      setForm({
        name:"",
        email:"",
        message:"",
      });
      setLoading(false);
    },1500);
  };

  return (
    <main className="pt-28 bg-[#FAF6F0] min-h-screen px-4">

      <div className="max-w-6xl mx-auto py-16">

        {/* HEADER */}
        <div className="text-center mb-14">
          <h1 className="text-4xl md:text-5xl
          font-semibold text-[#5A0F1C]">
            Contact Us
          </h1>

          <p className="text-gray-500 mt-3">
            We'd love to hear from you. Our team is always ready to help.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">

          {/* ================= CONTACT INFO ================= */}

          <div className="bg-white rounded-3xl shadow-xl p-10 space-y-8">

            <h2 className="text-2xl font-semibold text-[#5A0F1C]">
              Get In Touch
            </h2>

            <p className="text-gray-600">
              Questions about orders, delivery or returns?
              Reach out anytime — we're happy to assist you.
            </p>

            <div className="space-y-6">

              <div className="flex gap-4 items-start">
                <Mail className="text-[#5A0F1C]" />
                <div>
                  <p className="font-medium">Email</p>
                  <p className="text-gray-500">
                    sayondas2004s@gmail.com
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <Phone className="text-[#5A0F1C]" />
                <div>
                  <p className="font-medium">
                    Phone / WhatsApp
                  </p>
                  <p className="text-gray-500">
                    +91 9933614554
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <MapPin className="text-[#5A0F1C]" />
                <div>
                  <p className="font-medium">Location</p>
                  <p className="text-gray-500">
                    West Bengal, India
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <Clock className="text-[#5A0F1C]" />
                <div>
                  <p className="font-medium">
                    Support Hours
                  </p>
                  <p className="text-gray-500">
                    10AM – 7PM (Mon–Sat)
                  </p>
                </div>
              </div>

            </div>

          </div>

          {/* ================= CONTACT FORM ================= */}

          <div className="bg-white rounded-3xl shadow-xl p-10">

            <h2 className="text-2xl font-semibold
            text-[#5A0F1C] mb-6">
              Send Message
            </h2>

            <div className="space-y-5">

              <input
                placeholder="Your Name"
                value={form.name}
                onChange={(e)=>
                  setForm({...form,name:e.target.value})
                }
                className="input-modern"
              />

              <input
                type="email"
                placeholder="Email Address"
                value={form.email}
                onChange={(e)=>
                  setForm({...form,email:e.target.value})
                }
                className="input-modern"
              />

              <textarea
                rows="5"
                placeholder="Your Message"
                value={form.message}
                onChange={(e)=>
                  setForm({...form,message:e.target.value})
                }
                className="input-modern resize-none"
              />
              <button
                onClick={sendMessage}
                disabled={loading}
                className="w-full py-4 rounded-full
                text-white font-semibold
                bg-gradient-to-r
                from-[#5A0F1C]
                to-[#D4AF37]
                hover:scale-[1.02]
                transition"
              >
                {loading
                  ? "Sending..."
                  : "Send Message"}
              </button>
              {success && (
                <p className="text-green-600 text-center">
                  {success}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}