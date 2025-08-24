import React from 'react';

interface CartButtonProps {
  itemCount: number;
}

const CartButton: React.FC<CartButtonProps> = ({ itemCount }) => {
    const handleClick = () => {
    console.log("Botão Pressionado!");
  };

  return ( 
    <button 
      onClick={handleClick}
      className={`
        relative flex items-center justify-center 
        w-16 h-16
        bg-primary text-primary-foreground
        rounded-full 
        cursor-pointer 
        border-none
        transition-colors duration-300 hover:bg-primary/90
      `}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-8 h-8"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="9" cy="21" r="1"></circle>
        <circle cx="20" cy="21" r="1"></circle>
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
      </svg>
      {itemCount > 0 && (
        <span 
          className={`
            absolute -top-1 -right-1
            flex items-center justify-center
            w-7 h-7
            bg-accent text-accent-foreground
            text-sm font-bold
            rounded-full
            border-2 border-background
          `}
        >
          {itemCount}
        </span>
      )}
    </button>
  );
};

export default CartButton;