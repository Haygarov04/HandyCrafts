import { getJSON, setJSON } from "@/lib/kv";

// Shop-wide switches changed from /manage → Настройки.

/** Whether the −10 € discount is on. On unless switched off. */
export async function discountOn() {
  const value = await getJSON<boolean>("settings:discount").catch(() => null);
  return value !== false;
}

export async function setDiscountOn(on: boolean) {
  await setJSON("settings:discount", on);
}
