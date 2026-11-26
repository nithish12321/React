import { useState } from 'react';
import {
  Compass,
  Code2,
  Home,
  User,
  Settings,
  Bell,
  Copy,
  Edit,
  Trash2,
  Share2,
} from 'lucide-react';
import { Tabs } from '@/components/navigation/Tabs';
import { Accordion } from '@/components/navigation/Accordion';
import { Pagination } from '@/components/navigation/Pagination';
import { Stepper } from '@/components/navigation/Stepper';
import { DropdownMenu } from '@/components/navigation/DropdownMenu';
import { ContextMenu } from '@/components/navigation/ContextMenu';
import { TreeView, type TreeNode } from '@/components/navigation/TreeView';
import { Button } from '@/components/ui/Button';

const TREE_DATA: TreeNode[] = [
  {
    id: 'src',
    name: 'src',
    children: [
      {
        id: 'components',
        name: 'components',
        children: [
          {
            id: 'ui',
            name: 'ui',
            children: [
              { id: 'button', name: 'Button.tsx' },
              { id: 'input', name: 'Input.tsx' },
            ],
          },
          { id: 'feedback', name: 'feedback', children: [{ id: 'toast', name: 'Toast.tsx' }] },
        ],
      },
      {
        id: 'features',
        name: 'features',
        children: [
          { id: 'auth', name: 'auth', children: [{ id: 'login', name: 'LoginPage.tsx' }] },
          {
            id: 'showcase',
            name: 'showcase',
            children: [{ id: 'page', name: 'ShowcasePage.tsx' }],
          },
        ],
      },
      { id: 'app', name: 'App.tsx' },
    ],
  },
];

