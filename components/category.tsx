'use client';

import {
  categories,
  getProductsByCategory,
  Product,
  products,
  productsWithAI,
} from '../app/mock-data';
import { useEffect, useRef, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import LabubuNFT from '@/components/labubuNFT';
import Link from 'next/link';

export default function Category({
  params,
}: {
  params: { 'category-id': string };
}) {
  const categoryId = params['category-id'];

  const searchParams = useSearchParams();
  const router = useRouter();

  const searchTermParam = searchParams.get('search-text') || '';
  const [searchTerm, setSearchTerm] = useState(searchTermParam);
  const [isUsingAI, setUsingAI] = useState(false);
  const [currentParams, setCurrentParams] = useState(searchParams);
  const [labubuList, setLabubuList] = useState<Product[]>([]);
  const countRef = useRef(0);

  const productsData =
    categoryId == 'all'
      ? isUsingAI
        ? productsWithAI
        : products
      : getProductsByCategory(categoryId as string, isUsingAI);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    countRef.current = 0;
    const newSearchTerm = event.target.value;
    setSearchTerm(newSearchTerm);
    updateSearchParams('search-text', newSearchTerm);
  };

  const updateSearchParams = (key: string, value: string) => {
    const params = new URLSearchParams(currentParams);
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`?${params.toString()}`);
  };

  const filteredProducts = productsData.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.tags.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      ) ||
      product.id.toString().includes(searchTerm);

    return matchesSearch;
  });

  useEffect(() => {
    setCurrentParams(searchParams);
  }, [searchParams]);

  useEffect(() => {
    setSearchTerm(searchTermParam);
  }, [searchTermParam]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/products');
        const data = { data: { products: products } }; // await res.json();
        const productsList = data?.data?.products as Product[];
        setLabubuList(
          productsList?.filter((product) => {
            const matchesSearch =
              product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
              product.tags.some((tag) =>
                tag.toLowerCase().includes(searchTerm.toLowerCase())
              ) ||
              product.id.toString().includes(searchTerm);

            return matchesSearch;
          })
        );
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, [searchTerm]);

  countRef.current += 1;
  console.log('Products list rendered', countRef.current);

  return (
    <>
      <div className='category-filter'>
        <div className='search-field'>
          <span className='material-icons'>search</span>
          <input
            type='text'
            placeholder='Search products ...'
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
      </div>
      <div className='category-container'>
        {!filteredProducts.length ? (
          <div className='not-found'>
            <div>(·_·)</div>
            <p>
              No items found. Please check back later or try a different
              category!
            </p>
          </div>
        ) : (
          <div className='category-items'>
            {labubuList.map((item: Product, idx) => {
              return (
                <div key={item.id}>
                  <LabubuNFT
                    isFlashSale={item.id % 2 > 0}
                    name={item.name + ' #' + item.id}
                    imageUrl={item.image}
                    description={item.tags.join(', ')}
                    backgroundColor={item.background}
                    backgroundImg={item.backgroundImg}
                    price={item.price}
                    quantity={
                      item.stockQuantity || Math.floor(Math.random() * 100) + 1
                    }
                  />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
