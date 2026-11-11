import { notFound } from 'next/navigation';
import dynamic from 'next/dynamic';
import dayjs from 'dayjs';

import { Mdx } from '@/components/MDX';
import { postsMapping } from '@/utils/content';
import { cn } from '@/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { ImageWrap } from '@/components/ImageWrap';

const LoaderMobileToc = dynamic(
  () => import('@/components/Loader/TocMobile').then((mod) => mod.LoaderMobileToc),
  { ssr: false }
);

const DesktopOnlyTOC = dynamic(
  () => import('@/app/posts/[slug]/DesktopOnlyTOC').then((mod) => mod.DesktopOnlyTOC),
  {
    ssr: false,
    loading: () => (
      <div className='h-24 space-y-2 px-3'>
        <Skeleton className='h-4 w-full' />
        <Skeleton className='h-4 w-full' />
        <Skeleton className='h-4 w-full' />
        <Skeleton className='h-4 w-full' />
      </div>
    )
  }
);

interface BlogDetailProps {
  params: { slug: string };
}

/** 静态导出时预渲染所有文章页 */
export function generateStaticParams() {
  return [...postsMapping.keys()].map((slug) => ({
    slug: slug.replace(/^\/posts\//, '')
  }));
}

interface GenerateMetadataProps {
  params: { slug: string };
}

export async function generateMetadata(props: GenerateMetadataProps) {
  const { slug } = props.params;

  const post = postsMapping.get(`/posts/${slug}`);
  if (!post) return {};

  const { title, description, date } = post;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      publishedTime: date
    }
  };
}

/** 博文详情 */
export default function BlogDetail(props: BlogDetailProps) {
  const { slug } = props.params;

  const post = postsMapping.get(`/posts/${slug}`);
  if (!post) return notFound();

  return (
    <>
      <LoaderMobileToc />
      <div className={cn('px-4 sm:px-8', 'm-auto mb-6 mt-6', 'relative')}>
        <div className={cn('m-auto lg:max-w-5xl', 'lg:pr-72')}>
          <div className={cn('my-7 sm:my-7')}>
            <h1 className={cn('break-words text-3xl font-bold text-primary')}>{post.title}</h1>

            <p
              className={cn(
                'mt-2 md:text-base text-sm text-muted-foreground dark:text-muted-foreground',
                'space-x-4'
              )}
            >
              <span>{dayjs(post.date).format('YYYY 年 MM 月 DD 日')}</span>
              <span>预计阅读时长 {Math.round(post.readingMinutes)} 分钟</span>
              <span>字数 {post.readingWords} 字</span>
            </p>
          </div>

          {post.image && (
            <ImageWrap
              className={cn(
                'shadow-md',
                'object-cover',
                // 'object-contain',
                'mb-7 md:h-64 h-48 overflow-hidden rounded-sm md:rounded-md',
                'transition-all duration-500 ease-in-out'
              )}
              src={post.image}
              srcDark={post.imageDark}
              alt={post.title}
              width={736}
              height={256}
              sizes='100vw'
              blurPlaceholder
              quality={100}
              priority
              parallax={post.parallax}
            />
          )}

          <Mdx
            code={post.body.code}
            className={cn(
              'prose-sm',
              'prose-neutral !max-w-none dark:prose-invert md:prose-base',
              'prose-headings:scroll-m-28',
              'prose-headings:text-[#171717] dark:prose-headings:text-primary',
              'prose-headings:relative'
            )}
          />
        </div>
      </div>

      <div
        className={cn(
          'hidden lg:block',
          'fixed top-36',
          'md:right-[max(0px,calc(50%-32rem))]',
          'w-64'
        )}
      >
        <DesktopOnlyTOC
          className={cn('rounded-md0', 'transition-all duration-500 ease-in-out')}
          contentClassName={cn(
            'h-[calc(70vh)] overflow-y-auto'
            //  'pl-2 pr-4 mr-[-1rem]'
            // p-3 pl-F
          )}
        />
      </div>
    </>
  );
}
