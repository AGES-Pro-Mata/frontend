// import { createFileRoute } from "@tanstack/react-router";

// export const Route = createFileRoute("/(index)/")({
//   component: RouteComponent,
// });

// function RouteComponent() {
//   return (
//     <div className="h-full flex flex-col">
//       página inicial
//     </div>
//   );
// }

import { createFileRoute } from "@tanstack/react-router";
import TeacherApproval from "@/components/ui/acceptRequest";
export const Route = createFileRoute("/(index)/")({
component: HomePage,
});

function HomePage() {
return (
<div className="min-h-screen bg-gray-100 flex items-center justify-center p-10">
<TeacherApproval >
</TeacherApproval>
</div>
);
}