"use client";

import { FormEvent, useRef, useState } from "react";
import type { PublicLanguage } from "@/lib/public-data";

const copy = {
  en: { heading: "Tell us what your team needs", note: "Share the essentials and our team can continue the conversation with you.", name: "Your name", org: "Organization", phone: "Phone", email: "Email", message: "What are you looking for?", send: "Send enquiry", sending: "Sending…", needContact: "Add a phone number or email so we can respond.", success: "Thanks — your enquiry is in.", reference: "Reference", error: "We could not send that enquiry. Please try again." },
  ar: { heading: "أخبرنا بما يحتاجه فريقك", note: "شارك التفاصيل الأساسية وسيتابع فريقنا الحديث معك.", name: "الاسم", org: "الجهة", phone: "الهاتف", email: "البريد الإلكتروني", message: "ما الذي تبحث عنه؟", send: "إرسال الاستفسار", sending: "جارٍ الإرسال…", needContact: "أضف رقم هاتف أو بريدًا إلكترونيًا حتى نتمكن من الرد.", success: "شكرًا — تم استلام استفسارك.", reference: "المرجع", error: "تعذر إرسال الاستفسار. حاول مرة أخرى." },
};

function newKey() {
  return typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `fu-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function EnquiryForm({ language, sourceProductSlug }: { language: PublicLanguage; sourceProductSlug?: string }) {
  const text = copy[language];
  const keyRef = useRef<string>("");
  const [state, setState] = useState<{ kind: "idle" | "sending" | "success" | "error"; message?: string; reference?: string }>({ kind: "idle" });

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    const phone = String(form.get("phone") ?? "").trim();
    const email = String(form.get("email") ?? "").trim();
    if (!phone && !email) {
      setState({ kind: "error", message: text.needContact });
      return;
    }
    if (!keyRef.current) keyRef.current = newKey();
    setState({ kind: "sending" });
    const payload = {
      idempotency_key: keyRef.current,
      contact_name: String(form.get("contact_name") ?? "").trim(),
      organization_name: String(form.get("organization_name") ?? "").trim(),
      phone,
      email,
      message: String(form.get("message") ?? "").trim(),
      source_product_slug: sourceProductSlug ?? "",
      language,
      source_url: window.location.href,
    };
    try {
      const response = await fetch("/api/enquiries", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const body = (await response.json()) as { reference?: string; error?: string };
      if (!response.ok || !body.reference) throw new Error(body.error || text.error);
      setState({ kind: "success", reference: body.reference });
      keyRef.current = "";
      formElement.reset();
    } catch (error) {
      setState({ kind: "error", message: error instanceof Error ? error.message : text.error });
    }
  }

  return (
    <section className="enquiry-panel" id="enquiry" aria-labelledby="enquiry-title">
      <div className="enquiry-intro"><span className="eyebrow">{language === "ar" ? "ابدأ الحديث" : "Start a conversation"}</span><h2 id="enquiry-title">{text.heading}</h2><p>{text.note}</p></div>
      <form className="enquiry-form" onSubmit={submit}>
        <label><span>{text.name}</span><input name="contact_name" required maxLength={120} autoComplete="name" /></label>
        <label><span>{text.org}</span><input name="organization_name" maxLength={160} autoComplete="organization" /></label>
        <label><span>{text.phone}</span><input name="phone" maxLength={80} autoComplete="tel" inputMode="tel" /></label>
        <label><span>{text.email}</span><input name="email" maxLength={160} autoComplete="email" inputMode="email" /></label>
        <label className="message-field"><span>{text.message}</span><textarea name="message" maxLength={2000} rows={5} /></label>
        <button className="primary-button" type="submit" disabled={state.kind === "sending"}>{state.kind === "sending" ? text.sending : text.send}<span aria-hidden="true">↗</span></button>
        <div className="form-status" role="status" aria-live="polite">
          {state.kind === "success" && <span>{text.success} <strong>{text.reference}: {state.reference}</strong></span>}
          {state.kind === "error" && <span>{state.message ?? text.error}</span>}
        </div>
      </form>
    </section>
  );
}
