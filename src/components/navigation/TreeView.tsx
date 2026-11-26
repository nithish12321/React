import { useState } from 'react';
import { ChevronRight, ChevronDown, Folder, File, FolderOpen } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface TreeNode {
  id: string;
  name: string;
  children?: TreeNode[];
}

export interface TreeViewProps {
  data: TreeNode[];
  selectedId?: string;
  onSelect?: (node: TreeNode) => void;
  className?: string;
}

function TreeItem({
  node,
  selectedId,
  onSelect,
  level = 0,
}: {
  node: TreeNode;
  selectedId?: string;
  onSelect?: (node: TreeNode) => void;
  level?: number;
}) {
  const isFolder = Boolean(node.children && node.children.length > 0);
  const [open, setOpen] = useState(level < 1);
  const isSelected = selectedId === node.id;

  return (
    <div>
      <div
        role="button"
        tabIndex={0}
        onClick={() => {
          if (isFolder) setOpen((prev) => !prev);
          onSelect?.(node);
        }}
        className={cn(
          'flex items-center gap-1.5 rounded-md px-2 py-1 text-xs transition-colors cursor-pointer select-none',
          isSelected
            ? 'bg-primary text-primary-fg font-semibold'
            : 'text-foreground hover:bg-muted-surface',
        )}
        style={{ paddingLeft: `${level * 16 + 8}px` }}
      >
        {isFolder ? (
          <span className="p-0.5 text-muted hover:text-foreground">
            {open ? (
              <ChevronDown className="h-3.5 w-3.5" />
            ) : (
              <ChevronRight className="h-3.5 w-3.5" />
            )}
          </span>
        ) : (
          <span className="w-4" />
        )}

        {isFolder ? (
          open ? (
            <FolderOpen className="h-3.5 w-3.5 text-primary shrink-0" />
          ) : (
            <Folder className="h-3.5 w-3.5 text-primary shrink-0" />
          )
        ) : (
          <File className="h-3.5 w-3.5 text-muted shrink-0" />
        )}

        <span className="truncate">{node.name}</span>
      </div>

      {isFolder && open && node.children && (
        <div className="relative">
          <div
            className="absolute top-0 bottom-0 left-[15px] w-px bg-border/60"
            style={{ left: `${level * 16 + 15}px` }}
          />
          {node.children.map((child) => (
            <TreeItem
              key={child.id}
              node={child}
              selectedId={selectedId}
              onSelect={onSelect}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function TreeView({ data, selectedId, onSelect, className }: TreeViewProps) {
  return (
    <div className={cn('rounded-xl border border-border bg-surface p-2 shadow-soft', className)}>
      {data.map((rootNode) => (
        <TreeItem key={rootNode.id} node={rootNode} selectedId={selectedId} onSelect={onSelect} />
      ))}
    </div>
  );
}
