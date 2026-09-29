"use client";

export default function ErrorBoundary({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="not-found" role="alert">
      <span className="eyebrow">Fares Uniform</span>
      <h1>
        <span className="copy-en">Something went wrong.</span>
        <span className="copy-ar">حدث خطأ غير متوقع.</span>
      </h1>
      <p>
        <span className="copy-en">The public page could not be loaded. You can try again without losing the rest of the site.</span>
        <span className="copy-ar">تعذّر تحميل الصفحة العامة. يمكنك المحاولة مرة أخرى دون فقدان بقية الموقع.</span>
      </p>
      <div className="error-actions">
        <button className="primary-button" type="button" onClick={reset}>
          <span className="copy-en">Try again</span>
          <span className="copy-ar">حاول مرة أخرى</span>
        </button>
      </div>
    </main>
  );
}
