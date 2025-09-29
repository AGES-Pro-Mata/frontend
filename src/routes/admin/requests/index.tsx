import { createFileRoute } from '@tanstack/react-router';
import AdminRequestsPage from '@/components/table/adminRequests';

export const Route = createFileRoute('/admin/requests/')({
  component: AdminRequestsPage,
});
