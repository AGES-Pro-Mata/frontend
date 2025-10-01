import type { ReactNode } from "react";

import { Link, createFileRoute } from "@tanstack/react-router";
import {
	ChevronLeft,
	ChevronRight,
	CircleDollarSign,
	Search,
	ShoppingCart,
	Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

const categories = ["Quartos", "Eventos", "Laboratórios", "Trilhas"];

const mockLaboratories = Array.from({ length: 8 }, (_, index) => ({
	id: index + 1,
	title: "Laboratório X",
	type: "Laboratório",
	description:
		"Lorem ipsum dolor sit amet, consectetur adipiscing elit. In ut neque mattis, elementum ipsum id, semper lorem. Nam at dui in urna elementum ultrices at ac leo. Aliquam libero odio, molestie a purus vitae, cursus.",
	capacity: "12 pessoas",
	price: "R$ 356,90",
	image: "/mock/lab.webp",
}));

export const Route = createFileRoute("/(index)/reserve/")({
	component: ReservePage,
});

function ReservePage() {
	const activeCategory = "Laboratórios";

	return (
		<div className="min-h-screen bg-white pb-20">
			<div className="">
				<div className="mx-auto flex max-w-[1200px] flex-col items-center px-6 pb-16 pt-14 text-center">
					<h1 className="text-4xl font-bold text-main-dark-green md:text-5xl">
						Reservas Disponíveis
					</h1>
					<p className="mt-4 max-w-3xl text-base leading-relaxed text-[#6C6251] md:text-lg">
						Explore todas as opções de hospedagem, trilhas, laboratórios e eventos
						que o PRÓ-MATA oferece para pesquisadores, estudantes e amantes da
						natureza
					</p>

					<div className="mt-12 w-full max-w-[1040px] rounded-[32px] border border-card bg-white/80 p-8">
						<div className="grid gap-6 md:grid-cols-2">
							<FilterField label="Data de Entrada">
								<Select>
									<SelectTrigger className="h-12 rounded-full border-card bg-white/90 text-left text-[#2F2A1F] placeholder:text-[#8F887A] hover:bg-white">
										<SelectValue placeholder="Entrada" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="entrada">Entrada</SelectItem>
										<SelectItem value="hoje">Hoje</SelectItem>
										<SelectItem value="amanha">Amanhã</SelectItem>
									</SelectContent>
								</Select>
							</FilterField>

							<FilterField label="Data de Saída">
								<Select>
									<SelectTrigger className="h-12 rounded-full border-card bg-white/90 text-left text-[#2F2A1F] placeholder:text-[#8F887A] hover:bg-white">
										<SelectValue placeholder="Saída" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="saida">Saída</SelectItem>
										<SelectItem value="3dias">Daqui a 3 dias</SelectItem>
										<SelectItem value="5dias">Daqui a 5 dias</SelectItem>
									</SelectContent>
								</Select>
							</FilterField>
						</div>

						<div className="mt-10 flex flex-col items-center gap-6 lg:flex-row lg:items-end lg:justify-between">
							<div className="flex flex-wrap items-center justify-center gap-3">
								{categories.map((category) => (
									<button
										key={category}
										type="button"
										className={cn(
											"rounded-full border px-6 py-2 text-sm font-semibold transition",
											"border-card bg-white/70 text-[#6F6654] hover:bg-white",
											category === activeCategory &&
												"border-transparent bg-[#2F4631] text-white"
										)}
									>
										{category}
									</button>
								))}
							</div>

							<div className="relative w-full max-w-sm lg:max-w-xs">
								<Search className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-card" />
								<Input
									className="h-12 rounded-full border-card bg-white/90 pl-11 pr-5 text-sm text-[#2F2A1F] placeholder:text-[#9A917F] shadow-[0_12px_28px_rgba(90,74,54,0.12)]"
									placeholder="Buscar..."
								/>
							</div>
						</div>
					</div>
				</div>
			</div>

			<section className="mx-auto w-full max-w-[1200px] px-6">
				<header className="text-center">
					<h2 className="text-3xl font-semibold text-[#2F4631]">Laboratórios</h2>
					<p className="mt-2 text-base text-[#6C6251]">
						Espaços equipados para pesquisa científica
					</p>
				</header>

				<div className="mt-12 grid gap-10 md:grid-cols-2">
					{mockLaboratories.map((laboratory) => (
						<article
							key={laboratory.id}
							className="flex h-full flex-col overflow-hidden rounded-[28px] bg-card"
						>
							<div className="relative h-56 overflow-hidden">
								<img
									src={laboratory.image}
									alt={laboratory.title}
									className="h-full w-full object-cover"
								/>
							</div>

							<div className="flex flex-1 flex-col gap-5 px-8 pb-8 pt-6">
								<div className="flex items-start justify-between gap-4">
									<div>
										<h3 className="text-xl font-semibold text-main-dark-green">
											{laboratory.title}
										</h3>
										<span className="mt-2 inline-flex items-center rounded-full border border-[#CBBFA9] bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[#7A705E]">
											{laboratory.type}
										</span>
									</div>

									<div className="flex flex-col items-end gap-3 text-sm font-semibold text-[#2F2A1F]">
										<span className="inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-1 text-xs font-medium text-[#4F4536]">
											<Users className="size-4 text-[#2F4631]" />
											{laboratory.capacity}
										</span>
										<span className="inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-1 text-xs font-semibold text-[#2F4631]">
											<CircleDollarSign className="size-4 text-[#2F4631]" />
											{laboratory.price}
										</span>
									</div>
								</div>

								<p className="text-sm leading-6 text-[#6C6251]">
									{laboratory.description}
								</p>

								<Button
									asChild
									className="mt-auto inline-flex h-12 w-fit items-center gap-2 rounded-full bg-contrast-green px-6 text-sm font-semibold text-white transition hover:translate-y-[-1px] hover:bg-[#63a446]"
								>
									<Link to="/reserve/finish">
										<ShoppingCart className="size-4" />
										Adicionar ao carrinho
									</Link>
								</Button>
							</div>
						</article>
					))}
				</div>

				<nav className="mt-12 flex items-center justify-center gap-3 text-sm font-medium text-[#5E5645]">
					<button className="flex items-center gap-1 rounded-full border border-transparent px-3 py-1 text-[#5E5645] transition hover:border-[#D8CAB3] hover:text-[#2F4631]">
						<ChevronLeft className="size-4" />
						<span>Previous</span>
					</button>

					<div className="flex items-center gap-2">
						{["1", "2", "3"].map((page) => (
							<button
								key={page}
								className={cn(
									"size-10 rounded-full border border-transparent text-sm font-semibold transition",
									page === "1"
										? "bg-[#2F4631] text-white shadow-[0_12px_22px_rgba(47,70,49,0.25)]"
										: "bg-transparent text-[#5E5645] hover:border-[#D8CAB3] hover:bg-white/70"
								)}
							>
								{page}
							</button>
						))}
						<span className="text-[#8B8272]">…</span>
					</div>

					<button className="flex items-center gap-1 rounded-full border border-transparent px-3 py-1 text-[#5E5645] transition hover:border-[#D8CAB3] hover:text-[#2F4631]">
						<span>Next</span>
						<ChevronRight className="size-4" />
					</button>
				</nav>
			</section>
		</div>
	);
}

type FilterFieldProps = {
	label: string;
	children: ReactNode;
};

function FilterField({ label, children }: FilterFieldProps) {
	return (
		<label className="flex flex-col gap-3 text-left">
			<span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#7A705E]">
				{label}
			</span>
			{children}
		</label>
	);
}
