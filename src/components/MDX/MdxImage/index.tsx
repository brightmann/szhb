
import type { ImageProps } from 'next/image';

import { PreviewImage } from './PreviewImage';
import { ServerGenBlurDataURL } from '@/components/ImageWrap';
import { cn } from '@/utils';
import { omit } from '@/lib/utils';

interface MdxImageProps extends ImageProps {}

export const MdxImage = async (props: MdxImageProps) => {
  return ServerGenBlurDataURL({
    src: props.src,
    children: (params) => (
      <PreviewImage
        className={cn(props.className)}
        blurDataURL={params.blurDataURL}
        {...omit(props, ['className'])}
      />
    )
  });
};
