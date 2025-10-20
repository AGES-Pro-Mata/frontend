import React, { useState } from 'react';
import { ShoppingCart } from 'lucide-react';

interface CartButtonProps {
  itemCount: number;
  handleClick?: () => void;
  size?: number;
  className?: string;
}

const CartButton: React.FC<CartButtonProps> = ({ itemCount, handleClick, size = 36, className }) => {
  const [clicked, setClicked] = useState(false);
  const computedIconSize = size * 0.6;

  const handleButtonClick = () => {
    setClicked(true);
    if (handleClick) handleClick();
  setTimeout(() => setClicked(false), 90);
  };

  return ( 
    <button 
      onClick={handleButtonClick}
      style={{ width: size, height: size }}
      className={`
        relative flex items-center justify-center 
        bg-main-dark-green
        rounded-full 
        cursor-pointer 
        border-none
        transition-transform [transition-timing-function:cubic-bezier(0.4,0,0.2,1)] duration-150
        ${clicked ? 'scale-105' : ''}
        ${className ?? ''}
      `}
    >
  <ShoppingCart className={`text-banner`} style={{ width: computedIconSize, height: computedIconSize }} />

      {itemCount > 0 && (
        <span
          style={{
            position: 'absolute',
            top: size * -0.12,
            right: size * -0.12,
            width: itemCount > 99 ? size * 0.62 : size * 0.45,
            height: size * 0.45,
            fontSize: Math.max(size * 0.3),
            background: 'var(--selected-banner, #FFF2C9)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '50%',
            paddingLeft: itemCount > 99 ? size * 0.08 : 0,
            paddingRight: itemCount > 99 ? size * 0.08 : 0,
          }}
        >
          {itemCount > 99 ? '99+' : itemCount}
        </span>
      )}
    </button>
  );
};

export default CartButton;