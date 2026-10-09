/** 从翻译字典构建 FAQ 数组（faq.<page>.<i>.q / .a） */
export function buildFaq(
  t: (key: string) => string,
  page: string,
  count: number,
): { question: string; answer: string }[] {
  const items: { question: string; answer: string }[] = [];
  for (let i = 0; i < count; i++) {
    items.push({
      question: t(`${page}.faq.${i}.q`),
      answer: t(`${page}.faq.${i}.a`),
    });
  }
  return items;
}
