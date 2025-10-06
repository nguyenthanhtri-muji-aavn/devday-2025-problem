'use client';
import { Suspense, useEffect } from 'react';
import Category from '../../../../components/category';

export default function CategoryPage({
  params,
}: {
  params: { 'category-id': string };
}) {
  useEffect(() => {
    const sessionId = sessionStorage.getItem('your-session-id') as string;
    if (!sessionId) {
      sessionStorage.setItem('your-session-id', crypto.randomUUID());
    }

    const body = document.getElementsByClassName('body')[0];
    body.classList.add('category-page');

    const handleScroll = () => {
      if (window.scrollY < 40) {
        body.classList.add('hide-sticky-bg');
      } else {
        body.classList.remove('hide-sticky-bg');
      }
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll);

    return () => {
      body.classList.remove('category-page');
      body.classList.remove('hide-sticky-bg');
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  return (
    <Suspense>
      <Category params={params} />
    </Suspense>
  );
}
