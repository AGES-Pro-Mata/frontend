import { use, useState } from "react";

export function Carousel() {
  const [selected, setSelected] = useState();

  return (
    <div className="flex flex-col items-center bg-amber-400 w-fit h-fit">
      <h2 className="text-[36px] m-0 p-0 font-bold text-[#484848]">Conheça seu Destino!</h2>
      <svg
      className="w-[370px] mt-[-6px]"
        xmlns="http://www.w3.org/2000/svg"
        width="409"
        height="6"
        viewBox="0 0 409 6"
        fill="none"
      >
        <rect width="409" height="6" rx="3" fill="#484848" />
      </svg>
      <p className="text-[22px] font-bold">
        Conheça alguns dos cenários deslumbrantes que você encontrará no
        PRÓ-MATA
      </p>
      <div className="flex bg-red-500 h-[541px] w-[970px]"></div>
      <div className="flex bg-amber-900 h-[257px] w-[970px]"></div>
    </div>
  );
}
