'use client';

import React from 'react';

import type { NestedRouterOption } from '@/config/routerMapping';
import { cn } from '@/utils';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb';
import { LinkWrap } from '@/components';
import { useBreadcrumb } from '@/hooks/useBreadcrumb';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

export interface LayoutBreadcrumbProps {
  className?: string;
  routerMapping: Map<string, NestedRouterOption>;
}

/** 显示面包屑信息 */
const BreadcrumbInfo = (props: { children?: React.ReactNode; content: React.ReactNode }) => {
  const { children, content } = props;

  return (
    <Popover>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent
        className='py-2 px-3 text-sm bg-background text-foreground'
        collisionPadding={10}
        sticky='always'
        onClick={(e) => e.stopPropagation()}
      >
        {content}
      </PopoverContent>
    </Popover>
  );
};

export const LayoutBreadcrumb = (props: LayoutBreadcrumbProps) => {
  const { className, routerMapping } = props;

  const originalPathList = useBreadcrumb();
  const nestedPathList = originalPathList?.filter((item) => item.href !== '/posts/page');

  /**
   *  根据路由名称获取标题
   * @param pathname 路由路径
   * @returns 标题化后的字符串
   */
  const titleize = (pathname: string) => {
    const paginationPage = pathname.match(/^\/posts\/page\/(\d+)\/?$/)?.[1];
    if (paginationPage) return `第 ${paginationPage} 页`;
    return routerMapping.get(pathname)?.text ?? pathname;
  };

  if (!nestedPathList) return null;

  return (
    <div
      className={cn(
        'flex items-center justify-start flex-1',
        'overflow-hidden',
        'select-none',
        className
      )}
    >
      <Breadcrumb className={cn('overflow-hidden')}>
        <BreadcrumbList className={cn('flex-nowrap overflow-hidden')}>
          {nestedPathList.map((item, index) => {
            const isLast = index === nestedPathList.length - 1;

            // 生成面包屑文本 (根据路由或自定义)
            const text = titleize(item.href) ?? item.text;

            return (
              <React.Fragment key={item.href}>
                {/* 分隔符 */}
                {index !== 0 && <BreadcrumbSeparator />}

                {isLast ? (
                  // 最后一项不可点击
                  <BreadcrumbInfo content={text}>
                    <BreadcrumbItem className={cn(' truncate')}>
                      <BreadcrumbPage className={cn(' truncate')}>{text}</BreadcrumbPage>
                    </BreadcrumbItem>
                  </BreadcrumbInfo>
                ) : (
                  <BreadcrumbItem className={cn('flex-shrink-0')}>
                    {/* 其他项可点击跳转 */}
                    <BreadcrumbLink className={cn('whitespace-nowrap')} asChild>
                      <LinkWrap className={cn('')} href={item.href}>
                        {text}
                      </LinkWrap>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                )}
              </React.Fragment>
            );
          })}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
};
