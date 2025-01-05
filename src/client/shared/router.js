redirectToDefaultPage();

function redirectToDefaultPage() {
  const currentUser = localStorage.getItem(LOCAL_STORAGE_KEY.CURRENT_USER);

  const currentPage = getCurrentPage();

  if (!currentUser) {
    redirectToPage(PAGE.AUTH);
    return;
  }

  if (currentPage === PAGE.ROOT) {
    redirectToPage(PAGE.MENU);
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

  return splitParts.length === 0 ? PAGE.ROOT : splitParts[splitParts.length - 1];
}

function createPath(page, currentPage) {
  const baseUrl = window.location.origin;
  const trimmedPathname = window.location.pathname.replace(/\/$/, "");

  if (currentPage === "/") {
    return `${baseUrl + trimmedPathname}/${page}`;
  }

  return `${baseUrl + trimmedPathname.replace(currentPage, page)}`;
}
