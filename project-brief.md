# Project: EtsyToolshed（Etsy 卖家小工具 SaaS）

## 目标
做一个“不靠社媒推广、靠 Google 长尾搜索来人”的英文 SaaS 工具站。
目标用户：Etsy 卖家（数字品 / POD / 手作 / 复古）。
收入模型：免费限次 → Starter $9/mo → Pro $19/mo（Lemon Squeezy 收款）。

## 技术栈（必须遵守）
- Next.js 14 App Router + TypeScript
- Tailwind CSS
- Supabase（Auth + Postgres + RLS）
- Lemon Squeezy（订阅/Webhook）
- Vercel 部署
- AI 功能：Anthropic Claude 或 DeepSeek，通过服务端 API Route 调用，绝不把 Key 放前端
- 搜索流量型页面必须是 SSR/SSG，不能是纯客户端空壳

## 三个核心产品
1. /etsy-profit-calculator
   - 输入：售价、运费、成本、人工、包装、国家、Offsite Ads、销量
   - 输出：Etsy 抽成、净利润、利润率、反推最低售价
   - 费率先 mock，但结构要可配置（US/UK/CA/EU/AU）

2. /etsy-ai-disclosure-checker
   - 先规则引擎（不调 AI 也能出报告）
   - 再提供“AI 重写合规描述”按钮（Pro 功能）
   - 输出：risk score、违规项、Made by/Designed by 建议、AI 披露句

3. /etsy-to-shopify-listing-converter
   - 输入：Etsy title / 13 tags / description
   - 输出：Shopify title、meta title、meta description、alt text、Pinterest pin、TikTok caption
   - 后期可做成 Shopify App（本期不做 OAuth）

## 非目标（不要做）
- 不要做通用“AI 写文案平台”
- 不要做社媒排程、CRM、进销存
- 不要一上来做 Shopify App Store 上架
- 不要使用 any 类型
- 不要在前端放 API Key
- 不要做需要登录才能试用核心工具（先免登录可用，再弹注册）

## 交付顺序
P0：项目脚手架 + 利润计算器可跑
P1：合规检查器（规则版）
P2：Etsy→Shopify 转换器（规则版）
P3：Supabase 限次 + 注册
P4：Lemon Sneezy 订阅 + Webhook
P5：SEO（metadata / FAQ / JSON-LD / sitemap / blog）
P6：Vercel 上线配置

## 验收标准
- npm run dev 能起
- 三个工具页都能用
- 页面源码里有 <h1> 和 SoftwareApplication JSON-LD
- 未登录用户能用基础功能
- 调 AI 的接口必须服务端调用
- 所有金额/费率走 lib/etsyFees.ts，不写死在组件里