"use client";

import { FormEvent, useState } from "react";
import type { Locale } from "@/lib/locale";

export function ReviewForm({ locale }: { locale: Locale }) {
  const [status, setStatus] = useState<"idle" | "demo">("idle");
  const ar = locale === "ar";

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("demo");
  }

  return (
    <form className="review-form" onSubmit={submit}>
      <div className="field-row">
        <label>
          <span>{ar ? "الاسم" : "Name"}</span>
          <input name="name" autoComplete="name" placeholder={ar ? "اسمك" : "Your name"} />
        </label>
        <label>
          <span>{ar ? "المؤسسة" : "Organization"}</span>
          <input name="organization" autoComplete="organization" placeholder={ar ? "اسم المؤسسة" : "Organization name"} />
        </label>
      </div>
      <div className="field-row">
        <label>
          <span>{ar ? "البريد الإلكتروني" : "Email"}</span>
          <input type="email" name="email" autoComplete="email" placeholder="name@example.com" />
        </label>
        <label>
          <span>{ar ? "القطاع" : "Sector"}</span>
          <select name="sector" defaultValue="">
            <option value="" disabled>{ar ? "اختر القطاع" : "Choose sector"}</option>
            <option>{ar ? "التعليم" : "Education"}</option>
            <option>{ar ? "المطاعم والمقاهي" : "Restaurants & cafés"}</option>
            <option>{ar ? "الضيافة" : "Hospitality"}</option>
            <option>{ar ? "الرعاية الصحية" : "Healthcare"}</option>
            <option>{ar ? "فرق الشركات" : "Corporate teams"}</option>
          </select>
        </label>
      </div>
      <label className="field-message">
        <span>{ar ? "ما الذي يحتاجه فريقك؟" : "What does your team need?"}</span>
        <textarea name="message" rows={5} defaultValue={ar ? "أرغب في مناقشة برنامج زي موحّد لفريقنا." : "I’d like to discuss a coordinated uniform program for our team."} />
      </label>
      <div className="form-end">
        <button className="button button-dark" type="submit">{ar ? "راجع حالة الإرسال" : "Preview submission state"}<span aria-hidden="true">↗</span></button>
        <p>{ar ? "بيئة تصميم فقط — لا يتم إرسال أي بيانات." : "Design environment only — no data is sent."}</p>
      </div>
      {status === "demo" && <div className="demo-status" role="status">{ar ? "حالة النجاح: سيظهر التأكيد هنا بعد ربط النموذج الحقيقي." : "Success state: confirmation will appear here after the real form is integrated."}</div>}
    </form>
  );
}
