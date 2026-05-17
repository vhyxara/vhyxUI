/**
 * @vhyxui/react — Public API
 *
 * All 22 Tier 1 components, VhyxUIProvider, toast() imperative API,
 * and all TypeScript types needed to use VhyxUI.
 *
 * @example
 * import { Button, Input, toast, VhyxUIProvider } from '@vhyxui/react'
 */

// ─── Provider ─────────────────────────────────────────────────────────────────

export {
  VhyxUIProvider,
  type VhyxUIProviderProps,
  type ToastPosition,
} from './provider/VhyxUIProvider';

// ─── Button ───────────────────────────────────────────────────────────────────

export {
  Button,
  type ButtonProps,
  type ButtonVariant,
  type ButtonSize,
} from './components/Button';

// ─── Input ────────────────────────────────────────────────────────────────────

export {
  Input,
  type InputProps,
  type InputSize,
} from './components/Input';

// ─── Textarea ─────────────────────────────────────────────────────────────────

export {
  Textarea,
  type TextareaProps,
  type TextareaSize,
  type TextareaResize,
} from './components/Textarea';

// ─── Select ───────────────────────────────────────────────────────────────────

export {
  Select,
  type SelectProps,
  type SelectSize,
  type SelectTriggerProps,
  type SelectContentProps,
  type SelectItemProps,
  type SelectGroupProps,
  type SelectLabelProps,
  type SelectSeparatorProps,
} from './components/Select';

// ─── Checkbox ─────────────────────────────────────────────────────────────────

export {
  Checkbox,
  type CheckboxProps,
  type CheckboxSize,
} from './components/Checkbox';

// ─── Radio ────────────────────────────────────────────────────────────────────

export {
  RadioGroup,
  type RadioGroupProps,
  type RadioGroupSize,
  RadioItem,
  type RadioItemProps,
} from './components/Radio';

// ─── Switch ───────────────────────────────────────────────────────────────────

export {
  Switch,
  type SwitchProps,
  type SwitchSize,
} from './components/Switch';

// ─── Form / Field ─────────────────────────────────────────────────────────────

export {
  Form,
  useFormContext,
  type FormProps,
  type FormContextValue,
  Field,
  type FieldProps,
} from './components/Form';

// ─── Toast ────────────────────────────────────────────────────────────────────

export {
  Toast,
  ToastProvider,
  type ToastProviderProps,
} from './components/Toast';

export { toast } from './toast/toast';

export type {
  ToastOptions,
  ToastItem,
  ToastVariant,
} from './toast/toast-store';

// ─── Alert ────────────────────────────────────────────────────────────────────

export {
  Alert,
  type AlertProps,
  type AlertVariant,
} from './components/Alert';

// ─── Badge ────────────────────────────────────────────────────────────────────

export {
  Badge,
  type BadgeProps,
  type BadgeVariant,
  type BadgeSize,
} from './components/Badge';

// ─── Progress ─────────────────────────────────────────────────────────────────

export {
  Progress,
  type ProgressProps,
  type ProgressSize,
  type ProgressVariant,
} from './components/Progress';

// ─── Spinner ──────────────────────────────────────────────────────────────────

export {
  Spinner,
  type SpinnerProps,
  type SpinnerSize,
  type SpinnerVariant,
} from './components/Spinner';

// ─── Dialog ───────────────────────────────────────────────────────────────────

export {
  Dialog,
  type DialogProps,
  type DialogTriggerProps,
  type DialogPortalProps,
  type DialogOverlayProps,
  type DialogContentProps,
  type DialogHeaderProps,
  type DialogFooterProps,
  type DialogTitleProps,
  type DialogDescriptionProps,
  type DialogCloseProps,
} from './components/Dialog';

// ─── Drawer ───────────────────────────────────────────────────────────────────

export {
  Drawer,
  type DrawerProps,
  type DrawerSide,
  type DrawerSize,
  type DrawerTriggerProps,
  type DrawerPortalProps,
  type DrawerOverlayProps,
  type DrawerContentProps,
  type DrawerHeaderProps,
  type DrawerFooterProps,
  type DrawerTitleProps,
  type DrawerDescriptionProps,
  type DrawerCloseProps,
} from './components/Drawer';

// ─── Tooltip ──────────────────────────────────────────────────────────────────

export {
  Tooltip,
  type TooltipProps,
} from './components/Tooltip';

// ─── Popover ──────────────────────────────────────────────────────────────────

export {
  Popover,
  type PopoverProps,
  type PopoverTriggerProps,
  type PopoverContentProps,
  type PopoverArrowProps,
  type PopoverCloseProps,
  type PopoverSide,
  type PopoverAlign,
} from './components/Popover';

// ─── Card ─────────────────────────────────────────────────────────────────────

export {
  Card,
  type CardProps,
  type CardVariant,
  type CardPadding,
  type CardHeaderProps,
  type CardBodyProps,
  type CardFooterProps,
  type CardImageProps,
} from './components/Card';

// ─── Separator ────────────────────────────────────────────────────────────────

export {
  Separator,
  type SeparatorProps,
} from './components/Separator';

// ─── Tabs ─────────────────────────────────────────────────────────────────────

export {
  Tabs,
  type TabsProps,
  type TabsVariant,
  type TabsSize,
  type TabsListProps,
  type TabsTriggerProps,
  type TabsContentProps,
} from './components/Tabs';

// ─── Breadcrumb ───────────────────────────────────────────────────────────────

export {
  Breadcrumb,
  type BreadcrumbProps,
  type BreadcrumbItemProps,
  type BreadcrumbLinkProps,
  type BreadcrumbPageProps,
  type BreadcrumbEllipsisProps,
} from './components/Breadcrumb';

// ─── Pagination ───────────────────────────────────────────────────────────────

export {
  Pagination,
  type PaginationProps,
  type PaginationSize,
} from './components/Pagination';
