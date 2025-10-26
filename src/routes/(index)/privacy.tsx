import { createFileRoute } from '@tanstack/react-router'
import { Typography } from "@/components/typography/typography";
import React from 'react';

export const Route = createFileRoute('/(index)/privacy')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="container mx-auto p-8 max-w-4xl">
      <Typography variant="h2" className="mb-6 text-main-dark-green">
        Política de Privacidade
      </Typography>

      <Typography variant="body" className="mb-4 font-semibold">
        Dados Coletados e Finalidades
      </Typography>
      <Typography variant="body" className="mb-4 text-justify">
        Durante a utilização do site serão coletados dados pessoais, informações de pagamento e dados de navegação. 
        Os dados coletados têm como finalidades:
        <ul className="list-disc list-inside ml-4 mt-2">
          <li>Processar reservas e gerenciar hospedagens;</li>
          <li>Garantir a comunicação entre usuário e administração;</li>
          <li>Cumprir obrigações legais; e</li>
          <li>Melhorar a experiência de uso do site.</li>
        </ul>
      </Typography>

      <Typography variant="body" className="mb-4 font-semibold">
        Compartilhamento
      </Typography>
      <Typography variant="body" className="mb-4 text-justify">
        Os dados não serão vendidos ou cedidos a terceiros. Poderão ser compartilhados apenas com prestadores de serviços necessários ou mediante exigência legal.
      </Typography>

      <Typography variant="body" className="mb-4 font-semibold">
        Direitos do Usuário
      </Typography>
      <Typography variant="body" className="mb-4 text-justify">
        O usuário pode solicitar acesso, correção ou exclusão de seus dados; revogar consentimento quando aplicável; e obter informações sobre o tratamento realizado.
      </Typography>

      <Typography variant="body" className="mb-4 font-semibold">
        Armazenamento e Legislação
      </Typography>
      <Typography variant="body" className="mb-4 text-justify">
        Os dados serão armazenados pelo período necessário ao cumprimento das finalidades e em conformidade com a legislação vigente, especialmente a Lei Geral de Proteção de Dados – LGPD (Lei nº 13.709/2018).
      </Typography>

      <Typography variant="body" className="mt-6 p-3 border border-gray-300 rounded text-justify">
        Para dúvidas ou solicitações, o usuário pode entrar em contato com a administração do Pró-Mata/PUCRS pelo e-mail:{" "}
        <a href="mailto:ima@pucrs.br" className="text-blue-600 underline">
          ima@pucrs.br
        </a>.
      </Typography>
    </div>
  );
}
