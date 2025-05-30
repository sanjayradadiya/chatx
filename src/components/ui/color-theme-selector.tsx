import { Check, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "@/context/theme-provider";
import { colorSamples, ColorScheme, colorSchemes } from "@/lib/themes";
import { cn } from "@/lib/utils";

const colorNames: Record<ColorScheme, string> = {
  default: "Default",
  blue: "Blue",
  green: "Green",
  red: "Red",
  purple: "Purple",
  orange: "Orange",
};

export function ColorThemeSelector() {
  const { colorScheme, setColorScheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <Palette className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">Select color theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[180px]">
        <DropdownMenuLabel>Color Theme</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup value={colorScheme} onValueChange={(value) => setColorScheme(value as ColorScheme)}>
          {colorSchemes.map((scheme) => (
            <DropdownMenuRadioItem key={scheme} value={scheme} className="flex items-center gap-2">
              <div className={cn("flex-shrink-0 w-4 h-4 rounded-full", colorSamples[scheme])} />
              <span className="flex-grow">{colorNames[scheme]}</span>
              {colorScheme === scheme && <Check className="h-4 w-4" />}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
} 