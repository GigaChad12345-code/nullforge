// Wisp client loader
navigator.serviceWorker.register("/wisp.sw.js");

async function connectWisp(url) {
  const encoded = btoa(url);
  window.location.href = "/wisp/" + encoded;
}

