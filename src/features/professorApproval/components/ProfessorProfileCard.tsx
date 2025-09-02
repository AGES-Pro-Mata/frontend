import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import type { ProfessorApproval } from '../types/type';

const mockProfessor: ProfessorApproval = {
    nomeCompleto: "João da Silva",
    email: "joao@dasilva.com",
    telefone: "(55) 99999-9999",
    cpf: "123.456.789-00",
    genero: "Masculino",
    rg: "123456789",
    cep: "12345-678",
    endereco: "Rua do Limoeiro",
    cidade: "São Paulo",
    numero: "100",
    instituicao: "PUCRS | Professor",
};

export function ProfessorProfileCard() {
  return (
    <Card className="w-full max-w-lg">
      <CardHeader>
        <CardTitle className="text-center text-3xl font-bold text-green-900 mb-0">
          Perfil Professor
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mt-0 mb-8">
          <h3 className="font-semibold mt-0 mb-0 ml-1 text-lg text-neutral-800">Informações Pessoais</h3>
          <Separator className="mb-1" />
          <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
            <div>
              <strong>Nome Completo:</strong>
              <ul className="list-disc pl-6">
                <li><strong>{mockProfessor.nomeCompleto}</strong></li>
              </ul>
            </div>
            <div>
              <strong>Email:</strong>
              <ul className="list-disc pl-6">
                <li><strong>{mockProfessor.email}</strong></li>
              </ul>
            </div>
            <div>
              <strong>Telefone:</strong>
              <ul className="list-disc pl-6">
                <li><strong>{mockProfessor.telefone}</strong></li>
              </ul>
            </div>
            <div>
              <strong>CPF:</strong>
              <ul className="list-disc pl-6">
                <li><strong>{mockProfessor.cpf}</strong></li>
              </ul>
            </div>
            <div>
              <strong>Gênero:</strong>
              <ul className="list-disc pl-6">
                <li><strong>{mockProfessor.genero}</strong></li>
              </ul>
            </div>
            <div>
              <strong>RG:</strong>
              <ul className="list-disc pl-6">
                <li><strong>{mockProfessor.rg}</strong></li>
              </ul>
            </div>
            <div>
              <strong>CEP/ZIP CODE:</strong>
              <ul className="list-disc pl-6">
                <li><strong>{mockProfessor.cep}</strong></li>
              </ul>
            </div>
            <div>
              <strong>Endereço:</strong>
              <ul className="list-disc pl-6">
                <li><strong>{mockProfessor.endereco}</strong></li>
              </ul>
            </div>
            <div>
              <strong>Cidade:</strong>
              <ul className="list-disc pl-6">
                <li><strong>{mockProfessor.cidade}</strong></li>
              </ul>
            </div>
            <div>
              <strong>Número:</strong>
              <ul className="list-disc pl-6">
                <li><strong>{mockProfessor.numero}</strong></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="mb-4">
          <h3 className="font-semibold mb-0 ml-1 text-lg text-neutral-800">Informações Profissionais</h3>
          <Separator className="mb-1"/>
          <div className="text-sm">
            <div>
              <strong>Instituição:</strong>
              <ul className="list-disc pl-6">
                <li><strong>{mockProfessor.instituicao}</strong></li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}