import { use, useState } from "react";
import { LineSVG } from "./svgs/line";
import { ArrowSVG } from "./svgs/arrow";

export function Carousel() {
  const mockTrilha = "mock/mock-recurso.png";
  const recursos = [mockTrilha, mockTrilha, mockTrilha, mockTrilha, mockTrilha];
  const [selected, setSelected] = useState();


  return (
    <div className="flex flex-col mb-[100px] items-center bg-amber-400 w-fit h-fit">
      <h2 className="text-[36px] m-0 p-0 font-bold text-[#484848]">Conheça seu Destino!</h2>
      <LineSVG/>
      <p className="text-[22px] font-bold">
        Conheça alguns dos cenários deslumbrantes que você encontrará no
        PRÓ-MATA
      </p>
      <div className="flex bg-red-500 h-[541px] w-[970px]"></div>
      <div className="flex bg-amber-900 h-[257px] w-[970px]">
        <ArrowSVG/>
        <ArrowSVG/>
      </div>
    </div>
  );
}
