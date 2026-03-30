import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen w-full overflow-hidden">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 h-full w-full object-cover"
      >
        <source src="/video.mp4" type="video/mp4" />
      </video>

      <div className="absolute inset-0 bg-black/50" />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl items-center px-6 pt-28">
        <div className="max-w-3xl text-white">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-orange-400">
            3D ПРИНТИРАНЕ • 3D СКАНИРАНЕ • 3D МОДЕЛИРАНЕ
          </p>

          <h1 className="mb-6 text-4xl font-bold leading-tight md:text-6xl">
            Професионални 3D решения за идеи, прототипи, детайли и реални проекти
          </h1>

          <p className="mb-8 max-w-2xl text-lg leading-8 text-white/85">
            Помагаме при изработка на прототипи, функционални части, резервни
            детайли, персонализирани изделия и модели по идея или реален обект.
          </p>

          <div className="flex flex-col gap-4 sm:flex-row">
            <Link
              href="/upload"
              className="rounded-full bg-orange-500 px-8 py-4 text-center font-semibold transition hover:bg-orange-600"
            >
              Качи файл
            </Link>

            <a
              href="#services"
              className="rounded-full border border-white/40 bg-white/10 px-8 py-4 text-center font-semibold backdrop-blur-sm transition hover:bg-white/20"
            >
              Виж услугите
            </a>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 h-28 w-full bg-gradient-to-t from-white to-transparent" />
    </section>
  );
}