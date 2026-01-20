# 2025年中国个人所得税计算器

纯前端实现的个人所得税计算器，支持综合所得年度汇算，适配内网部署场景。

## 功能特性

- 综合所得计税：工资薪金、劳务报酬、稿酬、特许权使用费
- 专项扣除：养老保险、医疗保险、失业保险、住房公积金
- 专项附加扣除：子女教育、继续教育、大病医疗、住房贷款利息、住房租金、赡养老人、婴幼儿照护
- 计税过程明细展示
- 响应式布局，支持桌面/移动端
- 本地离线运行，无需联网

## 本地运行

### 方式一：直接打开（需先构建）

```bash
cd frontend-fortune
npm install
npm run build
```

构建完成后，双击 `frontend-fortune/dist/index.html` 即可运行。

### 方式二：开发模式

```bash
cd frontend-fortune
npm install
npm run dev
```

访问 http://localhost:3000

## Docker 部署

```bash
# 先构建前端
cd frontend-fortune
npm install
npm run build
cd ..

# 启动容器
docker-compose up -d
```

访问 http://localhost:8081

## 内网部署

将 `frontend-fortune/dist/` 目录下的所有文件部署到任意静态文件服务器即可。

## 测试用例

| 输入 | 预期结果 |
|------|----------|
| 工资薪金 180,000 + 三险一金 30,000 + 子女教育 12个月 | 应纳税所得额 78,000，应纳税额 5,280 |
| 工资薪金 300,000 | 应纳税所得额 240,000，应纳税额 31,080 |
| 工资薪金 100,000 | 应纳税所得额 40,000，应纳税额 1,480 |

## 技术栈

- HTML5 + Vanilla JavaScript (ES6+) + SCSS
- Vite 构建工具
- Nginx 静态托管（Docker部署）
