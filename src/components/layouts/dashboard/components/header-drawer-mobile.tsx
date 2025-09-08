import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Separator } from "@/components/ui/separator";
import { Link } from "@tanstack/react-router";
import { Menu, XCircle, LogOut } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { userQueryOptions } from "@/api/user";
import { useLogout } from "@/hooks/useLogout";

export function HeaderDrawerMobile() {
  const { data: user } = useQuery(userQueryOptions);
  const isLoggedIn = !!user;
  const { logout } = useLogout();

  return (
    <Drawer direction="left">
      <DrawerTrigger asChild>
        <Button variant="outline" size="icon" className="flex md:hidden">
          <Menu className="size-5" />
        </Button>
      </DrawerTrigger>

      <DrawerContent className="h-full bg-white w-80">
        <DrawerHeader className="!flex-row justify-between text-left items-center gap-4">
          <div className="flex items-center gap-4">
            <DrawerClose asChild>
              <XCircle className="size-5" />
            </DrawerClose>
            <DrawerTitle>Menu</DrawerTitle>
          </div>
          <div>PT / EN</div>
        </DrawerHeader>
        <Separator className="opacity-50" />
        <nav className="flex flex-col px-4 py-4 gap-4">
          <DrawerClose asChild>
            <Link to="/">Início</Link>
          </DrawerClose>
          <Separator />
          <DrawerClose asChild>
            <Link to="/reserve">Reservar</Link>
          </DrawerClose>
          {isLoggedIn && (
            <>
              <Separator />
              <DrawerClose asChild>
                <Link to="/user/my-reservations">Minhas reservas</Link>
              </DrawerClose>
              <Separator />
              <DrawerClose asChild>
                <Link to="/user/my-profile">Meu Perfil</Link>
              </DrawerClose>
              <Separator />
              <DrawerClose asChild>
                <Link to="/">Carrinho</Link>
              </DrawerClose>
            </>
          )}
          {!isLoggedIn && (
            <>
              <Separator />
              <DrawerClose asChild>
                <Link to="/auth/login">Entrar</Link>
              </DrawerClose>
              <Separator />
              <DrawerClose asChild>
                <Link to="/auth/register">Cadastrar</Link>
              </DrawerClose>
            </>
          )}
          {isLoggedIn && (
            <>
              <Separator />
              <DrawerClose asChild>
                <button
                  onClick={logout}
                  className="flex items-center gap-2 text-left w-full py-2 px-0 text-sm hover:text-gray-600"
                >
                  <LogOut className="size-4" />
                  Sair
                </button>
              </DrawerClose>
            </>
          )}
        </nav>
      </DrawerContent>
    </Drawer>
  );
}
