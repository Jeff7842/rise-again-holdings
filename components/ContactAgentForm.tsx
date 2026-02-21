"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import { supabase } from "@/lib/supabaseClient";

interface ContactAgentFormProps {
  listingTitle: string;
  listingId: string;
}

export default function ContactAgentForm({
  listingTitle,
  listingId,
}: ContactAgentFormProps) {
  const [formData, setFormData] = useState({
    fullName: "",
    country: "",
    email: "",
    phone: "",
    message: `I'm interested in ${listingTitle}`,
    contactMethod: "Email",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<string>("");

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus("");

    const subject = `Listing enquiry: ${listingTitle}`;
    const composedBody = [
      formData.message,
      "",
      `Preferred contact method: ${formData.contactMethod}`,
      `Country: ${formData.country}`,
    ].join("\n");

    const { error } = await supabase.rpc("ingest_contact_form_message", {
      p_source: "contact_agent",
      p_full_name: formData.fullName,
      p_email: formData.email,
      p_phone: formData.phone,
      p_subject: subject,
      p_body_text: composedBody,
      p_listing_id: listingId,
    });

    if (error) {
      setStatus("Could not send your enquiry right now. Please try again.");
      setIsSubmitting(false);
      return;
    }

    setStatus("Enquiry sent successfully. Our team will reply to your email.");
    setFormData({
      fullName: "",
      country: "",
      email: "",
      phone: "",
      message: `I'm interested in ${listingTitle}`,
      contactMethod: "Email",
    });
    setIsSubmitting(false);
  };

  return (
    <form className="contact-form" onSubmit={handleSubmit}>
      <h3>Contact Agent</h3>
      <p className="contact-form-subtitle">
        Enquire about this property and receive a private briefing.
      </p>

      <input
        placeholder="Your Name"
        required
        name="fullName"
        value={formData.fullName}
        onChange={handleChange}
      />
      <input
        placeholder="Country"
        required
        name="country"
        value={formData.country}
        onChange={handleChange}
      />
      <input
        type="email"
        placeholder="Email"
        required
        name="email"
        value={formData.email}
        onChange={handleChange}
      />
      <input
        placeholder="Phone Number"
        required
        name="phone"
        value={formData.phone}
        onChange={handleChange}
      />
      <textarea
        placeholder="Message"
        name="message"
        value={formData.message}
        onChange={handleChange}
      />

      <div className="form-group">
        <label className="form-label">Preferred Contact Method</label>
        <div className="contact-checkbox">
          {["Phone", "Email", "WhatsApp"].map((method) => (
            <label key={method} className="checkbox-wrapper">
              <input
                className="checkbox-input"
                type="radio"
                name="contactMethod"
                value={method}
                checked={formData.contactMethod === method}
                onChange={handleChange}
              />
              <span className="checkbox-tile">
                <span className="checkbox-label">{method}</span>
              </span>
            </label>
          ))}
        </div>
      </div>

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Sending..." : "Contact Agent"}
      </button>

      {status && <p className="contact-form-subtitle">{status}</p>}
    </form>
  );
}
