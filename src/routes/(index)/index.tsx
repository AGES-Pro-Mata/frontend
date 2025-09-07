import { Carousel } from "@/components/ui/caroulsel";
import { CardsInfoOnHover } from "@/components/cards/cards-info-onhover";
import { createFileRoute } from "@tanstack/react-router";
import { GreyButton } from "@/components/buttons/greyButton";
import { DefaultButton } from "@/components/buttons/defaultButton";
import { InfoExperiencias } from "@/components/ui/info-experiencias-home";

export const Route = createFileRoute("/(index)/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="h-full flex flex-col items-center">
      <div className="bg-[#2E361D] flex relative pb-[58px] ">
        <div className="bg-transparent absolute gap-0 flex flex-col ml-[240px] mt-[55px] w-full h-full">
          <p
            className="ml-[0] p-0 flex text-white font-bold text-[40px]  leading-none"
            style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.4)" }}
          >
            Bem vindo ao
          </p>
          <p
            className="p-0 flex text-[#D4CBC0] text-[40px] font-bold  leading-none italic mt-[10px]"
            style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.4)" }}
          >
            PRÓ-MATA
          </p>
          <p className="text-white font-medium text-[20px]">
            Centro de Pesquisas e Conservação da Natureza
          </p>

          <div className="flex gap-[20px]">
            <DefaultButton
              label="Reservar"
              variant="primary"
              onClick={() => console.log("Reservar clicado!")}
            />

            <DefaultButton
              label="Venha nos conhecer!"
              variant="secondary"
              onClick={() => console.log("Venha nos conhecer clicado!")}
            />
          </div>
        </div>
        <img src="home-page-image.png" alt="" className="flex" />
      </div>
      <InfoExperiencias/>
      <CardsInfoOnHover />
      <Carousel />
      <div className="flex flex-col items-center mb-[60px] justify-center">
        <p className="m-[18px] font-medium text-[#484848] text-[20px]">
          Não perca tempo e venha viver essa experiência única!
        </p>
        <GreyButton label="Fazer Reserva" />
      </div>
    </div>
  );
}
