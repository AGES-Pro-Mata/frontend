import { Separator } from "@/components/ui/separator";
import { Typography } from "@/components/ui/typography";

export const FooterLayout = () => {
  return (
    <div className="md:h-80 flex flex-col !w-full h-auto !py-4 !px-6 bg-[var(--main-dark-green)] items-center text-white">
      <div className="md:flex-row md:gap-10 md:h-4/5 flex flex-col h-auto w-full">
        <div className="md:w-1/3 flex justify-center">
          <img
            src="logo-pro-mata-png-invertida.png "
            alt="Logo Pro Mata"
            className="w-96 h-36"
          />
        </div>
        <div className="md:w-2/3 md:items-start flex flex-col w-full items-center">
          <Typography variant="h5">Entre em contato</Typography>
          <div className="md:flex-row md:items-start flex flex-col w-full mt-5 items-center">
            <div className="w-1/2 gap-4">
              <Typography>Centro de Pesquisas PRÓ-MATA</Typography>
              <Typography>CIDADE</Typography>
            </div>
            <div className="w-1/2 gap-4">
              <Typography>Telefone: (XX) XXXX-XXXX</Typography>
              <Typography>E-mail: contato@pro-mata.org</Typography>
            </div>
          </div>
        </div>
      </div>
      <Separator className="my-4" />
      <div className="w-full flex justify-center items-center h-1/5">
        <Typography variant="h6">
          © 2025 PRÓ-MATA. Todos os direitos reservados.
        </Typography>
      </div>
    </div>
  );
};
