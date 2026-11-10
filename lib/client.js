window.__ModuleLoader__.load({
  id: "dsh-coding-workbench-pack",
  factory: (require) => {
    var module = { exports: {} };
    var exports = module.exports;
    "use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name2 in all)
    __defProp(target, name2, { get: all[name2], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/client/entry.tsx
var entry_exports = {};
__export(entry_exports, {
  apply: () => apply,
  inject: () => inject,
  name: () => name
});
module.exports = __toCommonJS(entry_exports);
var import_react2 = __toESM(require("react"), 1);

// src/shared/types.ts
var PLUGIN_ID = "dsh-coding-workbench-pack";
var API_PREFIX = "/api/dsh-coding-workbench-pack";
var SETTINGS_SECTION_ID = "coding-workbench";

// src/client/page.tsx
var import_react = __toESM(require("react"), 1);

// src/client/api.ts
var HostApiError = class extends Error {
  constructor(code, message) {
    super(message);
    this.code = code;
    this.name = "HostApiError";
  }
};
var fetchCatalog = (signal) => post("catalog", {}, signal);
var fetchStatus = (signal) => post("status", {}, signal);
var saveSettings = (patch, signal) => post("settings", patch, signal);
var runInstall = (request, signal) => post("install", request, signal);
async function post(route, body, signal) {
  const response = await fetch(`${API_PREFIX}/${route}`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body ?? {}),
    signal
  });
  const payload = await response.json().catch(() => null);
  if (!response.ok || !payload?.ok) {
    throw new HostApiError(payload?.error?.code ?? "request_failed", payload?.error?.message ?? "The host request failed");
  }
  return payload.data;
}

// src/client/i18n.ts
var en = {
  nav: "Coding Workbench",
  title: "Coding Workbench Pack",
  subtitle: 'A categorized installer for the DSH coding workbench. Official built-in capabilities are explained, not installed. Community plugins are pinned; this pack never writes allowBuilds "*" and never installs dsh-better-sidebar@latest.',
  language: "Language",
  english: "English",
  chinese: "\u4E2D\u6587",
  hostVersion: "DSH host version",
  hostUnavailable: "Host version could not be read. Pick a host line before installing the sidebar workbench.",
  hostLine: "Host line for dsh-better-sidebar",
  hostAuto: "Use detected line",
  hostV022: "DSH 0.2.2-rc.1+ \u2192 npm 0.30.1",
  hostV021: "DSH 0.2.1 line \u2192 npm 0.28.2",
  skipCategory: "Do not install this category",
  official: "Official / built-in",
  defaultLabel: "Default",
  alternative: "Alternative",
  optional: "Optional",
  extension: "Extension",
  futureTitle: "Undelivered / \u672A\u4EA4\u4ED8",
  futureBlurb: "These products are visible only as future slots. They are not checkable and are not in the default or installable lists, even if a Draft PR or repository already exists.",
  undelivered: "Undelivered",
  installSelected: "Install selected",
  installing: "Installing\u2026",
  saveFailed: "Could not save settings",
  loadFailed: "Could not load the workbench catalog",
  restart: "Restart dsh web, or hard-refresh this UI, once so newly installed bundles can load.",
  allowBuildsTitle: "Confirm build-script whitelist",
  allowBuildsBody: 'A build script was blocked. Confirm only this plugin and its verified direct build dependencies. This pack will not write allowBuilds "*" or approve anything outside the list. If the profile already has a wildcard, this pack will not change it.',
  confirmAllow: "Confirm and retry",
  cancel: "Cancel",
  nbWarningTitle: "dsh-nb-plugin hides the input area",
  nbWarningBody: "A fresh install hides the composer and the floating button, which can make the UI look read-only. Restore them with Cmd+Shift+H / Ctrl+Shift+H, or open Settings \u2192 UI visibility. Do not install this plugin unless you want that default.",
  nbAck: "I understand how to restore the input area, and I still want to install dsh-nb-plugin.",
  starterPack: "starter-pack warning",
  commandHint: "Slash command: /coding-workbench [status|install|defaults]",
  pinsAsOf: "Pins verified",
  results: "Results",
  skipped: "Installed (skipped)"
};
var zh = {
  nav: "\u7F16\u7A0B\u5DE5\u4F5C\u53F0",
  title: "\u7F16\u7A0B\u5DE5\u4F5C\u53F0\u5F00\u7BB1\u5305",
  subtitle: '\u6309\u7F16\u7A0B\u5DE5\u4F5C\u53F0\u7C7B\u76EE\u5B89\u88C5\u793E\u533A\u63D2\u4EF6\u3002\u5B98\u65B9\u5185\u7F6E\u80FD\u529B\u53EA\u8BF4\u660E\u5982\u4F55\u642D\u914D\uFF0C\u4E0D\u7531\u672C\u5305\u5B89\u88C5\u3002\u7248\u672C\u5747\u5DF2\u9489\u6B7B\uFF1B\u672C\u5305\u4E0D\u4F1A\u5199\u5165 allowBuilds "*"\uFF0C\u4E5F\u4E0D\u4F1A\u5B89\u88C5 dsh-better-sidebar@latest\u3002',
  language: "\u8BED\u8A00",
  english: "English",
  chinese: "\u4E2D\u6587",
  hostVersion: "DSH \u5BBF\u4E3B\u7248\u672C",
  hostUnavailable: "\u65E0\u6CD5\u8BFB\u53D6\u5BBF\u4E3B\u7248\u672C\u3002\u5B89\u88C5\u4FA7\u680F\u5DE5\u4F5C\u53F0\u524D\u8BF7\u5148\u624B\u52A8\u9009\u7EBF\u3002",
  hostLine: "dsh-better-sidebar \u7684\u5BBF\u4E3B\u7EBF",
  hostAuto: "\u4F7F\u7528\u68C0\u6D4B\u5230\u7684\u5BBF\u4E3B\u7EBF",
  hostV022: "DSH 0.2.2-rc.1+ \u2192 npm 0.30.1",
  hostV021: "DSH 0.2.1 \u7EBF \u2192 npm 0.28.2",
  skipCategory: "\u4E0D\u88C5\u8FD9\u4E00\u7C7B",
  official: "\u5B98\u65B9 / \u5185\u7F6E",
  defaultLabel: "\u9ED8\u8BA4",
  alternative: "\u5907\u9009",
  optional: "\u53EF\u9009",
  extension: "\u6269\u5C55",
  futureTitle: "\u672A\u4EA4\u4ED8 / Undelivered",
  futureBlurb: "\u4E0B\u5217\u4EA7\u54C1\u53EA\u4F5C\u4E3A\u672A\u6765\u69FD\u4F4D\u5C55\u793A\uFF1A\u4E0D\u53EF\u52FE\u9009\uFF0C\u4E0D\u8FDB\u5165\u9ED8\u8BA4\u6216\u53EF\u5B89\u88C5\u6E05\u5355\uFF1B\u5373\u4F7F\u5DF2\u6709 Draft PR \u6216\u4ED3\u5E93\u4E5F\u4E0D\u5F97\u5217\u4E3A\u53EF\u5B89\u88C5\u9ED8\u8BA4\u3002",
  undelivered: "\u672A\u4EA4\u4ED8",
  installSelected: "\u5B89\u88C5\u6240\u9009",
  installing: "\u6B63\u5728\u5B89\u88C5\u2026",
  saveFailed: "\u65E0\u6CD5\u4FDD\u5B58\u8BBE\u7F6E",
  loadFailed: "\u65E0\u6CD5\u52A0\u8F7D\u5DE5\u4F5C\u53F0\u6E05\u5355",
  restart: "\u8BF7\u91CD\u542F\u4E00\u6B21 dsh web\uFF0C\u6216\u786C\u5237\u65B0\u672C\u9875\u9762\uFF0C\u4EE5\u4FBF\u65B0\u5B89\u88C5\u7684\u7EC4\u5408\u5305\u751F\u6548\u3002",
  allowBuildsTitle: "\u786E\u8BA4\u6784\u5EFA\u811A\u672C\u767D\u540D\u5355",
  allowBuildsBody: '\u6784\u5EFA\u811A\u672C\u88AB\u62E6\u622A\u3002\u8BF7\u53EA\u786E\u8BA4\u8BE5\u63D2\u4EF6\u53CA\u5176\u5DF2\u6838\u5B9E\u7684\u76F4\u63A5\u6784\u5EFA\u4F9D\u8D56\u3002\u672C\u5305\u4E0D\u4F1A\u5199\u5165 allowBuilds "*"\uFF0C\u4E5F\u4E0D\u4F1A\u653E\u884C\u540D\u5355\u5916\u7684\u811A\u672C\u3002\u82E5\u6863\u6848\u91CC\u5DF2\u6709\u901A\u914D\uFF0C\u672C\u5305\u4E0D\u4F1A\u6539\u5199\u3002',
  confirmAllow: "\u786E\u8BA4\u5E76\u91CD\u8BD5",
  cancel: "\u53D6\u6D88",
  nbWarningTitle: "dsh-nb-plugin \u4F1A\u9690\u85CF\u8F93\u5165\u533A",
  nbWarningBody: "\u5168\u65B0\u5B89\u88C5\u4F1A\u9690\u85CF\u8F93\u5165\u533A\u548C\u60AC\u6D6E\u6309\u94AE\uFF0C\u754C\u9762\u4F1A\u50CF\u53EA\u8BFB\u3002\u8BF7\u7528 Cmd+Shift+H / Ctrl+Shift+H\uFF0C\u6216\u6253\u5F00\u8BBE\u7F6E\u9875\u4E2D\u7684\u300C\u754C\u9762\u663E\u9690\u300D\u6062\u590D\u3002\u82E5\u4F60\u4E0D\u9700\u8981\u8FD9\u4E00\u9ED8\u8BA4\u884C\u4E3A\uFF0C\u8BF7\u4E0D\u8981\u5B89\u88C5\u3002",
  nbAck: "\u6211\u5DF2\u4E86\u89E3\u5982\u4F55\u6062\u590D\u8F93\u5165\u533A\uFF0C\u4ECD\u8981\u5B89\u88C5 dsh-nb-plugin\u3002",
  starterPack: "starter-pack \u63D0\u793A",
  commandHint: "\u659C\u6760\u547D\u4EE4\uFF1A/coding-workbench [status|install|defaults]",
  pinsAsOf: "\u7248\u672C\u6838\u5BF9\u65F6\u95F4",
  results: "\u7ED3\u679C",
  skipped: "\u5DF2\u5B89\u88C5\uFF08\u5DF2\u8DF3\u8FC7\uFF09"
};
function translate(locale, key) {
  return (locale === "zh" ? zh : en)[key];
}

// src/client/page.tsx
function WorkbenchPage(_props) {
  const [locale, setLocale] = (0, import_react.useState)("en");
  const [status, setStatus] = (0, import_react.useState)(null);
  const [categories, setCategories] = (0, import_react.useState)([]);
  const [futureSlots, setFutureSlots] = (0, import_react.useState)([]);
  const [pinnedAsOf, setPinnedAsOf] = (0, import_react.useState)("");
  const [exclusive, setExclusive] = (0, import_react.useState)({});
  const [extras, setExtras] = (0, import_react.useState)([]);
  const [hostLineOverride, setHostLineOverride] = (0, import_react.useState)();
  const [nbAck, setNbAck] = (0, import_react.useState)(false);
  const [error, setError] = (0, import_react.useState)(null);
  const [busy, setBusy] = (0, import_react.useState)(false);
  const [result, setResult] = (0, import_react.useState)(null);
  const t = (key) => translate(locale, key);
  (0, import_react.useEffect)(() => {
    let cancelled = false;
    Promise.all([fetchCatalog(), fetchStatus()]).then(([catalog, next]) => {
      if (cancelled) return;
      setCategories(catalog.categories);
      setFutureSlots(catalog.futureSlots);
      setPinnedAsOf(catalog.pinnedAsOf);
      applyStatus(next);
    }).catch((err) => {
      if (!cancelled) setError(err instanceof Error ? err.message : t("loadFailed"));
    });
    return () => {
      cancelled = true;
    };
  }, []);
  function applyStatus(next) {
    setStatus(next);
    setLocale(next.settings.locale);
    setExclusive({ ...next.settings.exclusive });
    setExtras([...next.settings.extras]);
    setHostLineOverride(next.settings.hostLineOverride);
    setNbAck(next.settings.nbPluginAcknowledged === true);
  }
  const settingsPatch = (0, import_react.useMemo)(() => ({
    locale,
    exclusive,
    extras,
    hostLineOverride,
    nbPluginAcknowledged: nbAck
  }), [locale, exclusive, extras, hostLineOverride, nbAck]);
  async function persist(patch = settingsPatch) {
    try {
      const saved = await saveSettings(patch);
      setLocale(saved.locale);
      setExclusive({ ...saved.exclusive });
      setExtras([...saved.extras]);
      setHostLineOverride(saved.hostLineOverride);
      setNbAck(saved.nbPluginAcknowledged === true);
    } catch (err) {
      setError(err instanceof Error ? err.message : t("saveFailed"));
    }
  }
  async function onInstall(request = settingsPatch) {
    setBusy(true);
    setError(null);
    try {
      await persist(request);
      const outcome = await runInstall(request);
      setResult(outcome);
      const refreshed = await fetchStatus();
      applyStatus(refreshed);
    } catch (err) {
      setError(err instanceof Error ? err.message : t("loadFailed"));
    } finally {
      setBusy(false);
    }
  }
  const nbSelected = extras.includes("dsh-nb-plugin");
  const text = (item) => locale === "zh" ? item.zh : item.en;
  return /* @__PURE__ */ import_react.default.createElement("div", { className: "dsh-cwp" }, /* @__PURE__ */ import_react.default.createElement("header", null, /* @__PURE__ */ import_react.default.createElement("h1", null, t("title")), /* @__PURE__ */ import_react.default.createElement("p", { className: "muted" }, t("subtitle")), /* @__PURE__ */ import_react.default.createElement("p", { className: "muted" }, t("commandHint")), pinnedAsOf ? /* @__PURE__ */ import_react.default.createElement("p", { className: "muted" }, t("pinsAsOf"), ": ", pinnedAsOf) : null, /* @__PURE__ */ import_react.default.createElement("div", { className: "toolbar" }, /* @__PURE__ */ import_react.default.createElement("label", null, t("language"), " ", /* @__PURE__ */ import_react.default.createElement(
    "select",
    {
      value: locale,
      "aria-label": t("language"),
      onChange: (event) => {
        const next = event.target.value === "zh" ? "zh" : "en";
        setLocale(next);
        void persist({ ...settingsPatch, locale: next });
      }
    },
    /* @__PURE__ */ import_react.default.createElement("option", { value: "en" }, t("english")),
    /* @__PURE__ */ import_react.default.createElement("option", { value: "zh" }, t("chinese"))
  )), /* @__PURE__ */ import_react.default.createElement("label", null, t("hostLine"), " ", /* @__PURE__ */ import_react.default.createElement(
    "select",
    {
      value: hostLineOverride ?? "",
      "aria-label": t("hostLine"),
      onChange: (event) => {
        const value = event.target.value;
        const next = value === "v022" || value === "v021" ? value : void 0;
        setHostLineOverride(next);
        void persist({ ...settingsPatch, hostLineOverride: next });
      }
    },
    /* @__PURE__ */ import_react.default.createElement("option", { value: "" }, t("hostAuto")),
    /* @__PURE__ */ import_react.default.createElement("option", { value: "v022" }, t("hostV022")),
    /* @__PURE__ */ import_react.default.createElement("option", { value: "v021" }, t("hostV021"))
  ))), /* @__PURE__ */ import_react.default.createElement("p", null, t("hostVersion"), ": ", /* @__PURE__ */ import_react.default.createElement("span", { className: "path" }, status?.host.parsed ?? status?.host.raw ?? "\u2014"), status?.host.line ? ` (${status.host.line})` : ""), status?.host.line === "unknown" && exclusive["sidebar-workbench"] === "dsh-better-sidebar" && !hostLineOverride ? /* @__PURE__ */ import_react.default.createElement("div", { className: "banner warn" }, t("hostUnavailable")) : null, status?.inventoryWarnings.map((warning) => /* @__PURE__ */ import_react.default.createElement("div", { className: "banner warn", key: warning.en }, text(warning))), error ? /* @__PURE__ */ import_react.default.createElement("div", { className: "banner warn", role: "alert" }, error) : null), categories.map((category) => /* @__PURE__ */ import_react.default.createElement("section", { className: "category", key: category.id }, /* @__PURE__ */ import_react.default.createElement("h2", null, text(category.title)), /* @__PURE__ */ import_react.default.createElement("p", { className: "muted" }, text(category.blurb)), category.items.filter((item) => item.role === "official").map((item) => /* @__PURE__ */ import_react.default.createElement(OfficialRow, { key: item.id, item, locale, officialLabel: t("official") })), category.exclusive ? /* @__PURE__ */ import_react.default.createElement(import_react.default.Fragment, null, category.items.filter((item) => item.installable).map((item) => /* @__PURE__ */ import_react.default.createElement("label", { className: "item", key: item.id }, /* @__PURE__ */ import_react.default.createElement(
    "input",
    {
      type: "radio",
      name: `cwp-${category.id}`,
      checked: exclusive[category.id] === item.id,
      onChange: () => {
        const next = { ...exclusive, [category.id]: item.id };
        setExclusive(next);
        void persist({ ...settingsPatch, exclusive: next });
      }
    }
  ), /* @__PURE__ */ import_react.default.createElement("span", null, /* @__PURE__ */ import_react.default.createElement("strong", null, item.packageName ?? item.id), " ", /* @__PURE__ */ import_react.default.createElement(RoleBadge, { role: item.role, t }), /* @__PURE__ */ import_react.default.createElement("div", { className: "muted" }, text(item.summary))))), category.skippable ? /* @__PURE__ */ import_react.default.createElement("label", { className: "item" }, /* @__PURE__ */ import_react.default.createElement(
    "input",
    {
      type: "radio",
      name: `cwp-${category.id}`,
      checked: exclusive[category.id] === "skip",
      onChange: () => {
        const next = { ...exclusive, [category.id]: "skip" };
        setExclusive(next);
        void persist({ ...settingsPatch, exclusive: next });
      }
    }
  ), /* @__PURE__ */ import_react.default.createElement("span", null, t("skipCategory"))) : null) : category.items.filter((item) => item.installable).map((item) => /* @__PURE__ */ import_react.default.createElement("label", { className: "item", key: item.id }, /* @__PURE__ */ import_react.default.createElement(
    "input",
    {
      type: "checkbox",
      checked: extras.includes(item.id),
      onChange: (event) => {
        const next = event.target.checked ? [...extras, item.id] : extras.filter((id) => id !== item.id);
        setExtras(next);
        if (!next.includes("dsh-nb-plugin")) setNbAck(false);
        void persist({ ...settingsPatch, extras: next, nbPluginAcknowledged: next.includes("dsh-nb-plugin") ? nbAck : false });
      }
    }
  ), /* @__PURE__ */ import_react.default.createElement("span", null, /* @__PURE__ */ import_react.default.createElement("strong", null, item.packageName ?? item.id), " ", /* @__PURE__ */ import_react.default.createElement(RoleBadge, { role: item.role, t }), /* @__PURE__ */ import_react.default.createElement("div", { className: "muted" }, text(item.summary))))))), nbSelected ? /* @__PURE__ */ import_react.default.createElement("div", { className: "banner warn", role: "region", "aria-label": t("nbWarningTitle") }, /* @__PURE__ */ import_react.default.createElement("h3", null, t("nbWarningTitle")), /* @__PURE__ */ import_react.default.createElement("p", null, t("nbWarningBody")), /* @__PURE__ */ import_react.default.createElement("label", null, /* @__PURE__ */ import_react.default.createElement(
    "input",
    {
      type: "checkbox",
      checked: nbAck,
      onChange: (event) => {
        setNbAck(event.target.checked);
        void persist({ ...settingsPatch, nbPluginAcknowledged: event.target.checked });
      }
    }
  ), " ", t("nbAck"))) : null, /* @__PURE__ */ import_react.default.createElement("section", { className: "category", "aria-label": t("futureTitle") }, /* @__PURE__ */ import_react.default.createElement("h2", null, t("futureTitle")), /* @__PURE__ */ import_react.default.createElement("p", { className: "muted" }, t("futureBlurb")), futureSlots.map((slot) => /* @__PURE__ */ import_react.default.createElement("div", { className: "item future", key: slot.id }, /* @__PURE__ */ import_react.default.createElement("div", null, /* @__PURE__ */ import_react.default.createElement("strong", null, slot.suggestedName), " ", /* @__PURE__ */ import_react.default.createElement("span", { className: "badge" }, t("undelivered")), /* @__PURE__ */ import_react.default.createElement("div", null, text(slot.name)), /* @__PURE__ */ import_react.default.createElement("div", { className: "muted" }, text(slot.summary)))))), /* @__PURE__ */ import_react.default.createElement("div", { className: "toolbar" }, /* @__PURE__ */ import_react.default.createElement(
    "button",
    {
      type: "button",
      className: "primary",
      disabled: busy || nbSelected && !nbAck,
      onClick: () => void onInstall()
    },
    busy ? t("installing") : t("installSelected")
  )), result ? /* @__PURE__ */ import_react.default.createElement("section", { className: "results", "aria-live": "polite" }, /* @__PURE__ */ import_react.default.createElement("h2", null, t("results")), result.restartRecommended ? /* @__PURE__ */ import_react.default.createElement("div", { className: "banner" }, t("restart")) : null, /* @__PURE__ */ import_react.default.createElement("ul", null, result.outcomes.map((item) => /* @__PURE__ */ import_react.default.createElement("li", { key: item.itemId }, /* @__PURE__ */ import_react.default.createElement("span", { className: "path" }, item.packageName), " \u2014 ", item.status, item.target ? /* @__PURE__ */ import_react.default.createElement(import_react.default.Fragment, null, " \u2192 ", /* @__PURE__ */ import_react.default.createElement("span", { className: "path" }, item.target)) : null, /* @__PURE__ */ import_react.default.createElement("div", { className: "muted" }, text(item.message)))))) : null, result?.pendingAllowBuilds ? /* @__PURE__ */ import_react.default.createElement(
    AllowBuildsPrompt,
    {
      t,
      keys: result.pendingAllowBuilds.keys,
      message: text(result.pendingAllowBuilds.message),
      busy,
      onCancel: () => setResult((current) => current ? { ...current, pendingAllowBuilds: void 0 } : current),
      onConfirm: () => void onInstall({
        ...settingsPatch,
        retryItemId: result.pendingAllowBuilds.itemId,
        confirmAllowBuilds: result.pendingAllowBuilds.keys
      })
    }
  ) : null);
}
function OfficialRow({ item, locale, officialLabel }) {
  const text = locale === "zh" ? item.summary.zh : item.summary.en;
  const name2 = locale === "zh" ? item.name.zh : item.name.en;
  return /* @__PURE__ */ import_react.default.createElement("div", { className: "item official" }, /* @__PURE__ */ import_react.default.createElement("div", null, /* @__PURE__ */ import_react.default.createElement("strong", null, name2), " ", /* @__PURE__ */ import_react.default.createElement("span", { className: "badge" }, officialLabel), /* @__PURE__ */ import_react.default.createElement("div", { className: "muted" }, text)));
}
function RoleBadge({ role, t }) {
  if (role === "default") return /* @__PURE__ */ import_react.default.createElement("span", { className: "badge" }, t("defaultLabel"));
  if (role === "alternative") return /* @__PURE__ */ import_react.default.createElement("span", { className: "badge" }, t("alternative"));
  if (role === "optional") return /* @__PURE__ */ import_react.default.createElement("span", { className: "badge" }, t("optional"));
  if (role === "extension") return /* @__PURE__ */ import_react.default.createElement("span", { className: "badge" }, t("extension"));
  return null;
}
function AllowBuildsPrompt(props) {
  return /* @__PURE__ */ import_react.default.createElement("div", { className: "banner warn", role: "dialog", "aria-labelledby": "cwp-allow-title" }, /* @__PURE__ */ import_react.default.createElement("h3", { id: "cwp-allow-title" }, props.t("allowBuildsTitle")), /* @__PURE__ */ import_react.default.createElement("p", null, props.t("allowBuildsBody")), /* @__PURE__ */ import_react.default.createElement("p", null, props.message), /* @__PURE__ */ import_react.default.createElement("p", { className: "path" }, props.keys.join(", ") || "\u2014"), /* @__PURE__ */ import_react.default.createElement("div", { className: "toolbar" }, /* @__PURE__ */ import_react.default.createElement("button", { type: "button", className: "primary", disabled: props.busy || props.keys.length === 0, onClick: props.onConfirm }, props.t("confirmAllow")), /* @__PURE__ */ import_react.default.createElement("button", { type: "button", className: "secondary", onClick: props.onCancel }, props.t("cancel"))));
}

// src/client/styles.ts
var STYLE_ID = "dsh-coding-workbench-pack-styles";
function ensureStyles() {
  if (typeof document === "undefined" || document.getElementById(STYLE_ID)) return;
  const style = document.createElement("style");
  style.id = STYLE_ID;
  style.textContent = `
.dsh-cwp { --cwp-border: color-mix(in srgb, currentColor 16%, transparent); --cwp-fill: color-mix(in srgb, currentColor 6%, transparent); --cwp-accent: #1f2937; color: inherit; font: inherit; max-width: 52rem; padding: 0 0 2rem; }
.dsh-cwp h1, .dsh-cwp h2, .dsh-cwp h3 { margin: 0 0 .4rem; font-weight: 650; }
.dsh-cwp p, .dsh-cwp li { line-height: 1.5; }
.dsh-cwp .muted { opacity: .78; }
.dsh-cwp header { margin-bottom: 1.25rem; }
.dsh-cwp .toolbar { display: flex; flex-wrap: wrap; gap: .75rem 1.25rem; align-items: center; margin: .75rem 0 1rem; }
.dsh-cwp .banner { border: 1px solid var(--cwp-border); background: var(--cwp-fill); border-radius: 10px; padding: .75rem 1rem; margin: .75rem 0; }
.dsh-cwp .banner.warn { border-color: color-mix(in srgb, #b45309 45%, var(--cwp-border)); }
.dsh-cwp section.category { border: 1px solid var(--cwp-border); border-radius: 12px; padding: 1rem 1rem .85rem; margin: 1rem 0; }
.dsh-cwp .item { display: grid; grid-template-columns: 1.25rem 1fr; gap: .55rem .7rem; padding: .55rem 0; border-top: 1px solid var(--cwp-border); }
.dsh-cwp .item:first-of-type { border-top: 0; }
.dsh-cwp .item.official, .dsh-cwp .item.future { grid-template-columns: 1fr; }
.dsh-cwp .badge { display: inline-block; margin-right: .4rem; padding: .05rem .4rem; border-radius: 999px; border: 1px solid var(--cwp-border); font-size: .75rem; }
.dsh-cwp button.primary, .dsh-cwp button.secondary { border-radius: 8px; padding: .45rem .9rem; font: inherit; cursor: pointer; }
.dsh-cwp button.primary { background: var(--cwp-accent, #1f2937); color: #fff; border: 1px solid transparent; }
.dsh-cwp button.primary:disabled { opacity: .55; cursor: not-allowed; }
.dsh-cwp button.secondary { background: transparent; border: 1px solid var(--cwp-border); color: inherit; }
.dsh-cwp .results { margin-top: 1rem; }
.dsh-cwp dialog { border: 1px solid var(--cwp-border); border-radius: 12px; padding: 1rem 1.1rem; max-width: 32rem; }
.dsh-cwp .path { font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; font-size: .9em; }
`;
  document.head.appendChild(style);
}

// src/client/entry.tsx
var name = PLUGIN_ID;
var inject = ["slots", "locale"];
function apply(ctx) {
  ensureStyles();
  const register = () => ctx.slots.inject(
    "settings.section",
    () => ctx.slots.register({
      name: "settings.section",
      id: SETTINGS_SECTION_ID,
      order: 85,
      locale: "codingWorkbench",
      registrant: PLUGIN_ID,
      label: () => translate(currentLocale(ctx), "nav")
    }, () => /* @__PURE__ */ import_react2.default.createElement(WorkbenchPage, null))
  );
  if (ctx.effect) ctx.effect(register, "dsh-coding-workbench-pack: settings");
  else register();
}
function currentLocale(ctx) {
  const snapshot = ctx.locale?.getSnapshot?.();
  const value = `${snapshot?.locale ?? snapshot?.lang ?? ""}`;
  return value.toLowerCase().startsWith("zh") ? "zh" : "en";
}

    return module.exports;
  }
});
