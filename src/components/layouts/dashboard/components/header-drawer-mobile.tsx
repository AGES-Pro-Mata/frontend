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
import { Menu, XCircle } from "lucide-react";

export function HeaderDrawerMobile() {
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
            <Link to="/">Reservar</Link>
          </DrawerClose>
          <Separator />
          <DrawerClose asChild>
            <Link to="/">Minhas reservas</Link>
          </DrawerClose>
          <Separator />
          <DrawerClose asChild>
            <Link to="/">User</Link>
          </DrawerClose>
          <Separator />
          <DrawerClose asChild>
            <Link to="/">Carrinho</Link>
          </DrawerClose>
        </nav>
      </DrawerContent>
    </Drawer>
  );
}
