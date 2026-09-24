"use client";

import { isProductId, isSubjectId, type ProductId, type SubjectId } from "@/lib/catalog";

/** What the studio remembers between visits, so a reload or a trip to the photo picker loses nothing. */
export type StudioSaved = {
  step: number;
  product: ProductId;
  subject: SubjectId;
  cm: number;
  clothes: string;
  pose: string;
  preview: { draftId: string; url: string; product: ProductId; subject: SubjectId } | null;
  added: boolean;
};

const KEY = "hc_studio_v1";
// Drafts live 30 days on the server; keep the local copy a bit shorter.
const MAX_AGE = 1000 * 60 * 60 * 24 * 7;

export function loadState(): StudioSaved | null {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) || "null");
    if (!raw || Date.now() - Number(raw.at) > MAX_AGE) return null;
    const state = raw.state as StudioSaved;
    if (!isProductId(state.product) || !isSubjectId(state.subject)) return null;
    return state;
  } catch {
    return null;
  }
}

export function saveState(state: StudioSaved) {
  try {
    localStorage.setItem(KEY, JSON.stringify({ at: Date.now(), state }));
  } catch {}
}

// The photo is too big for localStorage, so it goes to IndexedDB.
function db(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("hc_studio", 1);
    request.onupgradeneeded = () => request.result.createObjectStore("files");
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function savePhoto(file: File | null) {
  try {
    const store = (await db()).transaction("files", "readwrite").objectStore("files");
    if (file) store.put({ blob: file, name: file.name, type: file.type, at: Date.now() }, "photo");
    else store.delete("photo");
  } catch {}
}

export async function loadPhoto(): Promise<File | null> {
  try {
    const store = (await db()).transaction("files", "readonly").objectStore("files");
    const row = await new Promise<{ blob: Blob; name: string; type: string; at: number } | undefined>((resolve, reject) => {
      const request = store.get("photo");
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
    if (!row || Date.now() - row.at > MAX_AGE) return null;
    return new File([row.blob], row.name || "photo", { type: row.type });
  } catch {
    return null;
  }
}
