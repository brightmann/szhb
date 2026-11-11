// GitHub Pages 静态导出时给站内图片加上 basePath 前缀
// 仅在 GITHUB_PAGES=true 构建时通过 next.config.mjs 启用
export default function githubPagesImageLoader({ src }) {
  if (src.startsWith('/') && !src.startsWith('/szhb/')) return `/szhb${src}`;
  return src;
}
