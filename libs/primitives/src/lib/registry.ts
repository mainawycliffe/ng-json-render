import { type JrRegistry, defineRegistry } from '@ng-json-render/core';
import { JrBarChart, JrLineChart } from './charts';
import { JrBadge, JrHeading, JrStat, JrText } from './content';
import {
  JrButton,
  JrCheckbox,
  JrInput,
  JrSelect,
  JrSwitch,
  JrTextarea,
} from './forms';
import { JrAlert, JrProgress } from './feedback';
import { JrCard, JrContainer, JrDivider, JrGrid, JrStack } from './layout';
import { JrTable } from './table';

/**
 * Registry of all built-in primitive components, keyed by catalog `type`.
 * Pass to `<jr-renderer [registry]="primitivesRegistry">` or
 * `provideJsonRender({ registry: primitivesRegistry })`.
 */
export const primitivesRegistry: JrRegistry = defineRegistry({
  // layout
  Container: JrContainer,
  Stack: JrStack,
  Grid: JrGrid,
  Card: JrCard,
  Divider: JrDivider,
  // content
  Heading: JrHeading,
  Text: JrText,
  Badge: JrBadge,
  Stat: JrStat,
  // feedback
  Alert: JrAlert,
  Progress: JrProgress,
  // data
  Table: JrTable,
  BarChart: JrBarChart,
  LineChart: JrLineChart,
  // forms
  Input: JrInput,
  Textarea: JrTextarea,
  Select: JrSelect,
  Checkbox: JrCheckbox,
  Switch: JrSwitch,
  Button: JrButton,
});
