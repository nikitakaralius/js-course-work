function redirectToPage(page) {
  const baseUrl = window.location.origin;
  const pathname = window.location.pathname;

  const endsWithSlash = window.location.pathname.endsWith('/')

  const lastSlashIndex = pathname.lastIndexOf("/");
  let pathnameWithoutLastPart = pathname.slice(0, lastSlashIndex);

  if (endsWithSlash) {
    pathnameWithoutLastPart = pathname.slice(0, pathnameWithoutLastPart.lastIndexOf("/"));
  }

  window.location.href = `${baseUrl}${pathnameWithoutLastPart}/${page}`;
}
