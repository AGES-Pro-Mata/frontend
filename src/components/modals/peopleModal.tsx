import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/button/defaultButton";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { type Person } from "@/types/person";
import { digitsOnly, maskCpf, maskPhone } from "@/lib/utils";
import { TextInput } from "../input";

type PeopleModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  draftPeople: Person[];
  setDraftPeople: (people: Person[]) => void;
  people: Person[];
  handleSavePeople: (newPeople: Person[]) => void;
};

export function PeopleModal({
  open,
  onOpenChange,
  draftPeople,
  setDraftPeople,
  people,
  handleSavePeople,
}: PeopleModalProps) {
  const { t } = useTranslation();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="!max-w-none w-[70vw] h-[75vh] bg-white rounded-xl shadow-lg p-6 flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-main-dark-green text-2xl font-bold">
            {t("peopleModal.title")}
          </DialogTitle>
        </DialogHeader>

        <div className="mt-2 flex flex-col gap-4 flex-grow overflow-y-auto">
          {draftPeople.map((person, index) => (
            <div
              key={index}
              className="grid grid-cols-16 gap-4 border-b border-gray-300 pb-4 items-center"
            >
              <Input
                placeholder={t("peopleModal.name")}
                className="col-span-3 h-10"
                value={person.name}
                onChange={(e) => {
                  const updated = [...draftPeople];

                  updated[index].name = e.target.value;
                  setDraftPeople(updated);
                }}
              />
              <TextInput
                className="col-span-3 h-10"
                placeholder={t("peopleModal.phone")}
                value={maskPhone(person.phone || "")}
                onChange={(e) => {
                  const updated = [...draftPeople];
                  const digits = digitsOnly(e.target.value).slice(0, 11);

                  updated[index].phone = digits;
                  setDraftPeople(updated);
                }}
              />

              <Input
                type="date"
                className="col-span-3 h-10"
                placeholder={t("peopleModal.birth")}
                value={person.birthDate}
                onChange={(e) => {
                  const updated = [...draftPeople];

                  updated[index].birthDate = e.target.value;
                  setDraftPeople(updated);
                }}
              />
              <TextInput
                className="col-span-3 h-10"
                placeholder={t("peopleModal.cpf")}
                value={maskCpf(person.document || "")}
                onChange={(e) => {
                  const updated = [...draftPeople];
                  const digits = digitsOnly(e.target.value).slice(0, 11);
                  const masked = maskCpf(digits);

                  updated[index].document = masked;
                  setDraftPeople(updated);
                }}
              />
              <Select
                value={person.gender}
                onValueChange={(val) => {
                  const updated = [...draftPeople];

                  updated[index].gender = val;
                  setDraftPeople(updated);
                }}
              >
                <SelectTrigger className="col-span-3 !h-10">
                  <SelectValue placeholder={t("peopleModal.gender")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="masculino">{t("peopleModal.male")}</SelectItem>
                  <SelectItem value="feminino">{t("peopleModal.female")}</SelectItem>
                  <SelectItem value="outro">{t("peopleModal.other")}</SelectItem>
                </SelectContent>
              </Select>
              <div className="col-span-1 flex justify-end">
                <Button
                  onClick={() => {
                    const updated = draftPeople.filter((_, i) => i !== index);

                    setDraftPeople(updated);
                  }}
                  className="bg-default-red text-soft-white rounded-full w-[40px] h-[40px] flex items-center justify-center"
                  label={<Trash2 className="w-4 h-4" />}
                />
              </div>
            </div>
          ))}

          <div className="flex justify-end">
            <Button
              onClick={() =>
                setDraftPeople([
                  ...draftPeople,
                  {
                    name: "",
                    phone: "",
                    birthDate: "",
                    document: "",
                    gender: "",
                  },
                ])
              }
              className="bg-main-dark-green text-soft-white rounded-full w-[240px] h-[40px] text-sm shadow-md hover:opacity-90"
              label={
                draftPeople.length > 0 ? t("peopleModal.addPerson") : t("peopleModal.addOnePerson")
              }
            />
          </div>
        </div>

        <div className="flex justify-between mt-4">
          <Button
            onClick={() => {
              setDraftPeople(people.map((p) => ({ ...p })));
              onOpenChange(false);
            }}
            className="bg-dark-gray text-soft-white rounded-full w-[120px] h-[40px]"
            label={t("common.back")}
          />

          <Button
            onClick={() => {
              const incompleteFields = draftPeople.some(
                (p) => !p.name || !p.phone || !p.birthDate || !p.document || !p.gender,
              );

              if (incompleteFields) {
                toast.error(t("peopleModal.fillAllFields"));

                return;
              }

              handleSavePeople(draftPeople.map((p) => ({ ...p })));
            }}
            className="bg-contrast-green text-soft-white rounded-full w-[120px] h-[40px]"
            label={t("common.save")}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
