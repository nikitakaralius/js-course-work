redirectToPage("auth");

function redirectToPage(page) {
  const baseUrl = window.location.origin;
  const queryParams = window.location.search;
  const pathname = window.location.pathname;
  const pathnameWithoutLastPart = pathname.slice(0, pathname.lastIndexOf("/"));
  window.location.href = `${baseUrl}${pathnameWithoutLastPart}/${page}${queryParams}`;
}
