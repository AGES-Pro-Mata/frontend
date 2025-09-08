import { useState, useRef, useLayoutEffect } from "react";
import { LineSVG } from "./svgs/line";
import { ArrowSVG } from "./svgs/arrow";

export function Carousel() {
  const recursos = [
    "mock/mock-recurso/mock-recurso-0.png",
    "mock/mock-recurso/mock-recurso-1.png",
    "mock/mock-recurso/mock-recurso-2.png",
    "mock/mock-recurso/mock-recurso-3.png",
    "mock/mock-recurso/mock-recurso-4.png",
    "mock/mock-recurso/mock-recurso-5.png",
    "mock/mock-recurso/mock-recurso-6.png",
  ];

  const [selected, setSelected] = useState(0);
  const [firstIndex, setFirstIndex] = useState(0);

  // medimos a largura real de um "tile" para calcular o passo em pixels (tile + gap)
  const itemRef = useRef<HTMLDivElement | null>(null);
  const [stepPx, setStepPx] = useState(0);

  useLayoutEffect(() => {
    if (!itemRef.current) return;
    const gap = 60;

    // observa mudanças de tamanho no itemRef
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setStepPx(entry.contentRect.width + gap);
      }
    });

    observer.observe(itemRef.current);

    return () => observer.disconnect();
  }, []);

  const prev = () => setFirstIndex((i) => Math.max(0, i - 1));
  const next = () => setFirstIndex((i) => Math.min(recursos.length - 2, i + 1));

  return (
    <div className="flex flex-col mb-[10px] items-center w-full max-w-6xl h-fit scale-[0.9] mx-auto">
      <h2 className="text-[36px] m-0 p-0 font-bold text-[#484848]">
        Conheça seu Destino!
      </h2>
      <LineSVG />
      <p className="text-[22px] font-bold mb-[40px]">
        Conheça alguns dos cenários deslumbrantes que você encontrará no
        PRÓ-MATA
      </p>

      {/* imagem grande */}
      <div className="flex bg-[#F1EDEA] h-[541px] rounded-[18px] w-[970px] mb-[40px] p-[25px] justify-center items-center">
        <div className="flex flex-1 h-full rounded-[15px] overflow-hidden">
          <img
            src={recursos[selected]}
            className="h-full w-full object-cover object-center box-border select-none"
          />
        </div>
      </div>

      {/* faixa com slide das miniaturas (2 visíveis) */}
      <div className="flex flex-row h-[257px] w-[970px] justify-between items-center">
        <ArrowSVG direction="left" onClick={prev} />

        {/* viewport (mantive tuas classes; só acrescentei overflow-hidden) */}
        <div className="b flex w-full h-full px-[20px] gap-[60px] overflow-hidden">
          {/* track: todas as imagens; animação no transform */}
          <div
            className="flex gap-[60px] transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${firstIndex * stepPx}px)` }}
          >
            {recursos.map((src, i) => (
              <div
                key={i}
                // width fixo para que caibam exatamente 2 por viewport (50% - metade do gap)
                className="flex flex-none h-full rounded-[15px] overflow-hidden cursor-pointer"
                style={{ width: "calc(50% - 30px)" }}
                onClick={() => setSelected(i)}
                ref={i === 0 ? itemRef : null}
              >
                <img
                  src={src}
                  className="h-full w-full object-cover object-center box-border select-none"
                />
              </div>
            ))}
          </div>
        </div>

        <ArrowSVG direction="right" onClick={next} />
      </div>
    </div>
  );
}
