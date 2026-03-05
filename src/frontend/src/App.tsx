import { Toaster } from "@/components/ui/sonner";
import { useMutation } from "@tanstack/react-query";
import { useCallback, useEffect, useRef } from "react";
import Dashboard from "./components/Dashboard";
import { useActor } from "./hooks/useActor";

function AppInner() {
  const { actor, isFetching } = useActor();
  const seededRef = useRef(false);

  const { mutate: triggerSeed } = useMutation({
    mutationFn: async () => {
      if (!actor) return;
      await actor.seedEntriesOnce();
    },
  });

  const doSeed = useCallback(() => {
    triggerSeed();
  }, [triggerSeed]);

  useEffect(() => {
    if (actor && !isFetching && !seededRef.current) {
      seededRef.current = true;
      doSeed();
    }
  }, [actor, isFetching, doSeed]);

  return (
    <div className="min-h-screen bg-background">
      <Dashboard />
      <Toaster />
    </div>
  );
}

export default function App() {
  return <AppInner />;
}
