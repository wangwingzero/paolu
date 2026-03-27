# 虎哥跑路文档站

这是给 `https://docs.paolu.hudawang.cn` 准备的纯静态帮助站。

## 当前结构

```text
.
├─ index.html
├─ quickstart/index.html
├─ clients/index.html
├─ styles/ghost.css
├─ scripts/app.js
└─ _headers
```

## 推荐发布方式

1. 新建 GitHub 仓库，例如 `paolu-docs`
2. 把本目录全部推上去
3. 在 Cloudflare Pages 里连接这个仓库
4. Framework preset 选 `None`
5. Build command 留空
6. Output directory 填 `/`
7. 绑定自定义域名 `docs.paolu.hudawang.cn`

## 后续维护原则

- 继续保持纯静态，不引入没必要的打包器
- 新页面直接按 `目录/index.html` 的形式增加
- 保持黑色幽默语气，但内容只保留最小接入说明
- Base URL 统一写成：

```text
https://paolu.hudawang.cn/v1
```
