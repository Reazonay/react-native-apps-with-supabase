---
name: worker-ui-conversion
description: 'Implement UI components from tokens and atomic design specs. Use for React/React Native UI conversion, component buildout, and CDD-based implementation.'
argument-hint: 'Provide instructions, approved tokens, and component list.'
user-invocable: true
disable-model-invocation: false
---

# Worker - UI Conversion

## What this skill does
Implements UI components using tokens and atomic design, updates stories/tests, and keeps the UI inventory in sync.

## When to use
- Building or refactoring UI components.
- Converting UI to token-based styles.
- Enforcing CDD and atomic design.

## Inputs
- Instructions
- Approved references (tokens, mapping)
- Component list

## Outputs
- New/updated components
- Stories/tests
- Updated UI inventory

## Procedure
1. Read instructions and scope.
2. Load tokens and mapping references.
3. Build components atom -> molecule -> organism -> template.
4. Add/update stories for each component state.
5. Update UI inventory.
6. Validate visuals in Storybook.

## Validation
- Storybook shows all states.
- Tokens are used consistently.
- Inventory reflects the changes.
