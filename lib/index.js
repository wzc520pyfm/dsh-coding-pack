// src/shared/catalog.ts
var PINNED_AS_OF = "2026-11-10 Asia/Shanghai";
var npmPin = (packageName, version) => ({
  kind: "npm",
  packageName,
  version
});
var githubPin = (packageName, owner, repo, tag, version) => ({
  kind: "github",
  packageName,
  version,
  github: { owner, repo, tag }
});
var BETTER_SIDEBAR_PINS = {
  v022: npmPin("dsh-better-sidebar", "0.30.1"),
  v021: npmPin("dsh-better-sidebar", "0.28.2")
};
var FUTURE_SLOTS = [
  {
    id: "dsh-suggest-card",
    suggestedName: "dsh-suggest-card",
    name: { en: "Suggested next-step card", zh: "\u5EFA\u8BAE\u4E0B\u4E00\u6B65\u5361\u7247" },
    summary: {
      en: "Confirmed product scope, not delivered. Visible here only as an undelivered slot \u2014 not checkable and not part of the default or installable lists, even if a Draft PR already exists.",
      zh: "\u8303\u56F4\u5DF2\u786E\u8BA4\uFF0C\u5C1A\u672A\u4EA4\u4ED8\u3002\u6B64\u5904\u4EC5\u4F5C\u4E3A\u672A\u4EA4\u4ED8\u69FD\u4F4D\u5C55\u793A\uFF1A\u4E0D\u53EF\u52FE\u9009\uFF0C\u4E0D\u8FDB\u5165\u9ED8\u8BA4\u6216\u53EF\u5B89\u88C5\u6E05\u5355\uFF1B\u5373\u4F7F\u5DF2\u6709 Draft PR \u4E5F\u4E0D\u5F97\u5217\u4E3A\u53EF\u5B89\u88C5\u9ED8\u8BA4\u3002"
    },
    categoryHint: { en: "Session wrap-up suggestions", zh: "\u4F1A\u8BDD\u6536\u5C3E\u5EFA\u8BAE" }
  },
  {
    id: "dsh-worktrunk",
    suggestedName: "dsh-worktrunk",
    name: { en: "Worktree switcher and board", zh: "Worktree \u5F00\u5173\u4E0E\u770B\u677F" },
    summary: {
      en: "Confirmed product scope, not delivered. Not an installable default in this pack.",
      zh: "\u8303\u56F4\u5DF2\u786E\u8BA4\uFF0C\u5C1A\u672A\u4EA4\u4ED8\u3002\u4E0D\u4F5C\u4E3A\u672C\u5305\u7684\u53EF\u5B89\u88C5\u9ED8\u8BA4\u3002"
    },
    categoryHint: { en: "Coding workspaces / worktrees (not git branch chips)", zh: "\u7F16\u7A0B\u5DE5\u4F5C\u533A / worktree\uFF08\u4E0D\u7BA1 Git \u5206\u652F\u82AF\u7247\uFF09" }
  },
  {
    id: "dsh-new-workspace",
    suggestedName: "dsh-new-workspace",
    name: { en: "Unified New workspace dialog", zh: "\u7EDF\u4E00\u65B0\u5EFA\u5DE5\u4F5C\u533A\u5F39\u7A97" },
    summary: {
      en: "Confirmed product scope, not delivered. This pack will not take over Add workspace until that product ships.",
      zh: "\u8303\u56F4\u5DF2\u786E\u8BA4\uFF0C\u5C1A\u672A\u4EA4\u4ED8\u3002\u4EA4\u4ED8\u524D\u672C\u5305\u4E0D\u4F1A\u63A5\u7BA1 Add workspace\u3002"
    },
    categoryHint: { en: "Workspace entry", zh: "\u5DE5\u4F5C\u533A\u5165\u53E3" }
  },
  {
    id: "composer-branch",
    suggestedName: "dsh-composer-branch",
    name: { en: "Composer header branch chip", zh: "\u7EC4\u6210\u5668\u5934\u90E8\u5206\u652F\u82AF\u7247" },
    summary: {
      en: "Independent plugin; suggested name dsh-composer-branch, name not finalized. Not installable in this pack.",
      zh: "\u72EC\u7ACB\u63D2\u4EF6\uFF1B\u4E3B\u63A8\u540D\u5EFA\u8BAE dsh-composer-branch\uFF0C\u540D\u79F0\u5C1A\u672A\u6700\u7EC8\u786E\u5B9A\u3002\u672C\u5305\u4E0D\u53EF\u5B89\u88C5\u3002"
    },
    categoryHint: { en: "In-tree git branch switching / creation; separate from dsh-worktrunk", zh: "\u5F53\u524D\u6811\u5185 git \u5206\u652F\u5207\u6362/\u65B0\u5EFA\uFF1B\u4E0E dsh-worktrunk \u5206\u5F00" }
  }
];
var CATEGORIES = [
  {
    id: "session-environment",
    exclusive: true,
    defaultItemId: "session-rail",
    skippable: true,
    title: { en: "Session environment", zh: "\u4F1A\u8BDD\u73AF\u5883" },
    blurb: {
      en: "Inspect path, branch, context use, plugin list, and Git changes per session. Install only one community plugin in this class. Official session and sidebar chrome is built in and is not installed by this pack.",
      zh: "\u6309\u4F1A\u8BDD\u67E5\u770B\u8DEF\u5F84\u3001\u5206\u652F\u3001\u4E0A\u4E0B\u6587\u5360\u7528\u3001\u63D2\u4EF6\u6E05\u5355\u4E0E Git \u53D8\u66F4\u3002\u540C\u7C7B\u793E\u533A\u63D2\u4EF6\u53EA\u88C5\u4E00\u4E2A\u3002\u5B98\u65B9\u4F1A\u8BDD\u4E0E\u4FA7\u680F\u662F\u5BBF\u4E3B\u80FD\u529B\uFF0C\u4E0D\u7531\u672C\u5305\u5B89\u88C5\u3002"
    },
    items: [
      {
        id: "official-session-chrome",
        role: "official",
        categoryId: "session-environment",
        official: true,
        installable: false,
        name: { en: "Built-in session and sidebar chrome", zh: "\u5B98\u65B9\u4F1A\u8BDD\u4E0E\u4FA7\u680F\uFF08\u5185\u7F6E\uFF09" },
        summary: {
          en: "Host capability. There is no separate official \u201Csession environment rail\u201D package. This pack does not install it.",
          zh: "\u5BBF\u4E3B\u80FD\u529B\u3002\u6CA1\u6709\u5355\u72EC\u7684\u300C\u4F1A\u8BDD\u73AF\u5883\u8F68\u300D\u5B98\u65B9\u5305\u3002\u672C\u5305\u4E0D\u5B89\u88C5\u6B64\u9879\u3002"
        }
      },
      {
        id: "session-rail",
        role: "default",
        categoryId: "session-environment",
        exclusiveClass: "session-environment",
        packageName: "session-rail",
        repository: "wzc520pyfm/session-rail",
        pin: npmPin("session-rail", "0.1.3"),
        license: "MIT",
        installable: true,
        defaultSelected: true,
        name: { en: "session-rail", zh: "session-rail" },
        summary: {
          en: "Default. wzc520pyfm/session-rail. Right sidebar Environment / Context / Plugins / Git Changes per Session. Commit requests send a fixed message to the live Agent; the plugin does not write git itself. Not the same package as dsh-session-rail.",
          zh: "\u9ED8\u8BA4\u3002\u4ED3 wzc520pyfm/session-rail\u3002\u53F3\u4FA7\u680F\u6309 Session \u5C55\u793A Environment / Context / Plugins / Git Changes\u3002\u63D0\u4EA4\u8BF7\u6C42\u53D1\u56FA\u5B9A\u6587\u6848\u7ED9 live Agent\uFF0C\u63D2\u4EF6\u4E0D\u76F4\u63A5\u6539 git\u3002\u4E0E dsh-session-rail \u4E0D\u662F\u540C\u4E00\u4E2A\u5305\u3002"
        }
      },
      {
        id: "dsh-session-rail",
        role: "alternative",
        categoryId: "session-environment",
        exclusiveClass: "session-environment",
        packageName: "dsh-session-rail",
        repository: "zengxiaolou/dsh-session-rail",
        pin: npmPin("dsh-session-rail", "0.1.16"),
        license: "MIT",
        installable: true,
        name: { en: "dsh-session-rail", zh: "dsh-session-rail" },
        summary: {
          en: "Alternative by zengxiaolou. Easy to confuse with session-rail \u2014 only one of this class may be installed.",
          zh: "\u5907\u9009\uFF08zengxiaolou/dsh-session-rail\uFF09\u3002\u4E0E session-rail \u5305\u540D\u6781\u6613\u6DF7\u6DC6\uFF0C\u540C\u7C7B\u53EA\u88C5\u4E00\u4E2A\u3002"
        }
      }
    ]
  },
  {
    id: "review-and-changes",
    exclusive: true,
    defaultItemId: "dsh-codex-review-sidebar",
    skippable: true,
    title: { en: "Review and changes", zh: "\u5BA1\u67E5\u4E0E\u53D8\u66F4" },
    blurb: {
      en: "Official changes-review covers this turn\u2019s snapshot (enable Coding Tools for the changed-files card). The default community sidebar reviews the current working tree. Install only one community plugin in this class.",
      zh: "\u5B98\u65B9 changes-review \u6BD4\u8F83\u7684\u662F\u672C\u8F6E\u5FEB\u7167\uFF08changed-files \u5361\u7247\u9700\u5F00\u542F Coding Tools\uFF09\u3002\u9ED8\u8BA4\u793E\u533A\u4FA7\u680F\u5BA1\u67E5\u5F53\u524D\u5DE5\u4F5C\u533A\u3002\u540C\u7C7B\u793E\u533A\u63D2\u4EF6\u53EA\u88C5\u4E00\u4E2A\u3002"
    },
    items: [
      {
        id: "official-changes-review",
        role: "official",
        categoryId: "review-and-changes",
        official: true,
        installable: false,
        name: { en: "Official changes-review", zh: "\u5B98\u65B9 changes-review" },
        summary: {
          en: "Built-in from @deepseek-ai/dsh-client-ui-deliverables (changes-review tab plus the end-of-turn changed-files card). This pack only prompts you to enable Coding Tools; it does not install an official package. The card compares this turn\u2019s snapshot, not the full working tree.",
          zh: "\u6765\u81EA @deepseek-ai/dsh-client-ui-deliverables \u7684\u5185\u7F6E\u80FD\u529B\uFF08changes-review \u6807\u7B7E\u9875\u4E0E\u56DE\u5408\u7ED3\u5C3E changed-files \u5361\u7247\uFF09\u3002\u672C\u5305\u53EA\u63D0\u793A\u542F\u7528 Coding Tools\uFF0C\u4E0D\u628A\u5B83\u5F53\u6210\u9700\u5B89\u88C5\u63D2\u4EF6\u3002\u6BD4\u8F83\u7684\u662F\u672C\u8F6E\u5FEB\u7167\uFF0C\u4E0D\u662F\u5F53\u524D\u5DE5\u4F5C\u533A\u5168\u91CF\u3002"
        }
      },
      {
        id: "dsh-codex-review-sidebar",
        role: "default",
        categoryId: "review-and-changes",
        exclusiveClass: "review-and-changes",
        packageName: "dsh-codex-review-sidebar",
        repository: "wzc520pyfm/dsh-git-review",
        pin: npmPin("dsh-codex-review-sidebar", "0.2.0"),
        license: "MIT",
        installable: true,
        defaultSelected: true,
        name: { en: "dsh-codex-review-sidebar", zh: "dsh-codex-review-sidebar" },
        summary: {
          en: "Default. Package dsh-codex-review-sidebar from repo wzc520pyfm/dsh-git-review (not the npm package named dsh-git-review). Working-tree review sidebar; intended to sit alongside official turn review.",
          zh: "\u9ED8\u8BA4\u3002\u5305\u540D dsh-codex-review-sidebar\uFF0C\u4ED3 wzc520pyfm/dsh-git-review\uFF08\u4E0D\u662F npm \u4E0A\u7684 dsh-git-review\uFF09\u3002\u4ED3\u5E93\u5DE5\u4F5C\u533A\u5BA1\u67E5\u4FA7\u680F\uFF0C\u5EFA\u8BAE\u4E0E\u5B98\u65B9\u56DE\u5408\u5BA1\u67E5\u5E76\u5B58\u3002"
        }
      },
      {
        id: "dsh-git-review",
        role: "alternative",
        categoryId: "review-and-changes",
        exclusiveClass: "review-and-changes",
        packageName: "dsh-git-review",
        repository: "HaoyueQin/dsh-git-review",
        pin: npmPin("dsh-git-review", "0.1.8"),
        license: "MIT",
        installable: true,
        name: { en: "dsh-git-review", zh: "dsh-git-review" },
        summary: {
          en: "Alternative by HaoyueQin. Review tab plus a gated Git workbench. Same class as the default review sidebar \u2014 install only one.",
          zh: "\u5907\u9009\uFF08HaoyueQin/dsh-git-review\uFF09\u3002\u4F1A\u8BDD\u89C6\u56FE\u91CC\u7684 Review \u6807\u7B7E\u9875\u4E0E\u5E26\u786E\u8BA4\u7684 Git \u5DE5\u4F5C\u53F0\u3002\u4E0E\u9ED8\u8BA4\u5BA1\u67E5\u4FA7\u680F\u540C\u7C7B\uFF0C\u53EA\u88C5\u4E00\u4E2A\u3002"
        }
      },
      {
        id: "dsh-review-threads",
        role: "alternative",
        categoryId: "review-and-changes",
        exclusiveClass: "review-and-changes",
        packageName: "dsh-review-threads",
        repository: "huandu/dsh-review-threads",
        pin: npmPin("dsh-review-threads", "0.1.0"),
        license: "MIT",
        installable: true,
        name: { en: "dsh-review-threads", zh: "dsh-review-threads" },
        summary: {
          en: "Alternative. Persistent line-level review threads. Its README says it takes over the official changes-review tab while keeping the official turn diff source; this pack has not live-verified that occupancy. Published engines.dsh is >=0.2.1-rc.1 <0.2.2-0, so it may not load on a 0.2.2 host.",
          zh: "\u5907\u9009\u3002\u6301\u4E45\u5316\u884C\u7EA7\u5BA1\u67E5\u7EBF\u7A0B\u3002\u5176 README \u58F0\u79F0\u4F1A\u63A5\u7BA1\u5B98\u65B9 changes-review \u6807\u7B7E\u9875\u5E76\u4FDD\u7559\u5B98\u65B9\u56DE\u5408 diff \u6570\u636E\u6E90\uFF1B\u672C\u5305\u672A\u5728\u8FD0\u884C\u4E2D\u7684\u5BBF\u4E3B\u4E0A\u5B9E\u6D4B\u5360\u4F4D\u5173\u7CFB\u3002\u5176\u516C\u5E03\u7684 engines.dsh \u4E3A >=0.2.1-rc.1 <0.2.2-0\uFF0C\u5728 0.2.2 \u5BBF\u4E3B\u4E0A\u53EF\u80FD\u65E0\u6CD5\u52A0\u8F7D\u3002"
        }
      }
    ]
  },
  {
    id: "context-insights",
    exclusive: true,
    defaultItemId: "dsh-context",
    skippable: true,
    title: { en: "Context insights", zh: "\u4E0A\u4E0B\u6587\u6D1E\u5BDF" },
    blurb: {
      en: "Official token-meter exposes occupancy to the host UI. The community dashboard adds a finer breakdown. There is no second published community alternative; token-meter is not listed as a plugin alternative.",
      zh: "\u5B98\u65B9 token-meter \u5411\u5BBF\u4E3B UI \u63D0\u4F9B\u5360\u7528\u6570\u636E\u3002\u793E\u533A\u4EEA\u8868\u677F\u505A\u66F4\u7EC6\u7684\u7EC4\u6210\u4E0E\u6F14\u8FDB\u3002\u672A\u627E\u5230\u7B2C\u4E8C\u5957\u5DF2\u53D1\u5E03\u7684\u540C\u7C7B\u4EEA\u8868\u677F\uFF1B\u4E0D\u8981\u628A\u5B98\u65B9 token-meter \u5199\u6210\u5907\u9009\u63D2\u4EF6\u3002"
    },
    items: [
      {
        id: "official-token-meter",
        role: "official",
        categoryId: "context-insights",
        official: true,
        installable: false,
        name: { en: "Official token-meter", zh: "\u5B98\u65B9 token-meter" },
        summary: {
          en: "Host package @deepseek-ai/dsh-token-meter. Present in the current official base bundle used by the default web composition (see \u5F85\u6838\u9A8C). This pack explains it; it does not install it.",
          zh: "\u5BBF\u4E3B\u5305 @deepseek-ai/dsh-token-meter\u3002\u51FA\u73B0\u5728\u5F53\u524D\u5B98\u65B9 base \u7EC4\u5408\u4E2D\uFF0C\u9ED8\u8BA4 web \u6863\u6848\u4F1A\u7528\u5230\uFF08\u8BE6\u89C1\u5F85\u6838\u9A8C\uFF09\u3002\u672C\u5305\u53EA\u8BF4\u660E\uFF0C\u4E0D\u5B89\u88C5\u3002"
        }
      },
      {
        id: "dsh-context",
        role: "default",
        categoryId: "context-insights",
        exclusiveClass: "context-insights",
        packageName: "dsh-context",
        repository: "bowenliang123/dsh-context",
        pin: npmPin("dsh-context", "0.83.1"),
        license: "Apache-2.0",
        installable: true,
        defaultSelected: true,
        name: { en: "dsh-context", zh: "dsh-context" },
        summary: {
          en: "Default. Context dashboard, insight page, /context, and Fleet. Licensed Apache-2.0 \u2014 this pack does not relicense it. After it is installed, session-rail can also read a finer contextTimeline.",
          zh: "\u9ED8\u8BA4\u3002\u4E0A\u4E0B\u6587\u4EEA\u8868\u677F\u3001\u6D1E\u5BDF\u9875\u3001/context\u3001Fleet\u3002\u8BB8\u53EF\u4E3A Apache-2.0\uFF0C\u672C\u5305\u4E0D\u6539\u5199\u5176\u8BB8\u53EF\u3002\u5B89\u88C5\u540E session-rail \u8FD8\u53EF\u8BFB\u66F4\u7EC6\u7684 contextTimeline\u3002"
        }
      }
    ]
  },
  {
    id: "sidebar-workbench",
    exclusive: true,
    defaultItemId: "dsh-better-sidebar",
    skippable: true,
    title: { en: "Sidebar workbench", zh: "\u4FA7\u680F\u5DE5\u4F5C\u53F0" },
    blurb: {
      en: "File tree, editor, Git panel, and tasks. Pin dsh-better-sidebar by host line; never @latest. The alternative is to skip this class and keep the official sidebar plus review/session plugins. Official terminal PTY is provided by the host.",
      zh: "\u6587\u4EF6\u6811\u3001\u7F16\u8F91\u5668\u3001Git \u9762\u677F\u4E0E\u4EFB\u52A1\u3002dsh-better-sidebar \u5FC5\u987B\u6309\u5BBF\u4E3B\u7EBF\u9489\u7248\u672C\uFF0C\u7981\u6B62 @latest\u3002\u5907\u9009\u662F\u4E0D\u88C5\u8FD9\u4E00\u7C7B\uFF0C\u53EA\u7528\u5B98\u65B9\u4FA7\u680F\u52A0\u5BA1\u67E5/\u4F1A\u8BDD\u63D2\u4EF6\u3002\u5B98\u65B9\u7EC8\u7AEF PTY \u7531\u5BBF\u4E3B\u63D0\u4F9B\u3002"
    },
    items: [
      {
        id: "official-sidebar",
        role: "official",
        categoryId: "sidebar-workbench",
        official: true,
        installable: false,
        name: { en: "Official sidebar file preview and host terminal", zh: "\u5B98\u65B9\u4FA7\u680F\u6587\u4EF6\u9884\u89C8\u4E0E\u5BBF\u4E3B\u7EC8\u7AEF" },
        summary: {
          en: "Built-in. Terminal PTY is provided by the host, not by a community workbench plugin.",
          zh: "\u5185\u7F6E\u3002\u7EC8\u7AEF PTY \u7531\u5BBF\u4E3B\u63D0\u4F9B\uFF0C\u4E0D\u7531\u793E\u533A\u5DE5\u4F5C\u53F0\u63D2\u4EF6\u81EA\u5E26\u3002"
        }
      },
      {
        id: "dsh-better-sidebar",
        role: "default",
        categoryId: "sidebar-workbench",
        exclusiveClass: "sidebar-workbench",
        packageName: "dsh-better-sidebar",
        repository: "omdsh-dev/DSH-better-sidebar",
        hostPins: BETTER_SIDEBAR_PINS,
        license: "MIT",
        installable: true,
        defaultSelected: true,
        name: { en: "dsh-better-sidebar", zh: "dsh-better-sidebar" },
        summary: {
          en: "Default. Pin npm 0.30.1 on DSH 0.2.2-rc.1+ (and later 0.2.2.x); pin npm 0.28.2 on the 0.2.1 line. If the host version cannot be read, this item is aborted until you pick a host line manually. Can coexist with the review sidebar and session-rail, but the UI may feel crowded.",
          zh: "\u9ED8\u8BA4\u3002DSH 0.2.2-rc.1+\uFF08\u4EE5\u53CA\u540E\u7EED 0.2.2.x\uFF09\u9489 npm 0.30.1\uFF1B0.2.1 \u7EBF\u9489 npm 0.28.2\u3002\u8BFB\u4E0D\u5230\u5BBF\u4E3B\u7248\u672C\u65F6\u4E2D\u6B62\u8BE5\u9879\uFF0C\u76F4\u5230\u4F60\u624B\u52A8\u9009\u7EBF\u3002\u53EF\u4E0E\u5BA1\u67E5\u4FA7\u680F\u3001session-rail \u5E76\u5B58\uFF0C\u4F46\u754C\u9762\u53EF\u80FD\u62E5\u6324\u3002"
        }
      }
    ]
  },
  {
    id: "session-notes",
    exclusive: true,
    defaultItemId: "dsh-handy",
    skippable: true,
    title: { en: "Session notes", zh: "\u4F1A\u8BDD\u7B14\u8BB0" },
    blurb: {
      en: "Per-session notebook-style notes. Install only one plugin in this class. Jupyter and Flowglass are optional extensions, not replacements.",
      zh: "\u6309\u4F1A\u8BDD\u7684\u7B14\u8BB0\u3002\u540C\u7C7B\u53EA\u88C5\u4E00\u4E2A\u3002Jupyter \u4E0E Flowglass \u662F\u53EF\u9009\u6269\u5C55\uFF0C\u4E0D\u662F\u66FF\u6362\u9879\u3002"
    },
    items: [
      {
        id: "dsh-handy",
        role: "default",
        categoryId: "session-notes",
        exclusiveClass: "session-notes",
        packageName: "dsh-handy",
        repository: "dayutech/dsh-handy",
        pin: npmPin("dsh-handy", "0.8.1"),
        license: "MIT",
        installable: true,
        defaultSelected: true,
        name: { en: "dsh-handy", zh: "dsh-handy" },
        summary: {
          en: "Default. Session-top Notebook tab plus a key-information panel. The project README may still say it is unpublished; npm already has 0.8.1 as a web bundle, which this pack pins. See \u5F85\u6838\u9A8C for the live `dsh plugin add` check.",
          zh: "\u9ED8\u8BA4\u3002\u4F1A\u8BDD\u9876\u90E8\u300C\u7B14\u8BB0\u672C\u300D\u6807\u7B7E\u9875\u4E0E\u5173\u952E\u4FE1\u606F\u9762\u677F\u3002\u9879\u76EE README \u53EF\u80FD\u4ECD\u5199\u5C1A\u672A\u53D1 npm\uFF0C\u4F46 registry \u5DF2\u6709 0.8.1\uFF08Web \u7EC4\u5408\u5305\uFF09\uFF0C\u672C\u5305\u4EE5\u6B64\u4E3A\u51C6\u3002\u73B0\u573A `dsh plugin add` \u89C1\u5F85\u6838\u9A8C\u3002"
        }
      },
      {
        id: "dsh-session-notebook",
        role: "alternative",
        categoryId: "session-notes",
        exclusiveClass: "session-notes",
        packageName: "@timestatic/dsh-session-notebook",
        repository: "timestatic/dsh-session-notebook",
        pin: npmPin("@timestatic/dsh-session-notebook", "0.2.0"),
        license: "Apache-2.0",
        installable: true,
        name: { en: "@timestatic/dsh-session-notebook", zh: "@timestatic/dsh-session-notebook" },
        summary: {
          en: "Alternative focused on a session notebook. Licensed Apache-2.0 \u2014 this pack does not relicense it. Same class as dsh-handy; install only one.",
          zh: "\u66F4\u4E13\u6CE8\u4F1A\u8BDD\u7B14\u8BB0\u672C\u7684\u5907\u9009\u3002\u8BB8\u53EF\u4E3A Apache-2.0\uFF0C\u672C\u5305\u4E0D\u6539\u5199\u5176\u8BB8\u53EF\u3002\u4E0E dsh-handy \u540C\u7C7B\uFF0C\u53EA\u88C5\u4E00\u4E2A\u3002"
        }
      }
    ]
  },
  {
    id: "session-notes-extensions",
    exclusive: false,
    skippable: true,
    title: { en: "Notes and workflow extensions", zh: "\u7B14\u8BB0\u4E0E\u5DE5\u4F5C\u6D41\u6269\u5C55" },
    blurb: {
      en: "Optional add-ons. They do not replace the session-notes default. Jupyter requires dsh-better-sidebar.",
      zh: "\u53EF\u9009\u53D6\u4EF6\uFF0C\u4E0D\u66FF\u6362\u4F1A\u8BDD\u7B14\u8BB0\u9ED8\u8BA4\u9879\u3002Jupyter \u4F9D\u8D56 dsh-better-sidebar\u3002"
    },
    items: [
      {
        id: "dsh-better-sidebar-jupyter",
        role: "extension",
        categoryId: "session-notes-extensions",
        packageName: "@dong-victor/dsh-better-sidebar-jupyter",
        repository: "dong-victor/dsh-better-sidebar-jupyter",
        pin: npmPin("@dong-victor/dsh-better-sidebar-jupyter", "0.2.6"),
        license: "MIT",
        dependsOn: ["dsh-better-sidebar"],
        installable: true,
        name: { en: "@dong-victor/dsh-better-sidebar-jupyter", zh: "@dong-victor/dsh-better-sidebar-jupyter" },
        summary: {
          en: "Optional, not a replacement. Runs .ipynb inside better-sidebar. Blocked unless better-sidebar is selected or already installed.",
          zh: "\u53EF\u9009\u6269\u5C55\uFF0C\u4E0D\u662F\u7B14\u8BB0\u7C7B\u66FF\u6362\u9879\u3002\u5728 better-sidebar \u91CC\u8FD0\u884C .ipynb\u3002\u672A\u9009\u4E2D\u6216\u672A\u5B89\u88C5 better-sidebar \u65F6\u4F1A\u62E6\u4E0B\u3002"
        }
      },
      {
        id: "dsh-flowglass",
        role: "optional",
        categoryId: "session-notes-extensions",
        packageName: "dsh-flowglass",
        repository: "Iwctwbh/dsh-flowglass",
        pin: npmPin("dsh-flowglass", "0.7.4"),
        license: "MIT",
        installable: true,
        name: { en: "dsh-flowglass", zh: "dsh-flowglass" },
        summary: {
          en: "Optional, not default. Visualizes session / sub-agent flow.",
          zh: "\u53EF\u9009\uFF0C\u4E0D\u8FDB\u9ED8\u8BA4\u5B89\u88C5\u3002\u4F1A\u8BDD/\u5B50 agent \u6D41\u7A0B\u53EF\u89C6\u5316\u3002"
        }
      }
    ]
  },
  {
    id: "ui-visibility",
    exclusive: false,
    skippable: true,
    title: { en: "UI visibility", zh: "\u754C\u9762\u663E\u9690" },
    blurb: {
      en: "Independent class, not a notebook, and not installed by default. A fresh dsh-nb-plugin install hides the composer and the floating button.",
      zh: "\u72EC\u7ACB\u7C7B\uFF0C\u4E0D\u662F\u7B14\u8BB0\u672C\uFF0C\u9ED8\u8BA4\u4E0D\u5B89\u88C5\u3002dsh-nb-plugin \u5168\u65B0\u5B89\u88C5\u4F1A\u9ED8\u8BA4\u9690\u85CF\u8F93\u5165\u533A\u548C\u60AC\u6D6E\u6309\u94AE\u3002"
    },
    items: [
      {
        id: "dsh-nb-plugin",
        role: "optional",
        categoryId: "ui-visibility",
        packageName: "dsh-nb-plugin",
        repository: "wzc520pyfm/dsh-nb-plugin",
        pin: npmPin("dsh-nb-plugin", "1.4.0"),
        license: "MIT",
        requiresAck: "nb-plugin-hide-input",
        installable: true,
        name: { en: "dsh-nb-plugin", zh: "dsh-nb-plugin" },
        summary: {
          en: 'Optional, not default. 22 region toggles plus pick-to-hide. If you select it, you must acknowledge how to restore the input area: Cmd+Shift+H / Ctrl+Shift+H, or Settings \u2192 UI visibility. The package declares dsh.client.platform: "web"; its README install examples still show --profile desktop. This pack installs it with --profile web. See \u5F85\u6838\u9A8C.',
          zh: '\u53EF\u9009\uFF0C\u4E0D\u9ED8\u8BA4\u5B89\u88C5\u300222 \u4E2A\u533A\u57DF\u5F00\u5173\u4E0E\u62FE\u53D6\u9690\u85CF\u3002\u82E5\u52FE\u9009\uFF0C\u5FC5\u987B\u786E\u8BA4\u5982\u4F55\u6062\u590D\u8F93\u5165\u533A\uFF1ACmd+Shift+H / Ctrl+Shift+H\uFF0C\u6216\u8BBE\u7F6E\u9875\u300C\u754C\u9762\u663E\u9690\u300D\u3002\u5305\u58F0\u660E dsh.client.platform \u4E3A "web"\uFF1B\u5176 README \u5B89\u88C5\u793A\u4F8B\u4ECD\u5199 --profile desktop\u3002\u672C\u5305\u6309 --profile web \u5B89\u88C5\u3002\u8BE6\u89C1\u5F85\u6838\u9A8C\u3002'
        }
      }
    ]
  },
  {
    id: "file-reference-and-editor",
    exclusive: false,
    skippable: true,
    title: { en: "File references and external editor", zh: "\u6587\u4EF6\u5F15\u7528\u4E0E\u5916\u90E8\u7F16\u8F91\u5668" },
    blurb: {
      en: "Official @file completion is built in. Community plugins in this class are optional and not defaults. Incremental value of dsh-at-file over official @file is still unverified, so it stays optional.",
      zh: "\u5B98\u65B9\u5DF2\u6709\u7EC4\u6210\u5668 @ \u6587\u4EF6\u8865\u5168\u3002\u6B64\u7C7B\u793E\u533A\u63D2\u4EF6\u4EC5\u53EF\u9009\u3001\u4E0D\u8FDB\u9ED8\u8BA4\u3002dsh-at-file \u76F8\u5BF9\u5B98\u65B9 @file \u7684\u589E\u91CF\u4F53\u9A8C\u4ECD\u5F85\u6838\u9A8C\uFF0C\u56E0\u6B64\u4FDD\u7559\u4E3A\u53EF\u9009\u3002"
    },
    items: [
      {
        id: "official-file-reference",
        role: "official",
        categoryId: "file-reference-and-editor",
        official: true,
        installable: false,
        name: { en: "Official @file completion", zh: "\u5B98\u65B9 @file \u8865\u5168" },
        summary: {
          en: "Host package @deepseek-ai/dsh-file-reference-local, present in the current official web-app bundle (see \u5F85\u6838\u9A8C). This pack does not install it.",
          zh: "\u5BBF\u4E3B\u5305 @deepseek-ai/dsh-file-reference-local\uFF0C\u51FA\u73B0\u5728\u5F53\u524D\u5B98\u65B9 web-app \u7EC4\u5408\u4E2D\uFF08\u8BE6\u89C1\u5F85\u6838\u9A8C\uFF09\u3002\u672C\u5305\u4E0D\u5B89\u88C5\u3002"
        }
      },
      {
        id: "dsh-at-file",
        role: "optional",
        categoryId: "file-reference-and-editor",
        packageName: "dsh-at-file",
        repository: "omdsh-dev/dsh-at-file",
        pin: githubPin("dsh-at-file", "omdsh-dev", "dsh-at-file", "v0.7.0", "0.7.0"),
        license: "MIT",
        installable: true,
        name: { en: "dsh-at-file", zh: "dsh-at-file" },
        summary: {
          en: "Optional, not default. Pin github:omdsh-dev/dsh-at-file#v0.7.0. Do not use stale npm 0.6.3.",
          zh: "\u53EF\u9009\uFF0C\u4E0D\u9ED8\u8BA4\u3002\u9489 github:omdsh-dev/dsh-at-file#v0.7.0\u3002\u4E0D\u8981\u7528\u8FC7\u671F\u7684 npm 0.6.3\u3002"
        }
      },
      {
        id: "dsh-open-in-vscode",
        role: "optional",
        categoryId: "file-reference-and-editor",
        packageName: "dsh-open-in-vscode",
        repository: "omdsh-dev/dsh-open-in-vscode",
        pin: githubPin("dsh-open-in-vscode", "omdsh-dev", "dsh-open-in-vscode", "v0.1.6", "0.1.6"),
        license: "MIT",
        installable: true,
        name: { en: "dsh-open-in-vscode", zh: "dsh-open-in-vscode" },
        summary: {
          en: "Optional, not default. Opens the current workspace in VS Code. The npm package is unpublished; pin github:omdsh-dev/dsh-open-in-vscode#v0.1.6.",
          zh: "\u53EF\u9009\uFF0C\u4E0D\u9ED8\u8BA4\u3002\u4ECE Web UI \u6253\u5F00\u5F53\u524D\u5DE5\u4F5C\u533A\u5230 VS Code\u3002npm \u5305\u5DF2 unpublished\uFF1B\u9489 github:omdsh-dev/dsh-open-in-vscode#v0.1.6\u3002"
        }
      }
    ]
  }
];
function allCatalogItems() {
  return CATEGORIES.flatMap((category) => [...category.items]);
}
function findCatalogItem(id) {
  return allCatalogItems().find((item) => item.id === id);
}
function futureSlotIds() {
  return FUTURE_SLOTS.map((slot) => slot.id);
}
function defaultExclusiveSelections() {
  const next = {};
  for (const category of CATEGORIES) {
    if (!category.exclusive) continue;
    next[category.id] = category.defaultItemId ?? "skip";
  }
  return next;
}
function targetForPin(pin) {
  if (pin.kind === "github" && pin.github) {
    return `github:${pin.github.owner}/${pin.github.repo}#${pin.github.tag}`;
  }
  if (!pin.version) throw new Error(`npm pin for ${pin.packageName} is missing a version`);
  return `${pin.packageName}@${pin.version}`;
}

