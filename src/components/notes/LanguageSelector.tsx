
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

interface LanguageSelectorProps {
  open: boolean;
  onClose: () => void;
  onSelect: (language: string) => void;
}

export function LanguageSelector({ open, onClose, onSelect }: LanguageSelectorProps) {
  const [selectedLanguage, setSelectedLanguage] = React.useState<string>("python");

  const handleSelect = () => {
    onSelect(selectedLanguage);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Select Programming Language</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
            <SelectTrigger>
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="python">Python</SelectItem>
              <SelectItem value="java">Java</SelectItem>
              <SelectItem value="c++">C++</SelectItem>
              <SelectItem value="c">C</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSelect}>
            Insert Code Block
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
