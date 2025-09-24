import { useState, useRef, useLayoutEffect } from "react";
import { Typography } from "@/components/typography/typography";
import { Button } from "@/components/buttons/defaultButton";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";

export function Carousel() {
  const { t } = useTranslation();
  const recursos = [
    "/mock/infrastructure-0.jpg",
    "/mock/trail-1.jpg",
    "/mock/landscape-2.webp",
    "/mock/landscape-3.webp",
    "/mock/landscape-4.webp",
    "/mock/landscape-5.jpg",
    "/mock/landscape-6.jpg",
  ];

  const [selected, setSelected] = useState(0);
  const [firstIndex, setFirstIndex] = useState(0);

  // medimos a largura real de um "tile" e o gap para calcular o passo (tile + gap)
  const itemRef = useRef<HTMLDivElement | null>(null);
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const [stepPx, setStepPx] = useState(0);
  const [tiles, setTiles] = useState(2); // itens visíveis na faixa (2 desktop, 1 mobile)
  const startXRef = useRef<number | null>(null);

  useLayoutEffect(() => {
    if (!itemRef.current) return;
    // observa mudanças de tamanho no itemRef e no viewport (para o gap)
    const computeAndSetStep = (tileWidth: number) => {
      const gapStr = viewportRef.current
        ? getComputedStyle(viewportRef.current).columnGap ||
          getComputedStyle(viewportRef.current).gap
        : "0";
      const gapPx = parseFloat(gapStr || "0");
      setStepPx(tileWidth + (isNaN(gapPx) ? 0 : gapPx));
    };

    const itemObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        computeAndSetStep(entry.contentRect.width);
      }
    });

    const viewportObserver = new ResizeObserver(() => {
      if (itemRef.current && viewportRef.current) {
        const rect = itemRef.current.getBoundingClientRect();
        computeAndSetStep(rect.width);
        // define quantidade de tiles conforme largura do viewport (sm = 640px)
        const vw = viewportRef.current.clientWidth;
        setTiles(vw < 640 ? 1 : 2);
      }
    });

    itemObserver.observe(itemRef.current);
    if (viewportRef.current) viewportObserver.observe(viewportRef.current);

    return () => {
      itemObserver.disconnect();
      viewportObserver.disconnect();
    };
  }, []);

  const prev = () => setFirstIndex((i) => Math.max(0, i - 1));
  const next = () =>
    setFirstIndex((i) => Math.min(Math.max(recursos.length - tiles, 0), i + 1));

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    startXRef.current = e.clientX;
  };
  const onPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (startXRef.current == null) return;
    const delta = e.clientX - startXRef.current;
    const threshold = 30; // px
    if (delta > threshold) prev();
    else if (delta < -threshold) next();
    startXRef.current = null;
  };

  return (
    <div className="flex flex-col mb-[clamp(0.25rem,1.2vw,0.625rem)] items-center w-full max-w-[clamp(60rem,90vw,72rem)] h-fit scale-100 sm:scale-[0.9] mx-auto">
      <div className="w-fit flex flex-col items-center">
        <Typography className="inline-block text-[clamp(1.75rem,4.5vw,2.25rem)] m-0 p-0 font-bold text-on-banner-text">
          {t("carousel.title")}
        </Typography>
        <div className="w-full h-[clamp(1px,0.2vh,2px)] bg-on-banner-text mt-[clamp(0.125rem,0.5vh,0.25rem)] mb-[clamp(0.75rem,3vw,1.5rem)]" />
      </div>
      <Typography className="text-black text-[clamp(1.125rem,2.5vw,1.375rem)] font-bold mb-[clamp(1.5rem,4vw,2.5rem)]">
        {t("carousel.subtitle", { brand: "PRÓ-MATA" })}
      </Typography>

      {/* imagem grande */}
      <div className="flex bg-card h-[clamp(14rem,60vw,28rem)] sm:h-[clamp(22rem,50vw,33.8125rem)] rounded-[clamp(0.75rem,2vw,1.125rem)] w-full sm:w-[clamp(40rem,90vw,60.625rem)] mb-[clamp(1.5rem,4vw,2.5rem)] p-[clamp(1rem,3.5vw,1.5625rem)] justify-center items-center">
        <div className="flex flex-1 h-full rounded-[clamp(0.625rem,1.8vw,0.9375rem)] overflow-hidden">
          <img
            src={recursos[selected]}
            alt={t("carousel.imageAlt", { brand: "PRÓ-MATA", index: selected + 1 })}
            className="h-full w-full object-cover object-center box-border select-none"
          />
        </div>
      </div>

      {/* faixa com slide das miniaturas (2 visíveis) */}
      <div className="flex flex-row h-[clamp(8rem,40vw,12rem)] sm:h-[clamp(12rem,30vw,16.0625rem)] w-full sm:w-[clamp(40rem,90vw,60.625rem)] justify-between items-center">
        <Button
          variant="ghost"
          onClick={prev}
          aria-label={t("carousel.prev")}
          label={
            <span className="w-full h-full grid place-items-center">
              <ArrowLeft className="block w-[90%] h-[90%]" strokeWidth={3} />
            </span>
          }
          className="inline-flex items-center justify-center rounded-full !p-0 aspect-square shrink-0 !w-[clamp(2.5rem,6vw,3.5rem)] !h-[clamp(2.5rem,6vw,3.5rem)] bg-[#D9D9D9] hover:bg-[#cfcfcf] active:bg-[#bfbfbf] text-white shadow-sm"
        />

        {/* viewport com gap fluido via CSS var */}
        <div
          className="b flex w-full h-full px-[clamp(0.75rem,4vw,1.25rem)] gap-[var(--gap)] overflow-hidden touch-pan-y select-none"
          ref={viewportRef}
          style={{ ["--gap" as any]: "clamp(0.75rem,3.5vw,3.75rem)" }}
          onPointerDown={onPointerDown}
          onPointerUp={onPointerUp}
        >
          {/* track: todas as imagens; animação no transform */}
          <div
            className="flex gap-[var(--gap)] transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${firstIndex * stepPx}px)` }}
          >
            {recursos.map((src, i) => (
              <div
                key={i}
                // width fixo para que caibam exatamente 2 por viewport (50% - metade do gap)
                className="flex flex-none h-full rounded-[clamp(0.625rem,1.8vw,0.9375rem)] overflow-hidden cursor-pointer w-[calc(100%_-_var(--gap))] sm:w-[calc(50%_-_(var(--gap)/2))]"
                onClick={() => setSelected(i)}
                ref={i === 0 ? itemRef : null}
              >
                <img
                  src={src}
                  alt={t("carousel.imageAlt", { brand: "PRÓ-MATA", index: i + 1 })}
                  className="h-full w-full object-cover object-center box-border select-none"
                />
              </div>
            ))}
          </div>
        </div>

        <Button
          variant="ghost"
          onClick={next}
          aria-label={t("carousel.next")}
          label={
            <span className="w-full h-full grid place-items-center">
              <ArrowRight className="block w-[90%] h-[90%]" strokeWidth={3} />
            </span>
          }
          className="inline-flex items-center justify-center rounded-full !p-0 aspect-square shrink-0 !w-[clamp(2.5rem,6vw,3.5rem)] !h-[clamp(2.5rem,6vw,3.5rem)] bg-[#D9D9D9] hover:bg-[#cfcfcf] active:bg-[#bfbfbf] text-white shadow-sm"
        />
      </div>
    </div>
  );
}
