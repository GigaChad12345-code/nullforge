function go() {
  const url = document.getElementById("url").value;
  if (!url) return;

  const encoded = btoa(url);
  window.location.href = "/wisp/" + encoded;
}
