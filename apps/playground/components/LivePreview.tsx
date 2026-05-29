'use client';

import React, { useState } from 'react';
import {
  Button,
  Input,
  Textarea,
  Checkbox,
  RadioGroup,
  RadioItem,
  Switch,
  Badge,
  Progress,
  Spinner,
  Alert,
  Card,
  Separator,
  Dialog,
  Drawer,
  Tooltip,
  Popover,
  Tabs,
  Breadcrumb,
  Pagination,
  Select,
  Field,
  toast,
} from '@vhyxui/react';

interface LivePreviewProps {
  componentId: string;
  props: Record<string, unknown>;
}

// ─── Per-component renderers ──────────────────────────────────────────────────

function RenderButton(props: Record<string, unknown>): React.ReactElement {
  return (
    <Button
      variant={(props['variant'] as 'primary') ?? 'primary'}
      size={(props['size'] as 'md') ?? 'md'}
      loading={Boolean(props['loading'])}
      disabled={Boolean(props['disabled'])}
      iconOnly={Boolean(props['iconOnly'])}
      aria-label={Boolean(props['iconOnly']) ? String(props['children'] ?? 'Button') : undefined}
    >
      {!props['iconOnly'] ? String(props['children'] ?? 'Click me') : '★'}
    </Button>
  );
}

function RenderInput(props: Record<string, unknown>): React.ReactElement {
  const [value, setValue] = useState('');
  return (
    <Input
      size={(props['size'] as 'md') ?? 'md'}
      type={String(props['type'] ?? 'text')}
      placeholder={String(props['placeholder'] ?? '')}
      error={Boolean(props['error'])}
      disabled={Boolean(props['disabled'])}
      value={value}
      onChange={(e) => { setValue(e.target.value); }}
      style={{ width: '18rem' }}
    />
  );
}

function RenderTextarea(props: Record<string, unknown>): React.ReactElement {
  const [value, setValue] = useState('');
  return (
    <Textarea
      size={(props['size'] as 'md') ?? 'md'}
      resize={(props['resize'] as 'vertical') ?? 'vertical'}
      placeholder={String(props['placeholder'] ?? '')}
      error={Boolean(props['error'])}
      disabled={Boolean(props['disabled'])}
      showCount={Boolean(props['showCount'])}
      maxLength={props['showCount'] ? 200 : undefined}
      value={value}
      onChange={(e) => { setValue(e.target.value); }}
      style={{ width: '22rem' }}
    />
  );
}

function RenderCheckbox(props: Record<string, unknown>): React.ReactElement {
  const [checked, setChecked] = useState<boolean | 'indeterminate'>(Boolean(props['checked']));
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--vhyx-space-3)' }}>
      <Checkbox
        size={(props['size'] as 'md') ?? 'md'}
        checked={props['indeterminate'] ? 'indeterminate' : checked}
        onCheckedChange={setChecked}
        disabled={Boolean(props['disabled'])}
        aria-label="Checkbox example"
      />
      <span style={{ fontSize: 'var(--vhyx-text-sm)' }}>
        {props['indeterminate'] ? 'Indeterminate' : checked ? 'Checked' : 'Unchecked'}
      </span>
    </div>
  );
}

function RenderRadio(props: Record<string, unknown>): React.ReactElement {
  const [value, setValue] = useState('option-a');
  return (
    <RadioGroup
      value={value}
      onValueChange={setValue}
      size={(props['size'] as 'md') ?? 'md'}
      orientation={(props['orientation'] as 'vertical') ?? 'vertical'}
      disabled={Boolean(props['disabled'])}
      aria-label="Radio group example"
    >
      <RadioItem value="option-a">Option A</RadioItem>
      <RadioItem value="option-b">Option B</RadioItem>
      <RadioItem value="option-c">Option C</RadioItem>
    </RadioGroup>
  );
}

function RenderSwitch(props: Record<string, unknown>): React.ReactElement {
  const [checked, setChecked] = useState(Boolean(props['checked']));
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--vhyx-space-3)' }}>
      <Switch
        size={(props['size'] as 'md') ?? 'md'}
        checked={checked}
        onCheckedChange={setChecked}
        disabled={Boolean(props['disabled'])}
        aria-label="Switch example"
      />
      <span style={{ fontSize: 'var(--vhyx-text-sm)' }}>{checked ? 'On' : 'Off'}</span>
    </div>
  );
}

