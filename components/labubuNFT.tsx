import {
  FC,
  memo,
  ReactElement,
  ReactNode,
  RefObject,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

interface LabubuNFTProps {
  name: string;
  imageUrl: string;
  description: string;
  backgroundColor?: string;
  backgroundImg?: string;
  price: number;
  isFlashSale: boolean;
  quantity?: number;
}

const useFadeIn = () => {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.classList.add('labubu-card-fade-in');
      const timeoutId = setTimeout(() => {
        if (ref.current) {
          ref.current.classList.remove('labubu-card-fade-in');
        }
      }, 500);
      return () => clearTimeout(timeoutId);
    }
  });

  return ref;
};

const useButtonAnimation = () => {
  const ref = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.classList.add('button-bounce-in');
      const timeoutId = setTimeout(() => {
        if (ref.current) {
          ref.current.classList.remove('button-bounce-in');
        }
      }, 600);
      return () => clearTimeout(timeoutId);
    }
  });

  return ref;
};

/**
 * LabubuImage Component
 */
const LabubuImage = ({
  imageUrl,
  name,
}: {
  imageUrl: string;
  name: string;
}) => {
  const ref = useFadeIn() as RefObject<HTMLImageElement>;

  return <img src={imageUrl} alt={name} ref={ref} />;
};

/**
 * LabubuBackground Component
 */
const LabubuBackground = ({ backgroundImg }: { backgroundImg?: string }) => {
  const ref = useFadeIn() as RefObject<HTMLDivElement>;
  return (
    <div className='card-top' ref={ref}>
      {backgroundImg && <img src={backgroundImg} alt='product' />}
    </div>
  );
};

const PlaceABidButton: FC<{ onClick: () => void }> = ({ onClick }) => {
  const ref = useButtonAnimation();

  return (
    <button ref={ref} onClick={onClick}>
      Place a Bid
    </button>
  );
};

const LabubuInfo = ({ name }: { name: string }) => {
  const ref = useFadeIn() as RefObject<HTMLDivElement>;
  return (
    <div className='flex flex-col gap-1' ref={ref}>
      <span className='item-name'>{name}</span>
      <span>By LunaAI</span>
    </div>
  );
};

const LabubuPrice = ({
  labubuPriceData,
}: {
  labubuPriceData: { price: number; currency: string };
}) => {
  const ref = useFadeIn() as RefObject<HTMLDivElement>;

  return (
    <div ref={ref}>
      <img
        src='/assets/images/price.svg'
        alt={labubuPriceData.currency}
        width='32'
        height='32'
      />
      <span className='item-price'>
        {labubuPriceData.price} {labubuPriceData.currency}
      </span>
    </div>
  );
};

const FlashSaleCounter = ({
  formattedCounter,
}: {
  formattedCounter: string;
}) => {
  const ref = useFadeIn() as RefObject<HTMLSpanElement>;
  return <span ref={ref}>{formattedCounter}</span>;
};

const StockInfo = ({ quantity }: { quantity?: number }) => {
  const ref = useFadeIn() as RefObject<HTMLSpanElement>;

  return <span ref={ref}>In stock: {quantity ?? 0}</span>;
};

const FlashSaleBanner = () => {
  const ref = useFadeIn() as RefObject<HTMLDivElement>;

  return (
    <div className='flash-sale-banner' ref={ref}>
      FLASH SALE
    </div>
  );
};

const handleAddToCart = async (productId: number): Promise<number | null> => {
  const sessionId = sessionStorage.getItem('your-session-id') as string;

  try {
    const res = await fetch('/api/cart', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Session-Id': sessionId,
      },
      body: JSON.stringify({
        productId: productId,
        quantity: 1,
      }),
    });

    if (!res.ok) {
      throw new Error('Failed to add item to cart');
    }

    const data = await res.json();
    return data.data.product.stockQuantity;
  } catch (error) {
    console.error('Error adding to cart:', error);
    return null;
  }
};

const LabubuNFT: FC<LabubuNFTProps> = ({
  isFlashSale,
  name,
  imageUrl,
  backgroundColor,
  backgroundImg,
  price,
  quantity,
}) => {
  const [stockQuantity, setStockQuantity] = useState(quantity);
  const [timeLeft, setTimeLeft] = useState({
    hours: 7,
    minutes: 4,
    seconds: 8,
  });

  useEffect(() => {
    if (!isFlashSale) return;

    const countdown = setInterval(() => {
      setTimeLeft((prev) => {
        let { hours, minutes, seconds } = prev;

        if (seconds > 0) {
          seconds--;
        } else if (minutes > 0) {
          minutes--;
          seconds = 59;
        } else if (hours > 0) {
          hours--;
          minutes = 59;
          seconds = 59;
        } else {
          clearInterval(countdown);
          return prev;
        }

        return { hours, minutes, seconds };
      });
    }, 1000);

    return () => {
      clearInterval(countdown);
    };
  }, [isFlashSale]);

  const formatTime = (timeLeft: {
    hours: number;
    minutes: number;
    seconds: number;
  }) => {
    return `${timeLeft.hours}h : ${timeLeft.minutes}m : ${timeLeft.seconds}s`;
  };

  const formattedCounter = formatTime(timeLeft);

  const onClick = async () => {
    console.log('Place a Bid clicked');
    const productIdInString = name.split('#').pop();

    const productId =
      productIdInString && typeof productIdInString === 'string'
        ? parseInt(name.split('#').pop() as string)
        : null;

    if (!productId) return;

    const newStockQuantity = await handleAddToCart(productId);

    if (newStockQuantity === null) return;

    setStockQuantity(newStockQuantity);
  };

  const labubuPriceData = {
    price,
    currency: 'ETH',
  };

  return (
    <div
      className='labubu-card labubu-card-fade-in'
      style={
        {
          '--labubu-card-bg': backgroundColor,
          '--labubu-card-bg-img': backgroundImg,
        } as React.CSSProperties
      }
    >
      {isFlashSale && <FlashSaleBanner />}

      <LabubuImage imageUrl={imageUrl} name={name} />

      <LabubuBackground backgroundImg={backgroundImg} />

      <div className='card-body'>
        <div className='cart-item-name'>
          <LabubuInfo name={name} />

          <div className='cart-item-stock-info'>
            <StockInfo quantity={stockQuantity} />
            {isFlashSale && (
              <FlashSaleCounter formattedCounter={formattedCounter} />
            )}
          </div>
        </div>

        <div className='cart-item-price'>
          <LabubuPrice labubuPriceData={labubuPriceData} />

          <PlaceABidButton onClick={onClick} />
        </div>
      </div>
    </div>
  );
};

export default LabubuNFT;
