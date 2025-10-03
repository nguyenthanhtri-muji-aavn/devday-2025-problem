import { products } from '@/app/mock-data';
import Category from '@/components/category';
import Link from 'next/link';
import { redirect, useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Home() {
  redirect('/products/all');
}
