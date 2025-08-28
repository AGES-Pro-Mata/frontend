import { Link, useMatchRoute } from '@tanstack/react-router';
import { Building2, ClipboardList, LayoutDashboard, Presentation, Users, UserPlus } from 'lucide-react';
import { Typography } from '@/components/ui/typography';

export function SidebarLayout() {
	const matchRoute = useMatchRoute();
	return (
		<aside className="bg-white w-64 min-h-[85vh] flex flex-col py-6 px-2 rounded-2xl shadow-lg m-4" style={{ border: 'none' }}>
			<nav className="flex flex-col gap-2">
				<SidebarButton to="/admin" icon={<LayoutDashboard className="h-6 w-6 text-gray-500" />} active={!!matchRoute({ to: '/admin' })}>
					<Typography>Home</Typography>
				</SidebarButton>
				<SidebarButton to="/admin/reports" icon={<Users className="h-6 w-6 text-gray-500" />} active={!!matchRoute({ to: '/admin/reports' })}>
					<Typography>Relatórios</Typography>
				</SidebarButton>
				<SidebarButton to="/admin/requests" icon={<ClipboardList className="h-6 w-6 text-gray-500" />} active={!!matchRoute({ to: '/admin/requests' })}>
					<Typography>Solicitações</Typography>
				</SidebarButton>
				<SidebarButton to="/admin/create-user" icon={<UserPlus className="h-6 w-6 text-gray-500" />} active={!!matchRoute({ to: '/admin/create-user' })}>
					<Typography>Criar novo Usuário</Typography>
				</SidebarButton>
				<SidebarButton to="/admin/highlights" icon={<Presentation className="h-6 w-6 text-gray-500" />} active={!!matchRoute({ to: '/admin/highlights' })}>
					<Typography>Destaques</Typography>
				</SidebarButton>
				<SidebarButton to="/admin/experiences" icon={<Building2 className="h-6 w-6 text-gray-500" />} active={!!matchRoute({ to: '/admin/experiences' })}>
					<Typography>Experiências</Typography>
				</SidebarButton>
			</nav>
		</aside>
	);
}

function SidebarButton({ to, icon, children, active }: { to: string; icon: React.ReactNode; children: React.ReactNode; active?: boolean }) {
	return (
		<Link
			to={to}
			className={`flex items-center gap-4 px-5 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors ${active ? 'bg-blue-50 text-blue-600 font-semibold' : 'font-normal'}`}
			style={{ boxShadow: active ? '#2563eb' : undefined }}
		>
			{icon}
			<span>{children}</span>
		</Link>
	);
}
