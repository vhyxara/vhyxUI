// Component definitions — prop controls, default values, tokens, and contracts per component.

export type ControlType = 'select' | 'switch' | 'input';

export interface PropControl {
  key: string;
  label: string;
  type: ControlType;
  options?: string[];
}

export interface ComponentDef {
  id: string;
  name: string;
  group: string;
  description: string;
  defaultProps: Record<string, unknown>;
  controls: PropControl[];
  tokens: Array<{ name: string; desc: string }>;
  contract: Record<string, string>;
}

export const COMPONENT_GROUPS = [
  { label: 'Inputs', ids: ['button', 'input', 'textarea', 'checkbox', 'radio', 'switch'] },
  { label: 'Form', ids: ['select'] },
  { label: 'Feedback', ids: ['badge', 'progress', 'spinner', 'alert'] },
  { label: 'Display', ids: ['card', 'separator'] },
  { label: 'Overlay', ids: ['dialog', 'drawer', 'tooltip', 'popover'] },
  { label: 'Navigation', ids: ['tabs', 'breadcrumb', 'pagination'] },
];

export const COMPONENT_DEFS: Record<string, ComponentDef> = {
  button: {
    id: 'button',
    name: 'Button',
    group: 'Inputs',
    description: 'Triggers actions or submits forms.',
    defaultProps: {
      variant: 'primary',
      size: 'md',
      loading: false,
      disabled: false,
      iconOnly: false,
      children: 'Click me',
    },
    controls: [
      { key: 'children', label: 'children', type: 'input' },
      { key: 'variant', label: 'variant', type: 'select', options: ['primary', 'secondary', 'outline', 'ghost', 'destructive', 'link'] },
      { key: 'size', label: 'size', type: 'select', options: ['xs', 'sm', 'md', 'lg'] },
      { key: 'loading', label: 'loading', type: 'switch' },
      { key: 'disabled', label: 'disabled', type: 'switch' },
      { key: 'iconOnly', label: 'iconOnly', type: 'switch' },
    ],
    tokens: [
      { name: '--vhyx-size-md', desc: 'Height' },
      { name: '--vhyx-color-accent', desc: 'Primary bg' },
      { name: '--vhyx-color-accent-hover', desc: 'Hover bg' },
      { name: '--vhyx-radius-md', desc: 'Border radius' },
      { name: '--vhyx-shadow-focus', desc: 'Focus ring' },
      { name: '--vhyx-duration-instant', desc: 'Active scale' },
    ],
    contract: {
      type: 'action',
      intent: 'trigger-action',
      safetyLevel: 'low',
      destructive: 'false',
      requiresConfirmation: 'false',
      contractVersion: '0.0.1',
    },
  },

  input: {
    id: 'input',
    name: 'Input',
    group: 'Inputs',
    description: 'Text input with icon, prefix, suffix, clear, and password toggle.',
    defaultProps: {
      size: 'md',
      placeholder: 'Enter text…',
      error: false,
      disabled: false,
      type: 'text',
    },
    controls: [
      { key: 'placeholder', label: 'placeholder', type: 'input' },
      { key: 'size', label: 'size', type: 'select', options: ['sm', 'md', 'lg'] },
      { key: 'type', label: 'type', type: 'select', options: ['text', 'email', 'password', 'search', 'number'] },
      { key: 'error', label: 'error', type: 'switch' },
      { key: 'disabled', label: 'disabled', type: 'switch' },
    ],
    tokens: [
      { name: '--vhyx-size-md', desc: 'Height' },
      { name: '--vhyx-color-border', desc: 'Default border' },
      { name: '--vhyx-color-border-focus', desc: 'Focus border' },
      { name: '--vhyx-color-danger', desc: 'Error border' },
      { name: '--vhyx-radius-md', desc: 'Border radius' },
    ],
    contract: {
      type: 'input',
      intent: 'collect-text-input',
      safetyLevel: 'low',
      contractVersion: '0.0.1',
    },
  },

  textarea: {
    id: 'textarea',
    name: 'Textarea',
    group: 'Inputs',
    description: 'Multi-line text input with auto-resize and character count.',
    defaultProps: {
      size: 'md',
      placeholder: 'Write something…',
      error: false,
      disabled: false,
      resize: 'vertical',
      showCount: false,
    },
    controls: [
      { key: 'placeholder', label: 'placeholder', type: 'input' },
      { key: 'size', label: 'size', type: 'select', options: ['sm', 'md', 'lg'] },
      { key: 'resize', label: 'resize', type: 'select', options: ['none', 'vertical', 'horizontal', 'both', 'auto'] },
      { key: 'showCount', label: 'showCount', type: 'switch' },
      { key: 'error', label: 'error', type: 'switch' },
      { key: 'disabled', label: 'disabled', type: 'switch' },
    ],
    tokens: [
      { name: '--vhyx-size-md', desc: 'Min height' },
      { name: '--vhyx-color-border', desc: 'Default border' },
      { name: '--vhyx-radius-md', desc: 'Border radius' },
    ],
    contract: {
      type: 'input',
      intent: 'collect-text-input',
      safetyLevel: 'low',
      contractVersion: '0.0.1',
    },
  },

  checkbox: {
    id: 'checkbox',
    name: 'Checkbox',
    group: 'Inputs',
    description: 'Toggles a boolean or indeterminate selection.',
    defaultProps: { size: 'md', checked: false, disabled: false, indeterminate: false },
    controls: [
      { key: 'size', label: 'size', type: 'select', options: ['sm', 'md', 'lg'] },
      { key: 'checked', label: 'checked', type: 'switch' },
      { key: 'indeterminate', label: 'indeterminate', type: 'switch' },
      { key: 'disabled', label: 'disabled', type: 'switch' },
    ],
    tokens: [
      { name: '--vhyx-color-accent', desc: 'Checked bg' },
      { name: '--vhyx-size-md', desc: 'Dimensions' },
      { name: '--vhyx-radius-sm', desc: 'Border radius' },
      { name: '--vhyx-duration-fast', desc: 'Checkmark anim' },
      { name: '--vhyx-easing-spring', desc: 'Checkmark easing' },
    ],
    contract: {
      type: 'input',
      intent: 'toggle-selection',
      safetyLevel: 'low',
      contractVersion: '0.0.1',
    },
  },

  radio: {
    id: 'radio',
    name: 'Radio',
    group: 'Inputs',
    description: 'Group of mutually exclusive options.',
    defaultProps: { size: 'md', orientation: 'vertical', disabled: false },
    controls: [
      { key: 'size', label: 'size', type: 'select', options: ['sm', 'md', 'lg'] },
      { key: 'orientation', label: 'orientation', type: 'select', options: ['vertical', 'horizontal'] },
      { key: 'disabled', label: 'disabled', type: 'switch' },
    ],
    tokens: [
      { name: '--vhyx-color-accent', desc: 'Selected indicator' },
      { name: '--vhyx-radius-full', desc: 'Circular shape' },
      { name: '--vhyx-duration-fast', desc: 'Selection anim' },
    ],
    contract: {
      type: 'input',
      intent: 'select-exclusive-option',
      safetyLevel: 'low',
      contractVersion: '0.0.1',
    },
  },

  switch: {
    id: 'switch',
    name: 'Switch',
    group: 'Inputs',
    description: 'Toggles a binary on/off state with spring animation.',
    defaultProps: { size: 'md', checked: false, disabled: false },
    controls: [
      { key: 'size', label: 'size', type: 'select', options: ['sm', 'md', 'lg'] },
      { key: 'checked', label: 'checked', type: 'switch' },
      { key: 'disabled', label: 'disabled', type: 'switch' },
    ],
    tokens: [
      { name: '--vhyx-color-accent', desc: 'Track on' },
      { name: '--vhyx-color-bg-muted', desc: 'Track off' },
      { name: '--vhyx-duration-normal', desc: 'Thumb transition' },
      { name: '--vhyx-easing-spring', desc: 'Thumb easing' },
    ],
    contract: {
      type: 'action',
      intent: 'toggle-state',
      safetyLevel: 'low',
      reversible: 'true',
      contractVersion: '0.0.1',
    },
  },

  select: {
    id: 'select',
    name: 'Select',
    group: 'Form',
    description: 'Dropdown with keyboard navigation and type-ahead.',
    defaultProps: { size: 'md', disabled: false, placeholder: 'Select an option…' },
    controls: [
      { key: 'placeholder', label: 'placeholder', type: 'input' },
      { key: 'size', label: 'size', type: 'select', options: ['sm', 'md', 'lg'] },
      { key: 'disabled', label: 'disabled', type: 'switch' },
    ],
    tokens: [
      { name: '--vhyx-z-dropdown', desc: 'Z-index' },
      { name: '--vhyx-shadow-lg', desc: 'Dropdown shadow' },
      { name: '--vhyx-radius-md', desc: 'Dropdown radius' },
      { name: '--vhyx-color-accent-subtle', desc: 'Selected item bg' },
    ],
    contract: {
      type: 'input',
      intent: 'select-option',
      safetyLevel: 'low',
      contractVersion: '0.0.1',
    },
  },

  badge: {
    id: 'badge',
    name: 'Badge',
    group: 'Feedback',
    description: 'Small status label, count indicator, or dot.',
    defaultProps: { variant: 'default', size: 'md', dot: false, children: 'Badge' },
    controls: [
      { key: 'children', label: 'children', type: 'input' },
      { key: 'variant', label: 'variant', type: 'select', options: ['default', 'success', 'warning', 'danger', 'info', 'outline'] },
      { key: 'size', label: 'size', type: 'select', options: ['sm', 'md', 'lg'] },
      { key: 'dot', label: 'dot', type: 'switch' },
    ],
    tokens: [
      { name: '--vhyx-radius-full', desc: 'Pill shape' },
      { name: '--vhyx-text-xs', desc: 'Font size' },
      { name: '--vhyx-color-success', desc: 'Success bg' },
      { name: '--vhyx-color-danger', desc: 'Danger bg' },
    ],
    contract: {},
  },

  progress: {
    id: 'progress',
    name: 'Progress',
    group: 'Feedback',
    description: 'Task completion bar with determinate and indeterminate states.',
    defaultProps: { value: 60, size: 'md', variant: 'default', showLabel: false, indeterminate: false },
    controls: [
      { key: 'variant', label: 'variant', type: 'select', options: ['default', 'success', 'warning', 'danger'] },
      { key: 'size', label: 'size', type: 'select', options: ['xs', 'sm', 'md', 'lg'] },
      { key: 'showLabel', label: 'showLabel', type: 'switch' },
      { key: 'indeterminate', label: 'indeterminate', type: 'switch' },
    ],
    tokens: [
      { name: '--vhyx-color-accent', desc: 'Default fill' },
      { name: '--vhyx-radius-full', desc: 'Track radius' },
      { name: '--vhyx-duration-slow', desc: 'Fill transition' },
    ],
    contract: {
      type: 'display',
      intent: 'show-progress',
      safetyLevel: 'low',
      contractVersion: '0.0.1',
    },
  },

  spinner: {
    id: 'spinner',
    name: 'Spinner',
    group: 'Feedback',
    description: 'SVG loading indicator.',
    defaultProps: { size: 'md', variant: 'default', label: 'Loading' },
    controls: [
      { key: 'size', label: 'size', type: 'select', options: ['xs', 'sm', 'md', 'lg', 'xl'] },
      { key: 'variant', label: 'variant', type: 'select', options: ['default', 'accent', 'white'] },
      { key: 'label', label: 'label', type: 'input' },
    ],
    tokens: [
      { name: '--vhyx-color-text-muted', desc: 'Default color' },
      { name: '--vhyx-color-accent', desc: 'Accent variant' },
    ],
    contract: {
      type: 'display',
      intent: 'show-loading-state',
      safetyLevel: 'low',
      contractVersion: '0.0.1',
    },
  },

  alert: {
    id: 'alert',
    name: 'Alert',
    group: 'Feedback',
    description: 'Persistent in-page notification.',
    defaultProps: { variant: 'info', title: 'Heads up', children: 'This is an alert message.', dismissible: false },
    controls: [
      { key: 'variant', label: 'variant', type: 'select', options: ['default', 'success', 'warning', 'danger', 'info'] },
      { key: 'title', label: 'title', type: 'input' },
      { key: 'children', label: 'message', type: 'input' },
      { key: 'dismissible', label: 'dismissible', type: 'switch' },
    ],
    tokens: [
      { name: '--vhyx-color-*-subtle', desc: 'Variant backgrounds' },
      { name: '--vhyx-radius-md', desc: 'Border radius' },
      { name: '--vhyx-duration-normal', desc: 'Fade-in animation' },
    ],
    contract: {
      type: 'display',
      intent: 'display-alert',
      safetyLevel: 'low',
      contractVersion: '0.0.1',
    },
  },

  card: {
    id: 'card',
    name: 'Card',
    group: 'Display',
    description: 'Content container with variants and interactive states.',
    defaultProps: { variant: 'outline', padding: 'md', interactive: false },
    controls: [
      { key: 'variant', label: 'variant', type: 'select', options: ['default', 'outline', 'ghost', 'elevated'] },
      { key: 'padding', label: 'padding', type: 'select', options: ['none', 'sm', 'md', 'lg'] },
      { key: 'interactive', label: 'interactive', type: 'switch' },
    ],
    tokens: [
      { name: '--vhyx-color-surface', desc: 'Background' },
      { name: '--vhyx-radius-lg', desc: 'Border radius' },
      { name: '--vhyx-shadow-sm', desc: 'Elevated shadow' },
      { name: '--vhyx-shadow-md', desc: 'Interactive hover' },
    ],
    contract: {
      type: 'display',
      intent: 'display-content',
      safetyLevel: 'low',
      contractVersion: '0.0.1',
    },
  },

  separator: {
    id: 'separator',
    name: 'Separator',
    group: 'Display',
    description: 'Visual divider between sections.',
    defaultProps: { orientation: 'horizontal', decorative: true, label: '' },
    controls: [
      { key: 'orientation', label: 'orientation', type: 'select', options: ['horizontal', 'vertical'] },
      { key: 'label', label: 'label', type: 'input' },
      { key: 'decorative', label: 'decorative', type: 'switch' },
    ],
    tokens: [
      { name: '--vhyx-color-border', desc: 'Line color' },
      { name: '--vhyx-text-xs', desc: 'Label size' },
    ],
    contract: {},
  },

  dialog: {
    id: 'dialog',
    name: 'Dialog',
    group: 'Overlay',
    description: 'Modal overlay with focus trap and restoration.',
    defaultProps: {},
    controls: [],
    tokens: [
      { name: '--vhyx-z-modal', desc: 'Z-index (400)' },
      { name: '--vhyx-shadow-2xl', desc: 'Content shadow' },
      { name: '--vhyx-duration-slow', desc: 'Entry animation' },
      { name: '--vhyx-easing-spring', desc: 'Entry easing' },
    ],
    contract: {
      type: 'overlay',
      intent: 'show-modal',
      safetyLevel: 'low',
      contractVersion: '0.0.1',
    },
  },

  drawer: {
    id: 'drawer',
    name: 'Drawer',
    group: 'Overlay',
    description: 'Side panel overlay with directional slide animation.',
    defaultProps: { side: 'right', size: 'md' },
    controls: [
      { key: 'side', label: 'side', type: 'select', options: ['left', 'right', 'top', 'bottom'] },
      { key: 'size', label: 'size', type: 'select', options: ['sm', 'md', 'lg', 'full'] },
    ],
    tokens: [
      { name: '--vhyx-drawer-sm/md/lg', desc: 'Panel size' },
      { name: '--vhyx-z-modal', desc: 'Z-index (400)' },
      { name: '--vhyx-duration-slow', desc: 'Slide animation' },
    ],
    contract: {
      type: 'overlay',
      intent: 'show-side-panel',
      safetyLevel: 'low',
      contractVersion: '0.0.1',
    },
  },

  tooltip: {
    id: 'tooltip',
    name: 'Tooltip',
    group: 'Overlay',
    description: 'Shows on hover (delayed) and focus (instant).',
    defaultProps: { side: 'top', content: 'Tooltip content' },
    controls: [
      { key: 'content', label: 'content', type: 'input' },
      { key: 'side', label: 'side', type: 'select', options: ['top', 'right', 'bottom', 'left'] },
    ],
    tokens: [
      { name: '--vhyx-z-tooltip', desc: 'Z-index (550)' },
      { name: '--vhyx-color-bg-inverse', desc: 'Background' },
      { name: '--vhyx-duration-fast', desc: 'Fade-in' },
    ],
    contract: {
      type: 'display',
      intent: 'show-tooltip',
      safetyLevel: 'low',
      contractVersion: '0.0.1',
    },
  },

  popover: {
    id: 'popover',
    name: 'Popover',
    group: 'Overlay',
    description: 'Non-modal overlay. Focus not trapped.',
    defaultProps: {},
    controls: [],
    tokens: [
      { name: '--vhyx-z-popover', desc: 'Z-index (450)' },
      { name: '--vhyx-shadow-lg', desc: 'Shadow' },
      { name: '--vhyx-duration-normal', desc: 'Scale-in' },
      { name: '--vhyx-easing-spring', desc: 'Entry easing' },
    ],
    contract: {
      type: 'overlay',
      intent: 'show-contextual-overlay',
      safetyLevel: 'low',
      contractVersion: '0.0.1',
    },
  },

  tabs: {
    id: 'tabs',
    name: 'Tabs',
    group: 'Navigation',
    description: 'Four visual variants with sliding indicator.',
    defaultProps: { variant: 'default', size: 'md', orientation: 'horizontal' },
    controls: [
      { key: 'variant', label: 'variant', type: 'select', options: ['default', 'pills', 'underline', 'enclosed'] },
      { key: 'size', label: 'size', type: 'select', options: ['sm', 'md', 'lg'] },
      { key: 'orientation', label: 'orientation', type: 'select', options: ['horizontal', 'vertical'] },
    ],
    tokens: [
      { name: '--vhyx-color-accent', desc: 'Active indicator' },
      { name: '--vhyx-duration-normal', desc: 'Indicator slide' },
      { name: '--vhyx-easing-spring', desc: 'Indicator easing' },
      { name: '--vhyx-radius-md', desc: 'Pills radius' },
    ],
    contract: {
      type: 'navigation',
      intent: 'switch-content-panel',
      safetyLevel: 'low',
      contractVersion: '0.0.1',
    },
  },

  breadcrumb: {
    id: 'breadcrumb',
    name: 'Breadcrumb',
    group: 'Navigation',
    description: 'Navigation landmark showing page hierarchy.',
    defaultProps: { separator: '/' },
    controls: [
      { key: 'separator', label: 'separator', type: 'input' },
    ],
    tokens: [
      { name: '--vhyx-color-text-muted', desc: 'Separator' },
      { name: '--vhyx-color-text-subtle', desc: 'Link color' },
      { name: '--vhyx-text-sm', desc: 'Font size' },
    ],
    contract: {
      type: 'navigation',
      intent: 'show-page-hierarchy',
      safetyLevel: 'low',
      contractVersion: '0.0.1',
    },
  },

  pagination: {
    id: 'pagination',
    name: 'Pagination',
    group: 'Navigation',
    description: 'Page navigation with ellipsis sentinels.',
    defaultProps: { page: 5, pageCount: 20, siblingCount: 1, showFirstLast: false, showPrevNext: true, size: 'md' },
    controls: [
      { key: 'size', label: 'size', type: 'select', options: ['sm', 'md', 'lg'] },
      { key: 'siblingCount', label: 'siblingCount', type: 'select', options: ['1', '2', '3'] },
      { key: 'showFirstLast', label: 'showFirstLast', type: 'switch' },
      { key: 'showPrevNext', label: 'showPrevNext', type: 'switch' },
    ],
    tokens: [
      { name: '--vhyx-color-accent-subtle', desc: 'Current page' },
      { name: '--vhyx-size-md', desc: 'Button size' },
      { name: '--vhyx-radius-md', desc: 'Button radius' },
    ],
    contract: {
      type: 'navigation',
      intent: 'paginate-content',
      safetyLevel: 'low',
      contractVersion: '0.0.1',
    },
  },
};
