import { Page, Router } from "@happysanta/router";

// path const
export const PAGE_MAIN = "/";
export const PAGE_RATING = "/rating";
export const PAGE_PROFILE = "/profile";
export const PAGE_ERROR = "/error";

// view const
export const VIEW_MAIN = "main";
export const VIEW_RATING = "rating";
export const VIEW_PROFILE = "profile";
export const VIEW_ERROR = "error";

// panel const
export const PANEL_MAIN = "mainView--panel_main";
export const PANEL_RATING = "ratingView--panel_main";
export const PANEL_PROFILE = "profileView--panel_main";
export const PANEL_ERROR = "errorView--panel_main";

const routes = {
  // path | panel name | view name
  [PAGE_MAIN]: new Page(PANEL_MAIN, VIEW_MAIN),
  [PAGE_RATING]: new Page(PANEL_RATING, VIEW_RATING),
  [PAGE_PROFILE]: new Page(PANEL_PROFILE, VIEW_PROFILE),
  [PAGE_ERROR]: new Page(PANEL_ERROR, VIEW_ERROR),
};

export const pageRouter = new Router(routes);
