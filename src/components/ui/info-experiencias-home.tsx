import { GreyButton } from "../buttons/greyButton";
import { LineSVG } from "./svgs/line";

export function InfoExperiencias() {
  return (
    <div className="flex flex-col items-center pt-[50px]">
      <h2 className="text-[36px] m-0 p-0 font-bold text-[#484848]">
        Experiências!
      </h2>
      <LineSVG width={240} />
      <p className="text-[22px] font-bold mb-[40px] mt-[12px]">
        Viva momentos inesquecíveis conectado com a natureza preservada da Serra
        Gaúcha!
      </p>
      <div className="flex flex-row w-full justify-between">
        <div className="flex flex-col items-start justify-start">
          <ul className="list-disc list-inside text-black text-lg font-semibold space-y-2">
            <li>Acomodações diversas</li>
            <li>Laboratórios</li>
            <li>Trilhas</li>
            <li>Eventos</li>
          </ul>
        </div>
        <div className="flex flex-col gap-[10px] items-center mt-[20px]">
          <p className="font-bold text-[22px]">Faça sua reserva agora!</p>
          <GreyButton label="Fazer Reserva" />
        </div>
      </div>
    </div>
  );
}
