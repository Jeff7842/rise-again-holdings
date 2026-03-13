import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase-client";
const brevoApiKey = process.env.BREVO_API_KEY!;
const senderEmail = process.env.BREVO_SENDER_EMAIL!;
const senderName = process.env.BREVO_SENDER_NAME || "Rise Again Holdings";


export async function POST(req: Request) {
  try {
    const body = await req.json();

    const fullName = String(body.fullName || "").trim();
    const email = String(body.email || "").trim();
    const phone = String(body.phone || "").trim();
    const message = String(body.message || "").trim();

    if (!fullName || !email || !message) {
      return NextResponse.json(
        { error: "Full name, email, and message are required." },
        { status: 400 }
      );
    }

    // 1) Save contact message to Supabase first
    const { error: dbError } = await supabase.rpc("ingest_contact_form_message", {
      p_source: "contact_page",
      p_full_name: fullName,
      p_email: email,
      p_phone: phone,
      p_subject: "Contact page enquiry",
      p_body_text: message,
      p_listing_id: null,
    });

    if (dbError) {
      console.error("Supabase RPC error:", dbError);
      return NextResponse.json(
        { error: "Could not save your message right now." },
        { status: 500 }
      );
    }

    // 2) Send automatic acknowledgement email through Brevo
    const brevoResponse = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": brevoApiKey,
      },
      body: JSON.stringify({
        sender: {
          name: senderName,
          email: senderEmail,
        },
        to: [
          {
            email,
            name: fullName,
          },
        ],
        subject: "Thank you for contacting Rise Again Holdings LTD",
        htmlContent: `
          <body style="margin:0;padding:0;background:#f5f5f5;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;">
      <tr>
        <td align="center" style="padding:24px 12px;">
          <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 6px 20px rgba(0,0,0,0.08);width:100%;max-width:600px;">

            <tr>
              <td style="background:#ffffff;padding:0;text-align:center;">
                <img 
                  src="https://fvjyxnsxylajudptslro.supabase.co/storage/v1/object/public/Rise%20Agina%20website/Email-Template-1.1.webp"
                  alt="Rise Again Holdings"
                  style="width:100%;max-width:600px;display:block;"
                />
              </td>
            </tr>

            <tr>
              <td style="padding:32px;color:#333333;font-family:Arial,sans-serif;line-height:1.6;">
                <p style="margin:0 0 16px 0;font-size:20px;">
                  Hello <span style="color:#a61a1f;"><strong>${escapeHtml(fullName)}</strong></span>,
                </p>

                <p style="margin:0 0 16px 0;font-size:15px;line-height:1.6;color:#333333;">
                  Thank you for reaching out to <strong>Rise Again Holdings</strong>. Your inquiry has been successfully received and is currently under review by our team.
                </p>

                <p style="margin:0 0 8px 0;font-size:15px;line-height:1.6;color:#333333;">
                  Your message:
                </p>

                <div style="background:#f7f7f7;border-radius:6px;padding:14px;margin:8px 0 20px 0;text-align:left;font-size:14px;color:#333333;">
                  <div style="border-left:3px solid #a61a1f;padding:0 10px;margin-top:4px;">
                    <strong>“${escapeHtml(message).replace(/\n/g, "<br />")}”</strong>
                  </div>
                </div>

                <p style="margin:0 0 20px 0;font-size:14px;color:#555555;">
                  At Rise Again Holdings, we are committed to professionalism, transparency, and dependable service, helping our clients make confident real estate decisions with clarity and trust.
                </p>

                <div style="text-align:center;margin:28px 0;">
                  <a
                    href="https://riseagainholdings.com"
                    style="background:#0A1C29;color:#f7f7f7;text-decoration:none;padding:14px 26px;border-radius:6px;font-weight:bold;display:inline-block;"
                  >
                    Visit Our Website
                  </a>
                </div>

                <p style="font-size:14px;color:#555555;line-height:1.6;margin:0 0 20px 0;">
                  Our team typically responds as soon as possible. In the meantime, feel free to continue exploring our listings and services on our website.
                </p>

                <hr style="border:none;border-top:1px solid #e5e5e5;margin:24px 0;">

                <p style="font-size:13px;color:#777777;margin:0;line-height:1.8;">
                  <strong>Rise Again Holdings</strong><br>
                  +254 716 000 000<br>
                  info@riseagainholdings.com<br>
                  Nairobi, Kenya
                </p>
              </td>
            </tr>

            <tr>
              <td style="background:#f7f7f7;padding:18px;text-align:center;font-size:12px;color:#888888;font-family:Arial,sans-serif;">
                © 2026 Rise Again Holdings. All rights reserved.
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>
        `,
      }),
    });

    if (!brevoResponse.ok) {
      const brevoErrorText = await brevoResponse.text();
      console.error("Brevo send error:", brevoErrorText);

      // Message was saved, but auto-reply failed
      return NextResponse.json(
        {
          success: true,
          warning:
            "Your message was received, but the automatic confirmation email could not be sent.",
        },
        { status: 200 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Message received successfully. Confirmation email sent.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Contact route error:", error);
    return NextResponse.json(
      { error: "Something went wrong while sending your message." },
      { status: 500 }
    );
  }
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}