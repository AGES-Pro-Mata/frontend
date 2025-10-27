import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/button/defaultButton';
import { Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

type Pessoa = {
  nome: string;
  telefone: string;
  nascimento: string;
  cpf: string;
  genero: string;
};

type ModalPessoasProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  draftPessoas: Pessoa[];
  setDraftPessoas: (pessoas: Pessoa[]) => void;
  pessoas: Pessoa[];
  handleSalvarPessoas: (novasPessoas: Pessoa[]) => void;
};

export function ModalPessoas({
  open,
  onOpenChange,
  draftPessoas,
  setDraftPessoas,
  pessoas,
  handleSalvarPessoas,
}: ModalPessoasProps) {
  const { t } = useTranslation();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="!max-w-none w-[90vw] h-[75vh] bg-card rounded-xl shadow-lg p-6 flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-main-dark-green text-2xl font-bold">
            {t('peopleModal.title')}
          </DialogTitle>
        </DialogHeader>

        <div className="mt-2 flex flex-col gap-4 flex-grow overflow-y-auto">
          {draftPessoas.map((pessoa, index) => (
            <div
              key={index}
              className="grid grid-cols-6 gap-4 border-b border-gray-300 pb-4 items-center"
            >
              <Input
                placeholder={t('peopleModal.name')}
                value={pessoa.nome}
                onChange={(e) => {
                  const updated = [...draftPessoas];

                  updated[index].nome = e.target.value;
                  setDraftPessoas(updated);
                }}
              />
              <Input
                placeholder={t('peopleModal.phone')}
                value={pessoa.telefone}
                onChange={(e) => {
                  const updated = [...draftPessoas];

                  updated[index].telefone = e.target.value;
                  setDraftPessoas(updated);
                }}
              />
              <Input
                type="date"
                placeholder={t('peopleModal.birth')}
                value={pessoa.nascimento}
                onChange={(e) => {
                  const updated = [...draftPessoas];

                  updated[index].nascimento = e.target.value;
                  setDraftPessoas(updated);
                }}
              />
              <Input
                placeholder={t('peopleModal.cpf')}
                value={pessoa.cpf}
                onChange={(e) => {
                  const updated = [...draftPessoas];

                  updated[index].cpf = e.target.value;
                  setDraftPessoas(updated);
                }}
              />
              <Select
                value={pessoa.genero}
                onValueChange={(val) => {
                  const updated = [...draftPessoas];

                  updated[index].genero = val;
                  setDraftPessoas(updated);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t('peopleModal.gender')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="masculino">{t('peopleModal.male')}</SelectItem>
                  <SelectItem value="feminino">{t('peopleModal.female')}</SelectItem>
                  <SelectItem value="outro">{t('peopleModal.other')}</SelectItem>
                </SelectContent>
              </Select>

              <Button
                onClick={() => {
                  const updated = draftPessoas.filter((_, i) => i !== index);

                  setDraftPessoas(updated);
                }}
                className="bg-default-red text-soft-white rounded-full w-[40px] h-[40px] flex items-center justify-center"
                label={<Trash2 className="w-4 h-4" />}
              />
            </div>
          ))}

          <Button
            onClick={() =>
              setDraftPessoas([
                ...draftPessoas,
                { nome: '', telefone: '', nascimento: '', cpf: '', genero: '' },
              ])
            }
            className="bg-main-dark-green text-soft-white rounded-full w-[240px] h-[40px] text-sm shadow-md hover:opacity-90"
            label={t('peopleModal.addPerson')}
          />
        </div>

        <div className="flex justify-between mt-4">
          <Button
            onClick={() => {
              setDraftPessoas(pessoas.map((p) => ({ ...p })));
              onOpenChange(false);
            }}
            className="bg-dark-gray text-soft-white rounded-full w-[120px] h-[40px]"
            label={t('common.back')}
          />

          <Button
            onClick={() => {
              const camposIncompletos = draftPessoas.some(
                (p) => !p.nome || !p.telefone || !p.nascimento || !p.cpf || !p.genero,
              );

              if (camposIncompletos) {
                toast.error(t('peopleModal.fillAllFields'));

                return;
              }

              handleSalvarPessoas(draftPessoas.map((p) => ({ ...p })));
            }}
            className="bg-contrast-green text-soft-white rounded-full w-[120px] h-[40px]"
            label={t('common.save')}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
