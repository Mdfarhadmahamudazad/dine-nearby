import { Shuffle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface RandomButtonProps {
  onClick: () => void;
  isAnimating: boolean;
}

const RandomButton = ({ onClick, isAnimating }: RandomButtonProps) => {
  return (
    <Button
      variant="random"
      size="lg"
      onClick={onClick}
      disabled={isAnimating}
      className="gap-3"
    >
      <Shuffle
        className={cn(
          "h-5 w-5 transition-transform",
          isAnimating && "animate-spin-slow"
        )}
      />
      {isAnimating ? "Finding..." : "Surprise Me!"}
    </Button>
  );
};

export default RandomButton;