export function SectionD() {
  const [activeTab, setActiveTab] = useState('overview');
  const [activePill, setActivePill] = useState('analytics');
  const [activeStep, setActiveStep] = useState(1);
  const [currentPage, setCurrentPage] = useState(2);
  const [pageSize, setPageSize] = useState(20);
  const [selectedTreeNode, setSelectedTreeNode] = useState<string>('button');
  const [showCode, setShowCode] = useState(false);

  const menuItems = [
    { id: '1', label: 'Edit Item', icon: <Edit className="h-3.5 w-3.5" />, shortcut: '⌘E' },
    { id: '2', label: 'Copy Link', icon: <Copy className="h-3.5 w-3.5" />, shortcut: '⌘C' },
    { id: '3', label: 'Share', icon: <Share2 className="h-3.5 w-3.5" /> },
    { id: 'sep', label: '', separator: true },
    {
      id: '4',
      label: 'Delete',
      icon: <Trash2 className="h-3.5 w-3.5" />,
      destructive: true,
      shortcut: '⌫',
    },
  ];

  return (
    <section
      id="section-d"
      className="scroll-mt-20 rounded-xl border border-border bg-surface p-6 shadow-soft transition-all"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-border">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-fg font-bold text-sm shadow-soft">
            D
          </div>
          <div>
            <div className="flex items-center gap-2">
              <Compass className="h-4 w-4 text-primary" aria-hidden />
              <h2 className="text-lg font-bold text-foreground">D · Navigation</h2>
            </div>
            <p className="mt-1 text-xs text-muted max-w-2xl">
              Tabs (horizontal, vertical, pill), accordions, standalone pagination, steppers,
              dropdowns, context menu, and tree view.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowCode((v) => !v)}
          className="flex items-center gap-1.5 self-start sm:self-center rounded-md border border-border bg-muted-surface px-2.5 py-1 text-xs font-medium text-foreground hover:bg-surface transition-colors"
        >
          <Code2 className="h-3.5 w-3.5 text-muted" />
          <span>{showCode ? 'Hide code' : 'View code'}</span>
        </button>
      </div>

      {/* Code Toggle Drawer */}
      {showCode && (
        <div className="mt-4 rounded-lg border border-border bg-muted-surface/70 p-3 font-mono text-[11px] text-foreground overflow-x-auto">
          <div className="text-muted mb-1 font-sans font-semibold">// Navigation Usage:</div>
          <pre>{`<Tabs tabs={items} activeId={active} onChange={setActive} variant="pill" />
<Accordion items={faq} type="single" />
<Pagination currentPage={page} totalPages={10} onPageChange={setPage} />
<TreeView data={treeData} onSelect={node => setSelected(node.id)} />`}</pre>
        </div>
      )}

      {/* Tabs Showcase */}
      <div className="mt-6 space-y-4">
        <div className="rounded-xl border border-border bg-surface p-4 shadow-soft space-y-4">
          <h3 className="text-xs font-semibold text-foreground">
            Tabs (Horizontal & Pill Variants)
          </h3>
          <Tabs
            variant="horizontal"
            activeId={activeTab}
            onChange={setActiveTab}
            tabs={[
              { id: 'overview', label: 'Overview', icon: <Home className="h-3.5 w-3.5" /> },
              {
                id: 'profile',
                label: 'Team Profile',
                icon: <User className="h-3.5 w-3.5" />,
                badge: 3,
              },
              { id: 'notifications', label: 'Alerts', icon: <Bell className="h-3.5 w-3.5" /> },
              { id: 'settings', label: 'Settings', icon: <Settings className="h-3.5 w-3.5" /> },
            ]}
          />

          <Tabs
            variant="pill"
            activeId={activePill}
            onChange={setActivePill}
            tabs={[
              { id: 'analytics', label: 'Analytics' },
              { id: 'reports', label: 'Reports' },
              { id: 'activity', label: 'Activity Logs' },
            ]}
          />
        </div>

        {/* Stepper & Pagination */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-xl border border-border bg-surface p-4 shadow-soft space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold text-foreground">Interactive Stepper</h3>
              <div className="flex gap-1">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setActiveStep((s) => Math.max(0, s - 1))}
                >
                  Back
                </Button>
                <Button
                  size="sm"
                  variant="default"
                  onClick={() => setActiveStep((s) => Math.min(2, s + 1))}
                >
                  Next
                </Button>
              </div>
            </div>
            <Stepper
              activeStep={activeStep}
              steps={[
                { id: '1', title: 'Details', description: 'Enter name' },
                { id: '2', title: 'Settings', description: 'Configure options' },
                { id: '3', title: 'Review', description: 'Confirm submit' },
              ]}
            />
          </div>

          <div className="rounded-xl border border-border bg-surface p-4 shadow-soft space-y-3">
            <h3 className="text-xs font-semibold text-foreground">Standalone Pagination</h3>
            <Pagination
              currentPage={currentPage}
              totalPages={8}
              onPageChange={setCurrentPage}
              pageSize={pageSize}
              onPageSizeChange={setPageSize}
              totalItems={160}
            />
          </div>
        </div>

        {/* Accordions & Dropdown / Context Menu & TreeView */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Accordion */}
          <div className="lg:col-span-1 space-y-2">
            <h3 className="text-xs font-semibold text-foreground">
              Accordion (Collapsible Panels)
            </h3>
            <Accordion
              type="single"
              defaultOpen={['item-1']}
              items={[
                {
                  id: 'item-1',
                  title: 'How do theme presets work?',
                  content:
                    'Theme presets update CSS variables directly on <html> for instant sub-millisecond switching.',
                },
                {
                  id: 'item-2',
                  title: 'Is the backend mocked?',
                  content:
                    'Yes! Mock Service Worker (MSW) intercepts all /api calls in the browser with realistic delays.',
                },
                {
                  id: 'item-3',
                  title: 'What is the token refresh lifecycle?',
                  content:
                    'Upon receiving a 401, the Axios interceptor halts in-flight requests, calls /api/auth/refresh, and retries.',
                },
              ]}
            />
          </div>

          {/* Menus */}
          <div className="lg:col-span-1 rounded-xl border border-border bg-surface p-4 shadow-soft space-y-4">
            <h3 className="text-xs font-semibold text-foreground">Dropdown & Context Menus</h3>
            <div className="space-y-4">
              <div>
                <span className="text-[11px] text-muted block mb-1.5">Click trigger:</span>
                <DropdownMenu
                  trigger={
                    <Button size="sm" variant="outline">
                      Open Actions Menu
                    </Button>
                  }
                  items={menuItems}
                />
              </div>

              <div>
                <span className="text-[11px] text-muted block mb-1.5">
                  Right-click target area:
                </span>
                <ContextMenu items={menuItems}>
                  <div className="rounded-lg border-2 border-dashed border-border bg-muted-surface/40 p-5 text-center text-xs text-muted hover:border-primary/50 transition-colors">
                    Right-click anywhere inside this box to trigger the Context Menu
                  </div>
                </ContextMenu>
              </div>
            </div>
          </div>

          {/* Tree View */}
          <div className="lg:col-span-1 space-y-2">
            <h3 className="text-xs font-semibold text-foreground">
              Tree View (Recursive Hierarchy)
            </h3>
            <TreeView
              data={TREE_DATA}
              selectedId={selectedTreeNode}
              onSelect={(node) => setSelectedTreeNode(node.id)}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
