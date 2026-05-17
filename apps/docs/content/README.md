# VhyxUI Documentation Content

MDX component documentation lives here.

## Structure

Each component gets its own MDX file following the 12-section structure from spec Section 16:

```
content/
├── getting-started.mdx
├── components/
│   ├── button.mdx
│   ├── input.mdx
│   ├── textarea.mdx
│   ├── select.mdx
│   ├── checkbox.mdx
│   ├── radio.mdx
│   ├── switch.mdx
│   ├── form.mdx
│   ├── toast.mdx
│   ├── alert.mdx
│   ├── badge.mdx
│   ├── progress.mdx
│   ├── spinner.mdx
│   ├── dialog.mdx
│   ├── drawer.mdx
│   ├── tooltip.mdx
│   ├── popover.mdx
│   ├── card.mdx
│   ├── separator.mdx
│   ├── tabs.mdx
│   ├── breadcrumb.mdx
│   └── pagination.mdx
└── theming.mdx
```

## Per-Component Page Structure (Section 16)

Every component page follows this exact 12-section structure:

1. Component name and one line description
2. Live interactive example — FIRST thing on page
3. Import statement
4. Variants — live examples of every variant
5. Sizes — live examples of every size
6. States — live examples of every state
7. Props table — auto generated from TypeScript
8. Accessibility — what we handle automatically
9. Keyboard navigation table
10. Agent contract — default VhyxSeal contract
11. Theming — which CSS tokens control this component
12. Examples — real world usage patterns

Component pages are populated in Stage 6 continuation sessions.
