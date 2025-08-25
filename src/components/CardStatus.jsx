import IconConfirmada from "../assets/CardStatus/icon-confirmada.svg";
import IconCancelada from "../assets/CardStatus/icon-cancelada.svg";
import IconPendente from "../assets/CardStatus/icon-pendente.svg";
import IconDesconhecido from "../assets/CardStatus/icon-desconhecido.svg";

export const StatusEnum = {
  CONFIRMADA: "confirmada",
  PAGAMENTO_PENDENTE: "pagamento_pendente",
  CADASTRO_PENDENTE: "cadastro_pendente",
  AGUARDANDO_APROVACAO: "aguardando_aprovacao",
  CANCELADA: "cancelada",
};

const statusMap = {
  [StatusEnum.CONFIRMADA]: {
    style: "text-[#4C9613]",
    icon: IconConfirmada,
    label: "Confirmada",
  },
  [StatusEnum.CANCELADA]: {
    style: "text-[#CD5252]",
    icon: IconCancelada,
    label: "Cancelada",
  },

  // Base Pendente
  [StatusEnum.PAGAMENTO_PENDENTE]: {
    style: "text-[#A18900]",
    icon: IconPendente,
    label: "Pagamento pendente",
  },
  [StatusEnum.CADASTRO_PENDENTE]: {
    style: "text-[#A18900]",
    icon: IconPendente,
    label: "Cadastro pendente",
  },
  [StatusEnum.AGUARDANDO_APROVACAO]: {
    style: "text-[#A18900]",
    icon: IconPendente,
    label: "Aguardando aprovação",
  },
};

function CardStatus({ status }) {
  const { style, label, icon } = statusMap[status] || {
    style: "text-[#6D6D6D]",
    icon: IconDesconhecido,
    label: "Desconhecido",
  };

  return (
    <span
      className={`relative inline-flex items-center gap-[8px] pr-[12px] rounded-full text-sm w-fit bg-[#F6EDE4] leading-none font-bold whitespace-nowrap ${style}
              after:content-[''] after:absolute after:inset-0 after:rounded-full after:shadow-[inset_0_0_2px_1px_rgba(0,0,0,0.45)] after:pointer-events-none`}
    >
      <img src={icon} alt={label} className="relative z-0" />
      <span className="relative z-10">{label}</span>
    </span>
  );
}

export default CardStatus;