import { notFound } from 'next/navigation';
import { PostList, totalPages } from '../../PostList';

export const dynamicParams = false;

export function generateStaticParams() {
  return Array.from({ length: Math.max(0, totalPages - 1) }, (_, index) => ({
    page: String(index + 2)
  }));
}

export function generateMetadata({ params }: { params: { page: string } }) {
  return { title: `文章列表 - 第 ${params.page} 页` };
}

export default function PostsPage({ params }: { params: { page: string } }) {
  const page = Number(params.page);
  if (!/^[1-9]\d*$/.test(params.page) || page < 2 || page > totalPages) notFound();
  return <PostList page={page} />;
}
