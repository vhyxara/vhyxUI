# VhyxUI.

## Publishing

@vhyxui packages are published manually.

Before publishing:
1. Ensure CI is green on main branch
2. CI green is a required gate — not optional
3. Run: pnpm publish -r --tag alpha --access public

CI green means: Node 18 and Node 20 both pass
build + token sync drift-check + test + typecheck.
