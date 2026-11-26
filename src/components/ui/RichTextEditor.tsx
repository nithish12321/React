import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Heading2,
  Heading3,
  Code,
  Quote,
  Undo,
  Redo,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export interface RichTextEditorProps {
  label?: string;
  helperText?: string;
  value?: string;
  onChange?: (html: string) => void;
  disabled?: boolean;
  className?: string;
}

export function RichTextEditor({
  label,
  helperText,
  value = '<p>Start typing rich text here…</p>',
  onChange,
  disabled = false,
  className,
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: value,
    editable: !disabled,
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML());
    },
  });

  if (!editor) return null;

  return (
    <div className={cn('w-full flex flex-col gap-1', className)}>
      {label && <label className="text-xs font-medium text-foreground">{label}</label>}

      <div
        className={cn(
          'rounded-md border border-border bg-surface shadow-soft overflow-hidden transition-all',
          'focus-within:ring-2 focus-within:ring-ring focus-within:border-primary',
          disabled && 'opacity-50 cursor-not-allowed bg-muted-surface',
        )}
      >
        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-1 border-b border-border bg-muted-surface/40 p-1.5 text-muted">
          <button
            type="button"
            disabled={disabled}
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={cn(
              'p-1.5 rounded hover:bg-muted-surface hover:text-foreground transition-colors',
              editor.isActive('bold') && 'bg-surface text-primary font-bold shadow-xs',
            )}
            aria-label="Bold"
          >
            <Bold className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            disabled={disabled}
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={cn(
              'p-1.5 rounded hover:bg-muted-surface hover:text-foreground transition-colors',
              editor.isActive('italic') && 'bg-surface text-primary shadow-xs',
            )}
            aria-label="Italic"
          >
            <Italic className="h-3.5 w-3.5" />
          </button>
          <div className="h-4 w-px bg-border mx-0.5" />
          <button
            type="button"
            disabled={disabled}
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={cn(
              'p-1.5 rounded hover:bg-muted-surface hover:text-foreground transition-colors',
              editor.isActive('heading', { level: 2 }) && 'bg-surface text-primary shadow-xs',
            )}
            aria-label="Heading 2"
          >
            <Heading2 className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            disabled={disabled}
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            className={cn(
              'p-1.5 rounded hover:bg-muted-surface hover:text-foreground transition-colors',
              editor.isActive('heading', { level: 3 }) && 'bg-surface text-primary shadow-xs',
            )}
            aria-label="Heading 3"
          >
            <Heading3 className="h-3.5 w-3.5" />
          </button>
          <div className="h-4 w-px bg-border mx-0.5" />
          <button
            type="button"
            disabled={disabled}
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={cn(
              'p-1.5 rounded hover:bg-muted-surface hover:text-foreground transition-colors',
              editor.isActive('bulletList') && 'bg-surface text-primary shadow-xs',
            )}
            aria-label="Bullet List"
          >
            <List className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            disabled={disabled}
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={cn(
              'p-1.5 rounded hover:bg-muted-surface hover:text-foreground transition-colors',
              editor.isActive('orderedList') && 'bg-surface text-primary shadow-xs',
            )}
            aria-label="Ordered List"
          >
            <ListOrdered className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            disabled={disabled}
            onClick={() => editor.chain().focus().toggleCode().run()}
            className={cn(
              'p-1.5 rounded hover:bg-muted-surface hover:text-foreground transition-colors',
              editor.isActive('code') && 'bg-surface text-primary shadow-xs',
            )}
            aria-label="Code"
          >
            <Code className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            disabled={disabled}
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={cn(
              'p-1.5 rounded hover:bg-muted-surface hover:text-foreground transition-colors',
              editor.isActive('blockquote') && 'bg-surface text-primary shadow-xs',
            )}
            aria-label="Blockquote"
          >
            <Quote className="h-3.5 w-3.5" />
          </button>
          <div className="h-4 w-px bg-border mx-0.5" />
          <button
            type="button"
            disabled={disabled || !editor.can().undo()}
            onClick={() => editor.chain().focus().undo().run()}
            className="p-1.5 rounded hover:bg-muted-surface hover:text-foreground disabled:opacity-40"
            aria-label="Undo"
          >
            <Undo className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            disabled={disabled || !editor.can().redo()}
            onClick={() => editor.chain().focus().redo().run()}
            className="p-1.5 rounded hover:bg-muted-surface hover:text-foreground disabled:opacity-40"
            aria-label="Redo"
          >
            <Redo className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Content Area */}
        <div className="p-3 text-xs leading-relaxed min-h-[100px] text-foreground focus-within:outline-none [&_.ProseMirror]:outline-none [&_ul]:list-disc [&_ul]:ps-4 [&_ol]:list-decimal [&_ol]:ps-4 [&_blockquote]:border-s-2 [&_blockquote]:border-primary [&_blockquote]:ps-2">
          <EditorContent editor={editor} />
        </div>
      </div>

      {helperText && <p className="text-[11px] text-muted">{helperText}</p>}
    </div>
  );
}
