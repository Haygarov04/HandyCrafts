"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import ModelViewer from "@/app/components/ModelViewer";
import { isProductId, products, sizes, type ProductId } from "@/lib/figurine";

const steps = ["Хора", "Снимка", "Детайли", "Създаване", "Преглед", "Добавки"];

type ModelState = {
  status: string;
  progress: number;
  thumbnailUrl: string;
  glb: string;
  stl: string;
  error: string;
};

const emptyModel: ModelState = {
  status: "",
  progress: 0,
  thumbnailUrl: "",
  glb: "",
  stl: "",
  error: "",
};

export default function StudioPage() {
  const fileRef = useRef<HTMLInputElement>(null);
  const [step, setStep] = useState(0);
  const [product, setProduct] = useState<ProductId>("figurine");
  const [size, setSize] = useState<(typeof sizes)[number]>("10 см");
  const [people, setPeople] = useState(1);
  const [photoUrl, setPhotoUrl] = useState("");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [clothes, setClothes] = useState("Същите дрехи като на снимката");
  const [pose, setPose] = useState("Стои естествено, обърнат напред, в удобна поза в цял ръст.");
  const [progress, setProgress] = useState(0);
  const [previewUrl, setPreviewUrl] = useState("");
  const [notice, setNotice] = useState("");
  const [grok, setGrok] = useState<boolean | null>(null);
  const [meshy, setMeshy] = useState<boolean | null>(null);
  const [box, setBox] = useState<"standard" | "premium">("standard");
  const [rush, setRush] = useState(false);
  const [copy, setCopy] = useState(false);
  const [order, setOrder] = useState({ name: "", email: "", phone: "" });
  const [orderState, setOrderState] = useState("");
  const [model, setModel] = useState<ModelState>(emptyModel);
  const [modelBusy, setModelBusy] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const requested = params.get("product") || "";
    if (isProductId(requested)) setProduct(requested);
    fetch("/api/studio/status")
      .then((res) => res.json())
      .then((data) => {
        setGrok(Boolean(data.grok));
        setMeshy(Boolean(data.meshy));
      })
      .catch(() => {
        setGrok(false);
        setMeshy(false);
      });
  }, []);

  useEffect(() => {
    return () => {
      if (photoUrl.startsWith("blob:")) URL.revokeObjectURL(photoUrl);
    };
  }, [photoUrl]);

  const summary = useMemo(
    () => `${products[product].label} · ${size} · ${people} ${people === 1 ? "човек" : "души"}`,
    [product, size, people]
  );

  function choosePhoto(file: File | null) {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setNotice("Качи снимка във формат JPG или PNG.");
      return;
    }
    if (photoUrl.startsWith("blob:")) URL.revokeObjectURL(photoUrl);
    setPhotoFile(file);
    setPhotoUrl(URL.createObjectURL(file));
    setPreviewUrl("");
    setNotice("");
  }

  async function createPreview() {
    if (!photoFile) {
      setNotice("Първо избери снимка.");
      setStep(1);
      return;
    }
    setStep(3);
    setProgress(8);
    setNotice("");
    const timer = window.setInterval(() => {
      setProgress((value) => (value < 88 ? value + 4 : value));
    }, 500);

    try {
      const body = new FormData();
      body.set("product", product);
      body.set("size", size);
      body.set("clothes", clothes);
      body.set("pose", pose);
      body.set("photo", photoFile);
      const res = await fetch("/api/studio/preview", { method: "POST", body });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Визуализацията не мина.");
      setProgress(100);
      if (data.imageUrl) setPreviewUrl(data.imageUrl);
      if (!data.connected) setNotice(data.error);
      setStep(4);
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Нещо се обърка.");
      setStep(2);
    } finally {
      window.clearInterval(timer);
    }
  }

  async function sendOrder() {
    setOrderState("");
    if (!order.name || !order.email) {
      setOrderState("Напиши име и имейл.");
      return;
    }
    if (!photoFile) {
      setOrderState("Снимката липсва. Върни се една стъпка назад и я качи отново.");
      return;
    }
    const body = new FormData();
    body.set("name", order.name);
    body.set("email", order.email);
    body.set("phone", order.phone);
    body.set("product", product);
    body.set("size", size);
    body.set("people", String(people));
    body.set("clothes", clothes);
    body.set("pose", pose);
    body.set("box", box);
    body.set("rush", String(rush));
    body.set("secondCopy", String(copy));
    body.set("photo", photoFile);
    if (previewUrl) body.set("previewUrl", previewUrl);
    if (model.glb) body.set("glbUrl", model.glb);
    if (model.stl) body.set("stlUrl", model.stl);

    const res = await fetch("/api/orders", { method: "POST", body });
    const data = await res.json();
    if (!res.ok) {
      setOrderState(data.error || "Поръчката не се записа. Пиши на handycraftshelp@gmail.com.");
      return;
    }
    setOrderState("Поръчката е записана със снимката. Ще я прегледаме преди печат.");
  }

  async function startModel() {
    if (!previewUrl) return;
    setModelBusy(true);
    setModel(emptyModel);
    const res = await fetch("/api/studio/model", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ imageUrl: previewUrl }),
    });
    const data = await res.json();
    if (!res.ok || !data.id) {
      setModel({ ...emptyModel, error: data.error || "3D файлът не тръгна." });
      setModelBusy(false);
      return;
    }
    const id = data.id as string;
    for (let attempt = 0; attempt < 40; attempt += 1) {
      await new Promise((resolve) => setTimeout(resolve, 4000));
      const statusRes = await fetch(`/api/studio/model?id=${id}`);
      const status = await statusRes.json();
      setModel(status);
      if (status.status === "SUCCEEDED" || status.status === "FAILED") break;
    }
    setModelBusy(false);
  }

  return (
    <div className="min-h-screen bg-[#f4f7fb] px-4 pb-28 pt-6 text-[#172033] sm:px-6">
      <div className="mx-auto flex max-w-5xl items-center justify-between">
        <p className="font-display text-2xl text-ink">HandyCrafts</p>
        <div className="rounded-full border border-[#172033]/10 bg-white px-4 py-2 text-center text-sm shadow-sm">
          <span className="block font-semibold">{products[product].label}</span>
          <span className="text-xs text-[#172033]/55">{size}</span>
        </div>
        <a href="/" className="grid h-11 w-11 place-items-center rounded-full bg-white text-lg shadow-sm" aria-label="Затвори студиото">
          ×
        </a>
      </div>

      <ol className="mx-auto mt-8 flex max-w-3xl items-start justify-between gap-2">
        {steps.map((label, index) => {
          const done = index < step;
          const current = index === step;
          return (
            <li key={label} className="flex flex-1 flex-col items-center gap-2 text-center">
              <span
                className={`grid h-8 w-8 place-items-center rounded-full text-xs font-semibold ${
                  current
                    ? "bg-ember text-ink"
                    : done
                      ? "bg-ink text-paper"
                      : "bg-white text-[#172033]/40"
                }`}
              >
                {done ? "✓" : index + 1}
              </span>
              <span className={`text-[11px] sm:text-xs ${current ? "font-semibold" : "text-[#172033]/50"}`}>
                {label}
              </span>
            </li>
          );
        })}
      </ol>

      <section className="mx-auto mt-8 max-w-3xl rounded-[28px] bg-white px-5 py-8 shadow-[0_20px_60px_rgba(23,32,51,0.06)] sm:px-10 sm:py-12">
        {step === 0 ? (
          <div>
            <h1 className="text-center text-4xl sm:text-5xl">Кого превръщаме в мини?</h1>
            <div className="mx-auto mt-8 max-w-md rounded-3xl bg-[#f4f7fb] px-6 py-8">
              <p className="text-sm font-semibold">Брой души</p>
              <div className="mt-8 flex items-center justify-center gap-8">
                <button type="button" className="grid h-12 w-12 place-items-center rounded-full bg-white text-2xl" onClick={() => setPeople((n) => Math.max(1, n - 1))} aria-label="Намали">–</button>
                <p className="text-center"><span className="block font-display text-6xl">{people}</span><span className="text-sm">{people === 1 ? "човек" : "души"}</span></p>
                <button type="button" className="grid h-12 w-12 place-items-center rounded-full bg-white text-2xl" onClick={() => setPeople((n) => Math.min(3, n + 1))} aria-label="Увеличи">+</button>
              </div>
            </div>
            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {(Object.keys(products) as ProductId[]).map((id) => (
                <button key={id} type="button" onClick={() => setProduct(id)} className={`rounded-2xl border px-4 py-4 text-left ${product === id ? "border-ember bg-orange-50" : "border-black/10"}`}>
                  <span className="block font-semibold">{products[id].label}</span>
                  <span className="mt-1 block text-sm text-[#172033]/60">{products[id].line}</span>
                </button>
              ))}
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {sizes.map((item) => (
                <button key={item} type="button" onClick={() => setSize(item)} className={`rounded-full px-4 py-2 text-sm ${size === item ? "bg-ink text-paper" : "bg-[#f4f7fb]"}`}>{item}</button>
              ))}
            </div>
          </div>
        ) : null}

        {step === 1 ? (
          <div>
            <h1 className="text-center text-4xl sm:text-5xl">Избери снимка</h1>
            <p className="mx-auto mt-3 max-w-md text-center text-sm leading-6 text-[#172033]/60">
              Ясна снимка, лицето отпред. За {people} {people === 1 ? "човек" : "души"} една обща снимка стига, ако всички се виждат.
            </p>
            <button type="button" onClick={() => fileRef.current?.click()} className="mx-auto mt-8 block w-full max-w-lg rounded-3xl border border-dashed border-emerald-300 bg-emerald-50/40 p-4 text-left">
              <span className="flex items-center justify-between text-sm font-semibold">
                Вашата снимка
                <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs text-emerald-800">{photoUrl ? "Готово" : "Избери"}</span>
              </span>
              {photoUrl ? (
                <img src={photoUrl} alt="Качената снимка" className="mt-4 max-h-80 w-full rounded-2xl object-cover" />
              ) : (
                <span className="mt-8 block py-10 text-center text-[#172033]/50">Натисни и качи JPG или PNG до 8 MB</span>
              )}
            </button>
            <input ref={fileRef} type="file" accept="image/png,image/jpeg,image/webp" hidden onChange={(event) => choosePhoto(event.target.files?.[0] || null)} />
          </div>
        ) : null}

        {step === 2 ? (
          <div>
            <h1 className="text-center text-4xl sm:text-5xl">Опишете дрехите и позата</h1>
            <label className="mt-8 block text-sm font-semibold">
              Дрехи
              <textarea value={clothes} onChange={(event) => setClothes(event.target.value)} className="mt-2 min-h-28 w-full rounded-2xl border border-black/10 px-4 py-3 font-normal outline-none focus:border-ember" />
            </label>
            <label className="mt-5 block text-sm font-semibold">
              Опишете позата <span className="font-normal text-[#172033]/45">С ваши думи</span>
              <textarea value={pose} onChange={(event) => setPose(event.target.value)} className="mt-2 min-h-28 w-full rounded-2xl border border-black/10 px-4 py-3 font-normal outline-none focus:border-ember" />
            </label>
          </div>
        ) : null}

        {step === 3 ? (
          <div className="py-10 text-center">
            <h1 className="text-4xl">Създаване</h1>
            <div className="relative mx-auto mt-10 grid h-64 max-w-xl place-items-center overflow-hidden rounded-3xl bg-[#f7f8fb]">
              {photoUrl ? <img src={photoUrl} alt="" className="absolute inset-0 h-full w-full object-cover opacity-30" /> : null}
              <div className="relative grid h-40 w-40 place-items-center rounded-full border border-[#172033]/10 bg-white/80">
                <span className="font-display text-5xl">{progress}%</span>
              </div>
            </div>
            <p className="mt-4 text-sm text-[#172033]/55">Картинката се прави от снимката и описанието. 3D файлът идва след нея, ако го поискаш.</p>
          </div>
        ) : null}

        {step === 4 ? (
          <div>
            <h1 className="text-center text-4xl sm:text-5xl">Преглед</h1>
            {notice ? <p className="mt-6 rounded-2xl bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-950">{notice}</p> : null}
            <div className="mt-6 overflow-hidden rounded-3xl bg-[#f4f7fb]">
              {previewUrl ? (
                <img src={previewUrl} alt="Визуализация на фигурката" className="max-h-[28rem] w-full object-contain" />
              ) : photoUrl ? (
                <img src={photoUrl} alt="Качената снимка" className="max-h-80 w-full object-contain" />
              ) : null}
            </div>
            <p className="mt-4 text-sm leading-6 text-[#172033]/60">
              Grok: {grok ? "свързан" : grok === false ? "чака XAI_API_KEY" : "…"}. Meshy за печатаем файл: {meshy ? "свързан" : meshy === false ? "по желание, чака MESHY_API_KEY" : "…"}.
            </p>
            {previewUrl ? (
              <button type="button" onClick={startModel} disabled={modelBusy} className="mt-4 text-sm font-semibold underline decoration-ember underline-offset-4 disabled:opacity-50">
                {modelBusy ? `3D файл ${model.progress || 0}%` : "Подготви 3D файл за печат"}
              </button>
            ) : null}
            {model.error ? <p className="mt-2 text-sm text-red-700">{model.error}</p> : null}
            {model.glb ? (
              <div className="mt-5">
                <ModelViewer src={`/api/studio/asset?url=${encodeURIComponent(model.glb)}`} />
                <p className="mt-2 text-xs text-ink/50">Завърти фигурката с мишката или с пръст.</p>
              </div>
            ) : null}
          </div>
        ) : null}

        {step === 5 ? (
          <div>
            <h1 className="text-center text-4xl sm:text-5xl">Добавки</h1>
            <p className="mt-3 text-center text-sm text-[#172033]/60">Цената се потвърждава след преглед на визуализацията. Тук избираш само какво искаш.</p>
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              <button type="button" onClick={() => setBox("standard")} className={`rounded-3xl border p-5 text-left ${box === "standard" ? "border-ember" : "border-black/10"}`}>
                <span className="block text-xl font-semibold">Стандартна кутия</span>
                <span className="mt-1 block text-sm text-[#172033]/60">Крафт кутия, включена в изработката.</span>
              </button>
              <button type="button" onClick={() => setBox("premium")} className={`rounded-3xl border p-5 text-left ${box === "premium" ? "border-ember" : "border-black/10"}`}>
                <span className="block text-xl font-semibold">Премиум кутия</span>
                <span className="mt-1 block text-sm text-[#172033]/60">Цветна кутия с място за пожелание.</span>
              </button>
              <button type="button" onClick={() => setRush((value) => !value)} className={`rounded-3xl border p-5 text-left ${rush ? "border-ember" : "border-black/10"}`}>
                <span className="block font-semibold">Бърза изработка</span>
                <span className="mt-1 block text-sm text-[#172033]/60">{rush ? "Избрана" : "По-кратък срок, ако има място."}</span>
              </button>
              <button type="button" onClick={() => setCopy((value) => !value)} className={`rounded-3xl border p-5 text-left ${copy ? "border-ember" : "border-black/10"}`}>
                <span className="block font-semibold">Второ копие</span>
                <span className="mt-1 block text-sm text-[#172033]/60">{copy ? "Избрано" : "Същата фигурка още веднъж."}</span>
              </button>
            </div>
            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              <input value={order.name} onChange={(event) => setOrder({ ...order, name: event.target.value })} placeholder="Име" className="rounded-2xl border border-black/10 px-4 py-3 outline-none focus:border-ember" />
              <input value={order.email} onChange={(event) => setOrder({ ...order, email: event.target.value })} placeholder="Имейл" type="email" className="rounded-2xl border border-black/10 px-4 py-3 outline-none focus:border-ember" />
              <input value={order.phone} onChange={(event) => setOrder({ ...order, phone: event.target.value })} placeholder="Телефон" className="rounded-2xl border border-black/10 px-4 py-3 outline-none focus:border-ember" />
            </div>
            {orderState ? <p className="mt-4 text-sm">{orderState}</p> : null}
          </div>
        ) : null}
      </section>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-black/5 bg-white/95 px-4 py-4 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4">
          <button type="button" onClick={() => setStep((value) => Math.max(0, value - (value === 4 ? 2 : 1)))} disabled={step === 0 || step === 3} className="rounded-2xl border border-black/10 px-4 py-3 text-sm disabled:opacity-30">
            ‹ Назад
          </button>
          <p className="hidden text-sm sm:block"><span className="font-semibold">{summary}</span><span className="mt-0.5 block text-xs text-[#172033]/50">Цена след преглед</span></p>
          {step < 2 ? (
            <button type="button" onClick={() => setStep((value) => value + 1)} disabled={step === 1 && !photoFile} className="rounded-full bg-ember px-6 py-3 font-semibold text-ink disabled:opacity-40">
              Продължи →
            </button>
          ) : null}
          {step === 2 ? (
            <button type="button" onClick={createPreview} className="rounded-full bg-ember px-6 py-3 font-semibold text-ink">Създай</button>
          ) : null}
          {step === 4 ? (
            <button type="button" onClick={() => setStep(5)} className="rounded-full bg-ember px-6 py-3 font-semibold text-ink">Към добавките</button>
          ) : null}
          {step === 5 ? (
            <button type="button" onClick={sendOrder} className="rounded-full bg-ink px-6 py-3 font-semibold text-paper">Изпрати запитване</button>
          ) : null}
          {step === 3 ? <span className="rounded-full bg-ember/40 px-6 py-3 text-sm">Създаване</span> : null}
        </div>
      </div>
    </div>
  );
}
