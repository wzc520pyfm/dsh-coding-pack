import type { BetterSidebarPins, CatalogCategory, CatalogItem, ExclusiveChoice, FutureSlot, PackagePin } from './types.ts'

export const PINNED_AS_OF = '2026-11-10 Asia/Shanghai'

const npmPin = (packageName: string, version: string): PackagePin => ({
  kind: 'npm',
  packageName,
  version,
})

const githubPin = (packageName: string, owner: string, repo: string, tag: string, version: string): PackagePin => ({
  kind: 'github',
  packageName,
  version,
  github: { owner, repo, tag },
})

export const BETTER_SIDEBAR_PINS: BetterSidebarPins = {
  v022: npmPin('dsh-better-sidebar', '0.30.1'),
  v021: npmPin('dsh-better-sidebar', '0.28.2'),
}

export const FUTURE_SLOTS: readonly FutureSlot[] = [
  {
    id: 'dsh-suggest-card',
    suggestedName: 'dsh-suggest-card',
    name: { en: 'Suggested next-step card', zh: '建议下一步卡片' },
    summary: {
      en: 'Confirmed product scope, not delivered. Visible here only as an undelivered slot — not checkable and not part of the default or installable lists, even if a Draft PR already exists.',
      zh: '范围已确认，尚未交付。此处仅作为未交付槽位展示：不可勾选，不进入默认或可安装清单；即使已有 Draft PR 也不得列为可安装默认。',
    },
    categoryHint: { en: 'Session wrap-up suggestions', zh: '会话收尾建议' },
  },
  {
    id: 'dsh-worktrunk',
    suggestedName: 'dsh-worktrunk',
    name: { en: 'Worktree switcher and board', zh: 'Worktree 开关与看板' },
    summary: {
      en: 'Confirmed product scope, not delivered. Not an installable default in this pack.',
      zh: '范围已确认，尚未交付。不作为本包的可安装默认。',
    },
    categoryHint: { en: 'Coding workspaces / worktrees (not git branch chips)', zh: '编程工作区 / worktree（不管 Git 分支芯片）' },
  },
  {
    id: 'dsh-new-workspace',
    suggestedName: 'dsh-new-workspace',
    name: { en: 'Unified New workspace dialog', zh: '统一新建工作区弹窗' },
    summary: {
      en: 'Confirmed product scope, not delivered. This pack will not take over Add workspace until that product ships.',
      zh: '范围已确认，尚未交付。交付前本包不会接管 Add workspace。',
    },
    categoryHint: { en: 'Workspace entry', zh: '工作区入口' },
  },
  {
    id: 'composer-branch',
    suggestedName: 'dsh-composer-branch',
    name: { en: 'Composer header branch chip', zh: '组成器头部分支芯片' },
    summary: {
      en: 'Independent plugin; suggested name dsh-composer-branch, name not finalized. Not installable in this pack.',
      zh: '独立插件；主推名建议 dsh-composer-branch，名称尚未最终确定。本包不可安装。',
    },
    categoryHint: { en: 'In-tree git branch switching / creation; separate from dsh-worktrunk', zh: '当前树内 git 分支切换/新建；与 dsh-worktrunk 分开' },
  },
]

