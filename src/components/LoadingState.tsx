import { Loader2 } from "lucide-react";

interface LoadingStateProps {
  message?: string;
}

const LoadingState = ({ message = "Finding restaurants near you..." }: LoadingStateProps) => {
  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center gap-4 rounded-2xl bg-secondary/30 p-8">
      <Loader2 className="h-10 w-10 animate-spin text-primary" />
      <p className="text-lg font-medium text-muted-foreground">{message}</p>
    </div>
  );
};

export default LoadingState;
