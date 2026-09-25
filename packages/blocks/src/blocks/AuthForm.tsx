import React, { useState } from 'react';
import { Alert, Button, Heading, Separator, Stack, Text, TextField } from '@vhyxui/react';

/** Values submitted by AuthForm. `name` only in sign-up mode. */
export interface AuthFormValues {
  email: string;
  password: string;
  name?: string;
}

/** Social / SSO button. */
export interface AuthProvider {
  id: string;
  label: React.ReactNode;
  icon?: React.ReactNode;
  onClick: () => void;
}

/** Props for AuthForm. */
export interface AuthFormProps {
  /** @default 'sign-in' */
  mode?: 'sign-in' | 'sign-up';
  /** Receives validated values. Throw or reject to show an error message. */
  onSubmit: (values: AuthFormValues) => void | Promise<void>;
  title?: React.ReactNode;
  description?: React.ReactNode;
  providers?: AuthProvider[];
  /** Content under the form, e.g. "No account? Sign up". */
  footer?: React.ReactNode;
  /** Link or button next to the password label, e.g. "Forgot password?". */
  forgotPassword?: React.ReactNode;
  /** @default 8 */
  minPasswordLength?: number;
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * AuthForm — complete sign-in / sign-up form with validation, loading and error states.
 * Uses the `sign-in` / `submit-form` VhyxSeal intents through Button and TextField.
 *
 * @example
 * <AuthForm mode="sign-in" onSubmit={({ email, password }) => signIn(email, password)}
 *   providers={[{ id: 'github', label: 'Continue with GitHub', onClick: gh }]} />
 */
export function AuthForm({
  mode = 'sign-in',
  onSubmit,
  title,
  description,
  providers = [],
  footer,
  forgotPassword,
  minPasswordLength = 8,
}: AuthFormProps): React.ReactElement {
  const [values, setValues] = useState<AuthFormValues>({ email: '', password: '', name: '' });
  const [errors, setErrors] = useState<Partial<Record<keyof AuthFormValues, string>>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const signUp = mode === 'sign-up';

  const set = (key: keyof AuthFormValues) => (e: React.ChangeEvent<HTMLInputElement>): void =>
    setValues((v) => ({ ...v, [key]: e.target.value }));

  const validate = (): boolean => {
    const next: Partial<Record<keyof AuthFormValues, string>> = {};
    if (signUp && !values.name?.trim()) next.name = 'Enter your name';
    if (!EMAIL.test(values.email)) next.email = 'Enter a valid email address';
    if (values.password.length < minPasswordLength) next.password = `Use at least ${minPasswordLength} characters`;
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setFormError(null);
    if (!validate()) return;
    setLoading(true);
    try {
      await onSubmit(signUp ? values : { email: values.email, password: values.password });
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Something went wrong. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Stack gap={6} style={{ width: '100%', maxWidth: '24rem' }}>
      <Stack gap={1}>
        <Heading level={1} size="md">{title ?? (signUp ? 'Create your account' : 'Welcome back')}</Heading>
        <Text tone="subtle" size="sm">{description ?? (signUp ? 'Start in less than a minute.' : 'Sign in to continue.')}</Text>
      </Stack>

      {providers.length > 0 && (
        <Stack gap={2}>
          {providers.map((p) => (
            <Button key={p.id} type="button" variant="outline" icon={p.icon} onClick={p.onClick} style={{ width: '100%' }}>
              {p.label}
            </Button>
          ))}
          <Separator label="or" />
        </Stack>
      )}

      <form noValidate onSubmit={(e) => void handleSubmit(e)}>
        <Stack gap={4}>
          {formError && <Alert variant="danger">{formError}</Alert>}
          {signUp && (
            <TextField name="name" label="Name" autoComplete="name" value={values.name ?? ''} onChange={set('name')} {...(errors.name ? { error: errors.name } : {})} />
          )}
          <TextField name="email" label="Email" type="email" autoComplete="email" value={values.email} onChange={set('email')} {...(errors.email ? { error: errors.email } : {})} />
          <Stack gap={1}>
            <TextField
              name="password"
              label="Password"
              type="password"
              autoComplete={signUp ? 'new-password' : 'current-password'}
              value={values.password}
              onChange={set('password')}
              {...(errors.password ? { error: errors.password } : {})}
            />
            {forgotPassword && !signUp && <Text as="div" size="sm" align="end">{forgotPassword}</Text>}
          </Stack>
          <Button type="submit" loading={loading} style={{ width: '100%' }}>
            {signUp ? 'Create account' : 'Sign in'}
          </Button>
        </Stack>
      </form>

      {footer && <Text as="div" size="sm" tone="subtle" align="center">{footer}</Text>}
    </Stack>
  );
}
