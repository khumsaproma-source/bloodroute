import { createActor } from "@/backend";
import { LoginPage } from "@/pages/LoginPage";
import { router } from "@/routes";
import { useActor, useInternetIdentity } from "@caffeineai/core-infrastructure";
import { RouterProvider } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";

export default function App() {
  const { isAuthenticated, isInitializing } = useInternetIdentity();
  const { actor, isFetching } = useActor(createActor);

  if (isInitializing) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  if (!actor || isFetching) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    );
  }

  return <RouterProvider router={router} />;
}
