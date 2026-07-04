import type { Spec } from '@ng-json-render/core';

/** Small, focused specs used across the docs pages. */

export const HELLO_SPEC: Spec = {
  root: 'card',
  state: { name: 'Ada' },
  elements: {
    card: {
      type: 'Card',
      props: { title: 'Hello from a spec' },
      children: ['stack'],
    },
    stack: {
      type: 'Stack',
      props: { gap: 12 },
      children: ['greeting', 'input', 'btn'],
    },
    greeting: {
      type: 'Text',
      props: { value: { $template: 'Hi, ${/name}! 👋' }, weight: 'medium' },
    },
    input: {
      type: 'Input',
      props: { label: 'Your name', value: { $bindState: '/name' } },
    },
    btn: {
      type: 'Button',
      props: { label: 'Say hello' },
      on: { press: { action: 'greet' } },
    },
  },
};

export const LAYOUT_SPEC: Spec = {
  root: 'root',
  elements: {
    root: { type: 'Stack', props: { gap: 16 }, children: ['grid', 'divider', 'row'] },
    grid: {
      type: 'Grid',
      props: { columns: 3, gap: 12 },
      children: ['c1', 'c2', 'c3'],
    },
    c1: { type: 'Card', props: { title: 'One' }, children: ['t1'] },
    t1: { type: 'Text', props: { value: 'Card in a grid' } },
    c2: { type: 'Card', props: { title: 'Two' }, children: ['t2'] },
    t2: { type: 'Text', props: { value: 'Equal columns' } },
    c3: { type: 'Card', props: { title: 'Three' }, children: ['t3'] },
    t3: { type: 'Text', props: { value: 'minmax(0, 1fr)' } },
    divider: { type: 'Divider', props: {} },
    row: {
      type: 'Stack',
      props: { direction: 'row', gap: 8, align: 'center' },
      children: ['b1', 'b2', 'b3'],
    },
    b1: { type: 'Badge', props: { label: 'Row', tone: 'info' } },
    b2: { type: 'Badge', props: { label: 'of', tone: 'neutral' } },
    b3: { type: 'Badge', props: { label: 'badges', tone: 'success' } },
  },
};

export const CONTENT_SPEC: Spec = {
  root: 'root',
  elements: {
    root: { type: 'Stack', props: { gap: 12 }, children: ['h', 'p', 'badges', 'stats'] },
    h: { type: 'Heading', props: { value: 'Typography & status', level: 2 } },
    p: {
      type: 'Text',
      props: {
        value: 'Heading, Text, Badge and Stat cover the common content needs.',
        size: 'sm',
      },
    },
    badges: {
      type: 'Stack',
      props: { direction: 'row', gap: 8 },
      children: ['bn', 'bs', 'bw', 'bd'],
    },
    bn: { type: 'Badge', props: { label: 'Neutral' } },
    bs: { type: 'Badge', props: { label: 'Success', tone: 'success' } },
    bw: { type: 'Badge', props: { label: 'Warning', tone: 'warning' } },
    bd: { type: 'Badge', props: { label: 'Danger', tone: 'danger' } },
    stats: {
      type: 'Grid',
      props: { columns: 3, gap: 12 },
      children: ['s1', 's2', 's3'],
    },
    s1: { type: 'Stat', props: { label: 'Users', value: '2,340', delta: 8 } },
    s2: { type: 'Stat', props: { label: 'Revenue', value: '$48k', delta: 12 } },
    s3: { type: 'Stat', props: { label: 'Churn', value: '1.9%', delta: -3 } },
  },
};

export const FEEDBACK_SPEC: Spec = {
  root: 'root',
  elements: {
    root: { type: 'Stack', props: { gap: 12 }, children: ['i', 's', 'w', 'd', 'p'] },
    i: { type: 'Alert', props: { tone: 'info', title: 'Info', message: 'A neutral, informational note.' } },
    s: { type: 'Alert', props: { tone: 'success', title: 'Success', message: 'That worked.' } },
    w: { type: 'Alert', props: { tone: 'warning', message: 'Careful — check your input.' } },
    d: { type: 'Alert', props: { tone: 'danger', title: 'Error', message: 'Something went wrong.' } },
    p: { type: 'Progress', props: { value: 64, label: 'Storage used' } },
  },
};

export const DATAVIZ_SPEC: Spec = {
  root: 'root',
  elements: {
    root: { type: 'Stack', props: { gap: 16 }, children: ['charts', 'table'] },
    charts: { type: 'Grid', props: { columns: 2, gap: 16 }, children: ['barCard', 'lineCard'] },
    barCard: { type: 'Card', props: { title: 'BarChart' }, children: ['bar'] },
    bar: {
      type: 'BarChart',
      props: {
        height: 140,
        data: [
          { label: 'Q1', value: 24 },
          { label: 'Q2', value: 38 },
          { label: 'Q3', value: 31 },
          { label: 'Q4', value: 45 },
        ],
      },
    },
    lineCard: { type: 'Card', props: { title: 'LineChart' }, children: ['line'] },
    line: { type: 'LineChart', props: { height: 140, data: [4, 9, 6, 12, 10, 16, 14] } },
    table: {
      type: 'Card',
      props: { title: 'Table' },
      children: ['t'],
    },
    t: {
      type: 'Table',
      props: {
        columns: [
          { key: 'name', label: 'Name' },
          { key: 'role', label: 'Role' },
          { key: 'status', label: 'Status' },
        ],
        rows: [
          { name: 'Ada Lovelace', role: 'Engineer', status: 'Active' },
          { name: 'Grace Hopper', role: 'Admiral', status: 'Active' },
        ],
      },
    },
  },
};

export const FORMS_SPEC: Spec = {
  root: 'card',
  state: {
    form: { name: '', email: '', plan: 'pro', bio: '', notify: true, terms: false },
  },
  elements: {
    card: { type: 'Card', props: { title: 'Sign up', subtitle: 'Two-way bound to state' }, children: ['stack'] },
    stack: {
      type: 'Stack',
      props: { gap: 14 },
      children: ['name', 'email', 'plan', 'bio', 'notify', 'terms', 'submit'],
    },
    name: { type: 'Input', props: { label: 'Full name', placeholder: 'Ada Lovelace', value: { $bindState: '/form/name' } } },
    email: { type: 'Input', props: { label: 'Email', type: 'email', placeholder: 'you@co', value: { $bindState: '/form/email' } } },
    plan: {
      type: 'Select',
      props: {
        label: 'Plan',
        value: { $bindState: '/form/plan' },
        options: [
          { value: 'free', label: 'Free' },
          { value: 'pro', label: 'Pro' },
          { value: 'enterprise', label: 'Enterprise' },
        ],
      },
    },
    bio: { type: 'Textarea', props: { label: 'Bio', rows: 3, value: { $bindState: '/form/bio' } } },
    notify: { type: 'Switch', props: { label: 'Email notifications', checked: { $bindState: '/form/notify' } } },
    terms: { type: 'Checkbox', props: { label: 'I accept the terms', checked: { $bindState: '/form/terms' } } },
    submit: { type: 'Button', props: { label: 'Create account' }, on: { press: { action: 'submit' } } },
  },
};
