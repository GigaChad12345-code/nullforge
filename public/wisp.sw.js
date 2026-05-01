self.addEventListener("fetch", (event) => {
  // Basic passthrough for Wisp
  event.respondWith(fetch(event.request));
});

