'use client';

import type { ComponentProps } from 'react';
import dynamic from 'next/dynamic';

import type { LottieInner } from './LottieInner';

// lottie-react 依赖浏览器环境（lottie-web 顶层访问 document），
// 在构建期静态预渲染时会报 "document is not defined"，
// 因此这里用 next/dynamic 关闭 SSR，只在客户端加载。
const LazyLottieInner = dynamic(() => import('./LottieInner').then((m) => m.LottieInner), {
  ssr: false
});

export const LottieWrap = (props: ComponentProps<typeof LottieInner>) => {
  return <LazyLottieInner {...props} />;
};