function RenderSelect(props: Record<string, unknown>): React.ReactElement {
  const [value, setValue] = useState<string | undefined>(undefined);
  return (
    <Select
      value={value}
      onValueChange={setValue}
      size={(props['size'] as 'md') ?? 'md'}
      disabled={Boolean(props['disabled'])}
      placeholder={String(props['placeholder'] ?? 'Select an option…')}
      style={{ width: '14rem' }}
    >
      <Select.Trigger />
      <Select.Content>
        <Select.Item value="one">Option One</Select.Item>
        <Select.Item value="two">Option Two</Select.Item>
        <Select.Item value="three">Option Three</Select.Item>
      </Select.Content>
    </Select>
  );
}

function RenderBadge(props: Record<string, unknown>): React.ReactElement {
  return (
    <Badge
      variant={(props['variant'] as 'default') ?? 'default'}
      size={(props['size'] as 'md') ?? 'md'}
      dot={Boolean(props['dot'])}
    >
      {!props['dot'] ? String(props['children'] ?? 'Badge') : undefined}
    </Badge>
  );
}

function RenderProgress(props: Record<string, unknown>): React.ReactElement {
  return (
    <div style={{ width: '20rem' }}>
      <Progress
        value={props['indeterminate'] ? undefined : Number(props['value'] ?? 60)}
        size={(props['size'] as 'md') ?? 'md'}
        variant={(props['variant'] as 'default') ?? 'default'}
        showLabel={Boolean(props['showLabel'])}
        indeterminate={Boolean(props['indeterminate'])}
      />
    </div>
  );
}

function RenderSpinner(props: Record<string, unknown>): React.ReactElement {
  const bg = props['variant'] === 'white' ? 'var(--vhyx-color-bg-inverse)' : 'transparent';
  return (
    <div style={{ padding: 'var(--vhyx-space-4)', background: bg, borderRadius: 'var(--vhyx-radius-md)' }}>
      <Spinner
        size={(props['size'] as 'md') ?? 'md'}
        variant={(props['variant'] as 'default') ?? 'default'}
        label={String(props['label'] ?? 'Loading')}
      />
    </div>
  );
}

function RenderAlert(props: Record<string, unknown>): React.ReactElement {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) {
    return (
      <Button size="sm" variant="outline" onClick={() => { setDismissed(false); }}>
        Restore alert
      </Button>
    );
  }
  return (
    <Alert
      variant={(props['variant'] as 'info') ?? 'info'}
      title={String(props['title'] ?? '')}
      dismissible={Boolean(props['dismissible'])}
      onDismiss={() => { setDismissed(true); }}
      style={{ width: '22rem' }}
    >
      {String(props['children'] ?? '')}
    </Alert>
  );
}

function RenderCard(props: Record<string, unknown>): React.ReactElement {
  return (
    <Card
      variant={(props['variant'] as 'outline') ?? 'outline'}
      padding={(props['padding'] as 'md') ?? 'md'}
      interactive={Boolean(props['interactive'])}
      style={{ width: '16rem' }}
    >
      <Card.Header>
        <span style={{ fontWeight: 'var(--vhyx-weight-semibold)', fontSize: 'var(--vhyx-text-sm)' }}>Card title</span>
      </Card.Header>
      <Card.Body>
        <p style={{ fontSize: 'var(--vhyx-text-sm)', color: 'var(--vhyx-color-text-subtle)', lineHeight: 'var(--vhyx-leading-relaxed)' }}>
          This is the card body content. It can hold any content.
        </p>
      </Card.Body>
      <Card.Footer>
        <span style={{ fontSize: 'var(--vhyx-text-xs)', color: 'var(--vhyx-color-text-muted)' }}>Footer info</span>
      </Card.Footer>
    </Card>
  );
}

function RenderSeparator(props: Record<string, unknown>): React.ReactElement {
  const label = String(props['label'] ?? '');
  const orientation = String(props['orientation'] ?? 'horizontal') as 'horizontal' | 'vertical';
  return (
    <div style={orientation === 'vertical' ? { display: 'flex', alignItems: 'center', height: '4rem' } : { width: '20rem' }}>
      <Separator
        orientation={orientation}
        decorative={Boolean(props['decorative'] ?? true)}
        label={label || undefined}
        style={orientation === 'vertical' ? { height: '100%' } : undefined}
      />
    </div>
  );
}

