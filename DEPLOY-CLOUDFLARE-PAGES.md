# Cloudflare Pages 发布说明

## 目标

- 文档站域名：`https://docs.paolu.hudawang.cn`
- 主 API 地址：`https://paolu.hudawang.cn/v1`

## 本地目录

```text
D:\虎哥跑路
```

## GitHub

1. 新建仓库，例如：`paolu-docs`
2. 把 `D:\虎哥跑路` 整个目录推上去
3. 默认分支建议用 `main`

## Cloudflare Pages

1. 进入 Cloudflare Pages
2. 选择 `Connect to Git`
3. 选中你的 `paolu-docs` 仓库
4. 构建参数这样填：

```text
Framework preset: None
Build command: 留空
Build output directory: /
Root directory: /
```

## 自定义域名

绑定：

```text
docs.paolu.hudawang.cn
```

建议保持：

- DNS 代理状态：`Proxied`
- SSL/TLS：`Full` 或 `Strict`

## 后续更新

以后只需要：

1. 改 `D:\虎哥跑路` 里的 HTML / CSS / JS
2. push 到 GitHub
3. Cloudflare Pages 自动重新发布

## 风格约束

- 保持黑色幽默
- 但地址、参数、命令必须绝对准确
- 不要把文档写成谜语，受害者已经够多了
