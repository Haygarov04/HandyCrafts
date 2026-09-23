"use client";

import { createElement, useEffect, useState } from "react";

const SCRIPT = "https://ajax.googleapis.com/ajax/libs/model-viewer/3.5.0/model-viewer.min.js";

export default function ModelViewer({ src }: { src: string }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (customElements.get("model-viewer")) {
      setReady(true);
      return;
    }
    const found = document.querySelector<HTMLScriptElement>("script[data-model-viewer]");
    const script = found || document.createElement("script");
    const done = () => setReady(true);
    script.addEventListener("load", done);
    if (!found) {
      script.src = SCRIPT;
      script.type = "module";
      script.dataset.modelViewer = "1";
      document.head.appendChild(script);
    }
    return () => script.removeEventListener("load", done);
  }, []);

  return (
    <div className="h-[420px] overflow-hidden rounded-[1.6rem] bg-sand">
      {ready
        ? createElement("model-viewer", {
            src,
            alt: "3D фигурка",
            "camera-controls": true,
            "auto-rotate": true,
            "shadow-intensity": "0.8",
            style: { width: "100%", height: "100%", background: "#e7e1d6" },
          })
        : <p className="grid h-full place-items-center text-sm text-ink/50">Зарежда се визуализаторът…</p>}
    </div>
  );
}