function RenderDialog(): React.ReactElement {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <Dialog.Trigger asChild>
          <Button variant="primary">Open Dialog</Button>
        </Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Overlay />
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>Example Dialog</Dialog.Title>
              <Dialog.Description>This dialog has focus trap, Escape-to-close, and focus restoration.</Dialog.Description>
            </Dialog.Header>
            <div style={{ padding: 'var(--vhyx-space-4) 0', fontSize: 'var(--vhyx-text-sm)', color: 'var(--vhyx-color-text-subtle)' }}>
              Tab through the controls below. Focus stays inside until you close.
            </div>
            <Dialog.Footer>
              <Dialog.Close asChild><Button variant="outline">Cancel</Button></Dialog.Close>
              <Button variant="primary" onClick={() => { setOpen(false); }}>Confirm</Button>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog>
    </>
  );
}

function RenderDrawer(props: Record<string, unknown>): React.ReactElement {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="outline" onClick={() => { setOpen(true); }}>
        Open Drawer ({String(props['side'] ?? 'right')})
      </Button>
      <Drawer open={open} onOpenChange={setOpen} side={(props['side'] as 'right') ?? 'right'} size={(props['size'] as 'md') ?? 'md'}>
        <Drawer.Portal>
          <Drawer.Overlay />
          <Drawer.Content>
            <Drawer.Header>
              <Drawer.Title>Settings</Drawer.Title>
              <Drawer.Description>Slides from the {String(props['side'] ?? 'right')}.</Drawer.Description>
            </Drawer.Header>
            <div style={{ padding: 'var(--vhyx-space-6)', flex: 1, fontSize: 'var(--vhyx-text-sm)', color: 'var(--vhyx-color-text-subtle)' }}>
              Drawer content area. Focus is trapped inside.
            </div>
            <Drawer.Footer>
              <Drawer.Close asChild><Button variant="outline" style={{ width: '100%' }}>Close</Button></Drawer.Close>
            </Drawer.Footer>
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer>
    </>
  );
}

function RenderTooltip(props: Record<string, unknown>): React.ReactElement {
  return (
    <Tooltip
      content={String(props['content'] ?? 'Tooltip content')}
      side={(props['side'] as 'top') ?? 'top'}
    >
      <Button variant="outline">Hover or focus me</Button>
    </Tooltip>
  );
}

function RenderPopover(): React.ReactElement {
  return (
    <Popover>
      <Popover.Trigger asChild>
        <Button variant="outline">Open Popover</Button>
      </Popover.Trigger>
      <Popover.Content>
        <p style={{ fontWeight: 'var(--vhyx-weight-semibold)', marginBottom: 'var(--vhyx-space-1)', fontSize: 'var(--vhyx-text-sm)' }}>Non-modal overlay</p>
        <p style={{ fontSize: 'var(--vhyx-text-xs)', color: 'var(--vhyx-color-text-subtle)' }}>Focus is not trapped — Tab moves through popover content freely.</p>
        <Popover.Close asChild>
          <Button size="sm" variant="outline" style={{ marginTop: 'var(--vhyx-space-3)', width: '100%' }}>Close</Button>
        </Popover.Close>
      </Popover.Content>
    </Popover>
  );
}

function RenderTabs(props: Record<string, unknown>): React.ReactElement {
  const [tab, setTab] = useState('a');
  return (
    <Tabs
      value={tab}
      onValueChange={setTab}
      variant={(props['variant'] as 'default') ?? 'default'}
      size={(props['size'] as 'md') ?? 'md'}
      orientation={(props['orientation'] as 'horizontal') ?? 'horizontal'}
      style={{ width: '22rem' }}
    >
      <Tabs.List>
        <Tabs.Trigger value="a">Overview</Tabs.Trigger>
        <Tabs.Trigger value="b">Analytics</Tabs.Trigger>
        <Tabs.Trigger value="c">Settings</Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="a">
        <div style={{ padding: 'var(--vhyx-space-4)', fontSize: 'var(--vhyx-text-sm)', color: 'var(--vhyx-color-text-subtle)' }}>Overview content</div>
      </Tabs.Content>
      <Tabs.Content value="b">
        <div style={{ padding: 'var(--vhyx-space-4)', fontSize: 'var(--vhyx-text-sm)', color: 'var(--vhyx-color-text-subtle)' }}>Analytics content</div>
      </Tabs.Content>
      <Tabs.Content value="c">
        <div style={{ padding: 'var(--vhyx-space-4)', fontSize: 'var(--vhyx-text-sm)', color: 'var(--vhyx-color-text-subtle)' }}>Settings content</div>
      </Tabs.Content>
    </Tabs>
  );
}

