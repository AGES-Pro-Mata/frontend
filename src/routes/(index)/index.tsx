import { Carousel } from "@/components/ui/caroulsel";
import { CardsInfoOnHover } from "@/components/cards/cards-info-onhover";
import { createFileRoute, Link } from "@tanstack/react-router";
import { GreyButton } from "@/components/buttons/greyButton";
import { DefaultButton } from "@/components/buttons/defaultButton";
import { InfoExperiencias } from "@/components/ui/info-experiencias-home";
import { Typography } from "@/components/typography/typography";

export const Route = createFileRoute("/(index)/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="w-full overflow-x-hidden">
      <div className="relative w-full h-screen bg-main-dark-green flex items-start justify-center pt-20">
        <img
          src="home-page-image.png"
          alt="PRÓ-MATA Centro de Pesquisas"
          className="absolute inset-0 w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-black/20"></div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Typography
            variant="h1_light"
            className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-4"
            style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.6)" }}
          >
            Bem vindo ao
          </Typography>
          <Typography
            className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight italic mb-6 text-[#D4CBC0]"
            style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.6)" }}
          >
            PRÓ-MATA
          </Typography>
          <Typography
            variant="h3_light"
            className="text-lg sm:text-xl lg:text-2xl font-medium mb-8"
          >
            Centro de Pesquisas e Conservação da Natureza
          </Typography>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/reserve">
              <DefaultButton label="Reservar" variant="primary" />
            </Link>
            <a href="https://www.pucrs.br/ima/pro-mata/" target="_blank">
              <DefaultButton label="Venha nos conhecer!" variant="secondary" />
            </a>
          </div>
        </div>
      </div>
      <div className="h-20 w-full bg-main-dark-green" />
      <div className="p-20 flex flex-col items-center">
        <InfoExperiencias />
        <CardsInfoOnHover />
        <Carousel />
        <div className="flex flex-col items-center mb-[60px] justify-center">
          <Typography
            variant="h4"
            className="m-[18px] font-medium text-[#484848] text-[24px]"
          >
            Não perca tempo e venha viver essa experiência única!
          </Typography>
          <GreyButton label="Fazer Reserva" />
        </div>
      </div>
    </div>
  );
}
