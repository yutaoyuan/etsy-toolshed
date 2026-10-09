/**
 * Etsy → Shopify listing 转换规则引擎（规则版）
 *
 * 所有转换规则集中在此文件，组件不写死截断/模板逻辑。
 * 免费版：单条转换。Pro 批量 CSV 在 P4 接入权限后实现。
 *
 * 规则口径：
 * - Shopify title：清洗 Etsy 分隔符，关键词前置，截断到 70 字符（词边界）
 * - meta title：截断到 60 字符（Google SERP 显示限制）
 * - meta description：取描述首句，截断到 155 字符，有余量加 " Shop now!"
 * - alt text：title + 前 3 个 tag，截断到 125 字符（屏幕阅读器最佳长度）
 * - Pinterest pin：title(≤100) + body(描述前 450 字 + 5 个 hashtag)
 * - TikTok caption：hook + 描述前 180 字 + 5 个 hashtag，总长约 300
 */

export interface ConverterInput {
  etsyTitle: string;
  etsyTags: string[];
  etsyDescription: string;
}

export interface ConverterResult {
  shopifyTitle: string;
  metaTitle: string;
  metaDescription: string;
  altText: string;
  pinterestPin: {
    title: string;
    description: string;
  };
  tiktokCaption: string;
}

const SHOPIFY_TITLE_MAX = 70;
const META_TITLE_MAX = 60;
const META_DESC_MAX = 155;
const ALT_TEXT_MAX = 125;
const PINTEREST_TITLE_MAX = 100;
const PINTEREST_DESC_MAX = 500;
const TIKTOK_CAPTION_MAX = 300;
const ALT_TAGS_COUNT = 3;
const HASHTAG_COUNT = 5;

/** Etsy 标题常见分隔符，统一替换为空格以保留关键词顺序 */
const TITLE_SEPARATORS = /[|·•]/g;

function normalizeWhitespace(text: string): string {
  return text.replace(/\s+/g, " ").trim();
}

/** 清洗 Etsy 标题：分隔符转空格，合并空白，关键词保持原序（前置） */
function cleanTitle(title: string): string {
  return normalizeWhitespace(title.replace(TITLE_SEPARATORS, " "));
}

/** 按词边界截断到 max 字符，去除尾部标点 */
function truncateAtWord(text: string, max: number): string {
  if (text.length <= max) return text;
  const sliced = text.slice(0, max);
  const lastSpace = sliced.lastIndexOf(" ");
  const cut = lastSpace > max * 0.6 ? lastSpace : max;
  return normalizeWhitespace(sliced.slice(0, cut).replace(/[,\-–—:;]+$/, ""));
}

/** 取描述首句（到句号/问号/叹号），不超过 max */
function firstSentences(text: string, max: number): string {
  const trimmed = text.trim();
  if (trimmed.length <= max) return trimmed;
  const sentenceEnd = trimmed.search(/[.!?。！？]\s/);
  if (sentenceEnd > 0 && sentenceEnd <= max) {
    return trimmed.slice(0, sentenceEnd + 1);
  }
  return truncateAtWord(trimmed, max);
}

/** 把 tag 转成 hashtag：去空格、转小写、去 # 前缀 */
function toHashtag(tag: string): string {
  const cleaned = tag.trim().toLowerCase().replace(/^#/, "").replace(/\s+/g, "");
  return cleaned.length > 0 ? `#${cleaned}` : "";
}

/** 取前 n 个有效 hashtag */
function buildHashtags(tags: string[], count: number): string[] {
  return tags
    .map(toHashtag)
    .filter((t) => t.length > 1)
    .slice(0, count);
}

export function convertListing(input: ConverterInput): ConverterResult {
  const title = cleanTitle(input.etsyTitle);
  const description = normalizeWhitespace(input.etsyDescription);
  const tags = input.etsyTags;

  const shopifyTitle = truncateAtWord(title, SHOPIFY_TITLE_MAX);
  const metaTitle = truncateAtWord(title, META_TITLE_MAX);

  const descBody = firstSentences(description, META_DESC_MAX - " Shop now!".length);
  const metaDescription =
    descBody.length + " Shop now!".length <= META_DESC_MAX
      ? `${descBody} Shop now!`
      : descBody;

  const altTags = tags.slice(0, ALT_TAGS_COUNT).map((t) => t.trim()).filter(Boolean);
  const altBase = altTags.length > 0 ? `${shopifyTitle}, ${altTags.join(", ")}` : shopifyTitle;
  const altText = truncateAtWord(altBase, ALT_TEXT_MAX);

  const hashtags = buildHashtags(tags, HASHTAG_COUNT);
  const hashtagString = hashtags.join(" ");

  // Pinterest
  const pinterestTitle = truncateAtWord(title, PINTEREST_TITLE_MAX);
  const pinDescBody = firstSentences(description, PINTEREST_DESC_MAX);
  const pinterestDescription = hashtagString
    ? `${pinDescBody} ${hashtagString}`.slice(0, PINTEREST_DESC_MAX)
    : pinDescBody;

  // TikTok
  const tiktokHook = "Link in bio to shop 👇 ";
  const tiktokFeatures = firstSentences(
    description,
    TIKTOK_CAPTION_MAX - tiktokHook.length - hashtagString.length - 1,
  );
  const tiktokCaption = `${tiktokHook}${tiktokFeatures}${hashtagString ? " " + hashtagString : ""}`.slice(
    0,
    TIKTOK_CAPTION_MAX,
  );

  return {
    shopifyTitle,
    metaTitle,
    metaDescription,
    altText,
    pinterestPin: {
      title: pinterestTitle,
      description: pinterestDescription,
    },
    tiktokCaption,
  };
}
