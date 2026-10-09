export type Language = "en" | "zh";

/**
 * 全站翻译字典。
 * 命名空间：nav / home / profit / compliance / converter / pricing /
 *          login / forms / blog / blog posts / common
 * FAQ 用 faq.<page>.<i>.q / .a 的索引形式。
 */
export const translations: Record<Language, Record<string, string>> = {
  en: {
    // nav
    "nav.pricing": "Pricing",
    "nav.signIn": "Sign in",
    "nav.blog": "Blog",
    "nav.home": "Home",
    "faq.title": "Frequently Asked Questions",
    "blog.related": "Related reading",
    "blog.relatedFees": "Etsy Fees 2026: Complete Breakdown",
    "blog.relatedAi": "Etsy AI Disclosure Rules 2026",
    "blog.relatedMargin": "Etsy vs Shopify Profit Margin",
    "blog.relatedProfitTool": "Try the Etsy Profit Calculator",
    "blog.relatedComplianceTool": "Try the AI Disclosure Checker",
    "blog.relatedConverterTool": "Try the Etsy-to-Shopify Converter",
    "lang.switch": "中文",

    // site
    "site.title": "EtsyToolshed — Free Tools for Etsy Sellers",

    // home
    "home.title": "Tools for Etsy Sellers",
    "home.subtitle":
      "Simple, free tools to calculate profit, stay compliant, and move your listings off Etsy — no account required to start.",
    "home.tools.profit.title": "Etsy Profit Calculator",
    "home.tools.profit.desc":
      "See your true profit after Etsy fees, costs, labor, and packaging.",
    "home.tools.compliance.title": "AI Disclosure Checker",
    "home.tools.compliance.desc":
      "Check if your listing complies with Etsy's AI disclosure policy.",
    "home.tools.converter.title": "Etsy → Shopify Converter",
    "home.tools.converter.desc":
      "Turn Etsy listings into Shopify-optimized copy and social captions.",

    // tool switcher (short labels)
    "tools.profit": "Profit",
    "tools.compliance": "AI Disclosure",
    "tools.converter": "Converter",

    // common
    "common.home": "Home",
    "common.blog": "Blog",
    "common.readArticle": "Read article →",

    // profit calculator page
    "profit.h1": "Etsy Profit Calculator",
    "profit.subtitle":
      "Enter your listing details to see the real Etsy fees, your net profit, profit margin, and the minimum price you should charge to break even.",
    "profit.faq.0.q": "What fees does Etsy charge sellers?",
    "profit.faq.0.a":
      "Etsy charges a $0.20 listing fee per item, a 6.5% transaction fee on the item price plus shipping, a payment processing fee (about 3% + $0.25 in the US), and an Offsite Ads fee (15% or 12% depending on your annual sales) when a sale comes from an offsite ad.",
    "profit.faq.1.q": "How is the break-even price calculated?",
    "profit.faq.1.a":
      "Break-even price is the sale price at which your revenue exactly covers all Etsy fees plus your product costs, labor, and packaging — resulting in $0 net profit.",
    "profit.faq.2.q": "Does this calculator support my country?",
    "profit.faq.2.a":
      "Currently it supports US, UK, CA, EU, and AU fee structures. Payment processing fees and currency differ by country.",
    "profit.faq.3.q": "Do I need to sign up to use it?",
    "profit.faq.3.a":
      "No. The Etsy profit calculator is free to use without an account. Create an account only if you want higher usage limits and extra tools.",

    // compliance checker page
    "compliance.h1": "Etsy AI Disclosure Checker",
    "compliance.subtitle":
      "Paste your Etsy listing title and description, tell us whether you used AI, and get a compliance risk score with actionable suggestions.",
    "compliance.disclaimer": "Not legal advice. Based on Etsy Seller Handbook.",
    "compliance.faq.0.q": "Do I have to disclose AI use on Etsy?",
    "compliance.faq.0.a":
      "Yes. Etsy requires sellers to disclose when AI or AI-assisted tools are used to create listing content, including images, text, and designs. You can disclose in the listing description and by selecting the correct attribution.",
    "compliance.faq.1.q": "What's the difference between 'Made by' and 'Designed by'?",
    "compliance.faq.1.a":
      "'Made by' is for items you physically create. If you use AI to generate the work, you are the designer of the prompt/concept, not the maker — so select 'Designed by'.",
    "compliance.faq.2.q": "What should my AI disclosure say?",
    "compliance.faq.2.a":
      "A simple sentence is enough, for example: 'This design was created with the assistance of AI tools' or 'AI-generated artwork, curated and edited by the seller.'",
    "compliance.faq.3.q": "Is this legal advice?",
    "compliance.faq.3.a":
      "No. This tool is based on Etsy's public Seller Handbook and is for informational purposes only. It is not legal advice. For legal questions, consult a qualified attorney.",

    // converter page
    "converter.h1": "Etsy → Shopify Listing Converter",
    "converter.subtitle":
      "Paste your Etsy title, tags, and description to instantly generate Shopify-optimized title, meta tags, alt text, and social media copy.",
    "converter.faq.0.q": "Why is my Shopify title shorter than my Etsy title?",
    "converter.faq.0.a":
      "Etsy titles can be up to 140 characters and are often keyword-stuffed. Shopify product titles display best under 70 characters in search results, so the converter keeps your most important keywords (which Etsy puts first) and trims the rest cleanly.",
    "converter.faq.1.q": "What is the meta description for?",
    "converter.faq.1.a":
      "The meta description appears in Google search results under your page title. It should be under 155 characters and include a call to action so shoppers click through to your Shopify store.",
    "converter.faq.2.q": "Does this migrate images too?",
    "converter.faq.2.a":
      "No. This tool converts the text copy (title, description, tags) into Shopify-optimized versions. You will still need to upload your product images to Shopify manually.",
    "converter.faq.3.q": "Can I convert multiple listings at once?",
    "converter.faq.3.a":
      "The free version converts one listing at a time. Bulk CSV conversion for multiple listings is a Pro feature coming soon.",

    // pricing
    "pricing.h1": "Pricing",
    "pricing.subtitle": "Start free. Upgrade when you need more.",
    "pricing.plan.free": "Free",
    "pricing.plan.starter": "Starter",
    "pricing.plan.pro": "Pro",
    "pricing.feature.unlimited": "Unlimited tool usage",
    "pricing.feature.dailyLimit": "{n} tool uses / day",
    "pricing.feature.aiRewrite": "AI description rewriting",
    "pricing.feature.bulkCsv": "Bulk CSV convert (soon)",
    "pricing.current": "Current plan",
    "pricing.upgrade": "Upgrade",
    "pricing.loading": "Loading…",
    "pricing.freeForever": "Free forever",
    "pricing.footer":
      "Payments securely processed by Lemon Squeezy. Cancel anytime.",

    // login
    "login.h1": "Sign up or sign in",
    "login.subtitle":
      "Free accounts get 10 uses per day per tool. No credit card required.",
    "login.signup": "Sign up",
    "login.signin": "Sign in",
    "login.email": "Email",
    "login.password": "Password",
    "login.createAccount": "Create account",
    "login.pleaseWait": "Please wait…",
    "login.supabaseNotConfigured":
      "Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local.",
    "login.confirmEmail":
      "Check your email for a confirmation link, then sign in.",
    "login.authFailed": "Authentication failed",

    // profit form
    "forms.profit.salePrice": "Sale Price",
    "forms.profit.shipping": "Shipping charged to buyer",
    "forms.profit.cost": "Product cost",
    "forms.profit.labor": "Labor",
    "forms.profit.packaging": "Packaging",
    "forms.profit.salesVolume": "Sales volume (units)",
    "forms.profit.country": "Country",
    "forms.profit.offsiteAds": "Offsite Ads enabled",
    "forms.profit.highVolume": "Annual sales over $10,000 (12% rate)",
    "forms.profit.calculate": "Calculate Profit",
    "forms.profit.calculating": "Calculating…",
    "forms.profit.networkError": "Network error. Please try again.",
    "forms.profit.results": "Results",
    "forms.profit.revenue": "Revenue",
    "forms.profit.netProfit": "Net Profit",
    "forms.profit.profitMargin": "Profit Margin",
    "forms.profit.breakEven": "Break-even Price",
    "forms.profit.minPrice30": "Min Price (30% margin)",
    "forms.profit.feeBreakdown": "Etsy Fee Breakdown",
    "forms.profit.transactionFee": "Transaction fee (6.5%)",
    "forms.profit.listingFee": "Listing fee",
    "forms.profit.paymentProcessing": "Payment processing",
    "forms.profit.offsiteAdsFee": "Offsite ads",
    "forms.profit.totalFees": "Total Etsy fees",

    // compliance form
    "forms.compliance.title": "Title",
    "forms.compliance.chars": "{n} characters",
    "forms.compliance.description": "Description",
    "forms.compliance.usesAi":
      "I used AI to create this listing (images, text, or designs)",
    "forms.compliance.attribution": "Listing attribution",
    "forms.compliance.check": "Check Compliance",
    "forms.compliance.checking": "Checking…",
    "forms.compliance.networkError": "Network error. Please try again.",
    "forms.compliance.report": "Compliance Report",
    "forms.compliance.riskLevel": "Risk level",
    "forms.compliance.issuesFound": "Issues found",
    "forms.compliance.noIssues":
      "No compliance issues detected. Your listing looks good!",
    "forms.compliance.suggestions": "Suggestions",
    "forms.compliance.disclaimer":
      "Not legal advice. Based on Etsy Seller Handbook.",
    "forms.compliance.needAi":
      "Rewrite description with AI (Pro feature)",
    "forms.compliance.rewriteResult": "AI-rewritten description",
    "forms.compliance.copy": "Copy",
    "forms.compliance.copied": "Copied!",
    "forms.compliance.attr.made_by": "Made by",
    "forms.compliance.attr.designed_by": "Designed by",
    "forms.compliance.attr.production_partner": "Production partner",
    "forms.compliance.attr.not_listed": "Not listed",

    // converter form
    "forms.converter.etsyTitle": "Etsy title",
    "forms.converter.etsyTags": "Etsy tags (comma or newline separated, max 13)",
    "forms.converter.tagsCount": "{n}/13 tags",
    "forms.converter.etsyDescription": "Etsy description",
    "forms.converter.convert": "Convert to Shopify",
    "forms.converter.converting": "Converting…",
    "forms.converter.tagsTooMany":
      "Etsy allows up to 13 tags. Please remove some.",
    "forms.converter.networkError": "Network error. Please try again.",
    "forms.converter.shopifyCopy": "Shopify-optimized copy",
    "forms.converter.shopifyTitle": "Shopify title",
    "forms.converter.metaTitle": "Meta title (SEO)",
    "forms.converter.metaDescription": "Meta description",
    "forms.converter.altText": "Image alt text",
    "forms.converter.pinterest": "Pinterest pin",
    "forms.converter.tiktok": "TikTok caption",
    "forms.converter.copy": "Copy",
    "forms.converter.copied": "Copied!",

    // blog index
    "blog.h1": "Etsy Seller Blog",
    "blog.subtitle":
      "Practical guides on Etsy fees, AI policy, and selling on Shopify.",
    "blog.post.fees.title":
      "Etsy Fees 2026: A Complete Breakdown (And How to Price for Profit)",
    "blog.post.fees.excerpt":
      "Listing fees, transaction fees, payment processing, offsite ads — every Etsy fee explained with formulas and a pricing strategy that keeps your margin healthy.",
    "blog.post.ai.title": "Etsy AI Disclosure Rules 2026: What Sellers Must Do",
    "blog.post.ai.excerpt":
      "Etsy requires AI disclosure on listings. Here is exactly what to say, where to say it, and how to pick the right attribution without getting flagged.",
    "blog.post.margin.title":
      "Etsy vs Shopify Profit Margin: Where Do You Keep More Money?",
    "blog.post.margin.excerpt":
      "A side-by-side fee and margin comparison between Etsy and Shopify, plus how to convert your Etsy copy into Shopify-ready listings.",
    "blog.post.fees.category": "Fees & Pricing",
    "blog.post.ai.category": "Etsy Policy",
    "blog.post.margin.category": "Etsy vs Shopify",

    // fees blog faq
    "feesBlog.faq.0.q": "How much does Etsy take per sale?",
    "feesBlog.faq.0.a":
      "Etsy typically takes 6.5% transaction fee plus ~3% + $0.25 payment processing, plus a $0.20 listing fee. Offsite ads add 12–15% when applicable.",
    "feesBlog.faq.1.q": "Does Etsy charge for listing renewal?",
    "feesBlog.faq.1.a":
      "Yes. When an item sells, Etsy auto-renews the listing and charges another $0.20 listing fee.",
    "feesBlog.faq.2.q": "What is the Offsite Ads fee?",
    "feesBlog.faq.2.a":
      "It's a 15% fee (12% for sellers with >$10k annual sales) charged only on orders that come from Etsy's offsite ads.",
    "feesBlog.faq.3.q": "How do I price to stay profitable?",
    "feesBlog.faq.3.a":
      "Sum all fees and costs, find your break-even price, then add your target profit margin on top.",

    // ai blog faq
    "aiBlog.faq.0.q": "Do I have to disclose AI use on Etsy?",
    "aiBlog.faq.0.a":
      "Yes. Since 2024, Etsy requires disclosure when AI or AI-assisted tools create any listing content.",
    "aiBlog.faq.1.q": "What should my disclosure say?",
    "aiBlog.faq.1.a":
      "A simple sentence such as 'This design was created with the assistance of AI tools' is sufficient.",
    "aiBlog.faq.2.q": "Should I pick 'Made by' or 'Designed by'?",
    "aiBlog.faq.2.a":
      "If AI generates the work, pick 'Designed by'. Use 'Made by' only for items you physically create.",
    "aiBlog.faq.3.q": "What happens if I don't disclose?",
    "aiBlog.faq.3.a":
      "Listings may be removed, your account reviewed, and in severe cases suspended.",

    // margin blog faq
    "marginBlog.faq.0.q": "Which is more profitable, Etsy or Shopify?",
    "marginBlog.faq.0.a":
      "At higher volume Shopify usually wins on margin; at low volume Etsy avoids the monthly subscription cost.",
    "marginBlog.faq.1.q": "Does Shopify charge listing fees?",
    "marginBlog.faq.1.a":
      "No. Shopify charges a monthly subscription plus payment processing, but no per-listing or transaction fee.",
    "marginBlog.faq.2.q": "How do I convert my Etsy copy to Shopify?",
    "marginBlog.faq.2.a":
      "Rewrite your title to under 70 characters, tighten the description, and add a clear call to action.",
    "marginBlog.faq.3.q": "Is migration worth it for small sellers?",
    "marginBlog.faq.3.a":
      "It depends on volume and margins. Run the numbers for your shop before committing to a monthly plan.",

    // page metadata (title / description)
    "meta.home.title": "EtsyToolshed — Free Tools for Etsy Sellers",
    "meta.home.description":
      "Free tools for Etsy sellers: profit calculator, AI disclosure checker, and Etsy-to-Shopify listing converter. No account required to start.",
    "meta.profit.title":
      "Etsy Profit Calculator — Calculate Your True Profit After Fees",
    "meta.profit.description":
      "Free Etsy profit calculator. Enter your sale price, costs, labor, packaging, and country to see Etsy fees, net profit, margin, and the minimum price to break even.",
    "meta.compliance.title":
      "Etsy AI Disclosure Checker — Check If Your Listing Complies",
    "meta.compliance.description":
      "Free Etsy AI disclosure checker. Paste your title and description to get a risk score, compliance issues, and suggestions based on Etsy's AI policy.",
    "meta.converter.title":
      "Etsy to Shopify Listing Converter — Turn Etsy Copy Into Shopify SEO Copy",
    "meta.converter.description":
      "Free Etsy to Shopify listing converter. Paste your Etsy title, tags, and description to get Shopify-optimized title, meta title, meta description, alt text, Pinterest pin, and TikTok caption.",
    "meta.pricing.title": "Pricing",
    "meta.pricing.description":
      "Choose a plan: Free, Starter $9/mo, or Pro $19/mo. Start free, upgrade when you need more.",
    "meta.login.title": "Sign up / Sign in",
    "meta.login.description":
      "Create an account or sign in to EtsyToolshed for higher usage limits.",
    "meta.blog.title": "Etsy Seller Blog — Fees, AI Policy, and Shopify Tips",
    "meta.blog.description":
      "Guides for Etsy sellers: fee breakdowns, AI disclosure rules, Etsy vs Shopify margins, and more.",
    "meta.feesPost.title":
      "Etsy Fees 2026: A Complete Breakdown (And How to Price for Profit)",
    "meta.feesPost.description":
      "Every Etsy seller fee explained: listing, transaction, payment processing, offsite ads. Learn the formula and price for a healthy profit margin.",
    "meta.aiPost.title": "Etsy AI Disclosure Rules 2026: What Sellers Must Do",
    "meta.aiPost.description":
      "Etsy requires AI disclosure on listings. Learn what to disclose, where to disclose it, and how to pick the right attribution without risking your account.",
    "meta.marginPost.title":
      "Etsy vs Shopify Profit Margin: Where Do You Keep More Money?",
    "meta.marginPost.description":
      "A side-by-side fee and profit margin comparison between Etsy and Shopify, plus how to convert your Etsy listings into Shopify-optimized copy.",

    // not found page
    "notFound.title": "Page not found",
    "notFound.description":
      "The page you're looking for doesn't exist or has been moved.",
    "notFound.backHome": "Back to home",
  },

  zh: {
    // nav
    "nav.pricing": "定价",
    "nav.signIn": "登录",
    "nav.blog": "博客",
    "nav.home": "首页",
    "faq.title": "常见问题",
    "blog.related": "相关阅读",
    "blog.relatedFees": "Etsy 2026 手续费：完整拆解",
    "blog.relatedAi": "Etsy 2026 AI 披露规则",
    "blog.relatedMargin": "Etsy vs Shopify 利润率对比",
    "blog.relatedProfitTool": "试用 Etsy 利润计算器",
    "blog.relatedComplianceTool": "试用 AI 披露合规检查器",
    "blog.relatedConverterTool": "试用 Etsy 转 Shopify 转换器",
    "lang.switch": "EN",

    // site
    "site.title": "EtsyToolshed — Etsy 卖家免费工具",

    // home
    "home.title": "面向 Etsy 卖家的工具",
    "home.subtitle":
      "简单免费的工具，帮你计算利润、保持合规、把商品搬到 Etsy 之外——无需注册即可开始使用。",
    "home.tools.profit.title": "Etsy 利润计算器",
    "home.tools.profit.desc": "扣除 Etsy 手续费、成本、人工和包装后，看你的真实利润。",
    "home.tools.compliance.title": "AI 披露合规检查器",
    "home.tools.compliance.desc": "检查你的商品是否符合 Etsy 的 AI 披露政策。",
    "home.tools.converter.title": "Etsy → Shopify 转换器",
    "home.tools.converter.desc": "把 Etsy 商品文案转成适合 Shopify 的文案和社交媒体标题。",

    // 工具切换器（短标签）
    "tools.profit": "利润",
    "tools.compliance": "AI 披露",
    "tools.converter": "转换器",

    // common
    "common.home": "首页",
    "common.blog": "博客",
    "common.readArticle": "阅读全文 →",

    // profit calculator page
    "profit.h1": "Etsy 利润计算器",
    "profit.subtitle":
      "输入商品信息，查看真实的 Etsy 手续费、净利润、利润率，以及保本所需的最低售价。",
    "profit.faq.0.q": "Etsy 向卖家收取哪些费用？",
    "profit.faq.0.a":
      "Etsy 收取每件 $0.20 的上架费、商品价+运费的 6.5% 交易费、支付处理费（美国约 3% + $0.25），以及站外广告费（年销售额不同为 15% 或 12%，仅当订单来自站外广告时收取）。",
    "profit.faq.1.q": "保本价格是怎么计算的？",
    "profit.faq.1.a":
      "保本价格是指收入恰好覆盖所有 Etsy 手续费加上商品成本、人工和包装时的售价，此时净利润为 $0。",
    "profit.faq.2.q": "这个计算器支持我的国家吗？",
    "profit.faq.2.a":
      "目前支持美国、英国、加拿大、欧盟和澳大利亚的费率结构。支付处理费率和货币因国家而异。",
    "profit.faq.3.q": "需要注册才能使用吗？",
    "profit.faq.3.a":
      "不需要。Etsy 利润计算器无需账号即可免费使用。只有在你需要更高使用额度和更多工具时才需要注册。",

    // compliance checker page
    "compliance.h1": "Etsy AI 披露合规检查器",
    "compliance.subtitle":
      "粘贴你的 Etsy 商品标题和描述，告诉我们是否使用了 AI，即可获得合规风险评分和可操作的建议。",
    "compliance.disclaimer": "非法律建议。基于 Etsy 卖家手册。",
    "compliance.faq.0.q": "在 Etsy 上必须披露使用 AI 吗？",
    "compliance.faq.0.a":
      "是的。Etsy 要求卖家在使用 AI 或 AI 辅助工具创建商品内容（包括图片、文案、设计）时进行披露。你可以在商品描述中披露，并选择正确的归属方式。",
    "compliance.faq.1.q": "「Made by」和「Designed by」有什么区别？",
    "compliance.faq.1.a":
      "「Made by」用于你亲手制作的商品。如果你使用 AI 生成内容，你是提示词/概念的设计者而非制作者，因此应选择「Designed by」。",
    "compliance.faq.2.q": "AI 披露应该写什么？",
    "compliance.faq.2.a":
      "一句话即可，例如：「本设计使用 AI 工具辅助创建」或「AI 生成的作品，由卖家策划和编辑」。",
    "compliance.faq.3.q": "这是法律建议吗？",
    "compliance.faq.3.a":
      "不是。本工具基于 Etsy 公开的卖家手册，仅供参考，不构成法律建议。法律问题请咨询合格的律师。",

    // converter page
    "converter.h1": "Etsy → Shopify 商品转换器",
    "converter.subtitle":
      "粘贴你的 Etsy 标题、标签和描述，即可生成适合 Shopify 的标题、Meta 标签、图片 Alt 文案和社交媒体文案。",
    "converter.faq.0.q": "为什么 Shopify 标题比 Etsy 标题短？",
    "converter.faq.0.a":
      "Etsy 标题最多 140 字符，往往堆砌关键词。Shopify 商品标题在搜索结果中最好不超过 70 字符，因此转换器保留最重要的关键词（Etsy 会把它们放在前面），并干净地截断其余部分。",
    "converter.faq.1.q": "Meta 描述有什么用？",
    "converter.faq.1.a":
      "Meta 描述出现在 Google 搜索结果的页面标题下方。应控制在 155 字符以内，并包含行动号召，促使购物者点击进入你的 Shopify 店铺。",
    "converter.faq.2.q": "这个工具也会迁移图片吗？",
    "converter.faq.2.a":
      "不会。本工具只转换文字文案（标题、描述、标签）为适合 Shopify 的版本。你仍需手动把商品图片上传到 Shopify。",
    "converter.faq.3.q": "可以一次转换多个商品吗？",
    "converter.faq.3.a":
      "免费版一次转换一个商品。批量 CSV 转换多个商品是即将推出的 Pro 功能。",

    // pricing
    "pricing.h1": "定价",
    "pricing.subtitle": "免费开始，需要更多时再升级。",
    "pricing.plan.free": "免费版",
    "pricing.plan.starter": "入门版",
    "pricing.plan.pro": "专业版",
    "pricing.feature.unlimited": "不限工具使用次数",
    "pricing.feature.dailyLimit": "每天 {n} 次工具使用",
    "pricing.feature.aiRewrite": "AI 描述重写",
    "pricing.feature.bulkCsv": "批量 CSV 转换（即将推出）",
    "pricing.current": "当前套餐",
    "pricing.upgrade": "升级",
    "pricing.loading": "加载中…",
    "pricing.freeForever": "永久免费",
    "pricing.footer": "支付由 Lemon Squeezy 安全处理，随时可取消。",

    // login
    "login.h1": "注册或登录",
    "login.subtitle": "免费账号每个工具每天可使用 10 次，无需信用卡。",
    "login.signup": "注册",
    "login.signin": "登录",
    "login.email": "邮箱",
    "login.password": "密码",
    "login.createAccount": "创建账号",
    "login.pleaseWait": "请稍候…",
    "login.supabaseNotConfigured":
      "Supabase 未配置。请在 .env.local 中设置 NEXT_PUBLIC_SUPABASE_URL 和 NEXT_PUBLIC_SUPABASE_ANON_KEY。",
    "login.confirmEmail": "请查收邮箱中的确认链接，然后登录。",
    "login.authFailed": "认证失败",

    // profit form
    "forms.profit.salePrice": "售价",
    "forms.profit.shipping": "向买家收取的运费",
    "forms.profit.cost": "商品成本",
    "forms.profit.labor": "人工",
    "forms.profit.packaging": "包装",
    "forms.profit.salesVolume": "销量（件）",
    "forms.profit.country": "国家",
    "forms.profit.offsiteAds": "启用站外广告",
    "forms.profit.highVolume": "年销售额超过 $10,000（12% 费率）",
    "forms.profit.calculate": "计算利润",
    "forms.profit.calculating": "计算中…",
    "forms.profit.networkError": "网络错误，请重试。",
    "forms.profit.results": "计算结果",
    "forms.profit.revenue": "收入",
    "forms.profit.netProfit": "净利润",
    "forms.profit.profitMargin": "利润率",
    "forms.profit.breakEven": "保本价格",
    "forms.profit.minPrice30": "最低价格（30% 利润率）",
    "forms.profit.feeBreakdown": "Etsy 手续费明细",
    "forms.profit.transactionFee": "交易费（6.5%）",
    "forms.profit.listingFee": "上架费",
    "forms.profit.paymentProcessing": "支付处理费",
    "forms.profit.offsiteAdsFee": "站外广告费",
    "forms.profit.totalFees": "Etsy 手续费合计",

    // compliance form
    "forms.compliance.title": "标题",
    "forms.compliance.chars": "{n} 字符",
    "forms.compliance.description": "描述",
    "forms.compliance.usesAi": "我使用 AI 创建了此商品（图片、文案或设计）",
    "forms.compliance.attribution": "商品归属",
    "forms.compliance.check": "检查合规",
    "forms.compliance.checking": "检查中…",
    "forms.compliance.networkError": "网络错误，请重试。",
    "forms.compliance.report": "合规报告",
    "forms.compliance.riskLevel": "风险等级",
    "forms.compliance.issuesFound": "发现的问题",
    "forms.compliance.noIssues": "未发现合规问题，你的商品看起来不错！",
    "forms.compliance.suggestions": "建议",
    "forms.compliance.disclaimer": "非法律建议。基于 Etsy 卖家手册。",
    "forms.compliance.needAi": "用 AI 重写描述（Pro 功能）",
    "forms.compliance.rewriteResult": "AI 重写后的描述",
    "forms.compliance.copy": "复制",
    "forms.compliance.copied": "已复制！",
    "forms.compliance.attr.made_by": "我制作",
    "forms.compliance.attr.designed_by": "我设计",
    "forms.compliance.attr.production_partner": "生产合作方",
    "forms.compliance.attr.not_listed": "未列出",

    // converter form
    "forms.converter.etsyTitle": "Etsy 标题",
    "forms.converter.etsyTags": "Etsy 标签（用逗号或换行分隔，最多 13 个）",
    "forms.converter.tagsCount": "{n}/13 个标签",
    "forms.converter.etsyDescription": "Etsy 描述",
    "forms.converter.convert": "转换为 Shopify",
    "forms.converter.converting": "转换中…",
    "forms.converter.tagsTooMany": "Etsy 最多允许 13 个标签，请删除部分标签。",
    "forms.converter.networkError": "网络错误，请重试。",
    "forms.converter.shopifyCopy": "适合 Shopify 的文案",
    "forms.converter.shopifyTitle": "Shopify 标题",
    "forms.converter.metaTitle": "Meta 标题（SEO）",
    "forms.converter.metaDescription": "Meta 描述",
    "forms.converter.altText": "图片 Alt 文案",
    "forms.converter.pinterest": "Pinterest Pin",
    "forms.converter.tiktok": "TikTok 文案",
    "forms.converter.copy": "复制",
    "forms.converter.copied": "已复制！",

    // blog index
    "blog.h1": "Etsy 卖家博客",
    "blog.subtitle": "关于 Etsy 手续费、AI 政策和在 Shopify 上销售的实用指南。",
    "blog.post.fees.title": "Etsy 2026 手续费：完整拆解及如何定价盈利",
    "blog.post.fees.excerpt":
      "上架费、交易费、支付处理费、站外广告费——逐项拆解 Etsy 费用，附公式和保持健康利润率的定价策略。",
    "blog.post.ai.title": "Etsy 2026 AI 披露规则：卖家必须做什么",
    "blog.post.ai.excerpt":
      "Etsy 要求在商品中披露 AI 使用。本文告诉你该说什么、在哪里说，以及如何选择正确的归属方式而不被标记。",
    "blog.post.margin.title": "Etsy vs Shopify 利润率：在哪里能留住更多钱？",
    "blog.post.margin.excerpt":
      "Etsy 与 Shopify 的费用和利润率并排对比，以及如何把你的 Etsy 文案转成可用于 Shopify 的商品文案。",
    "blog.post.fees.category": "费用与定价",
    "blog.post.ai.category": "Etsy 政策",
    "blog.post.margin.category": "Etsy vs Shopify",

    // 费用博客 FAQ
    "feesBlog.faq.0.q": "Etsy 每次成交抽成多少？",
    "feesBlog.faq.0.a":
      "Etsy 通常收取 6.5% 交易费 + 约 3% + $0.25 支付处理费，再加 $0.20 上架费。若适用站外广告，还会加 12%–15%。",
    "feesBlog.faq.1.q": "Etsy 会对自动续费上架收费吗？",
    "feesBlog.faq.1.a":
      "是的。商品售出后，Etsy 会自动续费上架并再次收取 $0.20 上架费。",
    "feesBlog.faq.2.q": "什么是站外广告费？",
    "feesBlog.faq.2.a":
      "这是仅对来自 Etsy 站外广告的订单收取的 15% 费用（年销售额超 1 万美元的卖家为 12%）。",
    "feesBlog.faq.3.q": "如何定价才能保持盈利？",
    "feesBlog.faq.3.a":
      "把所有费用和成本加起来，算出保本价，然后在此基础上加上你想要的利润率。",

    // AI 博客 FAQ
    "aiBlog.faq.0.q": "我必须在 Etsy 上披露使用 AI 吗？",
    "aiBlog.faq.0.a":
      "是的。自 2024 年起，只要 AI 或 AI 辅助工具参与生成任何商品内容，Etsy 就要求披露。",
    "aiBlog.faq.1.q": "我的披露文案应该怎么写？",
    "aiBlog.faq.1.a":
      "一句简单的话即可，例如「本设计使用 AI 工具辅助创作」。",
    "aiBlog.faq.2.q": "应该选「由我制作」还是「由我设计」？",
    "aiBlog.faq.2.a":
      "若由 AI 生成作品，选「由我设计」。只有你亲手制作的商品才选「由我制作」。",
    "aiBlog.faq.3.q": "不披露会有什么后果？",
    "aiBlog.faq.3.a":
      "商品可能被下架，账号会被审核，严重情况下会被封禁。",

    // 利润率博客 FAQ
    "marginBlog.faq.0.q": "Etsy 和 Shopify 哪个利润更高？",
    "marginBlog.faq.0.a":
      "销量高时 Shopify 通常利润率更高；销量低时 Etsy 没有月费，风险更低。",
    "marginBlog.faq.1.q": "Shopify 收上架费吗？",
    "marginBlog.faq.1.a":
      "不收。Shopify 收月费和支付处理费，但没有每件上架费或交易费。",
    "marginBlog.faq.2.q": "如何把 Etsy 文案转换成 Shopify 文案？",
    "marginBlog.faq.2.a":
      "把标题改到 70 字符以内，精简描述，并加入明确的行动号召。",
    "marginBlog.faq.3.q": "小卖家值得迁移吗？",
    "marginBlog.faq.3.a":
      "取决于销量和利润率。在订阅月费之前，先为你的店铺算一下账。",

    // 页面 metadata（标题 / 描述）
    "meta.home.title": "EtsyToolshed — Etsy 卖家免费工具",
    "meta.home.description":
      "面向 Etsy 卖家的免费工具：利润计算器、AI 披露合规检查器、Etsy 转 Shopify 文案转换器。无需注册即可开始使用。",
    "meta.profit.title": "Etsy 利润计算器 — 算出扣除手续费后的真实利润",
    "meta.profit.description":
      "免费的 Etsy 利润计算器。输入售价、成本、人工、包装和国家，即可查看 Etsy 手续费、净利润、利润率和保本最低售价。",
    "meta.compliance.title": "Etsy AI 披露合规检查器 — 检查你的商品是否合规",
    "meta.compliance.description":
      "免费的 Etsy AI 披露检查器。粘贴标题和描述，根据 Etsy AI 政策获取风险评分、合规问题和改进建议。",
    "meta.converter.title": "Etsy 转 Shopify 文案转换器 — 把 Etsy 文案变成 Shopify SEO 文案",
    "meta.converter.description":
      "免费的 Etsy 转 Shopify 转换器。粘贴 Etsy 标题、标签和描述，生成适合 Shopify 的标题、Meta 标题、Meta 描述、Alt 文案、Pinterest Pin 和 TikTok 文案。",
    "meta.pricing.title": "定价",
    "meta.pricing.description":
      "选择套餐：免费版、入门版 $9/月、专业版 $19/月。免费开始，需要更多时再升级。",
    "meta.login.title": "注册 / 登录",
    "meta.login.description": "注册或登录 EtsyToolshed，获得更高的使用额度。",
    "meta.blog.title": "Etsy 卖家博客 — 手续费、AI 政策与 Shopify 技巧",
    "meta.blog.description":
      "面向 Etsy 卖家的指南：费用拆解、AI 披露规则、Etsy vs Shopify 利润率等。",
    "meta.feesPost.title": "Etsy 2026 手续费：完整拆解及如何定价盈利",
    "meta.feesPost.description":
      "逐项拆解 Etsy 卖家费用：上架费、交易费、支付处理费、站外广告费。了解公式并为健康利润率定价。",
    "meta.aiPost.title": "Etsy 2026 AI 披露规则：卖家必须做什么",
    "meta.aiPost.description":
      "Etsy 要求在商品中披露 AI 使用。了解该披露什么、在哪里披露，以及如何选择正确的归属方式而不冒账号风险。",
    "meta.marginPost.title": "Etsy vs Shopify 利润率：在哪里能留住更多钱？",
    "meta.marginPost.description":
      "Etsy 与 Shopify 的费用和利润率并排对比，以及如何把你的 Etsy 商品文案转成适合 Shopify 的优化文案。",

    // 404 页面
    "notFound.title": "页面未找到",
    "notFound.description": "你要找的页面不存在或已被移动。",
    "notFound.backHome": "返回首页",
  },
};

/** 带变量插值的翻译：{n} 等占位符替换 */
export function format(
  str: string,
  vars: Record<string, string | number>,
): string {
  return str.replace(/\{(\w+)\}/g, (_, key) => String(vars[key] ?? `{${key}}`));
}
