# Mac mini M4：工程配置与启动

2026-09-08。此说明依据当前仓库脚本与官方工具安装文档整理，尚未在用户的 Mac 上执行。当前能运行的是 JavaScript 浏览器原型；Godot/Blender 正式 Demo 尚未创建。

## 1. 这台机器的用途

建议作为常驻开发机：保存工作树，运行代码 AI、Godot 编辑器、Blender 和离线导出工具。按小型二维 Demo 与低分辨率动画帧的目标，可以先用 M4 开始；具体渲染耗时需要首个样板实测，不能从芯片型号直接保证。

先用原生 Apple Silicon 应用。图像/大模型推理可留在云端，机器资源用于编辑、运行和渲染。只有一台 Mac 时，先验证 macOS 本机构建；计划 Steam 首发 Windows 的话，仍需安排 Windows 实机或可交互的 Windows 测试机，跨平台导出不等于已经测过该平台。

## 2. 安装基础环境

如果没有 Apple 命令行开发工具，在终端执行并等待系统安装完成：

```bash
xcode-select --install
```

已安装时无需重装。Homebrew 使用 [官网安装方式](https://brew.sh/)，完成后执行安装器提示的 shell 初始化步骤。Apple Silicon 的默认安装前缀是 `/opt/homebrew`。

然后安装原型所需工具：

```bash
brew install git node@22
export PATH="/opt/homebrew/opt/node@22/bin:$PATH"
node --version
npm --version
```

Node 22 与当前 `.github/workflows/check.yml` 一致。`export` 只作用于当前终端；需要长期生效时，将同一行加入自己的 shell 配置一次。若已有版本管理器，直接用它选择 Node 22，不需要再安装一套。

## 3. 克隆并运行当前原型

```bash
mkdir -p ~/Developer
cd ~/Developer
git clone https://github.com/eldenmoon/deadblood.git
cd deadblood
npm run dev -- --host 127.0.0.1
```

浏览器打开 **http://127.0.0.1:4173/**。终端需要保持运行；`Ctrl+C` 停止服务器。代码/图片由开发服务器直接提供，修改后刷新页面查看。

项目没有第三方 npm 依赖，不需要 `npm install` 或构建步骤。不要双击 `dist/index.html` 启动，应用使用 ES modules，应通过 HTTP 服务加载。

在另一终端或停止服务后，从仓库根目录运行检查：

```bash
npm run check
npm test
```

`npm test` 为逻辑回归。浏览器开发场景入口是 `http://127.0.0.1:4173/?qa`，普通试玩使用无参数地址；受控场景检查不等于完整实玩。

如果 4173 被占用，可执行 `npm run dev -- --host 127.0.0.1 --port 4174` 并打开对应地址。存档按浏览器站点保存：线上存档不会自动进入本地；换主机名或端口也会改变存储来源。需要旧进度时使用原型自带的 JSON 导出/导入。

仓库已克隆时先检查 `git status`，处理自己尚未提交的修改，再用 `git pull --ff-only` 获取更新；不要再次克隆覆盖已有工作树。

## 4. 安装后续制作工具

```bash
brew install --cask godot blender@lts
open -a Godot
open -a Blender
```

这里选择标准版 Godot（建议使用 GDScript）和 Blender LTS。`blender` 与 `blender@lts` 不应同时安装；已安装可用版本时先确认版本，不需要为了本说明更换。

Homebrew 的 cask 会随上游更新。首个可用样板完成时，把实际使用的版本及导出设置记入工程，后续升级作为独立变更处理，避免无意改变导入结果。Godot 的导出模板需要与编辑器版本匹配，可在编辑器的导出模板管理器中安装。

**安装 Godot 后暂时没有可以导入的本项目工程。** `game/project.godot` 必须在 D0 制作时创建。之后通过 Godot 项目管理器导入该文件，并设置/运行主场景；现在执行 `npm run dev` 启动的始终是旧 JS 原型。

Blender 也尚无本项目 `.blend` 文件可打开。下一项资产工作是一具可编辑绑定角色及一次劈砍，不是把现有 WebP 图集导入 Blender 就获得骨骼动画。

## 5. 在其他电脑上使用这台 Mac mini

若希望远程开发，在 Mac mini 的“系统设置 → 通用 → 共享”中配置远程登录，限定到自己的开发账号；使用面板显示的 SSH 地址从主电脑连接。需要查看 Blender/Godot 界面时，可另外开启屏幕共享。

建议代码 AI 在 Mac mini 的仓库工作目录中执行，这样它读写的是实际工程，并能调用本机已安装的工具。当前聊天没有因你提供了机器型号就自动连接到该机器；可执行工具访问需要在你使用的 AI 开发环境中配置。

远程屏幕用于编辑和观察，最终输入延迟与手感尽量在本机显示器、键盘/手柄上判断。为持续渲染单独配置允许长任务运行的电源设置；显示器关闭不应被当成渲染任务已经停止或完成。

## 6. JS 与资产保留策略

保留 `dist/`、`tests/`、`scripts/` 和 Node 启动方式，作为可运行参考。后续新游戏代码进 `game/`，不让 JS 与 Godot 同时承担同一套正式玩法；搬迁前先保持路径稳定。

现有 WebP 保留在原位置。可参考背景气氛、图标语义和玩法数据；不直接采用有持握问题的图集作为正式角色动画。新制作源资产进 `art-src/`，无损序列/元数据作为可复现导出结果。资产分类详见 [assets.md](assets.md)。

不提交 Godot 导入缓存、临时渲染、个人存档或密钥；开始创建 Godot 工程时加入对应忽略规则。大型 `.blend` 等源资产按实际体积配置 Git LFS；不要在已有大文件提交后再误以为安装 LFS 会自动改写旧历史。

下一项任务按 [Demo 制作计划](demo-production-plan.md) 的 D0 执行：同一工程的一次劈砍闭环。上述机器配置和命令说明不代表 D0 已开始或完成。

## 来源

- [Homebrew](https://brew.sh/)；[Node 22](https://formulae.brew.sh/formula/node@22)；[Godot cask](https://formulae.brew.sh/cask/godot)；[Blender LTS cask](https://formulae.brew.sh/cask/blender@lts)。
- [Godot 系统要求](https://docs.godotengine.org/en/stable/about/system_requirements.html)。
- [Apple 远程登录](https://support.apple.com/en-hk/guide/mac-help/mchlp1066/mac)；[Apple 屏幕共享](https://support.apple.com/guide/mac-help/turn-screen-sharing-on-or-off-mh11848/mac)。

查询日期 2026-09-08；软件包和系统界面可能随更新变化，实际版本以本机为准。
