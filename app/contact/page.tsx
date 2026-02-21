// app/contact/page.tsx
"use client";

import { useState, type ChangeEvent, type FormEvent, type CSSProperties } from "react";
import Navbar from "@/components/Navbar"; // adjust path if needed
import { MapPin, Phone, Mail, Clock, ChevronDown, ChevronUp } from "lucide-react";
import Footer from '@/components/Footer';
import { supabase } from "@/lib/supabaseClient";

const reasons = [
  {
    title: "Expert Advice",
    description:
      "Our team has years of experience in luxury real estate. We provide honest, professional guidance tailored to your needs.",
  },
  {
    title: "Personalized Service",
    description:
      "We take time to understand your goals and preferences, offering solutions that match your lifestyle and investment plans.",
  },
  {
    title: "Quick Response",
    description:
      "Expect a prompt reply within 24 hours. We value your time and ensure your inquiries are addressed immediately.",
  },
];

const faqs = [
  {
    question: "How quickly do you respond to inquiries?",
    answer:
      "We typically respond within 24 hours during weekdays. For urgent matters, please call us directly.",
  },
  {
    question: "Do you have a physical office I can visit?",
    answer:
      "Yes, our office is located in Nairobi. We welcome appointments for in-person consultations. Contact us to schedule a visit.",
  },
  {
    question: "Can I schedule a property viewing online?",
    answer:
      "Absolutely! Use the form on this page or call us to arrange a viewing at your convenience.",
  },
  {
    question: "What areas do you serve?",
    answer:
      "We primarily focus on prime locations in Nairobi, Kiambu, and emerging satellite towns with high growth potential.",
  },
];

