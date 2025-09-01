import { useRouter } from "@tanstack/react-router";

export function useCurrentPath() {
  const router = useRouter();
  return router.state.location.pathname;
}
