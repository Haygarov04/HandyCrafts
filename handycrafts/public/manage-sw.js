// Service worker for the /manage app: new-order notifications only, no caching,
// so private order data never sits in the browser cache.

self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) => event.waitUntil(self.clients.claim()));

self.addEventListener("push", (event) => {
  let data = { title: "HandyCrafts", body: "Нова поръчка", url: "/manage" };
  try {
    data = { ...data, ...event.data.json() };
  } catch {}
  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: "/icons/icon-192.png",
      badge: "/icons/badge-96.png",
      tag: data.url,
      data: { url: data.url },
    })
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = new URL(event.notification.data?.url || "/manage", self.location.origin);
  if (!url.pathname.startsWith("/manage")) url.pathname = "/manage";
  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((list) => {
      for (const client of list) {
        if (new URL(client.url).pathname.startsWith("/manage") && "focus" in client) {
          return client.navigate(url.href).then((c) => (c || client).focus());
        }
      }
      return self.clients.openWindow(url.href);
    })
  );
});