function RenderBreadcrumb(props: Record<string, unknown>): React.ReactElement {
  return (
    <Breadcrumb separator={String(props['separator'] ?? '/')}>
      <Breadcrumb.Item><Breadcrumb.Link href="#">Home</Breadcrumb.Link></Breadcrumb.Item>
      <Breadcrumb.Item><Breadcrumb.Link href="#">Components</Breadcrumb.Link></Breadcrumb.Item>
      <Breadcrumb.Item><Breadcrumb.Page>Breadcrumb</Breadcrumb.Page></Breadcrumb.Item>
    </Breadcrumb>
  );
}

function RenderPagination(props: Record<string, unknown>): React.ReactElement {
  const [page, setPage] = useState(Number(props['page'] ?? 5));
  return (
    <Pagination
      page={page}
      pageCount={Number(props['pageCount'] ?? 20)}
      onPageChange={setPage}
      siblingCount={Number(props['siblingCount'] ?? 1)}
      showFirstLast={Boolean(props['showFirstLast'])}
      showPrevNext={props['showPrevNext'] !== false}
      size={(props['size'] as 'md') ?? 'md'}
    />
  );
}

function RenderToast(props: Record<string, unknown>): React.ReactElement {
  const variant = String(props['variant'] ?? 'default') as 'default' | 'success' | 'danger' | 'warning' | 'info';
  const description = String(props['description'] ?? 'Your changes have been saved.');

  function fire(): void {
    const methods: Record<string, (msg: string) => void> = {
      success: toast.success.bind(toast),
      danger: toast.danger.bind(toast),
      warning: toast.warning.bind(toast),
      info: toast.info.bind(toast),
    };
    const fn = methods[variant] ?? ((msg: string) => toast(msg));
    fn(description);
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--vhyx-space-3)' }}>
      <Button variant="outline" onClick={fire}>
        Fire toast({variant !== 'default' ? `.${variant}` : ''})
      </Button>
      <p style={{ fontSize: 'var(--vhyx-text-xs)', color: 'var(--vhyx-color-text-muted)' }}>
        Click to trigger a {variant} toast.
      </p>
    </div>
  );
}

function RenderForm(props: Record<string, unknown>): React.ReactElement {
  const [email, setEmail] = useState('');
  return (
    <div style={{ width: '20rem', display: 'flex', flexDirection: 'column', gap: 'var(--vhyx-space-4)' }}>
      <Field
        name="email"
        label="Email address"
        hint="We'll never share your email."
        layout={(props['layout'] as 'vertical') ?? 'vertical'}
      >
        <Input
          type="email"
          placeholder="name@example.com"
          value={email}
          onChange={(e) => { setEmail(e.target.value); }}
          size={(props['size'] as 'md') ?? 'md'}
        />
      </Field>
      <Field
        name="password"
        label="Password"
        required
        layout={(props['layout'] as 'vertical') ?? 'vertical'}
      >
        <Input
          type="password"
          placeholder="Min 8 characters"
          size={(props['size'] as 'md') ?? 'md'}
        />
      </Field>
      <Button variant="primary" type="submit" style={{ width: '100%' }}>Sign in</Button>
    </div>
  );
}

// ─── Component registry ───────────────────────────────────────────────────────

const RENDERERS: Record<string, (props: Record<string, unknown>) => React.ReactElement> = {
  button: RenderButton,
  input: RenderInput,
  textarea: RenderTextarea,
  checkbox: RenderCheckbox,
  radio: RenderRadio,
  switch: RenderSwitch,
  select: RenderSelect,
  badge: RenderBadge,
  progress: RenderProgress,
  spinner: RenderSpinner,
  alert: RenderAlert,
  card: RenderCard,
  separator: RenderSeparator,
  dialog: RenderDialog,
  drawer: RenderDrawer,
  tooltip: RenderTooltip,
  popover: RenderPopover,
  tabs: RenderTabs,
  breadcrumb: RenderBreadcrumb,
  pagination: RenderPagination,
  toast: RenderToast,
  form: RenderForm,
};

// ─── LivePreview ──────────────────────────────────────────────────────────────

export function LivePreview({ componentId, props }: LivePreviewProps): React.ReactElement {
  const renderer = RENDERERS[componentId];
  if (!renderer) {
    return (
      <div className="pg-live-preview">
        <p style={{ fontSize: 'var(--vhyx-text-sm)', color: 'var(--vhyx-color-text-muted)' }}>
          No preview for {componentId}
        </p>
      </div>
    );
  }

  return (
    <div className="pg-live-preview">
      {renderer(props)}
    </div>
  );
}
