import { ImageWrap } from '@/components/ImageWrap';
import { getAllCoverPicture } from '@/config/picture';
import type { CoverPicture } from '@/config/picture';
import { metadataConfig } from '@/config/picture';
import { cn } from '@/utils';

export const metadata = metadataConfig;

const GalleryDesktop = (props: { allCoverPicture: CoverPicture[] }) => {
  const { allCoverPicture } = props;

  return (
    <div
      className={cn(
        'user-select-none mt-4',
        'screen-1560:w-[1560px]',
        'screen-1250:w-[1250px]',
        'screen-950:w-[932px]',
        'screen-630:w-[622px]'
      )}
    >
      <div className={cn('grid grid-cols-gallery auto-rows-[10px]')}>
        {allCoverPicture.map((picture) => (
          <div
            className={cn('w-[300px] justify-self-center', 'row-auto')}
            style={{ gridRow: `span ${picture.photoSpan}` }}
            key={picture.cover}
          >
            <div className={cn('w-full h-auto', 'overflow-hidden', 'rounded-sm')}>
              <ImageWrap
                className={cn(
                  'w-full',
                  'shadow-md',
                  'hover:scale-105',
                  'transition-all duration-1000 ease-out-quart',
                  'cursor-pointer'
                )}
                src={picture.cover}
                alt={picture.title}
                width={picture.width}
                height={picture.height}
                quality={100}
                sizes='300px'
                blurPlaceholder
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const GalleryMobile = (props: { allCoverPicture: CoverPicture[] }) => {
  const { allCoverPicture } = props;

  return (
    <div className={cn('user-select-none mt-4')}>
      <div className={cn('w-screen')}>
        {allCoverPicture.map((picture) => {
          return (
            <div
              className={cn('w-full  aspect-[16/9] px-3 pb-3')}
              style={{ aspectRatio: picture.widthHeightRatio }}
              key={picture.cover}
            >
              <div
                className={cn(
                  'w-full h-full',
                  'shadow-md',
                  'rounded-sm',
                  'overflow-hidden',
                  'relative'
                )}
              >
                <ImageWrap
                  className={cn()}
                  src={picture.cover}
                  alt={picture.title}
                  fill
                  sizes='300px'
                  blurPlaceholder
                  quality={100}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default async function Gallery() {
  const allCoverPicturePromise = await getAllCoverPicture();
  const allCoverPicture = await Promise.all(allCoverPicturePromise.map(async (post) => post));

  return (
    <div className={cn('flex justify-center')}>
      {/* 桌面端布局，小屏隐藏（静态托管没有 middleware，改为 CSS 响应式切换） */}
      <div className='max-sm:hidden'>
        <GalleryDesktop allCoverPicture={allCoverPicture} />
      </div>
      {/* 移动端布局，大屏隐藏 */}
      <div className='sm:hidden'>
        <GalleryMobile allCoverPicture={allCoverPicture} />
      </div>
    </div>
  );
}
