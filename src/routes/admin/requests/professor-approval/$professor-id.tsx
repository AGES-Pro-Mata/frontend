import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ApproveProfessorCard } from "@/components/cards/approveProfessorCard";
import { getUserById } from "@/api/user";
import { toast } from "sonner";
import { useEffect } from "react";

export const Route = createFileRoute(
  "/admin/requests/professor-approval/$professor-id"
)({
  component: RouteComponent,
  errorComponent: RouteErrorComponent, 
  loader: async ({ params }) => {
    const id = params["professor-id"];
    if (!id) throw new Response("Not Found", { status: 404 });

    try {
      const response = await getUserById(id);
      const data = response?.data;
      if (!data || !data.name || !data.email) {
        throw new Response("Not Found", { status: 404 });
      }
      // para simplificar, retorne só o payload que o componente precisa
      return data;
    } catch {
      // se o backend “não responder”/falhar, também trata como 404 para navegar de volta
      throw new Response("Not Found", { status: 404 });
    }
  },
});

function RouteComponent() {
  const data = Route.useLoaderData();
  const { "professor-id": professorId } = Route.useParams();

  return <ApproveProfessorCard professor={data} professorId={professorId} />;
}

let toastShown = false;
function RouteErrorComponent() {
  const navigate = useNavigate();
  useEffect(() => {
    if (!toastShown) {
      toastShown = true;
      toast.error("Professor não encontrado", {
        style: { background: "var(--color-default-red)", color: "white" },
      });
    }
    navigate({ to: "/admin/requests", replace: true });
    // reset flag após um tempo para permitir novo toast em navegação futura
    const timeout = setTimeout(() => { toastShown = false; }, 2000);
    return () => clearTimeout(timeout);
  }, [navigate]);
  return null;
}
