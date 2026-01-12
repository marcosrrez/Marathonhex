import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { RefreshCw, Link2, Unlink } from "lucide-react";
import { SiStrava } from "react-icons/si";

interface StravaStatus {
  connected: boolean;
  configured: boolean;
  athleteName?: string;
  athleteId?: number;
}

interface StravaConnectProps {
  trainingStart: string;
}

export function StravaConnect({ trainingStart }: StravaConnectProps) {
  const { toast } = useToast();
  const [isSyncing, setIsSyncing] = useState(false);

  const { data: status, isLoading } = useQuery<StravaStatus>({
    queryKey: ["/api/strava/status"],
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("strava_connected") === "true") {
      toast({
        title: "Strava Connected",
        description: "Your Strava account is now connected. Sync your runs to auto-complete workouts.",
      });
      window.history.replaceState({}, "", window.location.pathname);
      queryClient.invalidateQueries({ queryKey: ["/api/strava/status"] });
    }
    if (params.get("strava_error")) {
      toast({
        title: "Connection Failed",
        description: "Could not connect to Strava. Please try again.",
        variant: "destructive",
      });
      window.history.replaceState({}, "", window.location.pathname);
    }
  }, [toast]);

  const connectMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/strava/auth-url");
      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      }
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Could not start Strava connection. Please try again.",
        variant: "destructive",
      });
    },
  });

  const disconnectMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("POST", "/api/strava/disconnect");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/strava/status"] });
      toast({
        title: "Disconnected",
        description: "Your Strava account has been disconnected.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Could not disconnect Strava. Please try again.",
        variant: "destructive",
      });
    },
  });

  const syncMutation = useMutation({
    mutationFn: async () => {
      setIsSyncing(true);
      return apiRequest("POST", "/api/strava/sync", { trainingStart });
    },
    onSuccess: (data: any) => {
      setIsSyncing(false);
      queryClient.invalidateQueries({ queryKey: ["/api/completions"] });
      toast({
        title: "Sync Complete",
        description: `Synced ${data.synced} runs from Strava.`,
      });
    },
    onError: () => {
      setIsSyncing(false);
      toast({
        title: "Sync Failed",
        description: "Could not sync activities from Strava. Please try again.",
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return (
      <Card className="border-dashed">
        <CardContent className="p-6">
          <div className="animate-pulse flex items-center gap-4">
            <div className="h-10 w-10 rounded-full bg-muted" />
            <div className="space-y-2 flex-1">
              <div className="h-4 w-32 bg-muted rounded" />
              <div className="h-3 w-48 bg-muted rounded" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!status?.configured) {
    return (
      <Card className="border-dashed border-muted-foreground/30">
        <CardContent className="p-6">
          <div className="flex items-center gap-4 text-muted-foreground">
            <SiStrava className="h-8 w-8" />
            <div>
              <p className="font-medium">Strava Integration Not Configured</p>
              <p className="text-sm">Add your Strava API credentials to enable auto-sync.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!status?.connected) {
    return (
      <Card className="overflow-hidden">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[#FC4C02]/10">
              <SiStrava className="h-6 w-6 text-[#FC4C02]" />
            </div>
            <div>
              <CardTitle className="text-lg">Connect Strava</CardTitle>
              <CardDescription>Auto-sync your runs to track progress</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Button
            onClick={() => connectMutation.mutate()}
            disabled={connectMutation.isPending}
            className="w-full bg-[#FC4C02] hover:bg-[#E34402] text-white"
            data-testid="button-connect-strava"
          >
            <Link2 className="mr-2 h-4 w-4" />
            Connect with Strava
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[#FC4C02]/10">
              <SiStrava className="h-6 w-6 text-[#FC4C02]" />
            </div>
            <div>
              <CardTitle className="text-lg">Strava Connected</CardTitle>
              <CardDescription>{status.athleteName}</CardDescription>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => disconnectMutation.mutate()}
              disabled={disconnectMutation.isPending}
              data-testid="button-disconnect-strava"
            >
              <Unlink className="mr-2 h-4 w-4" />
              Disconnect
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Button
          onClick={() => syncMutation.mutate()}
          disabled={isSyncing}
          className="w-full"
          data-testid="button-sync-strava"
        >
          <RefreshCw className={`mr-2 h-4 w-4 ${isSyncing ? "animate-spin" : ""}`} />
          {isSyncing ? "Syncing..." : "Sync Runs from Strava"}
        </Button>
      </CardContent>
    </Card>
  );
}
