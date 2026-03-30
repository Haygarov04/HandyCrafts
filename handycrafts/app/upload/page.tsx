"use client";

import { useMemo, useRef, useState } from "react";

const materials = ["PLA", "PETG", "ABS", "TPU", "Resin", "Консултация"];
const technologies = ["FDM", "SLA / Resin", "Не съм сигурен"];
const purposes = [
  "Прототип",
  "Функционален детайл",
  "Резервна част",
  "Декоративен модел",
  "Custom проект",
];

const presetColors = [
  { name: "Черно", value: "#1f1f1f" },
  { name: "Бяло", value: "#f5f5f5" },
  { name: "Сиво", value: "#9ca3af" },
  { name: "Оранжево", value: "#f97316" },
  { name: "Синьо", value: "#2563eb" },
  { name: "Червено", value: "#dc2626" },
  { name: "Зелено", value: "#16a34a" },
  { name: "Жълто", value: "#eab308" },
];

export default function UploadPage() {
  const inputRef = useRef<HTMLInputElement>(null);

  const [selectedMaterial, setSelectedMaterial] = useState<string | null>(null);
  const [selectedTechnology, setSelectedTechnology] = useState<string | null>(null);
  const [selectedPurpose, setSelectedPurpose] = useState<string | null>(null);
  const [selectedColorName, setSelectedColorName] = useState<string | null>(null);
  const [customColor, setCustomColor] = useState("#ff7a00");
  const [useCustomColor, setUseCustomColor] = useState(false);

  const [paintingRequested, setPaintingRequested] = useState(false);
  const [paintingDetails, setPaintingDetails] = useState("");

  const [files, setFiles] = useState<File[]>([]);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    quantity: "1",
    description: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const finalColor = useMemo(() => {
    if (useCustomColor) return customColor;
    const found = presetColors.find((c) => c.name === selectedColorName);
    return found?.value ?? "#f97316";
  }, [useCustomColor, customColor, selectedColorName]);

  function updateField(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }

  function handleFiles(fileList: FileList | null) {
    if (!fileList) return;
    const incoming = Array.from(fileList);

    setFiles((prev) => {
      const merged = [...prev, ...incoming];
      return merged.slice(0, 10);
    });
  }

  function removeFile(indexToRemove: number) {
    setFiles((prev) => prev.filter((_, index) => index !== indexToRemove));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setSuccess("");
    setError("");

    try {
      if (!form.name || !form.email || !form.description) {
        throw new Error("Попълни име, имейл и описание.");
      }

      if (files.length === 0) {
        throw new Error("Качи поне един файл или снимка.");
      }

      const body = new FormData();

      body.append("name", form.name);
      body.append("email", form.email);
      body.append("phone", form.phone);
      body.append("quantity", form.quantity);
      body.append("description", form.description);

      body.append("material", selectedMaterial ?? "");
      body.append("technology", selectedTechnology ?? "");
      body.append("purpose", selectedPurpose ?? "");
      body.append("colorName", useCustomColor ? "Custom" : selectedColorName ?? "");
      body.append("colorHex", finalColor);

      body.append("paintingRequested", String(paintingRequested));
      body.append("paintingDetails", paintingDetails);

      files.forEach((file) => {
        body.append("files", file);
      });

      const res = await fetch("/api/upload", {
        method: "POST",
        body,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Грешка при изпращане.");
      }

      setSuccess("Запитването беше изпратено успешно.");
      setForm({
        name: "",
        email: "",
        phone: "",
        quantity: "1",
        description: "",
      });
      setSelectedMaterial(null);
      setSelectedTechnology(null);
      setSelectedPurpose(null);
      setSelectedColorName(null);
      setCustomColor("#ff7a00");
      setUseCustomColor(false);
      setPaintingRequested(false);
      setPaintingDetails("");
      setFiles([]);
      if (inputRef.current) inputRef.current.value = "";
    } catch (err) {
      setError(err instanceof Error ? err.message : "Нещо се обърка.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-neutral-50 px-6 pb-20 pt-36">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 max-w-3xl">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-orange-500">
            Качване на проект
          </p>
          <h1 className="mb-4 text-4xl font-bold text-neutral-900 md:text-5xl">
            Качи файл и конфигурирай проекта си
          </h1>
          <p className="text-lg leading-8 text-neutral-700">
            Изпрати STL, OBJ, STEP, 3MF, ZIP или снимки и избери основните си
            предпочитания. След изпращане ще получим всички детайли и линкове към файловете.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="rounded-[32px] border border-black/5 bg-white p-8 shadow-[0_20px_60px_rgba(0,0,0,0.05)]">
            <h2 className="mb-4 text-2xl font-bold text-neutral-900">
              Файлове и основна информация
            </h2>

            <label className="flex min-h-[240px] cursor-pointer flex-col items-center justify-center rounded-[28px] border-2 border-dashed border-orange-300 bg-orange-50 text-center transition hover:bg-orange-100/40">
              <span className="mb-2 text-xl font-semibold text-neutral-900">
                Натисни тук или плъзни файлове
              </span>
              <span className="px-6 text-neutral-600">
                Поддържани формати: STL, OBJ, STEP, 3MF, ZIP, JPG, PNG, WEBP
              </span>

              <input
                ref={inputRef}
                type="file"
                multiple
                accept=".stl,.obj,.step,.stp,.3mf,.zip,.jpg,.jpeg,.png,.webp"
                className="hidden"
                onChange={(e) => handleFiles(e.target.files)}
              />
            </label>

            {files.length > 0 ? (
              <div className="mt-6 rounded-2xl border border-black/10 bg-neutral-50 p-4">
                <p className="mb-3 font-semibold text-neutral-900">Качени файлове</p>
                <div className="space-y-2">
                  {files.map((file, index) => (
                    <div
                      key={`${file.name}-${index}`}
                      className="flex items-center justify-between rounded-xl bg-white px-4 py-3"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-neutral-900">
                          {file.name}
                        </p>
                        <p className="text-xs text-neutral-500">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="ml-4 rounded-full px-3 py-1 text-sm text-red-600 transition hover:bg-red-50"
                      >
                        Премахни
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            <div className="mt-8 grid gap-4 md:grid-cols-2">
              <input
                name="name"
                type="text"
                value={form.name}
                onChange={updateField}
                placeholder="Име"
                className="rounded-2xl border border-black/10 px-4 py-3 outline-none transition focus:border-orange-500"
                required
              />
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={updateField}
                placeholder="Имейл"
                className="rounded-2xl border border-black/10 px-4 py-3 outline-none transition focus:border-orange-500"
                required
              />
              <input
                name="phone"
                type="text"
                value={form.phone}
                onChange={updateField}
                placeholder="Телефон"
                className="rounded-2xl border border-black/10 px-4 py-3 outline-none transition focus:border-orange-500"
              />
              <input
                name="quantity"
                type="number"
                min="1"
                value={form.quantity}
                onChange={updateField}
                placeholder="Количество"
                className="rounded-2xl border border-black/10 px-4 py-3 outline-none transition focus:border-orange-500"
              />
              <textarea
                name="description"
                value={form.description}
                onChange={updateField}
                placeholder="Описание, размери, предназначение, важни детайли"
                className="min-h-[160px] rounded-2xl border border-black/10 px-4 py-3 outline-none transition focus:border-orange-500 md:col-span-2"
                required
              />
            </div>
          </div>

          <div className="space-y-8">
            <div className="rounded-[32px] bg-white p-8 shadow-[0_20px_60px_rgba(0,0,0,0.05)]">
              <h3 className="mb-5 text-xl font-bold text-neutral-900">Материал</h3>
              <div className="flex flex-wrap gap-3">
                {materials.map((item) => {
                  const active = selectedMaterial === item;
                  return (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setSelectedMaterial(item)}
                      className={`rounded-full border px-4 py-2 transition ${
                        active
                          ? "border-orange-500 bg-orange-500 text-white"
                          : "border-black/10 hover:border-orange-500 hover:bg-orange-50"
                      }`}
                    >
                      {item}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="rounded-[32px] bg-white p-8 shadow-[0_20px_60px_rgba(0,0,0,0.05)]">
              <div className="mb-5 flex items-center justify-between gap-4">
                <h3 className="text-xl font-bold text-neutral-900">Цвят</h3>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-neutral-500">Избран:</span>
                  <span
                    className="h-8 w-8 rounded-full border-2 border-white shadow-md"
                    style={{ background: finalColor }}
                  />
                </div>
              </div>

              <div className="mb-6 grid grid-cols-4 gap-4">
                {presetColors.map((color) => {
                  const active = !useCustomColor && selectedColorName === color.name;
                  return (
                    <button
                      key={color.name}
                      type="button"
                      onClick={() => {
                        setUseCustomColor(false);
                        setSelectedColorName(color.name);
                      }}
                      className="flex flex-col items-center gap-2"
                    >
                      <span
                        className={`block h-12 w-12 rounded-full border-4 transition ${
                          active ? "scale-110 border-orange-500" : "border-white shadow-md"
                        }`}
                        style={{ background: color.value }}
                      />
                      <span
                        className={`text-xs font-medium ${
                          active ? "text-orange-500" : "text-neutral-600"
                        }`}
                      >
                        {color.name}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="rounded-2xl border border-black/10 bg-neutral-50 p-4">
                <div className="mb-3 flex items-center justify-between">
                  <p className="font-semibold text-neutral-900">Custom цвят</p>
                  <button
                    type="button"
                    onClick={() => setUseCustomColor(true)}
                    className={`rounded-full px-3 py-1 text-sm font-medium transition ${
                      useCustomColor
                        ? "bg-orange-500 text-white"
                        : "border border-black/10 bg-white text-neutral-700"
                    }`}
                  >
                    Използвай custom
                  </button>
                </div>

                <div className="flex items-center gap-4">
                  <input
                    type="color"
                    value={customColor}
                    onChange={(e) => {
                      setCustomColor(e.target.value);
                      setUseCustomColor(true);
                    }}
                    className="h-12 w-16 cursor-pointer rounded-xl border border-black/10 bg-white"
                  />
                  <input
                    type="text"
                    value={customColor}
                    onChange={(e) => {
                      setCustomColor(e.target.value);
                      setUseCustomColor(true);
                    }}
                    className="flex-1 rounded-xl border border-black/10 px-4 py-3 outline-none focus:border-orange-500"
                  />
                </div>
              </div>
            </div>

            <div className="rounded-[32px] bg-white p-8 shadow-[0_20px_60px_rgba(0,0,0,0.05)]">
              <h3 className="mb-5 text-xl font-bold text-neutral-900">Технология</h3>
              <div className="flex flex-wrap gap-3">
                {technologies.map((item) => {
                  const active = selectedTechnology === item;
                  return (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setSelectedTechnology(item)}
                      className={`rounded-full border px-4 py-2 transition ${
                        active
                          ? "border-orange-500 bg-orange-500 text-white"
                          : "border-black/10 hover:border-orange-500 hover:bg-orange-50"
                      }`}
                    >
                      {item}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="rounded-[32px] bg-white p-8 shadow-[0_20px_60px_rgba(0,0,0,0.05)]">
              <h3 className="mb-5 text-xl font-bold text-neutral-900">Приложение</h3>
              <div className="flex flex-wrap gap-3">
                {purposes.map((item) => {
                  const active = selectedPurpose === item;
                  return (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setSelectedPurpose(item)}
                      className={`rounded-full border px-4 py-2 transition ${
                        active
                          ? "border-orange-500 bg-orange-500 text-white"
                          : "border-black/10 hover:border-orange-500 hover:bg-orange-50"
                      }`}
                    >
                      {item}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="rounded-[32px] bg-white p-8 shadow-[0_20px_60px_rgba(0,0,0,0.05)]">
              <div className="flex items-center justify-between gap-4">
                <h3 className="text-xl font-bold text-neutral-900">Ръчно боядисване</h3>
                <button
                  type="button"
                  onClick={() => setPaintingRequested((prev) => !prev)}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                    paintingRequested
                      ? "bg-orange-500 text-white"
                      : "border border-black/10 bg-white text-neutral-700"
                  }`}
                >
                  {paintingRequested ? "Да" : "Не"}
                </button>
              </div>

              {paintingRequested ? (
                <textarea
                  value={paintingDetails}
                  onChange={(e) => setPaintingDetails(e.target.value)}
                  placeholder="Уточнения за боядисването - по снимка, мат / гланц, реалистично, конкретни цветове и т.н."
                  className="mt-5 min-h-[120px] w-full rounded-2xl border border-black/10 px-4 py-3 outline-none focus:border-orange-500"
                />
              ) : null}
            </div>

            <div className="rounded-[32px] border border-orange-100 bg-orange-50 p-6">
              <h4 className="mb-4 text-lg font-bold text-neutral-900">Обобщение</h4>
              <div className="space-y-2 text-sm text-neutral-700">
                <p><strong>Материал:</strong> {selectedMaterial ?? "Не е избран"}</p>
                <p><strong>Цвят:</strong> {useCustomColor ? `${customColor} (custom)` : selectedColorName ?? "Не е избран"}</p>
                <p><strong>Технология:</strong> {selectedTechnology ?? "Не е избрана"}</p>
                <p><strong>Приложение:</strong> {selectedPurpose ?? "Не е избрано"}</p>
                <p><strong>Ръчно боядисване:</strong> {paintingRequested ? "Да" : "Не"}</p>
                <p><strong>Файлове:</strong> {files.length}</p>
              </div>
            </div>

            {success ? (
              <div className="rounded-2xl bg-green-50 px-4 py-3 text-green-700">
                {success}
              </div>
            ) : null}

            {error ? (
              <div className="rounded-2xl bg-red-50 px-4 py-3 text-red-700">
                {error}
              </div>
            ) : null}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-orange-500 px-6 py-4 font-semibold text-white transition hover:bg-orange-600 disabled:opacity-60"
            >
              {loading ? "Изпращане..." : "Изпрати запитване"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}