# Coding Workbench Pack / 编程工作台开箱包

English-first DSH Web **installer** plugin. It ships a categorized coding-workbench catalog and installs pinned community plugins with:

```sh
dsh plugin --profile web add <pinned-target>
```

Display name: **Coding Workbench Pack** / 编程工作台开箱包.

Package / repository / plugin id: `dsh-coding-pack` (the name does not include “Codex”).

This pack is **not published to npm** in v0.1. Install it from the GitHub repository or a Draft PR branch. Official built-in capabilities are explained or prompted for enablement; they are never installed as if they were community plugins.

中文说明见下方 [中文](#中文) 一节。路径、包名、命令和版本号保留原文。

## Install this pack

From the GitHub repository (replace the ref if you are testing a PR branch):

```sh
dsh plugin --profile web add github:wzc520pyfm/dsh-coding-pack#feat/v0.1-installer
```

From a local checkout:

```sh
dsh plugin --profile web add link:/path/to/dsh-coding-pack
```

Restart `dsh web` after installing this pack. Then open **Settings → Coding Workbench**, or run `/coding-workbench`.

Uninstall only this pack (child plugins are left in place):

```sh
dsh plugin --profile web remove dsh-coding-pack
```

## How the installer works

1. The settings page (grouped by workbench categories) and the `/coding-workbench` slash command share the same catalog and policy.
2. For each selected installable item the pack runs `dsh plugin --profile web add <pinned target>`. The official CLI forwards that command to pnpm in `$DSH_HOME/profiles/<profile>` (default `~/.dsh/profiles/web`).
3. If the profile already has the same package at a version **greater than or equal to** the pin, the pack **skips** it and marks it Installed. Official `dsh plugin add` idempotency is **not** treated as sufficient on its own; skip / no-upgrade logic lives in this pack (see 待核验).
4. If the installed version is **lower** than the pin, the pack **does not auto-upgrade**. It shows the difference and leaves the decision to you.
5. Installs are idempotent and re-entrant: the pack does not rewrite unrelated profile config, and it will not write `allowBuilds` again for an already-satisfied package.
6. If any child plugin was newly installed, the pack prompts **once** at the end to restart `dsh web` or hard-refresh the UI.

Slash command:

```text
/coding-workbench              # status and plan
/coding-workbench status       # same
/coding-workbench install      # install the current selection
/coding-workbench defaults     # install the v0.1 default set (no optionals)
```

The command name is workbench-specific. This pack does not reuse starter-pack’s `/setup` or its generic group names (Essentials / External / Memory / Efficiency).

## Default catalog (pinned as of 2026-11-10 Asia/Shanghai)

Re-verified against npm and GitHub at implement time. There was **no version delta** versus the confirmed product range page.

| Category | Official (explained, not installed) | Default | Alternative / optional |
| --- | --- | --- | --- |
| Session environment | Built-in session / sidebar chrome | `session-rail@0.1.3` (wzc520pyfm/session-rail) | `dsh-session-rail@0.1.16` (zengxiaolou). Names are easy to confuse; only one of this class. |
| Review and changes | Official changes-review / changed-files card (enable Coding Tools). Package: `@deepseek-ai/dsh-client-ui-deliverables` | `dsh-codex-review-sidebar@0.2.0` (repo wzc520pyfm/dsh-git-review) | `dsh-git-review@0.1.8` (HaoyueQin); `dsh-review-threads@0.1.0` |
| Context insights | Official `@deepseek-ai/dsh-token-meter` | `dsh-context@0.83.1` (Apache-2.0, not relicensed) | Vacant. token-meter is not listed as a plugin alternative. |
| Sidebar workbench | Official file preview and host terminal PTY | `dsh-better-sidebar` pinned by host line | Skip this category |
| Session notes | — | `dsh-handy@0.8.1` | `@timestatic/dsh-session-notebook@0.2.0` (Apache-2.0, not relicensed) |
| Notes / workflow extensions | — | none | `@dong-victor/dsh-better-sidebar-jupyter@0.2.6` (needs better-sidebar); `dsh-flowglass@0.7.4` |
| UI visibility | — | **not installed by default** | `dsh-nb-plugin@1.4.0` (requires restore-input acknowledgement) |
| File references and editor | Official `@deepseek-ai/dsh-file-reference-local` `@file` completion | none | `github:omdsh-dev/dsh-at-file#v0.7.0` (do not use npm 0.6.3); `github:omdsh-dev/dsh-open-in-vscode#v0.1.6` (npm unpublished) |

`dsh-better-sidebar` host-line pins (never `@latest`):

- DSH `0.2.2-rc.1` through later `0.2.2.x` → npm `0.30.1`
- DSH `0.2.1` line → npm `0.28.2`
- If `dsh --version` cannot be read or the line cannot be classified (including `0.2.2-rc.0` and `0.3.0`), this item is **aborted** until you pick a host line manually.

`session-rail` and `dsh-session-rail` are different packages. `dsh-codex-review-sidebar` lives in repo `wzc520pyfm/dsh-git-review` and is **not** the npm package `dsh-git-review`.

The UI does not allow selecting two community plugins of the same exclusive class. If another alternative is already installed, the pack blocks and asks you to uninstall or change the choice.

Jupyter is blocked unless `dsh-better-sidebar` is selected or already installed.

If you check `dsh-nb-plugin`, the pack **must** show a warning: a fresh install hides the composer and the floating button. Restore them with `Cmd+Shift+H` / `Ctrl+Shift+H`, or the Settings page (the plugin’s own “UI visibility” page). The pack will not install it until you acknowledge that.

## Undelivered / 未交付 future slots

These are **visible, not checkable, and not in the default or installable lists**, even if a Draft PR or repository already exists:

- `dsh-suggest-card` — suggested next-step card
- `dsh-worktrunk` — worktree switcher and board
- `dsh-new-workspace` — unified New workspace dialog
- Independent composer-branch plugin (suggested name `dsh-composer-branch`; name not finalized)

## allowBuilds policy

- Prefer prebuilt npm packages so pnpm `prepare` / build scripts are not triggered.
- This pack **never** writes `allowBuilds: '*': true`, and it does **not** copy dsh-starter-pack’s “first blocked build → allow all” behavior.
- If a git-source plugin’s build script is blocked (`ERR_PNPM_IGNORED_BUILDS`), the pack shows a package-name whitelist (that plugin and verified direct build dependencies only). Keys are written only after explicit confirmation, in the documented shape:

  ```yaml
  allowBuilds:
    some-plugin: true
  ```

- A script / package outside that list is refused. The pack will not retry automatically with a wider policy.
- If the profile already has a wildcard written by another tool, the pack **warns** and suggests narrowing it. v0.1 does **not** silently change that policy.
- Field shape is taken from official DSH publish / CLI docs (`pnpm-workspace.yaml` in the profile, boolean values). pnpm placeholder text such as `set this to true or false` is not treated as a decision.

## Conflicts with dsh-starter-pack

If `dsh-starter-pack` is already installed, the pack warns that:

- the two products have different positioning (generic curated pack vs coding-workbench installer);
- they may both try to install `dsh-context` or `dsh-better-sidebar`;
- starter-pack may already have widened `allowBuilds`.

v0.1 **does not uninstall** starter-pack.

session-rail, the review sidebar, better-sidebar, and dsh-context can coexist, but the right sidebar may feel crowded. This pack does not merge those UIs.

## 待核验 conclusions

Verified in this v0.1 implementation (2026-11-10 Asia/Shanghai), unless marked otherwise:

| Item | Conclusion |
| --- | --- |
| Official packages in the default web composition | Current official **master** composition is `base` + `web-app`. `@deepseek-ai/dsh-token-meter` is listed in the official **base** bundle patch; `@deepseek-ai/dsh-file-reference-local` and `@deepseek-ai/dsh-client-ui-deliverables` are listed in the official **web-app** bundle patch. This is **not** a live check of every published DSH release line. If a given release omits one, treat it as “needs enablement / mounting”, not as “always built-in”. |
| `dsh plugin add` official skip / version compare | Official CLI forwards to pnpm and then reconciles `dsh.profile.bundles`. This pack implements its own skip-if-`>=` and no-auto-upgrade logic by reading the profile `package.json` / `node_modules`. Official skip semantics were **not** live-tested here (`dsh` is not on the implementer’s box). |
| `dsh-review-threads` occupancy | The plugin’s own README states it “takes over the official `changes-review` tab and keeps the official turn diff data source.” That is a published claim, **not** a live occupancy check on a running host. Its published `engines.dsh` is `>=0.2.1-rc.1 <0.2.2-0`, so it may not load on a 0.2.2 host. This pack does not hard-claim live takeover. |
| `dsh-handy@0.8.1` add target | **npm** has `0.8.1` (latest). The published tarball includes `lib/index.js`, `lib/client.js`, and `cordis.patch.yml`, and `dsh.client.platform` is `"web"`. The project README still says it is unpublished and shows `dsh plugin --profile desktop add https://github.com/dayutech/dsh-handy`. This pack pins `dsh-handy@0.8.1` for `--profile web`. The live command `dsh plugin --profile web add dsh-handy@0.8.1` was **not** executed (no `dsh` CLI on the box). |
| `dsh-nb-plugin` web vs desktop | The package declares `dsh.client.platform: "web"`. README install examples still use `--profile desktop`. This pack installs it with `--profile web`. Consistency of desktop-profile vs web-profile behavior was **not** live-tested. |
| `dsh-at-file` v0.7.0 vs official `@file` | Incremental UX is **still unverified**. The item stays optional and is not a default. Tag `v0.7.0` exists; npm remains at stale `0.6.3`. The git tag already ships `lib/`. |
| `session-rail` vs `dsh-session-rail` conflict | The pack treats them as one exclusive class and blocks installing one when the other is present. Actual right-sidebar tab / injection conflicts were **not** live-tested. |
| `allowBuilds` field shape | Documented official shape is a `pnpm-workspace.yaml` map of package keys to booleans. This pack reads/writes only that shape and never writes `*`. |
| Reading `dsh --version` | Official CLI help documents `-V, --version`. The pack runs that command (re-invoking the launching `dsh` when possible). This was **not** live-tested against a real CLI on the box; if it fails, the sidebar item aborts until you pick a host line. Default home is `$DSH_HOME` or `~/.dsh` (official home-paths docs). |

## Development

```sh
npm install
npm test
npm run typecheck
npm run build
```

Package version: `0.1.0` (unpublished). License: MIT. This pack calls already-published child plugins and does not relicense them.

## License

MIT. Child plugins keep their own licenses (for example `dsh-context` and `@timestatic/dsh-session-notebook` are Apache-2.0).

---

## 中文

这是一款 DSH Web **安装器**插件：按编程工作台类目给出默认与备选，调用 `dsh plugin --profile web add <钉定目标>` 安装社区子插件。官方内置能力只说明或提示启用，不写成「需由本包安装的插件」。

**安装本包（尚未发布到 npm，请从 GitHub / PR 分支安装）：**

```sh
dsh plugin --profile web add github:wzc520pyfm/dsh-coding-pack#feat/v0.1-installer
```

安装后重启 `dsh web`，打开 **设置 → 编程工作台**，或运行 `/coding-workbench`。

**卸载本包（不会卸载已装上的子插件）：**

```sh
dsh plugin --profile web remove dsh-coding-pack
```

已装且版本不低于钉定版则跳过并标成 Installed；已装但低于钉定版**不会自动升级**。同类社区插件只能选一个。`dsh-better-sidebar` 必须按宿主线钉版本（0.2.2-rc.1+ 用 0.30.1，0.2.1 线用 0.28.2），禁止 `@latest`；读不到宿主版本时请手动选线。

`dsh-nb-plugin` 不进默认。若勾选，必须确认可用 `Cmd+Shift+H` / `Ctrl+Shift+H` 或设置页恢复输入区。

未来槽位 `dsh-suggest-card`、`dsh-worktrunk`、`dsh-new-workspace`、组成器分支插件（主推名建议 `dsh-composer-branch`，名未定）只显示「未交付」，不可勾选，即使已有 Draft PR 也不得列为可安装默认。

本包**从不**写入 `allowBuilds '*'`，也不会在首次被拦时放开通配。若档案里已被其他工具（例如 dsh-starter-pack）写入通配，只会提示风险，不会暗默改掉。检测到已装 `dsh-starter-pack` 时提示定位不同与可能重复安装，但不会自动卸载它。

子插件许可保持原样：`dsh-context` 与 `@timestatic/dsh-session-notebook` 为 Apache-2.0。
