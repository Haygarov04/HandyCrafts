"use client";

import { useEffect, useRef } from "react";

export default function MouseParticles() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current!;

    const handleMove = (e: MouseEvent) => {
      const particle = document.createElement("div");
      particle.className = "mouse-particle";

      const size = Math.random() * 3 + 1;
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;

      particle.style.left = `${e.clientX}px`;
      particle.style.top = `${e.clientY}px`;

      container.appendChild(particle);

      setTimeout(() => {
        particle.style.opacity = "0";
        particle.style.transform = "translateY(-20px)";
      }, 10);

      setTimeout(() => {
        particle.remove();
      }, 800);
    };

    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  return <div ref={containerRef} className="mouse-particles" />;
}