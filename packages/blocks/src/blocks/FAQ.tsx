import React from 'react';
import { Accordion, Container, Heading, Stack, Text } from '@vhyxui/react';

/** One question and answer. */
export interface FAQItem {
  question: React.ReactNode;
  answer: React.ReactNode;
}

/** Props for FAQ. */
export interface FAQProps {
  items: FAQItem[];
  title?: React.ReactNode;
  description?: React.ReactNode;
}

/**
 * FAQ — frequently asked questions on an accessible Accordion.
 * @example
 * <FAQ title="Questions" items={[{ question: 'Is it free?', answer: 'Yes, MIT licensed.' }]} />
 */
export function FAQ({ items, title = 'Frequently asked questions', description }: FAQProps): React.ReactElement {
  return (
    <Container as="section" size="md" style={{ paddingBlock: 'var(--vhyx-space-16)' }}>
      <Stack gap={8}>
        <Stack gap={2} align="center" style={{ textAlign: 'center' }}>
          <Heading level={2} size="xl">{title}</Heading>
          {description && <Text tone="subtle">{description}</Text>}
        </Stack>
        <Accordion items={items.map((item, i) => ({ value: `faq-${i}`, title: item.question, content: item.answer }))} />
      </Stack>
    </Container>
  );
}
