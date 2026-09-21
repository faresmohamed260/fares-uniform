"use client";

import Script from "next/script";

declare global {
  interface Window {
    ScrollCraft?: { mount: (root?: Document | HTMLElement) => unknown; instances: unknown[] };
  }
}

export function ScrollcraftRuntime() {
  const mount = () => {
    requestAnimationFrame(() => {
      if (!window.ScrollCraft) return;
      window.ScrollCraft.instances = [];
      window.ScrollCraft.mount(document.body);
      document.documentElement.dataset.scrollcraftMounted = "true";
    });
  };

  return (
    <Script
      src="/scrollcraft/scrollcraft.js"
      strategy="afterInteractive"
      onLoad={mount}
    />
  );
}
