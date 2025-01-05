redirectToDefaultPage();

function redirectToDefaultPage() {
  const currentUser = localStorage.getItem(LOCAL_STORAGE_KEYS.CURRENT_USER);

  if (currentUser) {
    redirectToPage("menu");
  } else {
    redirectToPage("auth");
  }
}

function redirectToPage(page) {
  if (window.location.pathname.includes(page))
    return;

  const baseUrl = window.location.origin;
  const pathname = window.location.pathname;

  let newPathname;

  if (pathname.includes('menu')) {
    newPathname = pathname.replace('menu', page);
  } else if (pathname.includes('auth')) {
    newPathname = pathname.replace('auth', page);
  }
  else {
    newPathname = `${pathname}/${page}`;
  }

  window.location.href = `${baseUrl}${newPathname}`;
}
