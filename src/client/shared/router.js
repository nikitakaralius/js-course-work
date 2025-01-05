redirectToDefaultPage();

function redirectToDefaultPage() {
  const currentUser = localStorage.getItem(LOCAL_STORAGE_KEYS.CURRENT_USER);

  const currentPage = getCurrentPage();

  if (!currentUser) {
    redirectToPage("auth")
    return;
  }

  if (currentPage === "/") {
    redirectToPage("menu");
  }
}

function redirectToPage(page) {
  const currentPage = getCurrentPage();

  if (currentPage === page)
    return;

  window.location.href = createPath(page, currentPage);
}

function getCurrentPage() {
  const pathname = window.location.pathname;

  const splitParts = pathname
    .split('/')
    .filter(part => !["src", "client"].includes(part))
    .filter(Boolean);

  return splitParts.length === 0 ? "/" : splitParts[splitParts.length - 1];
}

function createPath(page, currentPage) {
  const baseUrl = window.location.origin;
  const trimmedPathname = window.location.pathname.replace(/\/$/, "");

  if (currentPage === "/") {
    return `${baseUrl + trimmedPathname}/${page}`;
  }

  return `${baseUrl + trimmedPathname.replace(currentPage, page)}`;
}
