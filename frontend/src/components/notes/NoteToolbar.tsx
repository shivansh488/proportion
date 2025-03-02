
import { Button } from "@/components/ui/button";
import { Bold, Italic, List, ListOrdered, Code, FileCode, Plus } from "lucide-react";
import { Editor } from '@tiptap/react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";

interface NoteToolbarProps {
  editor: Editor;
  onShowLanguageSelector: () => void;
}

export function NoteToolbar({ editor, onShowLanguageSelector }: NoteToolbarProps) {
  const { toast } = useToast();

  const insertBlock = (type: string) => {
    if (!editor) return;

    switch (type) {
      case 'text':
        editor.chain().focus().setParagraph().run();
        break;
      case 'heading1':
        editor.chain().focus().setHeading({ level: 1 }).run();
        break;
      case 'heading2':
        editor.chain().focus().setHeading({ level: 2 }).run();
        break;
      case 'heading3':
        editor.chain().focus().setHeading({ level: 3 }).run();
        break;
      case 'bulletList':
        editor.chain().focus().toggleBulletList().run();
        break;
      case 'orderedList':
        editor.chain().focus().toggleOrderedList().run();
        break;
      case 'code':
        onShowLanguageSelector();
        break;
      default:
        break;
    }

    if (type !== 'code') {
      toast({
        title: "Block inserted",
        description: `A new ${type} block has been added.`,
      });
    }
  };

  return (
    <div className="border-b border-border pb-4 mb-4">
      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              <Plus className="h-4 w-4" />
              Add block
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem onClick={() => insertBlock('text')}>
              Text
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => insertBlock('heading1')}>
              Heading 1
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => insertBlock('heading2')}>
              Heading 2
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => insertBlock('heading3')}>
              Heading 3
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => insertBlock('bulletList')}>
              Bullet List
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => insertBlock('orderedList')}>
              Numbered List
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => insertBlock('code')}>
              Code Block
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={editor.isActive('bold') ? 'bg-accent' : ''}
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={editor.isActive('italic') ? 'bg-accent' : ''}
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={editor.isActive('bulletList') ? 'bg-accent' : ''}
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={editor.isActive('orderedList') ? 'bg-accent' : ''}
        >
          <ListOrdered className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={editor.isActive('codeBlock') ? 'bg-accent' : ''}
        >
          <Code className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={onShowLanguageSelector}
        >
          <FileCode className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