export const CATEGORIES: readonly CatalogCategory[] = [
  {
    id: 'session-environment',
    exclusive: true,
    defaultItemId: 'session-rail',
    skippable: true,
    title: { en: 'Session environment', zh: '会话环境' },
    blurb: {
      en: 'Inspect path, branch, context use, plugin list, and Git changes per session. Install only one community plugin in this class. Official session and sidebar chrome is built in and is not installed by this pack.',
      zh: '按会话查看路径、分支、上下文占用、插件清单与 Git 变更。同类社区插件只装一个。官方会话与侧栏是宿主能力，不由本包安装。',
    },
    items: [
      {
        id: 'official-session-chrome',
        role: 'official',
        categoryId: 'session-environment',
        official: true,
        installable: false,
        name: { en: 'Built-in session and sidebar chrome', zh: '官方会话与侧栏（内置）' },
        summary: {
          en: 'Host capability. There is no separate official “session environment rail” package. This pack does not install it.',
          zh: '宿主能力。没有单独的「会话环境轨」官方包。本包不安装此项。',
        },
      },
      {
        id: 'session-rail',
        role: 'default',
        categoryId: 'session-environment',
        exclusiveClass: 'session-environment',
        packageName: 'session-rail',
        repository: 'wzc520pyfm/session-rail',
        pin: npmPin('session-rail', '0.1.3'),
        license: 'MIT',
        installable: true,
        defaultSelected: true,
        name: { en: 'session-rail', zh: 'session-rail' },
        summary: {
          en: 'Default. wzc520pyfm/session-rail. Right sidebar Environment / Context / Plugins / Git Changes per Session. Commit requests send a fixed message to the live Agent; the plugin does not write git itself. Not the same package as dsh-session-rail.',
          zh: '默认。仓 wzc520pyfm/session-rail。右侧栏按 Session 展示 Environment / Context / Plugins / Git Changes。提交请求发固定文案给 live Agent，插件不直接改 git。与 dsh-session-rail 不是同一个包。',
        },
      },
      {
        id: 'dsh-session-rail',
        role: 'alternative',
        categoryId: 'session-environment',
        exclusiveClass: 'session-environment',
        packageName: 'dsh-session-rail',
        repository: 'zengxiaolou/dsh-session-rail',
        pin: npmPin('dsh-session-rail', '0.1.16'),
        license: 'MIT',
        installable: true,
        name: { en: 'dsh-session-rail', zh: 'dsh-session-rail' },
        summary: {
          en: 'Alternative by zengxiaolou. Easy to confuse with session-rail — only one of this class may be installed.',
          zh: '备选（zengxiaolou/dsh-session-rail）。与 session-rail 包名极易混淆，同类只装一个。',
        },
      },
    ],
  },
  {
    id: 'review-and-changes',
    exclusive: true,
    defaultItemId: 'dsh-codex-review-sidebar',
    skippable: true,
    title: { en: 'Review and changes', zh: '审查与变更' },
    blurb: {
      en: 'Official changes-review covers this turn’s snapshot (enable Coding Tools for the changed-files card). The default community sidebar reviews the current working tree. Install only one community plugin in this class.',
      zh: '官方 changes-review 比较的是本轮快照（changed-files 卡片需开启 Coding Tools）。默认社区侧栏审查当前工作区。同类社区插件只装一个。',
    },
    items: [
      {
        id: 'official-changes-review',
        role: 'official',
        categoryId: 'review-and-changes',
        official: true,
        installable: false,
        name: { en: 'Official changes-review', zh: '官方 changes-review' },
        summary: {
          en: 'Built-in from @deepseek-ai/dsh-client-ui-deliverables (changes-review tab plus the end-of-turn changed-files card). This pack only prompts you to enable Coding Tools; it does not install an official package. The card compares this turn’s snapshot, not the full working tree.',
          zh: '来自 @deepseek-ai/dsh-client-ui-deliverables 的内置能力（changes-review 标签页与回合结尾 changed-files 卡片）。本包只提示启用 Coding Tools，不把它当成需安装插件。比较的是本轮快照，不是当前工作区全量。',
        },
      },
      {
        id: 'dsh-codex-review-sidebar',
        role: 'default',
        categoryId: 'review-and-changes',
        exclusiveClass: 'review-and-changes',
        packageName: 'dsh-codex-review-sidebar',
        repository: 'wzc520pyfm/dsh-git-review',
        pin: npmPin('dsh-codex-review-sidebar', '0.2.0'),
        license: 'MIT',
        installable: true,
        defaultSelected: true,
        name: { en: 'dsh-codex-review-sidebar', zh: 'dsh-codex-review-sidebar' },
        summary: {
          en: 'Default. Package dsh-codex-review-sidebar from repo wzc520pyfm/dsh-git-review (not the npm package named dsh-git-review). Working-tree review sidebar; intended to sit alongside official turn review.',
          zh: '默认。包名 dsh-codex-review-sidebar，仓 wzc520pyfm/dsh-git-review（不是 npm 上的 dsh-git-review）。仓库工作区审查侧栏，建议与官方回合审查并存。',
        },
      },
      {
        id: 'dsh-git-review',
        role: 'alternative',
        categoryId: 'review-and-changes',
        exclusiveClass: 'review-and-changes',
        packageName: 'dsh-git-review',
        repository: 'HaoyueQin/dsh-git-review',
        pin: npmPin('dsh-git-review', '0.1.8'),
        license: 'MIT',
        installable: true,
        name: { en: 'dsh-git-review', zh: 'dsh-git-review' },
        summary: {
          en: 'Alternative by HaoyueQin. Review tab plus a gated Git workbench. Same class as the default review sidebar — install only one.',
          zh: '备选（HaoyueQin/dsh-git-review）。会话视图里的 Review 标签页与带确认的 Git 工作台。与默认审查侧栏同类，只装一个。',
        },
      },
      {
        id: 'dsh-review-threads',
        role: 'alternative',
        categoryId: 'review-and-changes',
        exclusiveClass: 'review-and-changes',
        packageName: 'dsh-review-threads',
        repository: 'huandu/dsh-review-threads',
        pin: npmPin('dsh-review-threads', '0.1.0'),
        license: 'MIT',
        installable: true,
        name: { en: 'dsh-review-threads', zh: 'dsh-review-threads' },
        summary: {
          en: 'Alternative. Persistent line-level review threads. Its README says it takes over the official changes-review tab while keeping the official turn diff source; this pack has not live-verified that occupancy. Published engines.dsh is >=0.2.1-rc.1 <0.2.2-0, so it may not load on a 0.2.2 host.',
          zh: '备选。持久化行级审查线程。其 README 声称会接管官方 changes-review 标签页并保留官方回合 diff 数据源；本包未在运行中的宿主上实测占位关系。其公布的 engines.dsh 为 >=0.2.1-rc.1 <0.2.2-0，在 0.2.2 宿主上可能无法加载。',
        },
      },
    ],
  },
  {
    id: 'context-insights',
    exclusive: true,
    defaultItemId: 'dsh-context',
    skippable: true,
    title: { en: 'Context insights', zh: '上下文洞察' },
    blurb: {
      en: 'Official token-meter exposes occupancy to the host UI. The community dashboard adds a finer breakdown. There is no second published community alternative; token-meter is not listed as a plugin alternative.',
      zh: '官方 token-meter 向宿主 UI 提供占用数据。社区仪表板做更细的组成与演进。未找到第二套已发布的同类仪表板；不要把官方 token-meter 写成备选插件。',
    },
    items: [
      {
        id: 'official-token-meter',
        role: 'official',
        categoryId: 'context-insights',
        official: true,
        installable: false,
        name: { en: 'Official token-meter', zh: '官方 token-meter' },
        summary: {
          en: 'Host package @deepseek-ai/dsh-token-meter. Present in the current official base bundle used by the default web composition (see 待核验). This pack explains it; it does not install it.',
          zh: '宿主包 @deepseek-ai/dsh-token-meter。出现在当前官方 base 组合中，默认 web 档案会用到（详见待核验）。本包只说明，不安装。',
        },
      },
      {
        id: 'dsh-context',
        role: 'default',
        categoryId: 'context-insights',
        exclusiveClass: 'context-insights',
        packageName: 'dsh-context',
        repository: 'bowenliang123/dsh-context',
        pin: npmPin('dsh-context', '0.83.1'),
        license: 'Apache-2.0',
        installable: true,
        defaultSelected: true,
        name: { en: 'dsh-context', zh: 'dsh-context' },
        summary: {
          en: 'Default. Context dashboard, insight page, /context, and Fleet. Licensed Apache-2.0 — this pack does not relicense it. After it is installed, session-rail can also read a finer contextTimeline.',
          zh: '默认。上下文仪表板、洞察页、/context、Fleet。许可为 Apache-2.0，本包不改写其许可。安装后 session-rail 还可读更细的 contextTimeline。',
        },
      },
    ],
  },
  {
    id: 'sidebar-workbench',
    exclusive: true,
    defaultItemId: 'dsh-better-sidebar',
    skippable: true,
    title: { en: 'Sidebar workbench', zh: '侧栏工作台' },
    blurb: {
      en: 'File tree, editor, Git panel, and tasks. Pin dsh-better-sidebar by host line; never @latest. The alternative is to skip this class and keep the official sidebar plus review/session plugins. Official terminal PTY is provided by the host.',
      zh: '文件树、编辑器、Git 面板与任务。dsh-better-sidebar 必须按宿主线钉版本，禁止 @latest。备选是不装这一类，只用官方侧栏加审查/会话插件。官方终端 PTY 由宿主提供。',
    },
    items: [
      {
        id: 'official-sidebar',
        role: 'official',
        categoryId: 'sidebar-workbench',
        official: true,
        installable: false,
        name: { en: 'Official sidebar file preview and host terminal', zh: '官方侧栏文件预览与宿主终端' },
        summary: {
          en: 'Built-in. Terminal PTY is provided by the host, not by a community workbench plugin.',
          zh: '内置。终端 PTY 由宿主提供，不由社区工作台插件自带。',
        },
      },
      {
        id: 'dsh-better-sidebar',
        role: 'default',
        categoryId: 'sidebar-workbench',
        exclusiveClass: 'sidebar-workbench',
        packageName: 'dsh-better-sidebar',
        repository: 'omdsh-dev/DSH-better-sidebar',
        hostPins: BETTER_SIDEBAR_PINS,
        license: 'MIT',
        installable: true,
        defaultSelected: true,
        name: { en: 'dsh-better-sidebar', zh: 'dsh-better-sidebar' },
        summary: {
          en: 'Default. Pin npm 0.30.1 on DSH 0.2.2-rc.1+ (and later 0.2.2.x); pin npm 0.28.2 on the 0.2.1 line. If the host version cannot be read, this item is aborted until you pick a host line manually. Can coexist with the review sidebar and session-rail, but the UI may feel crowded.',
          zh: '默认。DSH 0.2.2-rc.1+（以及后续 0.2.2.x）钉 npm 0.30.1；0.2.1 线钉 npm 0.28.2。读不到宿主版本时中止该项，直到你手动选线。可与审查侧栏、session-rail 并存，但界面可能拥挤。',
        },
      },
    ],
  },
  {
    id: 'session-notes',
    exclusive: true,
    defaultItemId: 'dsh-handy',
    skippable: true,
    title: { en: 'Session notes', zh: '会话笔记' },
    blurb: {
      en: 'Per-session notebook-style notes. Install only one plugin in this class. Jupyter and Flowglass are optional extensions, not replacements.',
      zh: '按会话的笔记。同类只装一个。Jupyter 与 Flowglass 是可选扩展，不是替换项。',
    },
    items: [
      {
        id: 'dsh-handy',
        role: 'default',
        categoryId: 'session-notes',
        exclusiveClass: 'session-notes',
        packageName: 'dsh-handy',
        repository: 'dayutech/dsh-handy',
        pin: npmPin('dsh-handy', '0.8.1'),
        license: 'MIT',
        installable: true,
        defaultSelected: true,
        name: { en: 'dsh-handy', zh: 'dsh-handy' },
        summary: {
          en: 'Default. Session-top Notebook tab plus a key-information panel. The project README may still say it is unpublished; npm already has 0.8.1 as a web bundle, which this pack pins. See 待核验 for the live `dsh plugin add` check.',
          zh: '默认。会话顶部「笔记本」标签页与关键信息面板。项目 README 可能仍写尚未发 npm，但 registry 已有 0.8.1（Web 组合包），本包以此为准。现场 `dsh plugin add` 见待核验。',
        },
      },
      {
        id: 'dsh-session-notebook',
        role: 'alternative',
        categoryId: 'session-notes',
        exclusiveClass: 'session-notes',
        packageName: '@timestatic/dsh-session-notebook',
        repository: 'timestatic/dsh-session-notebook',
        pin: npmPin('@timestatic/dsh-session-notebook', '0.2.0'),
        license: 'Apache-2.0',
        installable: true,
        name: { en: '@timestatic/dsh-session-notebook', zh: '@timestatic/dsh-session-notebook' },
        summary: {
          en: 'Alternative focused on a session notebook. Licensed Apache-2.0 — this pack does not relicense it. Same class as dsh-handy; install only one.',
          zh: '更专注会话笔记本的备选。许可为 Apache-2.0，本包不改写其许可。与 dsh-handy 同类，只装一个。',
        },
      },
    ],
  },
  {
    id: 'session-notes-extensions',
    exclusive: false,
    skippable: true,
    title: { en: 'Notes and workflow extensions', zh: '笔记与工作流扩展' },
    blurb: {
      en: 'Optional add-ons. They do not replace the session-notes default. Jupyter requires dsh-better-sidebar.',
      zh: '可选取件，不替换会话笔记默认项。Jupyter 依赖 dsh-better-sidebar。',
    },
    items: [
      {
        id: 'dsh-better-sidebar-jupyter',
        role: 'extension',
        categoryId: 'session-notes-extensions',
        packageName: '@dong-victor/dsh-better-sidebar-jupyter',
        repository: 'dong-victor/dsh-better-sidebar-jupyter',
        pin: npmPin('@dong-victor/dsh-better-sidebar-jupyter', '0.2.6'),
        license: 'MIT',
        dependsOn: ['dsh-better-sidebar'],
        installable: true,
        name: { en: '@dong-victor/dsh-better-sidebar-jupyter', zh: '@dong-victor/dsh-better-sidebar-jupyter' },
        summary: {
          en: 'Optional, not a replacement. Runs .ipynb inside better-sidebar. Blocked unless better-sidebar is selected or already installed.',
          zh: '可选扩展，不是笔记类替换项。在 better-sidebar 里运行 .ipynb。未选中或未安装 better-sidebar 时会拦下。',
        },
      },
      {
        id: 'dsh-flowglass',
        role: 'optional',
        categoryId: 'session-notes-extensions',
        packageName: 'dsh-flowglass',
        repository: 'Iwctwbh/dsh-flowglass',
        pin: npmPin('dsh-flowglass', '0.7.4'),
        license: 'MIT',
        installable: true,
        name: { en: 'dsh-flowglass', zh: 'dsh-flowglass' },
        summary: {
          en: 'Optional, not default. Visualizes session / sub-agent flow.',
          zh: '可选，不进默认安装。会话/子 agent 流程可视化。',
        },
      },
    ],
  },
  {
    id: 'ui-visibility',
    exclusive: false,
    skippable: true,
    title: { en: 'UI visibility', zh: '界面显隐' },
    blurb: {
      en: 'Independent class, not a notebook, and not installed by default. A fresh dsh-nb-plugin install hides the composer and the floating button.',
      zh: '独立类，不是笔记本，默认不安装。dsh-nb-plugin 全新安装会默认隐藏输入区和悬浮按钮。',
    },
    items: [
      {
        id: 'dsh-nb-plugin',
        role: 'optional',
        categoryId: 'ui-visibility',
        packageName: 'dsh-nb-plugin',
        repository: 'wzc520pyfm/dsh-nb-plugin',
        pin: npmPin('dsh-nb-plugin', '1.4.0'),
        license: 'MIT',
        requiresAck: 'nb-plugin-hide-input',
        installable: true,
        name: { en: 'dsh-nb-plugin', zh: 'dsh-nb-plugin' },
        summary: {
          en: 'Optional, not default. 22 region toggles plus pick-to-hide. If you select it, you must acknowledge how to restore the input area: Cmd+Shift+H / Ctrl+Shift+H, or Settings → UI visibility. The package declares dsh.client.platform: "web"; its README install examples still show --profile desktop. This pack installs it with --profile web. See 待核验.',
          zh: '可选，不默认安装。22 个区域开关与拾取隐藏。若勾选，必须确认如何恢复输入区：Cmd+Shift+H / Ctrl+Shift+H，或设置页「界面显隐」。包声明 dsh.client.platform 为 "web"；其 README 安装示例仍写 --profile desktop。本包按 --profile web 安装。详见待核验。',
        },
      },
    ],
  },
  {
    id: 'file-reference-and-editor',
    exclusive: false,
    skippable: true,
    title: { en: 'File references and external editor', zh: '文件引用与外部编辑器' },
    blurb: {
      en: 'Official @file completion is built in. Community plugins in this class are optional and not defaults. Incremental value of dsh-at-file over official @file is still unverified, so it stays optional.',
      zh: '官方已有组成器 @ 文件补全。此类社区插件仅可选、不进默认。dsh-at-file 相对官方 @file 的增量体验仍待核验，因此保留为可选。',
    },
    items: [
      {
        id: 'official-file-reference',
        role: 'official',
        categoryId: 'file-reference-and-editor',
        official: true,
        installable: false,
        name: { en: 'Official @file completion', zh: '官方 @file 补全' },
        summary: {
          en: 'Host package @deepseek-ai/dsh-file-reference-local, present in the current official web-app bundle (see 待核验). This pack does not install it.',
          zh: '宿主包 @deepseek-ai/dsh-file-reference-local，出现在当前官方 web-app 组合中（详见待核验）。本包不安装。',
        },
      },
      {
        id: 'dsh-at-file',
        role: 'optional',
        categoryId: 'file-reference-and-editor',
        packageName: 'dsh-at-file',
        repository: 'omdsh-dev/dsh-at-file',
        pin: githubPin('dsh-at-file', 'omdsh-dev', 'dsh-at-file', 'v0.7.0', '0.7.0'),
        license: 'MIT',
        installable: true,
        name: { en: 'dsh-at-file', zh: 'dsh-at-file' },
        summary: {
          en: 'Optional, not default. Pin github:omdsh-dev/dsh-at-file#v0.7.0. Do not use stale npm 0.6.3.',
          zh: '可选，不默认。钉 github:omdsh-dev/dsh-at-file#v0.7.0。不要用过期的 npm 0.6.3。',
        },
      },
      {
        id: 'dsh-open-in-vscode',
        role: 'optional',
        categoryId: 'file-reference-and-editor',
        packageName: 'dsh-open-in-vscode',
        repository: 'omdsh-dev/dsh-open-in-vscode',
        pin: githubPin('dsh-open-in-vscode', 'omdsh-dev', 'dsh-open-in-vscode', 'v0.1.6', '0.1.6'),
        license: 'MIT',
        installable: true,
        name: { en: 'dsh-open-in-vscode', zh: 'dsh-open-in-vscode' },
        summary: {
          en: 'Optional, not default. Opens the current workspace in VS Code. The npm package is unpublished; pin github:omdsh-dev/dsh-open-in-vscode#v0.1.6.',
          zh: '可选，不默认。从 Web UI 打开当前工作区到 VS Code。npm 包已 unpublished；钉 github:omdsh-dev/dsh-open-in-vscode#v0.1.6。',
        },
      },
    ],
  },
]

