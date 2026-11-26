import { useState } from 'react';
import { HelpCircle, User } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Modal, type ModalSize } from '@/components/ui/Modal';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { Drawer, type DrawerPosition } from '@/components/ui/Drawer';
import { Popover } from '@/components/ui/Popover';
import { Tooltip } from '@/components/ui/Tooltip';
import { HoverCard } from '@/components/ui/HoverCard';

export function SectionCOverlays() {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalSize, setModalSize] = useState<ModalSize>('md');
  const [nestedOpen, setNestedOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerPos, setDrawerPos] = useState<DrawerPosition>('right');

  return (
    <div className="space-y-6">
      {/* Modals & Dialogs */}
      <div className="rounded-xl border border-border bg-surface p-4 shadow-soft space-y-3">
        <h3 className="text-xs font-semibold text-foreground">Modals & Dialogs (Sizes & Nested)</h3>
        <p className="text-xs text-muted">
          Accessible modals with customizable size (sm, md, lg, xl, full) and nested overlay
          support.
        </p>

        <div className="flex flex-wrap items-center gap-2 pt-2">
          {(['sm', 'md', 'lg', 'xl'] as ModalSize[]).map((s) => (
            <Button
              key={s}
              variant="outline"
              size="sm"
              onClick={() => {
                setModalSize(s);
                setModalOpen(true);
              }}
            >
              Open Modal ({s.toUpperCase()})
            </Button>
          ))}

          <Button variant="danger" size="sm" onClick={() => setConfirmOpen(true)}>
            Confirm Dialog
          </Button>
        </div>
      </div>

      {/* Modal Instance */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        size={modalSize}
        title={`Modal Dialog (${modalSize.toUpperCase()})`}
        description="Demonstrating Radix-style accessible overlay with keyboard Esc & backdrop dismiss."
      >
        <div className="space-y-4 py-2">
          <p className="text-xs text-muted leading-relaxed">
            This dialog handles focus trap, outside click dismissal, smooth scale animations, and
            theme-token borders.
          </p>

          <div className="rounded-lg bg-muted-surface/50 p-3 border border-border">
            <span className="text-xs font-semibold text-foreground block mb-2">
              Nested Modal Test:
            </span>
            <Button size="sm" variant="outline" onClick={() => setNestedOpen(true)}>
              Open Nested Child Modal
            </Button>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-border">
            <Button variant="outline" size="sm" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="default" size="sm" onClick={() => setModalOpen(false)}>
              Save Changes
            </Button>
          </div>
        </div>
      </Modal>

      {/* Nested Modal */}
      <Modal
        open={nestedOpen}
        onClose={() => setNestedOpen(false)}
        size="sm"
        title="Nested Confirmation Modal"
      >
        <div className="py-2 text-xs space-y-3">
          <p className="text-muted">
            This child modal renders over the parent modal without z-index conflicts.
          </p>
          <Button size="sm" variant="default" onClick={() => setNestedOpen(false)}>
            Close Nested Modal
          </Button>
        </div>
      </Modal>

      {/* Confirm Dialog Instance */}
      <ConfirmDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={() => setConfirmOpen(false)}
        title="Delete Resource?"
        message="Are you sure you want to delete this resource? This action cannot be reversed."
        confirmLabel="Delete Forever"
        variant="danger"
      />

      {/* Slide-out Drawers (4 Directions) */}
      <div className="rounded-xl border border-border bg-surface p-4 shadow-soft space-y-3">
        <h3 className="text-xs font-semibold text-foreground">Slide-out Drawers (4 Positions)</h3>
        <p className="text-xs text-muted">
          Drawers sliding in from Right, Left, Top, or Bottom with backdrop blur.
        </p>

        <div className="flex flex-wrap items-center gap-2 pt-2">
          {(['right', 'left', 'bottom', 'top'] as DrawerPosition[]).map((pos) => (
            <Button
              key={pos}
              variant="outline"
              size="sm"
              onClick={() => {
                setDrawerPos(pos);
                setDrawerOpen(true);
              }}
            >
              Drawer ({pos})
            </Button>
          ))}
        </div>
      </div>

      {/* Drawer Instance */}
      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        position={drawerPos}
        title={`Slide-out Panel (${drawerPos})`}
      >
        <div className="space-y-3 text-xs text-muted leading-relaxed">
          <p>
            This drawer is mounted on the {drawerPos} edge with responsive width/height and backdrop
            dismiss.
          </p>
          <div className="rounded-md bg-muted-surface p-3 border border-border text-foreground font-mono">
            Position: {drawerPos}
          </div>
          <Button size="sm" variant="default" onClick={() => setDrawerOpen(false)}>
            Done
          </Button>
        </div>
      </Drawer>

      {/* Floating Overlays: Popover, Tooltip, HoverCard */}
      <div className="rounded-xl border border-border bg-surface p-4 shadow-soft space-y-3">
        <h3 className="text-xs font-semibold text-foreground">
          Floating Popovers, Tooltips & HoverCards
        </h3>
        <p className="text-xs text-muted">
          Lightweight contextual overlays triggered by click or hover.
        </p>

        <div className="flex flex-wrap items-center gap-6 pt-2">
          {/* Popover */}
          <Popover
            trigger={
              <Button size="sm" variant="outline">
                Click Popover
              </Button>
            }
          >
            <div className="space-y-2 text-xs">
              <h4 className="font-semibold text-foreground">Quick Settings</h4>
              <p className="text-[11px] text-muted">
                Configure lightweight options directly from this floating card.
              </p>
            </div>
          </Popover>

          {/* Tooltip */}
          <Tooltip content="Tooltip helper text on hover" position="top">
            <Button size="sm" variant="ghost" prefixIcon={<HelpCircle className="h-4 w-4" />}>
              Hover for Tooltip
            </Button>
          </Tooltip>

          {/* Hover Card */}
          <HoverCard
            trigger={
              <div className="flex items-center gap-2 rounded-md border border-border px-3 py-1.5 text-xs font-medium hover:bg-muted-surface cursor-pointer">
                <User className="h-4 w-4 text-primary" />
                <span>@alex_developer</span>
              </div>
            }
          >
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary font-bold text-xs">
                AD
              </div>
              <div className="space-y-1 text-xs min-w-0">
                <h4 className="font-bold text-foreground">Alex Developer</h4>
                <p className="text-[11px] text-muted">Senior Software Engineer · San Francisco</p>
                <div className="flex gap-3 text-[10px] text-muted pt-1">
                  <span>
                    <strong className="text-foreground">1.4k</strong> Following
                  </span>
                  <span>
                    <strong className="text-foreground">8.2k</strong> Followers
                  </span>
                </div>
              </div>
            </div>
          </HoverCard>
        </div>
      </div>
    </div>
  );
}
