'use client';
import type { HTMLProps } from 'react';
import { useEffect, useState, type ComponentProps } from 'react';
import type Lottie from 'lottie-react';
import type { LottieOptions } from 'lottie-react';
import { useLottie } from 'lottie-react';

import { cn } from '@/utils';

interface LottieWrapProps extends ComponentProps<typeof Lottie>, HTMLProps<HTMLDivElement> {
  mode?: 'hover' | 'click' | 'auto';
  loop?: boolean;
  speed?: number;
}

export const LottieInner = (props: LottieWrapProps) => {
  const { animationData, mode = 'auto', loop = true, speed = 1 } = props;

  const [state, setState] = useState<'start' | 'end'>('end');

  const params: LottieOptions<'svg'> = {
    animationData,
    autoplay: mode === 'auto' ? true : false,
    loop
  };

  const { View, play, stop, setDirection, setSpeed } = useLottie(params);

  /** 进入 */
  const onMouseEnter = () => {
    if (mode !== 'hover') return;
    setDirection(1);
    play();
  };

  /** 离开 */
  const onMouseLeave = () => {
    if (mode !== 'hover') return;
    setDirection(-1);
    stop();
  };

  const onClick = (e: React.MouseEvent<HTMLDivElement>) => {
    props.onClick?.(e);
    if (mode !== 'click') return;

    if (state === 'start') {
      setDirection(-1);
      play();
      setState('end');
    } else {
      setDirection(1);
      play();
      setState('start');
    }
  };

  useEffect(() => {
    setSpeed(speed);
  }, [setSpeed, speed]);

  return (
    <div
      className={cn('[&_*]:!stroke-current', '[&_*]:!fill-current', props.className)}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
    >
      {View}
    </div>
  );
};
