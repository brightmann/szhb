import type { Metadata } from 'next';
import { PostList } from './PostList';

const metadataDecs = '所有文章';
const metadataTitle = '文章列表';
export const metadata: Metadata = {
  title: metadataTitle,
  description: metadataDecs,
  openGraph: {
    title: metadataTitle,
    description: metadataDecs
  },
  twitter: {
    title: metadataTitle,
    description: metadataDecs,
    card: 'summary_large_image'
  }
};

export default function Posts() {
  return <PostList page={1} />;
}
