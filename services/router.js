const PAGE = {
  ROOT: "/",
  INDEX: "index",
  AUTH: "auth",
  MENU: "menu",
  GAME: "game",
  LEADERBOARD: "leaderboard",
}

class Router {
  redirectToPage = (page) => {
    const currentPage = this.getCurrentPage();

    if (page === currentPage)
      return;

    window.location.href = this.#createPath(page, currentPage);
  }

  getCurrentPage = () => {
    const pathname = window.location.pathname;

    let splitParts = pathname
      .split('/')
      .filter(part => !["src", "client", "js-course-work", "index.html"].includes(part))
      .filter(Boolean);

    if (window.location.protocol === 'file:') {
      const sanitizedFilePath = window.location.href
        .replace("/index.html", "")
        .replace("index.html", "")
        .replace(PAGE.GAME, "")
        .replace(PAGE.MENU, "")
        .replace(PAGE.AUTH, "")
        .replace(PAGE.LEADERBOARD, "");

      splitParts = splitParts
        .filter(part => !sanitizedFilePath.includes(part))
        .filter(Boolean);
    }

    return splitParts.length === 0 ? PAGE.ROOT : splitParts[splitParts.length - 1];
  }

  #createPath = (page, currentPage) => {
    const baseUrl = window.location.origin;
    const trimmedPathname = window
      .location
      .pathname
      .replace("index.html", "")
      .replace(/\/$/, "");

    if (currentPage === PAGE.ROOT) {
      return `${baseUrl + trimmedPathname}/${page}/index.html`;
    }

    const replacedPart = trimmedPathname
      .replace(currentPage, page);

    return `${baseUrl + replacedPart}/index.html`;
  }
}


