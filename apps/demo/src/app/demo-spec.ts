import type { Spec } from '@ng-json-render/core';

/**
 * A hand-written spec standing in for AI-generated output. Its shape is exactly
 * what a model produces against a catalog: a flat tree of typed elements the
 * renderer resolves against the primitives registry. Form inputs two-way bind to
 * `state` via `$bindState`; text/stat values read live via `$state` / `$template`.
 */
export const DEMO_SPEC: Spec = {
  root: 'page',
  state: {
    settings: {
      workspace: 'Acme Inc',
      plan: 'pro',
      seats: '12',
      notifications: true,
      weeklyReport: false,
    },
  },
  elements: {
    page: { type: 'Container', props: { maxWidth: 1120 }, children: ['root'] },
    root: {
      type: 'Stack',
      props: { gap: 24 },
      children: ['header', 'stats', 'charts', 'signups', 'bottom'],
    },

    // ── Header ────────────────────────────────────────────────
    header: {
      type: 'Stack',
      props: { direction: 'row', justify: 'space-between', align: 'center' },
      children: ['headerLeft', 'headerRight'],
    },
    headerLeft: {
      type: 'Stack',
      props: { gap: 4 },
      children: ['h1', 'sub'],
    },
    h1: { type: 'Heading', props: { value: 'Analytics', level: 1 } },
    sub: {
      type: 'Text',
      props: {
        value: { $template: '${/settings/workspace} · workspace overview' },
        size: 'sm',
      },
    },
    headerRight: {
      type: 'Stack',
      props: { direction: 'row', gap: 10, align: 'center' },
      children: ['liveBadge', 'exportBtn'],
    },
    liveBadge: { type: 'Badge', props: { label: 'Live', tone: 'success' } },
    exportBtn: {
      type: 'Button',
      props: { label: 'Export report', variant: 'secondary' },
      on: { press: { action: 'export' } },
    },

    // ── KPI stats ─────────────────────────────────────────────
    stats: {
      type: 'Grid',
      props: { columns: 4, gap: 16 },
      children: ['s1', 's2', 's3', 's4'],
    },
    s1: { type: 'Card', props: {}, children: ['s1v'] },
    s1v: {
      type: 'Stat',
      props: { label: 'Revenue', value: '$48.2k', delta: 12 },
    },
    s2: { type: 'Card', props: {}, children: ['s2v'] },
    s2v: {
      type: 'Stat',
      props: { label: 'Active users', value: '2,340', delta: 8 },
    },
    s3: { type: 'Card', props: {}, children: ['s3v'] },
    s3v: {
      type: 'Stat',
      props: { label: 'Churn', value: '1.9%', delta: -3 },
    },
    s4: { type: 'Card', props: {}, children: ['s4v'] },
    s4v: {
      type: 'Stat',
      props: { label: 'NPS', value: '61', delta: 5 },
    },

    // ── Charts ────────────────────────────────────────────────
    charts: {
      type: 'Grid',
      props: { columns: 2, gap: 16 },
      children: ['barCard', 'lineCard'],
    },
    barCard: {
      type: 'Card',
      props: { title: 'Revenue by month', subtitle: 'Last 6 months' },
      children: ['bar'],
    },
    bar: {
      type: 'BarChart',
      props: {
        height: 180,
        data: [
          { label: 'Jan', value: 24 },
          { label: 'Feb', value: 31 },
          { label: 'Mar', value: 28 },
          { label: 'Apr', value: 40 },
          { label: 'May', value: 44 },
          { label: 'Jun', value: 48 },
        ],
      },
    },
    lineCard: {
      type: 'Card',
      props: { title: 'Active users', subtitle: 'Trailing 12 weeks' },
      children: ['line'],
    },
    line: {
      type: 'LineChart',
      props: {
        height: 180,
        data: [12, 18, 15, 22, 19, 27, 24, 30, 28, 34, 33, 41],
      },
    },

    // ── Table ─────────────────────────────────────────────────
    signups: {
      type: 'Card',
      props: { title: 'Recent signups' },
      children: ['table'],
    },
    table: {
      type: 'Table',
      props: {
        columns: [
          { key: 'name', label: 'Name' },
          { key: 'email', label: 'Email' },
          { key: 'plan', label: 'Plan' },
          { key: 'joined', label: 'Joined' },
        ],
        rows: [
          { name: 'Ada Lovelace', email: 'ada@calc.io', plan: 'Pro', joined: 'Jul 1' },
          { name: 'Grace Hopper', email: 'grace@navy.mil', plan: 'Enterprise', joined: 'Jun 28' },
          { name: 'Alan Turing', email: 'alan@bletchley.uk', plan: 'Free', joined: 'Jun 27' },
          { name: 'Katherine Johnson', email: 'kj@nasa.gov', plan: 'Pro', joined: 'Jun 25' },
        ],
      },
    },

    // ── Settings form + live state ────────────────────────────
    bottom: {
      type: 'Grid',
      props: { columns: 2, gap: 16 },
      children: ['formCard', 'previewCard'],
    },
    formCard: {
      type: 'Card',
      props: { title: 'Workspace settings', subtitle: 'Bound to state via $bindState' },
      children: ['form'],
    },
    form: {
      type: 'Stack',
      props: { gap: 16 },
      children: ['fWorkspace', 'fPlan', 'fSeats', 'fNotify', 'fWeekly', 'fDivider', 'fSave'],
    },
    fWorkspace: {
      type: 'Input',
      props: { label: 'Workspace name', value: { $bindState: '/settings/workspace' } },
    },
    fPlan: {
      type: 'Select',
      props: {
        label: 'Plan',
        value: { $bindState: '/settings/plan' },
        options: [
          { value: 'free', label: 'Free' },
          { value: 'pro', label: 'Pro' },
          { value: 'enterprise', label: 'Enterprise' },
        ],
      },
    },
    fSeats: {
      type: 'Input',
      props: {
        label: 'Seats',
        type: 'number',
        value: { $bindState: '/settings/seats' },
      },
    },
    fNotify: {
      type: 'Switch',
      props: { label: 'Email notifications', checked: { $bindState: '/settings/notifications' } },
    },
    fWeekly: {
      type: 'Checkbox',
      props: { label: 'Send weekly report', checked: { $bindState: '/settings/weeklyReport' } },
    },
    fDivider: { type: 'Divider', props: {} },
    fSave: {
      type: 'Button',
      props: { label: 'Save changes' },
      on: { press: { action: 'save' } },
    },

    previewCard: {
      type: 'Card',
      props: { title: 'Live state', subtitle: 'Reflects your edits in real time' },
      children: ['preview'],
    },
    preview: {
      type: 'Stack',
      props: { gap: 12 },
      children: ['pWorkspace', 'pPlan', 'pSeats', 'pAlert'],
    },
    pWorkspace: {
      type: 'Text',
      props: { value: { $template: 'Workspace: ${/settings/workspace}' }, weight: 'medium' },
    },
    pPlan: {
      type: 'Text',
      props: { value: { $template: 'Plan: ${/settings/plan} · Seats: ${/settings/seats}' } },
    },
    pSeats: {
      type: 'Text',
      props: {
        value: { $template: 'Notifications: ${/settings/notifications} · Weekly report: ${/settings/weeklyReport}' },
        size: 'sm',
      },
    },
    pAlert: {
      type: 'Alert',
      props: {
        tone: 'info',
        title: 'Server-driven',
        message: 'This whole page — layout, charts, table, and form — is one JSON spec rendered into native Angular components.',
      },
    },
  },
};
