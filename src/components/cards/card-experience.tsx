import { Button } from "@/components/buttons/defaultButton";

export function CardExperience() {
  return (
<div className="bg-red-300 w-[450px] h-[400px] flex justify-center relative rounded-[20px] overflow-hidden">
  <div className="flex bg-red-900 h-[50%] w-[90%] mx-[15px] mt-[20px] box-border rounded-[15px]"></div>
  <div className="flex flex-col absolute bg-red-300 h-[50%] w-full top-[200px] px-[15px] py-[15px] gap-[5px] shadow-[0_0px_12px_rgba(0,0,0,0.8)] z-[50]">
    <div className="flex flex-row bg-red-200 gap-[10px] w-full h-full">
      <div className="flex flex-1 bg-red-400 ">
        <div>

        </div>
        <p>Lorem ipsum dolor sit amet consectetur adipiscing elit varius vestibulum pretium, at class in blandit porta quisque augue. </p>
      </div>
      <div className="flex w-[35%] bg-red-400"></div>
    </div>
    <div className="flex flex-col bg-red-200 w-full h-fit justify-center items-end">
      <Button label="Adicionar ao carrinho" className="rounded-[100px] text-[14px] px-[15px] py-[10px]"/>
    </div>
  </div>
</div>

  );
}
