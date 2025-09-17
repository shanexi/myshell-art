# myshell-art

锁定 pnpm 依赖，因为对 nx（锁 15.9.7） 有些定制。没有必要升级这些基建。

可以在 `.zshrc` 里设置 `alias`

```
alias pnpm="pnpm dlx pnpm@9"
alias pnpm7="pnpm dlx pnpm@7"
alias pnpm9="pnpm dlx pnpm@9"
```

1. pnpm7
2. nx 15.9.7

## 安装依赖

```
pnpm@7 i
```

所有 dependencies 都安装在 `package.json`，而且可以不用区分 dependencies 和 devDependencies。

> 默认就放到 dependencies，某些高级场景会区分 devDependencies。

因为**开发**和**发布**分开，nx 会自动根据 lib 的 import 解析出 dependencies。

> 这也是为什么锁 pnpm@7 的原因，配合拆分出合适的 pnpm-lock.yaml。
> 另外，这也是和 turbo.json 比较大的区别。nx 看起来是多个项目，实际上一个项目。虽然 monorepo 有好处，但是一个项目也有好处。nx 是做到了兼有之。

## 快速开发

以开发 `agent-ui` 为例,

```
pnpm exec nx run agent-ui:storybook
```

你可以安装 [nx vscode 插件](https://nx.dev/getting-started/editor-setup) 这样不用打这么多字。

> 不过我习惯用命令行。我可以通过 ctrl-R 搜索历史命令。相比鼠标点击似乎更快。

## 集成到 ShellAgentInternal/myshell_web_react

```
pnpm exec nx run agent-ui:local-publish
```

这块主要参考 [yalc](https://github.com/wclr/yalc)

next

```
- libs
  // 集成层 业务测试
  - agent-chat
  - preview-chat
  // 核心层，高保
  - core // 一个人负责
  // 插件层，分工负责
  - plugins
  - tailwind-cfg // design token 层
```

按照分工原则，不应该出现 ui lib。但是可以 storybook 统一进行 test review。