export default function ContactPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState("");

  const handleFormChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleContactSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("");

    const { error } = await supabase.rpc("ingest_contact_form_message", {
      p_source: "contact_page",
      p_full_name: formData.fullName,
      p_email: formData.email,
      p_phone: formData.phone,
      p_subject: "Contact page enquiry",
      p_body_text: formData.message,
      p_listing_id: null,
    });

    if (error) {
      setSubmitStatus("Could not send message right now. Please try again.");
      setIsSubmitting(false);
      return;
    }

    setSubmitStatus("Message sent successfully. We will reply by email.");
    setFormData({
      fullName: "",
      email: "",
      phone: "",
      message: "",
    });
    setIsSubmitting(false);
  };

  // Pattern style from user example
  const patternStyle = {
    "--s": "100px",
    "--c1": "#f8b195",
    "--c2": "#355c7d",
    "--_g":
      "var(--c2) 4% 14%, var(--c1) 14% 24%, var(--c2) 22% 34%, var(--c1) 34% 44%, var(--c2) 44% 56%, var(--c1) 56% 66%, var(--c2) 66% 76%, var(--c1) 76% 86%, var(--c2) 86% 96%",
    background: `radial-gradient(100% 100% at 100% 0, var(--c1) 4%, var(--_g), #0008 96%, #0000), radial-gradient(100% 100% at 0 100%, #0000, #0008 4%, var(--_g), var(--c1) 96%) var(--c1)`,
    backgroundSize: "var(--s) var(--s)",
    backgroundRepeat: "repeat",        // bg-repeat
  backgroundAttachment: "fixed",     // bg-fixed
  } as CSSProperties;

  return (
    <>
      <Navbar />

      {/* Hero Section with Pattern */}
      <section className="relative min-h-[50vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-repeat bg-fixed" style={patternStyle} />
        <div className="absolute inset-0 bg-black/50" /> {/* dark overlay */}
        <div className="relative container mx-auto px-4 text-center text-white py-32">
          <h1 className="text-5xl md:text-7xl font-bold mb-4">Contact <span className="text-red-700">Us</span></h1>
          <p className="text-xl md:text-2xl max-w-2xl mx-auto">
            We’re here to help with any questions about our properties or services.
          </p>
        </div>
      </section>

      {/* Why Contact Us Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Contact Us</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We are committed to providing exceptional service at every step.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {reasons.map((reason, index) => (
              <div key={index} className="luxury-card p-8 text-center">
                <h3 className="text-xl font-bold text-gray-900 mb-4">{reason.title}</h3>
                <p className="text-gray-600">{reason.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Form + Contact Info Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Get in Touch</h2>
              <p className="text-gray-600">We’d love to hear from you. Send us a message and we’ll respond as soon as possible.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Left: Form */}
              <div className="luxury-card p-8">
                <form className="space-y-6" onSubmit={handleContactSubmit}>
                  <div>
                    <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="fullName"
                      className="w-full px-4 py-3 border text-black border-gray-300 focus:border-red-700 focus:ring-1 focus:ring-red-700 outline-none transition"
                      placeholder="John Doe"
                      value={formData.fullName}
                      onChange={handleFormChange}
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      className="w-full px-4 py-3 border text-black border-gray-300 focus:border-red-700 focus:ring-1 focus:ring-red-700 outline-none transition"
                      placeholder="johndoe@example.com"
                      value={formData.email}
                      onChange={handleFormChange}
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      className="w-full px-4 py-3 border text-black border-gray-300 focus:border-red-700 focus:ring-1 focus:ring-red-700 outline-none transition"
                      placeholder="+254 700 000 000"
                      value={formData.phone}
                      onChange={handleFormChange}
                    />
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                      Message
                    </label>
                    <textarea
                      id="message"
                      rows={5}
                      className="w-full px-4 py-3 border text-black border-gray-300 focus:border-red-700 focus:ring-1 focus:ring-red-700 outline-none transition"
                      placeholder="I'm interested in..."
                      value={formData.message}
                      onChange={handleFormChange}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-red-700 text-white px-8 py-4 font-medium hover:bg-red-800 transition-colors"
                  >
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </button>
                  {submitStatus && (
                    <p className="text-sm text-gray-700">{submitStatus}</p>
                  )}
                </form>
              </div>

              {/* Right: Contact Info */}
              <div className="luxury-card p-8 flex flex-col justify-center space-y-8">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">Contact Information</h3>
                  <div className="space-y-5">
                    <div className="flex items-start gap-4">
                      <MapPin className="w-6 h-6 text-red-700 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-gray-900">Office Address</p>
                        <p className="text-gray-600">
                          Rise Again Holdings Ltd.<br />
                          Nairobi, Kenya
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <Phone className="w-6 h-6 text-red-700 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-gray-900">Phone</p>
                        <p className="text-gray-600">+254 718 551 831</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <Mail className="w-6 h-6 text-red-700 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-gray-900">Email</p>
                        <p className="text-gray-600">info@riseagainholdings.co.ke</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <Clock className="w-6 h-6 text-red-700 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-gray-900">Working Hours</p>
                        <p className="text-gray-600">
                          Monday – Friday: 8:00 AM – 6:00 PM<br />
                          Saturday: 9:00 AM – 1:00 PM
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Optional subtle map placeholder */}
                <div className="h-40 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500">
                  Map (or embed actual map)
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-gray-600">
                Quick answers to common inquiries about contacting us.
              </p>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div key={index} className="luxury-card">
                  <button
                    className="w-full p-6 text-left flex justify-between items-center"
                    onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  >
                    <span className="text-lg font-medium text-gray-900">{faq.question}</span>
                    {openIndex === index ? (
                      <ChevronUp className="w-5 h-5 text-red-700" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    )}
                  </button>
                  {openIndex === index && (
                    <div className="px-6 pb-6">
                      <p className="text-gray-600">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="text-center mt-12">
              <button className="bg-red-700 text-white px-8 py-3 font-medium hover:bg-red-800 transition-colors">
                Still have questions? Call Us
              </button>
            </div>
          </div>
        </div>
      </section>
      <Footer/>
    </>
  );
}
