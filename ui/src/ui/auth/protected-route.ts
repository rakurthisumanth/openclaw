import type { Tab } from "../navigation.ts";
import { isAuthTab } from "../navigation.ts";

export function resolveProtectedTab(tab: Tab, isAuthenticated: boolean): Tab {
  if (!isAuthenticated && !isAuthTab(tab)) {
    return "login";
  }
  if (isAuthenticated && isAuthTab(tab)) {
    return "chat";
  }
  return tab;
}
