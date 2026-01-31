import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const SearchBar = ({ value, onChange, placeholder = "Search restaurants or cuisines..." }: SearchBarProps) => {
  return (
    <div className="relative w-full">
      <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-14 w-full rounded-2xl border-2 border-border bg-card pl-12 pr-4 text-base shadow-card transition-all duration-200 placeholder:text-muted-foreground focus:border-primary focus:shadow-card-hover focus:ring-0"
      />
    </div>
  );
};

export default SearchBar;