export function allCatalogItems(): CatalogItem[] {
  return CATEGORIES.flatMap(category => [...category.items])
}

export function findCatalogItem(id: string): CatalogItem | undefined {
  return allCatalogItems().find(item => item.id === id)
}

export function installableItems(): CatalogItem[] {
  return allCatalogItems().filter(item => item.installable && item.role !== 'future' && item.role !== 'official')
}

export function futureSlotIds(): readonly string[] {
  return FUTURE_SLOTS.map(slot => slot.id)
}

export function defaultExclusiveSelections(): Record<string, ExclusiveChoice> {
  const next: Record<string, ExclusiveChoice> = {}
  for (const category of CATEGORIES) {
    if (!category.exclusive) continue
    next[category.id] = category.defaultItemId ?? 'skip'
  }
  return next
}

export function defaultSettingsExtras(): string[] {
  return []
}

export function targetForPin(pin: PackagePin): string {
  if (pin.kind === 'github' && pin.github) {
    return `github:${pin.github.owner}/${pin.github.repo}#${pin.github.tag}`
  }
  if (!pin.version) throw new Error(`npm pin for ${pin.packageName} is missing a version`)
  return `${pin.packageName}@${pin.version}`
}

export const NEVER_LATEST_PACKAGES = ['dsh-better-sidebar'] as const
