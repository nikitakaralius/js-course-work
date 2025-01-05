const PAGE = {
  ROOT: "/",
  AUTH: "auth",
  MENU: "menu",
  GAME: "game",
  LEADERBOARD: "leaderboard",
}

class Router {
  redirectToPage = (page) => {
    const currentPage = this.#getCurrentPage();

    if (currentPage === page)
      return;

    window.location.href = this.#createPath(page, currentPage);
  }

  #getCurrentPage = () => {
    const pathname = window.location.pathname;

    const splitParts = pathname
      .split('/')
      .filter(part => !["src", "client"].includes(part))
      .filter(Boolean);

    return splitParts.length === 0 ? PAGE.ROOT : splitParts[splitParts.length - 1];
  }

  #createPath = (page, currentPage) => {
    const baseUrl = window.location.origin;
    const trimmedPathname = window.location.pathname.replace(/\/$/, "");

    if (currentPage === "/") {
      return `${baseUrl + trimmedPathname}/${page}`;
    }

    return `${baseUrl + trimmedPathname.replace(currentPage, page)}`;
  }
}

// function redirectToDefaultPage() {
//   const currentUser = localStorage.getItem(LOCAL_STORAGE_KEY.CURRENT_USER);
//
//   const currentPage = getCurrentPage();
//
//   if (!currentUser) {
//     redirectToPage(PAGE.AUTH);
//     return;
//   }
//
//   if (currentPage === PAGE.ROOT) {
//     redirectToPage(PAGE.MENU);
//   }
// }