// src/shared/semver.ts
var VERSION_RE = /^v?(\d+)\.(\d+)\.(\d+)(?:-([0-9A-Za-z.-]+))?(?:\+[0-9A-Za-z.-]+)?$/;
function parseVersion(input) {
  if (!input) return null;
  const trimmed = input.trim();
  const match = VERSION_RE.exec(trimmed);
  if (!match) return null;
  const prerelease = match[4] ? match[4].split(".").map((part) => /^\d+$/.test(part) ? Number(part) : part) : [];
  return {
    major: Number(match[1]),
    minor: Number(match[2]),
    patch: Number(match[3]),
    prerelease
  };
}
function compareVersions(a, b) {
  const left = parseVersion(a);
  const right = parseVersion(b);
  if (!left || !right) return null;
  return compareParsed(left, right);
}
function compareParsed(a, b) {
  if (a.major !== b.major) return a.major < b.major ? -1 : 1;
  if (a.minor !== b.minor) return a.minor < b.minor ? -1 : 1;
  if (a.patch !== b.patch) return a.patch < b.patch ? -1 : 1;
  if (a.prerelease.length === 0 && b.prerelease.length === 0) return 0;
  if (a.prerelease.length === 0) return 1;
  if (b.prerelease.length === 0) return -1;
  const len = Math.max(a.prerelease.length, b.prerelease.length);
  for (let i = 0; i < len; i += 1) {
    const l = a.prerelease[i];
    const r = b.prerelease[i];
    if (l === void 0) return -1;
    if (r === void 0) return 1;
    if (l === r) continue;
    const lNum = typeof l === "number";
    const rNum = typeof r === "number";
    if (lNum && rNum) return l < r ? -1 : 1;
    if (lNum) return -1;
    if (rNum) return 1;
    return String(l) < String(r) ? -1 : 1;
  }
  return 0;
}
function isAtLeast(installed, pin) {
  const cmp = compareVersions(installed, pin);
  if (cmp === null) return null;
  return cmp >= 0;
}
function isLowerThan(installed, pin) {
  const cmp = compareVersions(installed, pin);
  if (cmp === null) return null;
  return cmp < 0;
}
var V022_FLOOR = parseVersion("0.2.2-rc.1");
var V023_FLOOR = parseVersion("0.3.0");
function classifyHostLine(version) {
  const parsed = parseVersion(extractVersion(version ?? ""));
  if (!parsed) return "unknown";
  if (parsed.major === 0 && parsed.minor === 2 && parsed.patch === 1) return "v021";
  if (compareParsed(parsed, V022_FLOOR) >= 0 && compareParsed(parsed, V023_FLOOR) < 0) return "v022";
  return "unknown";
}
function extractVersion(raw) {
  const trimmed = raw.trim();
  if (!trimmed) return null;
  const candidates = [
    trimmed,
    ...trimmed.split(/[\s/,]+/)
  ];
  const explicit = trimmed.match(/v?\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?/);
  if (explicit?.[0]) candidates.unshift(explicit[0]);
  for (const candidate of candidates) {
    const parsed = parseVersion(candidate);
    if (parsed) return formatParsed(parsed, candidate);
  }
  return null;
}
function formatParsed(parsed, original) {
  const match = VERSION_RE.exec(original.trim());
  if (match) return original.trim().replace(/^v/, "");
  const pre = parsed.prerelease.length ? `-${parsed.prerelease.join(".")}` : "";
  return `${parsed.major}.${parsed.minor}.${parsed.patch}${pre}`;
}
function pinForHostLine(line) {
  if (line === "v022") return BETTER_SIDEBAR_PINS.v022;
  if (line === "v021") return BETTER_SIDEBAR_PINS.v021;
  return null;
}
function versionFromSpecifier(specifier) {
  if (!specifier) return null;
  const hash = specifier.match(/#v?(\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?)/);
  if (hash?.[1]) return hash[1];
  const at = specifier.match(/@v?(\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?)$/);
  if (at?.[1]) return at[1];
  return parseVersion(specifier) ? specifier.replace(/^v/, "") : null;
}

// src/shared/types.ts
var PLUGIN_ID = "dsh-coding-workbench-pack";
var API_PREFIX = "/api/dsh-coding-workbench-pack";
var COMMAND_NAME = "coding-workbench";
var DEFAULT_PROFILE = "web";
var SETTINGS_FILE_NAME = "dsh-coding-workbench-pack.settings.json";

// src/shared/policy.ts
var EXCLUSIVE_CLASSES = [
  "session-environment",
  "review-and-changes",
  "context-insights",
  "sidebar-workbench",
  "session-notes"
];
function normalizeSettings(input) {
  const exclusive = {};
  for (const classId of EXCLUSIVE_CLASSES) {
    const value = input?.exclusive?.[classId];
    exclusive[classId] = isExclusiveChoice(classId, value) ? value : defaultChoice(classId);
  }
  const extras = unique(asStringArray(input?.extras).filter((id) => isExtraItem(id)));
  const hostLineOverride = isHostLine(input?.hostLineOverride) ? input.hostLineOverride : void 0;
  return {
    locale: input?.locale === "zh" ? "zh" : "en",
    profile: typeof input?.profile === "string" && /^[A-Za-z0-9_-]+$/.test(input.profile) ? input.profile : DEFAULT_PROFILE,
    exclusive,
    extras,
    hostLineOverride,
    nbPluginAcknowledged: input?.nbPluginAcknowledged === true
  };
}
function mergeRequest(settings, request, detectedLine) {
  const exclusive = { ...settings.exclusive, ...request.exclusive ?? {} };
  const normalized = normalizeSettings({
    ...settings,
    exclusive,
    extras: request.extras ?? settings.extras,
    hostLineOverride: request.hostLineOverride ?? settings.hostLineOverride,
    nbPluginAcknowledged: request.nbPluginAcknowledged ?? settings.nbPluginAcknowledged
  });
  const hostLine = normalized.hostLineOverride && normalized.hostLineOverride !== "unknown" ? normalized.hostLineOverride : detectedLine;
  return {
    exclusive: normalized.exclusive,
    extras: normalized.extras,
    hostLine,
    nbPluginAcknowledged: normalized.nbPluginAcknowledged === true
  };
}
function selectedItems(selection) {
  const ids = [
    ...Object.values(selection.exclusive).filter((id) => id !== "skip"),
    ...selection.extras
  ];
  return unique(ids).map((id) => findCatalogItem(id)).filter((item) => Boolean(item));
}
function resolvePin(item, hostLine) {
  if (item.hostPins) return pinForHostLine(hostLine);
  return item.pin ?? null;
}
function planSelection(selection, inventory, host) {
  const items = selectedItems(selection);
  const results = [];
  for (const item of items) {
    results.push(planOne(item, selection, inventory, host, items));
  }
  return results;
}
function planOne(item, selection, inventory, host, selected) {
  if (!item.installable || item.role === "official" || item.role === "future" || futureSlotIds().includes(item.id)) {
    return blocked(item, "blocked-future", {
      en: `${item.id} is not an installable item in this pack.`,
      zh: `${item.id} \u4E0D\u662F\u672C\u5305\u7684\u53EF\u5B89\u88C5\u9879\u3002`
    });
  }
  if (item.requiresAck === "nb-plugin-hide-input" && !selection.nbPluginAcknowledged) {
    return blocked(item, "blocked-ack", {
      en: "dsh-nb-plugin hides the composer and the floating button on a fresh install. Acknowledge how to restore them with Cmd+Shift+H / Ctrl+Shift+H or the Settings page before installing.",
      zh: "dsh-nb-plugin \u5168\u65B0\u5B89\u88C5\u4F1A\u9690\u85CF\u8F93\u5165\u533A\u548C\u60AC\u6D6E\u6309\u94AE\u3002\u5B89\u88C5\u524D\u5FC5\u987B\u786E\u8BA4\u53EF\u7528 Cmd+Shift+H / Ctrl+Shift+H \u6216\u8BBE\u7F6E\u9875\u6062\u590D\u3002"
    }, item.packageName);
  }
  const missingDep = missingDependency(item, selection, inventory, selected);
  if (missingDep) {
    return blocked(item, "blocked-dependency", {
      en: `${item.packageName ?? item.id} depends on ${missingDep}, which is not selected or installed.`,
      zh: `${item.packageName ?? item.id} \u4F9D\u8D56 ${missingDep}\uFF0C\u4F46\u8BE5\u9879\u672A\u9009\u4E2D\u4E5F\u672A\u5B89\u88C5\u3002`
    }, item.packageName);
  }
  const pin = resolvePin(item, selection.hostLine);
  if (!pin) {
    return blocked(item, "blocked-host-line", {
      en: "The DSH host version could not be classified, so dsh-better-sidebar was not pinned. Pick the 0.2.2-rc.1+ line or the 0.2.1 line manually. This pack never installs @latest.",
      zh: "\u65E0\u6CD5\u5224\u5B9A\u5F53\u524D DSH \u5BBF\u4E3B\u7EBF\uFF0C\u56E0\u6B64\u672A\u9489\u5B9A dsh-better-sidebar\u3002\u8BF7\u624B\u52A8\u9009\u62E9 0.2.2-rc.1+ \u6216 0.2.1 \u7EBF\u3002\u672C\u5305\u4ECE\u4E0D\u4F7F\u7528 @latest\u3002"
    }, item.packageName);
  }
  const target = targetForPin(pin);
  if (item.packageName === "dsh-better-sidebar" && /@latest(?:$|[#])/.test(target)) {
    return blocked(item, "blocked-host-line", {
      en: "Refusing to install dsh-better-sidebar@latest.",
      zh: "\u62D2\u7EDD\u5B89\u88C5 dsh-better-sidebar@latest\u3002"
    }, item.packageName);
  }
  const conflict = conflictingInstalled(item, inventory);
  if (conflict) {
    return result(item, pin, target, "blocked-conflict", {
      en: `${conflict.packageName}${conflict.version ? `@${conflict.version}` : ""} is already installed in this class. Uninstall it or choose that alternative before installing ${pin.packageName}.`,
      zh: `\u540C\u7C7B\u5DF2\u5B89\u88C5 ${conflict.packageName}${conflict.version ? `@${conflict.version}` : ""}\u3002\u8BF7\u5148\u5378\u8F7D\u5B83\u6216\u6539\u9009\u8BE5\u9879\uFF0C\u518D\u5B89\u88C5 ${pin.packageName}\u3002`
    });
  }
  const installed = item.packageName ? inventory.packages[item.packageName] : void 0;
  if (installed) {
    const installedVersion = installed.version;
    const pinnedVersion = pin.version ?? null;
    if (installedVersion && pinnedVersion && isAtLeast(installedVersion, pinnedVersion) === true) {
      return result(item, pin, target, "skip-installed", {
        en: `${pin.packageName}@${installedVersion} is already installed and meets pin ${pinnedVersion}. Skipped.`,
        zh: `${pin.packageName}@${installedVersion} \u5DF2\u5B89\u88C5\u4E14\u4E0D\u4F4E\u4E8E\u9489\u5B9A\u7248 ${pinnedVersion}\uFF0C\u5DF2\u8DF3\u8FC7\u3002`
      }, installedVersion);
    }
    if (installedVersion && pinnedVersion && isLowerThan(installedVersion, pinnedVersion) === true) {
      return result(item, pin, target, "blocked-upgrade", {
        en: `${pin.packageName}@${installedVersion} is already installed and is lower than pin ${pinnedVersion}. This pack does not auto-upgrade; choose whether to upgrade.`,
        zh: `${pin.packageName}@${installedVersion} \u5DF2\u5B89\u88C5\u4F46\u4F4E\u4E8E\u9489\u5B9A\u7248 ${pinnedVersion}\u3002\u672C\u5305\u4E0D\u81EA\u52A8\u5347\u7EA7\uFF0C\u8BF7\u81EA\u884C\u51B3\u5B9A\u662F\u5426\u5347\u5230\u9489\u5B9A\u7248\u3002`
      }, installedVersion);
    }
    return result(item, pin, target, "blocked-upgrade", {
      en: `${pin.packageName} is already installed (${installedVersion ?? installed.specifier ?? "version unknown"}) but cannot be compared with pin ${pinnedVersion ?? target}. This pack will not replace it automatically.`,
      zh: `${pin.packageName} \u5DF2\u5B89\u88C5\uFF08${installedVersion ?? installed.specifier ?? "\u7248\u672C\u672A\u77E5"}\uFF09\uFF0C\u4F46\u65E0\u6CD5\u4E0E\u9489\u5B9A ${pinnedVersion ?? target} \u6BD4\u8F83\u3002\u672C\u5305\u4E0D\u4F1A\u81EA\u52A8\u66FF\u6362\u3002`
    }, installedVersion);
  }
  return result(item, pin, target, "install", {
    en: `Will run: dsh plugin --profile ${inventory.profile} add ${target}`,
    zh: `\u5C06\u6267\u884C\uFF1Adsh plugin --profile ${inventory.profile} add ${target}`
  });
}
function missingDependency(item, selection, inventory, selected) {
  for (const dep of item.dependsOn ?? []) {
    const selectedDep = selected.some((candidate) => candidate.id === dep || candidate.packageName === dep);
    const installedDep = Boolean(inventory.packages[dep]);
    const exclusivePicksIt = Object.values(selection.exclusive).some((choice) => {
      const chosen = findCatalogItem(choice);
      return chosen?.id === dep || chosen?.packageName === dep;
    });
    if (!selectedDep && !installedDep && !exclusivePicksIt) return dep;
  }
  return null;
}
function conflictingInstalled(item, inventory) {
  if (!item.exclusiveClass) return null;
  const rivals = allCatalogItems().filter(
    (candidate) => candidate.exclusiveClass === item.exclusiveClass && candidate.id !== item.id && candidate.packageName && inventory.packages[candidate.packageName]
  );
  const rival = rivals[0];
  if (!rival?.packageName) return null;
  if (item.packageName && inventory.packages[item.packageName]) return null;
  return inventory.packages[rival.packageName] ?? null;
}
function inventoryWarnings(inventory) {
  const warnings = [];
  if (inventory.starterPackInstalled) {
    warnings.push({
      en: "dsh-starter-pack is already installed. It is a generic curated pack, not this workbench installer. The two may both try to install dsh-context or dsh-better-sidebar, and starter-pack may have widened allowBuilds (including a wildcard). This pack will not uninstall it.",
      zh: "\u68C0\u6D4B\u5230\u5DF2\u5B89\u88C5 dsh-starter-pack\u3002\u5B83\u662F\u901A\u7528\u7CBE\u9009\u5305\uFF0C\u4E0E\u672C\u5DE5\u4F5C\u53F0\u5B89\u88C5\u5668\u5B9A\u4F4D\u4E0D\u540C\u3002\u4E24\u8005\u53EF\u80FD\u91CD\u590D\u5B89\u88C5 dsh-context \u6216 dsh-better-sidebar\uFF0C\u4E14 starter-pack \u53EF\u80FD\u5DF2\u653E\u5BBD allowBuilds\uFF08\u5305\u62EC\u901A\u914D\uFF09\u3002v0.1 \u4E0D\u4F1A\u81EA\u52A8\u5378\u8F7D\u5B83\u3002"
    });
  }
  if (inventory.allowBuilds.hasWildcard) {
    warnings.push({
      en: `The profile pnpm-workspace.yaml already allows a wildcard build policy (${inventory.allowBuilds.wildcardKeys.join(", ")}). That trusts any later package build script. This pack will not silently change that policy; consider narrowing it to explicit package names.`,
      zh: `\u6863\u6848 pnpm-workspace.yaml \u4E2D\u5DF2\u6709\u901A\u914D allowBuilds\uFF08${inventory.allowBuilds.wildcardKeys.join(", ")}\uFF09\uFF0C\u540E\u7EED\u4EFB\u610F\u5305\u7684\u6784\u5EFA\u811A\u672C\u90FD\u53EF\u80FD\u88AB\u653E\u884C\u3002\u672C\u5305\u4E0D\u4F1A\u6697\u9ED8\u6539\u6389\u8BE5\u7B56\u7565\uFF1B\u5EFA\u8BAE\u6536\u7A84\u4E3A\u660E\u786E\u7684\u5305\u540D\u767D\u540D\u5355\u3002`
    });
  }
  return warnings;
}
function defaultChoice(classId) {
  if (classId === "session-environment") return "session-rail";
  if (classId === "review-and-changes") return "dsh-codex-review-sidebar";
  if (classId === "context-insights") return "dsh-context";
  if (classId === "sidebar-workbench") return "dsh-better-sidebar";
  if (classId === "session-notes") return "dsh-handy";
  return "skip";
}
function isExclusiveChoice(classId, value) {
  if (value === "skip") return true;
  if (typeof value !== "string") return false;
  const item = findCatalogItem(value);
  return Boolean(item && item.exclusiveClass === classId && item.installable);
}
function isExtraItem(id) {
  const item = findCatalogItem(id);
  return Boolean(item && item.installable && (item.role === "optional" || item.role === "extension"));
}
function isHostLine(value) {
  return value === "v022" || value === "v021" || value === "unknown";
}
function asStringArray(value) {
  return Array.isArray(value) ? value.filter((item) => typeof item === "string") : [];
}
function unique(values) {
  return [...new Set(values)];
}
function blocked(item, status, message, packageName) {
  return {
    itemId: item.id,
    packageName: packageName ?? item.packageName ?? item.id,
    target: "",
    status,
    message
  };
}
function result(item, pin, target, status, message, installedVersion) {
  return {
    itemId: item.id,
    packageName: pin.packageName,
    target,
    status,
    installedVersion,
    pinnedVersion: pin.version ?? null,
    message
  };
}

// src/host/install.ts
import { spawn } from "node:child_process";

// src/shared/allow-builds.ts
function isWildcardKey(key) {
  const trimmed = key.trim().replace(/^['"]|['"]$/g, "");
  return trimmed === "*";
}
function isAllowedValue(value) {
  return value === true || value === "true";
}
function detectWildcardKeys(entries) {
  return Object.keys(entries).filter(isWildcardKey);
}
function parseIgnoredBuildKeys(output) {
  const keys = /* @__PURE__ */ new Set();
  const ignored = output.match(/Ignored build scripts:\s*([^\n]+)/i);
  if (ignored?.[1]) {
    for (const part of ignored[1].split(/[,\n]/)) {
      const token = part.trim().replace(/\.$/, "");
      const name2 = packageNameFromBuildToken(token);
      if (name2) keys.add(name2);
    }
  }
  for (const match of output.matchAll(/allowBuilds:\s*\n(?:[ \t]+['"]?([@A-Za-z0-9_./:+-]+)['"]?:\s*[^\n]+)/g)) {
    if (match[1] && !isWildcardKey(match[1])) keys.add(packageNameFromBuildToken(match[1]) ?? match[1]);
  }
  return [...keys];
}
function packageNameFromBuildToken(token) {
  const trimmed = token.trim().replace(/^['"]|['"]$/g, "");
  if (!trimmed || isWildcardKey(trimmed)) return null;
  if (trimmed.startsWith("@")) {
    const scoped = trimmed.match(/^(@[^@/]+\/[^@/]+)(?:@.+)?$/);
    return scoped?.[1] ?? null;
  }
  const ordinary = trimmed.match(/^([^@/]+)(?:@.+)?$/);
  return ordinary?.[1] ?? null;
}
function parseAllowBuildsSection(source) {
  const lines = source.split(/\r?\n/);
  const start = lines.findIndex((line) => /^\s*allowBuilds\s*:/.test(line));
  if (start < 0) return {};
  const header2 = lines[start] ?? "";
  const inline = header2.replace(/^\s*allowBuilds\s*:/, "").trim();
  const entries = {};
  if (inline && inline !== "|" && inline !== ">") {
    Object.assign(entries, parseYamlMapLine(inline) ? { [parseYamlMapLine(inline).key]: parseYamlMapLine(inline).value } : {});
  }
  const headerIndent = header2.match(/^\s*/)?.[0].length ?? 0;
  for (let i = start + 1; i < lines.length; i += 1) {
    const line = lines[i] ?? "";
    if (line.trim() === "" || /^\s*#/.test(line)) continue;
    const indent = line.match(/^\s*/)?.[0].length ?? 0;
    if (indent <= headerIndent) break;
    const parsed = parseYamlMapLine(line.trim());
    if (parsed) entries[parsed.key] = parsed.value;
  }
  return entries;
}
function parseYamlMapLine(line) {
  const match = line.match(/^(['"]?)([^:'"]+)\1\s*:\s*(.*?)\s*$/);
  if (!match) return null;
  return { key: match[2], value: parseYamlScalar(match[3] ?? "") };
}
function parseYamlScalar(raw) {
  const value = raw.trim();
  if (value === "true") return true;
  if (value === "false") return false;
  if (value === "null" || value === "~" || value === "") return null;
  if (value.startsWith("'") && value.endsWith("'") || value.startsWith('"') && value.endsWith('"')) {
    return value.slice(1, -1);
  }
  return value;
}
function upsertAllowBuilds(source, keysToAllow) {
  const unique2 = uniqueAllowedKeys(keysToAllow);
  if (unique2.length === 0) return source;
  const existing = parseAllowBuildsSection(source);
  if (detectWildcardKeys(existing).length > 0) {
    return source;
  }
  const missing = unique2.filter((key) => !isAllowedValue(existing[key]));
  if (missing.length === 0) return source;
  if (!/^\s*allowBuilds\s*:/m.test(source)) {
    const body = missing.map((key) => `  ${formatYamlKey(key)}: true`).join("\n");
    const prefix = source.endsWith("\n") || source.length === 0 ? source : `${source}
`;
    return `${prefix}allowBuilds:
${body}
`;
  }
  const lines = source.split(/\r?\n/);
  const start = lines.findIndex((line) => /^\s*allowBuilds\s*:/.test(line));
  const headerIndent = lines[start]?.match(/^\s*/)?.[0].length ?? 0;
  let end = start + 1;
  while (end < lines.length) {
    const line = lines[end] ?? "";
    if (line.trim() !== "" && !/^\s*#/.test(line) && (line.match(/^\s*/)?.[0].length ?? 0) <= headerIndent) break;
    end += 1;
  }
  const additions = missing.map((key) => `${" ".repeat(headerIndent + 2)}${formatYamlKey(key)}: true`);
  return [...lines.slice(0, end), ...additions, ...lines.slice(end)].join("\n");
}
function uniqueAllowedKeys(keys) {
  const out = [];
  for (const key of keys) {
    const name2 = packageNameFromBuildToken(key) ?? key.trim();
    if (!name2 || isWildcardKey(name2)) continue;
    if (!out.includes(name2)) out.push(name2);
  }
  return out;
}
function formatYamlKey(key) {
  return key.startsWith("@") ? `'${key}'` : key;
}
function keysOutsideWhitelist(pending, whitelist) {
  const allowed = new Set(uniqueAllowedKeys(whitelist));
  return uniqueAllowedKeys(pending).filter((key) => !allowed.has(key));
}

// src/host/allow-builds-file.ts
import { readFile, writeFile } from "node:fs/promises";
async function confirmAllowBuilds(filePath, pendingKeys, confirmedKeys) {
  const refused = keysOutsideWhitelist(pendingKeys, confirmedKeys);
  if (refused.length > 0) return { wrote: false, refused, hasWildcard: false };
  let source = "";
  try {
    source = await readFile(filePath, "utf8");
  } catch (error) {
    if (!(error && typeof error === "object" && "code" in error && error.code === "ENOENT")) throw error;
  }
  const existing = parseAllowBuildsSection(source);
  const hasWildcard = detectWildcardKeys(existing).length > 0;
  if (hasWildcard) return { wrote: false, refused: [], hasWildcard: true };
  const next = upsertAllowBuilds(source, confirmedKeys);
  if (next === source) return { wrote: false, refused: [], hasWildcard: false };
  await writeFile(filePath, next.endsWith("\n") ? next : `${next}
`, "utf8");
  return { wrote: true, refused: [], hasWildcard: false };
}

// src/host/dsh-command.ts
import { dirname, resolve } from "node:path";
function resolveDshCommand(argv = process.argv, execPath = process.execPath, execArgv = process.execArgv, platform = process.platform) {
  const entry = argv[1];
  if (entry && /(?:^|[/\\])(?:bin\.(?:js|ts)|dsh)$/.test(entry)) {
    const abs = resolve(entry);
    return { file: execPath, args: [...execArgv, abs], cwd: dirname(abs), viaShell: false };
  }
  return { file: "dsh", args: [], cwd: void 0, viaShell: platform === "win32" };
}
var TARGET_RE = /^(?:[A-Za-z0-9._+-]+\/)?[A-Za-z0-9@._+-]+(?:@[A-Za-z0-9._+-]+)?$|^github:[A-Za-z0-9._-]+\/[A-Za-z0-9._-]+#[A-Za-z0-9._/-]+$/;
function assertSafeTarget(target) {
  if (!TARGET_RE.test(target) || target.includes("@latest")) {
    throw new Error(`Refusing unsafe or unpinned plugin target: ${target}`);
  }
}

// src/host/install.ts
var INSTALL_TIMEOUT_MS = 5 * 60 * 1e3;
async function runPluginAdd(profile, target) {
  assertSafeTarget(target);
  return runPlugin(profile, ["add", "-w", target]);
}
function pluginAddCommand(profile, target) {
  return `dsh plugin --profile ${profile} add ${target}`;
}
function runPlugin(profile, pluginArgs) {
  const command = resolveDshCommand();
  return new Promise((resolvePromise) => {
    const child = spawn(command.file, [...command.args, "plugin", "--profile", profile, ...pluginArgs], {
      cwd: command.cwd,
      env: { ...process.env, CI: "true" },
      stdio: ["ignore", "pipe", "pipe"],
      shell: command.viaShell
    });
    let stdout = "";
    let stderr = "";
    let timedOut = false;
    const timer = setTimeout(() => {
      timedOut = true;
      killChild(child);
    }, INSTALL_TIMEOUT_MS);
    child.stdout.on("data", (chunk) => {
      stdout = (stdout + chunk.toString()).slice(-256 * 1024);
    });
    child.stderr.on("data", (chunk) => {
      stderr = (stderr + chunk.toString()).slice(-64 * 1024);
    });
    child.on("error", (error) => {
      clearTimeout(timer);
      resolvePromise({ exitCode: 127, timedOut: false, stdout, stderr: `${stderr}
${error.message}` });
    });
    child.on("close", (code) => {
      clearTimeout(timer);
      resolvePromise({ exitCode: code, timedOut, stdout, stderr });
    });
  });
}
function outcomeFromPlan(plan) {
  if (plan.status === "install") return null;
  const status = plan.status === "skip-installed" ? "skipped" : "blocked";
  return {
    itemId: plan.itemId,
    packageName: plan.packageName,
    target: plan.target,
    status,
    installedVersion: plan.installedVersion,
    pinnedVersion: plan.pinnedVersion,
    message: plan.message
  };
}
function outcomeFromCommand(plan, profile, result2) {
  const log = trimLog(`${result2.stdout}
${result2.stderr}`);
  const pending = uniqueAllowedKeys(parseIgnoredBuildKeys(`${result2.stdout}
${result2.stderr}`));
  if (result2.timedOut) {
    return fail(plan, {
      en: `${pluginAddCommand(profile, plan.target)} timed out.`,
      zh: `${pluginAddCommand(profile, plan.target)} \u8D85\u65F6\u3002`
    }, log);
  }
  if (pending.length > 0 || /ERR_PNPM_IGNORED_BUILDS/.test(log)) {
    return {
      itemId: plan.itemId,
      packageName: plan.packageName,
      target: plan.target,
      status: "needs-allow-builds",
      pinnedVersion: plan.pinnedVersion,
      pendingBuilds: pending,
      log,
      message: {
        en: `A build script was blocked for ${plan.target}. Confirm a package-name whitelist (this plugin and its verified direct build dependencies only). This pack will not write allowBuilds '*' or approve anything outside that list.`,
        zh: `${plan.target} \u7684\u6784\u5EFA\u811A\u672C\u88AB\u62E6\u622A\u3002\u8BF7\u786E\u8BA4\u4EC5\u5305\u542B\u8BE5\u63D2\u4EF6\u53CA\u5176\u5DF2\u6838\u5B9E\u76F4\u63A5\u6784\u5EFA\u4F9D\u8D56\u7684\u5305\u540D\u767D\u540D\u5355\u3002\u672C\u5305\u4E0D\u4F1A\u5199\u5165 allowBuilds '*'\uFF0C\u4E5F\u4E0D\u4F1A\u653E\u884C\u540D\u5355\u5916\u7684\u811A\u672C\u3002`
      }
    };
  }
  if ((result2.exitCode ?? 1) !== 0) {
    return fail(plan, {
      en: `${pluginAddCommand(profile, plan.target)} failed (exit ${result2.exitCode ?? "null"}).`,
      zh: `${pluginAddCommand(profile, plan.target)} \u5931\u8D25\uFF08\u9000\u51FA\u7801 ${result2.exitCode ?? "null"}\uFF09\u3002`
    }, log);
  }
  return {
    itemId: plan.itemId,
    packageName: plan.packageName,
    target: plan.target,
    status: "installed",
    pinnedVersion: plan.pinnedVersion,
    log,
    message: {
      en: `Installed ${plan.target}.`,
      zh: `\u5DF2\u5B89\u88C5 ${plan.target}\u3002`
    }
  };
}
async function applyConfirmedAllowBuilds(workspaceFile, pending, confirmed) {
  if (!workspaceFile) {
    return {
      ok: false,
      message: {
        en: "The profile pnpm-workspace.yaml path is unknown, so allowBuilds was not changed.",
        zh: "\u65E0\u6CD5\u5B9A\u4F4D\u6863\u6848\u7684 pnpm-workspace.yaml\uFF0C\u672A\u6539\u5199 allowBuilds\u3002"
      }
    };
  }
  const result2 = await confirmAllowBuilds(workspaceFile, pending, confirmed);
  if (result2.hasWildcard) {
    return {
      ok: false,
      message: {
        en: "The profile already has a wildcard allowBuilds policy. This pack will not add keys or change that policy. Narrow it manually if you intend to install a git package that needs a build.",
        zh: "\u6863\u6848\u5DF2\u6709\u901A\u914D allowBuilds \u7B56\u7565\u3002\u672C\u5305\u4E0D\u4F1A\u8FFD\u52A0\u952E\u6216\u6539\u5199\u8BE5\u7B56\u7565\u3002\u82E5\u4ECD\u8981\u5B89\u88C5\u9700\u8981\u6784\u5EFA\u7684 git \u5305\uFF0C\u8BF7\u81EA\u884C\u6536\u7A84\u540E\u518D\u8BD5\u3002"
      }
    };
  }
  if (result2.refused.length > 0) {
    return {
      ok: false,
      message: {
        en: `Refused to allow build scripts outside the confirmed whitelist: ${result2.refused.join(", ")}.`,
        zh: `\u62D2\u7EDD\u653E\u884C\u767D\u540D\u5355\u4E4B\u5916\u7684\u6784\u5EFA\u811A\u672C\uFF1A${result2.refused.join(", ")}\u3002`
      }
    };
  }
  return {
    ok: true,
    message: {
      en: result2.wrote ? `Wrote explicit allowBuilds keys: ${uniqueAllowedKeys(confirmed).join(", ")}.` : "allowBuilds already contained the confirmed keys.",
      zh: result2.wrote ? `\u5DF2\u5199\u5165\u660E\u786E\u7684 allowBuilds \u952E\uFF1A${uniqueAllowedKeys(confirmed).join(", ")}\u3002` : "allowBuilds \u4E2D\u5DF2\u6709\u786E\u8BA4\u7684\u952E\u3002"
    }
  };
}
function fail(plan, message, log) {
  return {
    itemId: plan.itemId,
    packageName: plan.packageName,
    target: plan.target,
    status: "failed",
    pinnedVersion: plan.pinnedVersion,
    log,
    message
  };
}
function killChild(child) {
  if (process.platform === "win32" && child.pid !== void 0) {
    try {
      spawn("taskkill", ["/pid", String(child.pid), "/t", "/f"], { stdio: "ignore" });
    } catch {
      child.kill("SIGKILL");
    }
    return;
  }
  child.kill("SIGKILL");
}
function trimLog(text) {
  return text.trim().slice(-16e3);
}

// src/host/http.ts
var HttpError = class extends Error {
  constructor(status, code, message) {
    super(message);
    this.status = status;
    this.code = code;
    this.name = "HttpError";
  }
};
function header(headers, name2) {
  const raw = headers[name2] ?? headers[name2.toLowerCase()];
  if (Array.isArray(raw)) return raw.join(",");
  return raw ?? "";
}
function isSameOrigin(headers) {
  const origin = header(headers, "origin").trim();
  if (!origin) return true;
  const host = header(headers, "host").trim();
  if (!host) return false;
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}
function sendJson(res, status, body) {
  res.writeHead(status, { "content-type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(body));
}
function sendError(res, status, code, message) {
  sendJson(res, status, { ok: false, error: { code, message } });
}
async function readJsonBody(req, limit = 1e6) {
  const chunks = [];
  let size = 0;
  for await (const chunk of req) {
    const buf = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
    size += buf.length;
    if (size > limit) throw new HttpError(413, "payload_too_large", "Request body is too large");
    chunks.push(buf);
  }
  if (chunks.length === 0) return {};
  try {
    const parsed = JSON.parse(Buffer.concat(chunks).toString("utf8"));
    if (parsed === null || typeof parsed !== "object" || Array.isArray(parsed)) {
      throw new Error("Expected a JSON object");
    }
    return parsed;
  } catch {
    throw new HttpError(400, "invalid_json", "Request body must be a JSON object");
  }
}

// src/host/home.ts
import { existsSync } from "node:fs";
import { homedir } from "node:os";
import { join, resolve as resolve2 } from "node:path";
function resolveDshHome(env = process.env) {
  const override = env.DSH_HOME?.trim();
  if (override) return resolve2(expandHome(override));
  return join(homedir(), ".dsh");
}
function resolveProfileDir(profile, env = process.env) {
  return join(resolveDshHome(env), "profiles", profile);
}
function inferProfileName(argv = process.argv, env = process.env) {
  const flag = argv.findIndex((arg) => arg === "--profile");
  if (flag >= 0) {
    const value = argv[flag + 1];
    if (value && /^[A-Za-z0-9_-]+$/.test(value)) return value;
  }
  const envName = env.DSH_PROFILE?.trim();
  if (envName && /^[A-Za-z0-9_-]+$/.test(envName)) return envName;
  if (argv.includes("web")) return "web";
  return DEFAULT_PROFILE;
}
function profileExists(profileDir) {
  return existsSync(join(profileDir, "package.json"));
}
function expandHome(path) {
  if (path === "~") return homedir();
  if (path.startsWith("~/")) return join(homedir(), path.slice(2));
  return path;
}

// src/host/inventory.ts
import { readFile as readFile2 } from "node:fs/promises";
import { join as join2 } from "node:path";
async function readInventory(profile) {
  const profileDir = resolveProfileDir(profile);
  if (!profileExists(profileDir)) {
    return {
      profile,
      profileDir,
      packages: {},
      starterPackInstalled: false,
      allowBuilds: emptyAllowBuilds(join2(profileDir, "pnpm-workspace.yaml"))
    };
  }
  const manifest = await readJson(join2(profileDir, "package.json")) ?? {};
  const packages = {};
  for (const [packageName, specifier] of Object.entries(manifest.dependencies ?? {})) {
    const installedVersion = await readInstalledVersion(profileDir, packageName) ?? versionFromSpecifier(specifier);
    packages[packageName] = {
      packageName,
      version: installedVersion,
      specifier,
      source: installedVersion && installedVersion !== versionFromSpecifier(specifier) ? "node_modules" : "dependencies"
    };
  }
  for (const bundle of manifest.dsh?.profile?.bundles ?? []) {
    if (packages[bundle]) continue;
    const installedVersion = await readInstalledVersion(profileDir, bundle);
    packages[bundle] = {
      packageName: bundle,
      version: installedVersion,
      specifier: null,
      source: installedVersion ? "node_modules" : "bundles"
    };
  }
  return {
    profile,
    profileDir,
    packages,
    starterPackInstalled: Boolean(packages["dsh-starter-pack"]),
    allowBuilds: await readAllowBuilds(join2(profileDir, "pnpm-workspace.yaml"))
  };
}
async function readInstalledVersion(profileDir, packageName) {
  const manifest = await readJson(join2(profileDir, "node_modules", ...packageName.split("/"), "package.json"));
  return typeof manifest?.version === "string" ? manifest.version : null;
}
async function readAllowBuilds(filePath) {
  try {
    const source = await readFile2(filePath, "utf8");
    const entries = parseAllowBuildsSection(source);
    const wildcardKeys = detectWildcardKeys(entries);
    return { filePath, exists: true, entries, hasWildcard: wildcardKeys.length > 0, wildcardKeys };
  } catch (error) {
    if (error && typeof error === "object" && "code" in error && error.code === "ENOENT") {
      return emptyAllowBuilds(filePath);
    }
    throw error;
  }
}
function emptyAllowBuilds(filePath) {
  return { filePath, exists: false, entries: {}, hasWildcard: false, wildcardKeys: [] };
}
async function readJson(path) {
  try {
    return JSON.parse(await readFile2(path, "utf8"));
  } catch (error) {
    if (error && typeof error === "object" && "code" in error && error.code === "ENOENT") return null;
    throw error;
  }
}

// src/host/settings-store.ts
import { mkdir, readFile as readFile3, writeFile as writeFile2 } from "node:fs/promises";
import { dirname as dirname2, join as join3 } from "node:path";
async function readUserSettings(profile) {
  const path = settingsPath(profile);
  try {
    const raw = JSON.parse(await readFile3(path, "utf8"));
    const settings = normalizeSettings(raw && typeof raw === "object" ? raw : {});
    return { ...settings, profile };
  } catch (error) {
    if (isNotFound(error)) return normalizeSettings({ profile });
    throw error;
  }
}
async function writeUserSettings(profile, settings) {
  const normalized = normalizeSettings({ ...settings, profile });
  const path = settingsPath(profile);
  await mkdir(dirname2(path), { recursive: true });
  await writeFile2(path, `${JSON.stringify(normalized, null, 2)}
`, "utf8");
  return normalized;
}
function settingsPath(profile) {
  return join3(resolveProfileDir(profile), SETTINGS_FILE_NAME);
}
function isNotFound(error) {
  return Boolean(error && typeof error === "object" && "code" in error && error.code === "ENOENT");
}

// src/host/version.ts
import { spawn as spawn2 } from "node:child_process";
async function readHostVersion(override) {
  if (override && override !== "unknown") {
    return { raw: null, parsed: null, line: override, source: "manual" };
  }
  const command = resolveDshCommand();
  try {
    const output = await runVersion(command);
    const parsed = extractVersion(output);
    return {
      raw: output.trim() || null,
      parsed,
      line: classifyHostLine(parsed),
      source: parsed ? "dsh-version" : "unavailable"
    };
  } catch {
    return { raw: null, parsed: null, line: "unknown", source: "unavailable" };
  }
}
function runVersion(command) {
  return new Promise((resolvePromise, reject) => {
    const child = spawn2(command.file, [...command.args, "--version"], {
      cwd: command.cwd,
      env: process.env,
      stdio: ["ignore", "pipe", "pipe"],
      shell: command.viaShell
    });
    let out = "";
    let err = "";
    const timer = setTimeout(() => {
      child.kill("SIGKILL");
      reject(new Error("dsh --version timed out"));
    }, 8e3);
    child.stdout.on("data", (chunk) => {
      out += String(chunk);
    });
    child.stderr.on("data", (chunk) => {
      err += String(chunk);
    });
    child.on("error", (error) => {
      clearTimeout(timer);
      reject(error);
    });
    child.on("close", (code) => {
      clearTimeout(timer);
      const text = `${out}
${err}`;
      if (code === 0 || extractVersion(text)) resolvePromise(text);
      else reject(new Error(err || `dsh --version exited ${code ?? "null"}`));
    });
  });
}

// src/host/plugin.ts
var name = PLUGIN_ID;
var inject = ["webServer", "commands"];
function apply(ctx) {
  const registerRoutes = () => {
    if (!ctx.webServer?.register) return () => void 0;
    return ctx.webServer.register({
      kind: "prefix",
      path: API_PREFIX,
      handler: (req, res) => route(req, res)
    });
  };
  const registerCommand = () => {
    if (!ctx.commands?.register) return () => void 0;
    return ctx.commands.register({
      name: COMMAND_NAME,
      description: "Inspect or install the Coding Workbench Pack catalog",
      input: { hint: "[status|install|defaults]" },
      handler: async ({ rawInput }) => runCommand(rawInput ?? "")
    });
  };
  if (ctx.effect) {
    ctx.effect(registerRoutes, "dsh-coding-workbench-pack: routes");
    ctx.effect(registerCommand, "dsh-coding-workbench-pack: command");
  } else {
    registerRoutes();
    registerCommand();
  }
}
async function route(req, res) {
  if (!isSameOrigin(req.headers)) {
    sendError(res, 403, "cross_origin", "Cross-origin requests are refused");
    return;
  }
  if (String(req.method ?? "").toUpperCase() !== "POST") {
    sendError(res, 405, "method_not_allowed", "Only POST is supported");
    return;
  }
  if (!/^application\/json(?:\s*;|$)/i.test(header(req.headers, "content-type"))) {
    sendError(res, 415, "json_required", "Content-Type must be application/json");
    return;
  }
  try {
    const url = new URL(req.url ?? "/", "http://dsh.local");
    const body = await readJsonBody(req);
    const profile = inferProfileName();
    if (url.pathname === `${API_PREFIX}/catalog`) {
      sendJson(res, 200, { ok: true, data: { categories: CATEGORIES, futureSlots: FUTURE_SLOTS, pinnedAsOf: PINNED_AS_OF } });
      return;
    }
    if (url.pathname === `${API_PREFIX}/status`) {
      sendJson(res, 200, { ok: true, data: await loadStatus(profile) });
      return;
    }
    if (url.pathname === `${API_PREFIX}/settings`) {
      const current = await readUserSettings(profile);
      const saved = await writeUserSettings(profile, { ...current, ...parseSettingsPatch(body) });
      sendJson(res, 200, { ok: true, data: saved });
      return;
    }
    if (url.pathname === `${API_PREFIX}/install`) {
      sendJson(res, 200, { ok: true, data: await install(profile, body) });
      return;
    }
    sendError(res, 404, "route_not_found", "Route was not found");
  } catch (error) {
    if (error instanceof HttpError) {
      sendError(res, error.status, error.code, error.message);
      return;
    }
    sendError(res, 500, "host_failed", error instanceof Error ? error.message : "The host request failed");
  }
}
async function loadStatus(profile) {
  const settings = await readUserSettings(profile);
  const inventory = await readInventory(profile);
  const detected = await readHostVersion();
  const host = settings.hostLineOverride && settings.hostLineOverride !== "unknown" ? { ...detected, line: settings.hostLineOverride, source: "manual" } : detected;
  const selection = mergeRequest(settings, {}, host.line);
  return {
    settings,
    host,
    inventory,
    plan: planSelection(selection, inventory, host),
    inventoryWarnings: inventoryWarnings(inventory)
  };
}
async function install(profile, request) {
  const current = await readUserSettings(profile);
  const settings = await writeUserSettings(profile, {
    ...current,
    exclusive: request.exclusive ?? current.exclusive,
    extras: request.extras ?? current.extras,
    hostLineOverride: request.hostLineOverride ?? current.hostLineOverride,
    nbPluginAcknowledged: request.nbPluginAcknowledged ?? current.nbPluginAcknowledged,
    locale: request.locale ?? current.locale
  });
  const inventory = await readInventory(profile);
  const detected = await readHostVersion(settings.hostLineOverride);
  const host = detected;
  const selection = mergeRequest(settings, request, host.line);
  const plan = planSelection(selection, inventory, host);
  const warnings = inventoryWarnings(inventory);
  const outcomes = [];
  let restartRecommended = false;
  let pendingAllowBuilds;
  const retry = request.retryItemId ? plan.find((item) => item.itemId === request.retryItemId) : void 0;
  const work = retry ? [retry] : plan;
  for (const item of work) {
    if (item.status !== "install") {
      const blocked2 = outcomeFromPlan(item);
      if (blocked2) outcomes.push(blocked2);
      continue;
    }
    if (request.confirmAllowBuilds && request.retryItemId === item.itemId) {
      const applied = await applyConfirmedAllowBuilds(
        inventory.allowBuilds.filePath,
        request.confirmAllowBuilds,
        request.confirmAllowBuilds
      );
      if (!applied.ok) {
        outcomes.push({
          itemId: item.itemId,
          packageName: item.packageName,
          target: item.target,
          status: "blocked",
          pinnedVersion: item.pinnedVersion,
          message: applied.message
        });
        continue;
      }
    }
    const result2 = await runPluginAdd(profile, item.target);
    const outcome = outcomeFromCommand(item, profile, result2);
    outcomes.push(outcome);
    if (outcome.status === "installed") restartRecommended = true;
    if (outcome.status === "needs-allow-builds") {
      pendingAllowBuilds = {
        itemId: item.itemId,
        packageName: item.packageName,
        keys: outcome.pendingBuilds ?? [],
        message: outcome.message
      };
      break;
    }
  }
  return {
    ok: outcomes.every((item) => item.status === "installed" || item.status === "skipped"),
    host,
    inventoryWarnings: warnings,
    outcomes,
    restartRecommended,
    pendingAllowBuilds
  };
}
async function runCommand(rawInput) {
  const profile = inferProfileName();
  const token = rawInput.trim().split(/\s+/)[0]?.toLowerCase() || "status";
  try {
    if (token === "status" || token === "list" || token === "") {
      const status = await loadStatus(profile);
      return { kind: "success", text: renderStatus(status) };
    }
    if (token === "defaults" || token === "install") {
      const request = token === "defaults" ? { exclusive: defaultExclusiveSelections(), extras: [], nbPluginAcknowledged: false } : {};
      const result2 = await install(profile, request);
      return { kind: result2.ok ? "success" : "error", text: renderInstall(result2) };
    }
    return {
      kind: "error",
      text: "Usage: /coding-workbench [status|install|defaults]\nstatus \u2014 catalog and install plan\ninstall \u2014 install the current selection\ndefaults \u2014 install the v0.1 default set (no optionals)"
    };
  } catch (error) {
    return { kind: "error", text: error instanceof Error ? error.message : "The command failed" };
  }
}
function renderStatus(status) {
  const lines = [
    "Coding Workbench Pack / \u7F16\u7A0B\u5DE5\u4F5C\u53F0\u5F00\u7BB1\u5305",
    `Host: ${status.host.parsed ?? status.host.raw ?? "unavailable"} (${status.host.line}, ${status.host.source})`,
    `Profile: ${status.settings.profile}`,
    ...status.inventoryWarnings.map((warning) => `Warning: ${warning.en}`),
    "",
    "Plan:",
    ...status.plan.map((item) => `- ${item.itemId}: ${item.status}${item.target ? ` \u2192 ${item.target}` : ""} \u2014 ${item.message.en}`),
    "",
    "Future slots (undelivered, not installable): dsh-suggest-card, dsh-worktrunk, dsh-new-workspace, dsh-composer-branch (name not finalized).",
    "Use /coding-workbench install to apply the current selection, or the Settings page for grouped choices."
  ];
  return lines.join("\n");
}
function renderInstall(result2) {
  const lines = [
    ...result2.inventoryWarnings.map((warning) => `Warning: ${warning.en}`),
    ...result2.outcomes.map((item) => `- ${item.itemId}: ${item.status}${item.target ? ` \u2192 ${item.target}` : ""} \u2014 ${item.message.en}`)
  ];
  if (result2.pendingAllowBuilds) {
    lines.push(`Build scripts were blocked for ${result2.pendingAllowBuilds.packageName}. Confirm a package whitelist in Settings before retrying. Keys: ${result2.pendingAllowBuilds.keys.join(", ") || "(see log)"}. This pack will not write allowBuilds '*'.`);
  }
  if (result2.restartRecommended) {
    lines.push("Restart dsh web (or hard-refresh the UI) once so newly installed bundles can load.");
  }
  return lines.join("\n");
}
function parseSettingsPatch(body) {
  const patch = {};
  if (body.locale === "en" || body.locale === "zh") patch.locale = body.locale;
  if (body.exclusive && typeof body.exclusive === "object" && !Array.isArray(body.exclusive)) {
    patch.exclusive = body.exclusive;
  }
  if (Array.isArray(body.extras)) patch.extras = body.extras.filter((item) => typeof item === "string");
  if (body.hostLineOverride === "v022" || body.hostLineOverride === "v021" || body.hostLineOverride === "unknown") {
    patch.hostLineOverride = body.hostLineOverride;
  }
  if (typeof body.nbPluginAcknowledged === "boolean") patch.nbPluginAcknowledged = body.nbPluginAcknowledged;
  return patch;
}
export {
  apply,
  inject,
  name
};
