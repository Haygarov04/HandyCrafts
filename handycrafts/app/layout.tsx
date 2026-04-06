import type { Metadata } from "next";
import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import LightBackground from "./components/LightBackground";
import MouseParticles from "./components/MouseParticles";

export const metadata: Metadata = {
  title: "HandyCrafts 3D",
  description: "3D Printing · Scanning · Modeling",
  icons: {
    icon: "/logo-remove.png",
  },
};



export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="bg">
      <body className="relative overflow-x-hidden">

        {/* Background effects */}
        <LightBackground />
        <MouseParticles />

        {/* Main content */}
        <div className="relative z-10">

          <Navbar />

          <main>
            {children}
          </main>

          <Footer />

        </div>

      </body>
    </html>
  );
}