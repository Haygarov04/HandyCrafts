"use client";

export default function LogoutButton() {
  async function logout() {
    await fetch("/api/manage/login", { method: "DELETE" });
    window.location.replace("/manage/login");
  }
  return (
    <button type="button" onClick={logout} className="text-ink/55 hover:text-ink">
      Изход
    </button>
  );
}
