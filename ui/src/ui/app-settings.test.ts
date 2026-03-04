import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { applySettingsFromUrl, setTabFromRoute } from "./app-settings.ts";
import type { Tab } from "./navigation.ts";

type SettingsHost = Parameters<typeof setTabFromRoute>[0] & {
  logsPollInterval: number | null;
  debugPollInterval: number | null;
};

const createHost = (tab: Tab): SettingsHost => ({
  settings: {
    gatewayUrl: "",
    token: "",
    sessionKey: "main",
    lastActiveSessionKey: "main",
    theme: "system",
    chatFocusMode: false,
    chatShowThinking: true,
    splitRatio: 0.6,
    navCollapsed: false,
    navGroupsCollapsed: {},
  },
  theme: "system",
  themeResolved: "dark",
  applySessionKey: "main",
  sessionKey: "main",
  tab,
  connected: false,
  chatHasAutoScrolled: false,
  logsAtBottom: false,
  eventLog: [],
  eventLogBuffer: [],
  basePath: "",
  themeMedia: null,
  themeMediaHandler: null,
  logsPollInterval: null,
  debugPollInterval: null,
});

describe("setTabFromRoute", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("starts and stops log polling based on the tab", () => {
    const host = createHost("chat");

    setTabFromRoute(host, "logs");
    expect(host.logsPollInterval).not.toBeNull();
    expect(host.debugPollInterval).toBeNull();

    setTabFromRoute(host, "chat");
    expect(host.logsPollInterval).toBeNull();
  });

  it("starts and stops debug polling based on the tab", () => {
    const host = createHost("chat");

    setTabFromRoute(host, "debug");
    expect(host.debugPollInterval).not.toBeNull();
    expect(host.logsPollInterval).toBeNull();

    setTabFromRoute(host, "chat");
    expect(host.debugPollInterval).toBeNull();
  });
});

describe("applySettingsFromUrl", () => {
  it("hydrates token from hash and marks host authenticated", () => {
    const host = createHost("login");
    host.isAuthenticated = false;

    window.history.replaceState({}, "", "http://localhost/#token=abc123");
    applySettingsFromUrl(host);

    expect(host.settings.token).toBe("abc123");
    expect(host.isAuthenticated).toBe(true);
    expect(window.location.hash).toBe("");
  });

  it("supports slash-prefixed hash params", () => {
    const host = createHost("login");
    host.isAuthenticated = false;

    window.history.replaceState({}, "", "http://localhost/#/token=xyz789");
    applySettingsFromUrl(host);

    expect(host.settings.token).toBe("xyz789");
    expect(host.isAuthenticated).toBe(true);
    expect(window.location.hash).toBe("");
  });

  it("supports bare hash token redirects", () => {
    const host = createHost("login");
    host.isAuthenticated = false;

    window.history.replaceState({}, "", "http://localhost/#xyz987");
    applySettingsFromUrl(host);

    expect(host.settings.token).toBe("xyz987");
    expect(host.isAuthenticated).toBe(true);
    expect(window.location.hash).toBe("");
  });
});
