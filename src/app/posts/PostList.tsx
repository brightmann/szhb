import Image from 'next/image';
import { allPosts } from 'contentlayer/generated';
import { cn } from '@/utils';
import { LinkWrap } from '@/components';
import { dynamicBlurDataUrl } from '@/lib/image/dynamicBlurDataUrl';

export const allPostsSorted = [...allPosts].sort((a, b) => {
  if (!a.date || !b.date) return 1;
  return new Date(b.date).getTime() - new Date(a.date).getTime();
});

export const POSTS_PER_PAGE = 5;
export const totalPages = Math.max(1, Math.ceil(allPostsSorted.length / POSTS_PER_PAGE));

export async function PostList({ page = 1 }: { page?: number }) {
  const postList = await Promise.all(
    allPostsSorted.slice((page - 1) * POSTS_PER_PAGE, page * POSTS_PER_PAGE).map(async (post) => {
      return {
        ...post,
        blurDataURL: await dynamicBlurDataUrl(post.image)
      };
    })
  );

  return (
    <div className={cn('sm:px-8 px-4')}>
      <div className={cn('lg:max-w-5xl', 'm-auto', 'mt-5 mb-5 space-y-6')}>
        {postList.map((post, index) => {
          return (
            <LinkWrap
              href={post.slug}
              key={post._raw.flattenedPath}
              className={cn(
                'flex sm:flex-row flex-col',
                'bg-card border text-card-foreground',
                'shadow-sm rounded-md',
                'overflow-hidden',
                'p-4'
              )}
            >
              {post.image && (
                <div
                  className={cn(
                    'w-full sm:w-44 md:w-52 lg:w-60  h-36',
                    'sm:mr-5 m-0',
                    'flex-shrink-0',
                    'relative'
                  )}
                >
                  <Image
                    className={cn('rounded-md', 'object-cover')}
                    src={post.image}
                    alt={`cover-${post.title}`}
                    fill={true}
                    sizes='50vw'
                    placeholder='blur'
                    blurDataURL={post.blurDataURL}
                    quality={50}
                    priority={index === 0}
                  />
                </div>
              )}

              <div className={cn('flex flex-col justify-between ')}>
                <div>
                  {/* 标题 */}
                  <h1
                    className={cn(
                      'text-primary sm:text-xl text-base font-bold leading-loose',
                      'sm:mt-0 mt-2'
                    )}
                  >
                    {post.title}
                  </h1>

                  {/* 描述 */}
                  {post.description && (
                    <p
                      className={cn(
                        'sm:text-base text-sm text-secondary-foreground',
                        'sm:mt-2 mt-1',
                        'text-ellipsis line-clamp-2 ',
                        'opacity-80'
                      )}
                    >
                      {post.description}
                    </p>
                  )}
                </div>

                <div
                  className={cn(
                    'sm:text-sm text-xs text-muted-foreground',
                    'space-x-4',
                    'mt-3',
                    'opacity-70'
                  )}
                >
                  <span>文字数量：{post.readingWords}</span>
                  <span>阅读时长：{Math.floor(post.readingMinutes)} 分钟</span>
                </div>
              </div>
            </LinkWrap>
          );
        })}
      </div>
      {totalPages > 1 && (
        <nav aria-label='文章分页' className='mx-auto mb-8 mt-8 flex max-w-5xl items-center justify-between gap-4'>
          {page > 1 ? (
            <LinkWrap href={page === 2 ? '/posts' : `/posts/page/${page - 1}`} className='rounded-md border px-4 py-2 hover:bg-muted'>
              Prev
            </LinkWrap>
          ) : <span className='rounded-md border px-4 py-2 text-muted-foreground opacity-50' aria-disabled='true'>Prev</span>}
          <span aria-current='page'>第 {page} / {totalPages} 页</span>
          {page < totalPages ? (
            <LinkWrap href={`/posts/page/${page + 1}`} className='rounded-md border px-4 py-2 hover:bg-muted'>
              Next
            </LinkWrap>
          ) : <span className='rounded-md border px-4 py-2 text-muted-foreground opacity-50' aria-disabled='true'>Next</span>}
        </nav>
      )}
    </div>
  );
}
