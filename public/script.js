function go() {
  const url = document.getElementById("url").value;
  if (!url) return;

  window.location.href = "/uv/" + __uv$config.encodeUrl(url);
}
