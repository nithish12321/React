import { Eye, Trash2, UserCheck } from 'lucide-react';
import type { BulkAction, ColumnConfig, RowAction } from '@/components/data-table/types';
import type { ShowcaseUser } from '@/mocks/data/users';

export function createUserColumns(
  onNameEdit: (row: ShowcaseUser, name: string) => Promise<void> | void,
): ColumnConfig<ShowcaseUser>[] {
  return [
    {
      id: 'user',
      header: 'User',
      accessorKey: 'name',
      cellRenderer: 'avatar',
      cellRendererProps: { subtitleKey: 'email' },
      width: 220,
      minWidth: 160,
      pinned: 'left',
    },
    {
      id: 'name',
      header: 'Name',
      accessorKey: 'name',
      width: 160,
      editable: true,
      onEdit: onNameEdit,
      filterType: 'text',
    },
    {
      id: 'email',
      header: 'Email',
      accessorKey: 'email',
      cellRenderer: 'link',
      width: 200,
      filterType: 'text',
    },
    {
      id: 'role',
      header: 'Role',
      accessorKey: 'role',
      cellRenderer: 'badge',
      width: 120,
      filterType: 'select',
      filterOptions: [
        { label: 'Admin', value: 'admin' },
        { label: 'Manager', value: 'manager' },
        { label: 'Staff', value: 'staff' },
        { label: 'Guest', value: 'guest' },
      ],
    },
    {
      id: 'status',
      header: 'Status',
      accessorKey: 'status',
      cellRenderer: 'badge',
      width: 120,
      filterType: 'select',
      filterOptions: [
        { label: 'Active', value: 'active' },
        { label: 'Pending', value: 'pending' },
        { label: 'Inactive', value: 'inactive' },
      ],
    },
    {
      id: 'progress',
      header: 'Progress',
      accessorKey: 'progress',
      cellRenderer: 'progress',
      width: 160,
      filterType: 'number-range',
    },
    {
      id: 'salary',
      header: 'Salary',
      accessorKey: 'salary',
      cellRenderer: 'currency',
      cellRendererProps: { currency: '$' },
      width: 120,
      filterType: 'number-range',
    },
    {
      id: 'verified',
      header: 'Verified',
      accessorKey: 'verified',
      cellRenderer: 'boolean',
      width: 110,
      filterType: 'select',
      filterOptions: [
        { label: 'Yes', value: 'true' },
        { label: 'No', value: 'false' },
      ],
    },
    {
      id: 'createdAt',
      header: 'Created',
      accessorKey: 'createdAt',
      cellRenderer: 'date',
      cellRendererProps: { dateFormat: 'MMM dd, yyyy' },
      width: 140,
      filterType: 'date-range',
    },
  ];
}

export function createUserBulkActions(
  onAction: (kind: string, rows: ShowcaseUser[]) => void,
): BulkAction<ShowcaseUser>[] {
  return [
    {
      id: 'activate',
      label: 'Activate',
      icon: UserCheck className="h-3.5 w-3.5" />,
      variant: 'primary',
      onClick: (rows, clear) => {
        onAction('activate', rows);
        clear();
      },
    },
    {
      id: 'delete',
      label: 'Remove',
      variant: 'danger',
      onClick: (rows, clear) => {
        onAction('delete', rows);
        clear();
      },
    },
  ];
}

export function createUserRowActions(
  onAction: (kind: string, row: ShowcaseUser) => void,
): RowAction<ShowcaseUser>[] {
  return [
    {
      id: 'view',
      label: 'View profile',
      icon: <Eye className="h-4 w-4" />,
      onClick: (row) => onAction('view', row),
    },
    {
      id: 'remove',
      label: 'Remove',
      icon: <Trash2 className="h-4 w-4" />,
      danger: true,
      onClick: (row) => onAction('remove', row),
    },
  ];
}
