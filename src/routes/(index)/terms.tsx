import { createFileRoute } from '@tanstack/react-router'
import { Typography } from "@/components/typography/typography";
import React from 'react'; 

export const Route = createFileRoute('/(index)/terms')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="container mx-auto p-8 max-w-4xl">
      <Typography variant="h2" className="mb-6 text-main-dark-green">
        Termos de Uso
      </Typography>

      <Typography variant="body" className="mb-4 text-justify">
        Estes Termos de Uso regulam a utilização do site de hospedagem do Pró-Mata/PUCRS, que disponibiliza informações, reservas e serviços relacionados à hospedagem no Centro de Pesquisas e Conservação da Natureza Pró-Mata, em São Francisco de Paula/RS. O acesso ao site é livre e gratuito, ressalvados os serviços que dependam de reserva ou contratação.
      </Typography>
      
      <Typography variant="body" className="mb-4 text-justify">
        Ao realizar uma reserva, o usuário declara estar de acordo com estas condições. É responsabilidade do usuário fornecer informações corretas e atualizadas. Reservas estão sujeitas à disponibilidade e confirmação. Cancelamentos e alterações devem respeitar os prazos informados. Em casos de não comparecimento ou cancelamento fora do prazo, poderá haver cobrança de multa.
      </Typography>

      <Typography variant="body" className="mb-4 text-justify">
        O usuário deve zelar pela preservação das instalações e do patrimônio ambiental, cumprir normas internas de segurança e responder por eventuais danos causados por uso indevido das dependências.
      </Typography>

      <Typography variant="body" className="mb-4 text-justify">
        A PUCRS se compromete a manter as instalações adequadas, fornecer informações claras sobre serviços, tarifas e condições, e adotar medidas de segurança digital compatíveis.
      </Typography>
    </div>
  );
}
