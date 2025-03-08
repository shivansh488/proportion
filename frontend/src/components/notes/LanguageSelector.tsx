import * as React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ReloadIcon } from "@radix-ui/react-icons";

interface LanguageSelectorProps {
  open: boolean;
  onClose: () => void;
  onSelect: (language: string) => void;
  languages?: string[];
  isLoading?: boolean;
}

export function LanguageSelector({ 
  open, 
  onClose, 
  onSelect,
  languages = [],
  isLoading = false
}: LanguageSelectorProps) {
  const [selectedLanguage, setSelectedLanguage] = React.useState<string>("");

  React.useEffect(() => {
    if (languages.length > 0 && !selectedLanguage) {
      setSelectedLanguage(languages[0]);
    }
  }, [languages]);

  const handleSelect = () => {
    if (selectedLanguage) {
      onSelect(selectedLanguage);
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Select Programming Language</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <Select 
            value={selectedLanguage} 
            onValueChange={setSelectedLanguage}
            disabled={isLoading}
          >
            <SelectTrigger>
              <SelectValue placeholder={isLoading ? "Loading languages..." : "Select language"} />
            </SelectTrigger>
            <SelectContent>
              {isLoading ? (
                <div className="flex items-center justify-center p-4">
                  <ReloadIcon className="h-4 w-4 animate-spin mr-2" />
                  Loading languages...
                </div>
              ) : languages.length > 0 ? (
                languages.map(lang => (
                  <SelectItem key={lang} value={lang}>
                    {lang.charAt(0).toUpperCase() + lang.slice(1)}
                  </SelectItem>
                ))
              ) : (
                <div className="p-4 text-sm text-muted-foreground">
                  No languages available
                </div>
              )}
            </SelectContent>
          </Select>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleSelect}
            disabled={isLoading || !selectedLanguage}
          >
            Insert Code Block
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
