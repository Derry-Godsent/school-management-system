import { Check, Eye, Minus, ShieldCheck } from 'lucide-react';
import { modules, permissions, roles, type Access } from '../../../data/admin';
import { useStaffAuth } from '../AuthContext';
import { Avatar, Badge, Card, CardHead, CardPad, PageHead } from '../ui';

/**
 * Access.
 *
 * The permission table, shown as a table. This is the screen that answers the
 * question every head teacher asks before a system goes live: who can see the
 * money, and who can change a mark?
 *
 * It is read from the same object the navigation and the screens read from, so
 * it cannot describe a system different from the one running. A tick means the
 * role may change the record, an eye means they may read it, and a dash means
 * the module does not exist for them at all.
 */

const CELL: Record<Access, { icon: typeof Check; label: string; className: string }> = {
  edit: { icon: Check, label: 'May change', className: 'bg-tint-green text-green-deep' },
  view: { icon: Eye, label: 'May read', className: 'bg-tint-purple text-purple-deep' },
  none: { icon: Minus, label: 'No access', className: 'bg-canvas text-ink-mute' },
};

export function AccessScreen() {
  const { auth } = useStaffAuth();
  if (!auth) return null;

  return (
    <div className="space-y-5">
      <PageHead
        title="Access"
        sub="Who may read a record, and who may change it"
        actions={<Badge tone="green">Six roles</Badge>}
      />

      <Card tone="green">
        <CardPad>
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-paper">
              <ShieldCheck size={18} className="text-green-deep" aria-hidden="true" />
            </span>
            <p className="text-[0.8125rem] leading-relaxed text-ink">
              A member of staff is given a role, not a list of permissions. The role decides what
              the console shows them, and the menu is built from this same table, so nothing is
              hidden behind a door that still opens.
            </p>
          </div>
        </CardPad>
      </Card>

      <Card>
        <CardHead title="The matrix" sub="Rows are modules, columns are roles" icon={ShieldCheck} tone="purple" />
        <div className="overflow-x-auto">
          <table className="w-full min-w-[46rem] border-collapse text-left">
            <thead>
              <tr>
                <th scope="col" className="sticky left-0 z-10 border-b border-rule bg-paper px-4 py-3 text-[0.6875rem] font-semibold uppercase tracking-[0.08em] text-ink-mute">
                  Module
                </th>
                {roles.map(role => (
                  <th key={role.id} scope="col" className="border-b border-rule px-2 py-3 text-center">
                    <span className="mx-auto flex w-16 flex-col items-center gap-1">
                      <Avatar name={role.name} size="sm" tone={role.tone} />
                      <span className="text-[0.625rem] font-medium leading-tight text-ink-mute">
                        {role.title.replace('School ', '').replace(' Teacher', '')}
                      </span>
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {modules.map(module => (
                <tr key={module.id} className="border-b border-rule last:border-0">
                  <th scope="row" className="sticky left-0 z-10 bg-paper px-4 py-2.5 text-left">
                    <span className="block text-[0.8125rem] font-medium text-ink">{module.label}</span>
                    <span className="block text-[0.6875rem] text-ink-mute">{module.short}</span>
                  </th>
                  {roles.map(role => {
                    const held = permissions[role.id][module.id] ?? 'none';
                    const cell = CELL[held];
                    const Icon = cell.icon;
                    return (
                      <td key={role.id} className="px-2 py-2.5 text-center">
                        <span
                          title={`${role.title}: ${cell.label} ${module.label}`}
                          className={`mx-auto flex h-8 w-8 items-center justify-center rounded-lg ${cell.className}`}
                        >
                          <Icon size={14} aria-hidden="true" />
                          <span className="sr-only">
                            {role.title} {cell.label} {module.label}
                          </span>
                        </span>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex flex-wrap items-center gap-3 border-t border-rule px-4 py-3 sm:px-5">
          {(Object.keys(CELL) as Access[]).map(key => {
            const Icon = CELL[key].icon;
            return (
              <span key={key} className="flex items-center gap-1.5 text-[0.75rem] text-ink">
                <span className={`flex h-6 w-6 items-center justify-center rounded-md ${CELL[key].className}`}>
                  <Icon size={12} aria-hidden="true" />
                </span>
                {CELL[key].label}
              </span>
            );
          })}
        </div>
      </Card>

      <Card>
        <CardHead title="The roles, in words" sub="What each desk does all day" icon={ShieldCheck} tone="orange" />
        <ul>
          {roles.map(role => (
            <li key={role.id} className="border-t border-rule px-4 py-4 first:border-0 sm:px-5">
              <div className="flex items-start gap-3">
                <Avatar name={role.name} tone={role.tone} />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-[0.875rem] font-semibold text-ink">{role.title}</p>
                    <Badge tone={role.tone}>{role.name}</Badge>
                  </div>
                  <p className="mt-1 text-[0.8125rem] leading-relaxed text-ink-mute">{role.blurb}</p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {Object.entries(permissions[role.id])
                      .filter(([, access]) => access === 'edit')
                      .map(([moduleId]) => (
                        <Badge key={moduleId} tone="green">
                          {modules.find(module => module.id === moduleId)?.label ?? moduleId}
                        </Badge>
                      ))}
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}

export default AccessScreen;
