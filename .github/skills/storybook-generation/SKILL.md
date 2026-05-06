---
name: storybook-generation
description: 'Generate CSF stories for components and UI states. Use for Storybook setup, component documentation, and visual verification.'
argument-hint: 'Provide component list, tokens, and UI states.'
user-invocable: true
disable-model-invocation: false
---

# Storybook Generation

## What this skill does
Creates CSF stories for components and states so UI can be verified without running the app.

## When to use
- You need Storybook coverage.
- You want CSF stories for new UI.
- You need visual verification of states.

## Inputs
- Component list
- Tokens
- UI states

## Outputs
- CSF stories
- Metaobject + Storyobjects + Decorators

## Procedure
1. Review component list and required states.
2. Draft CSF stories per component.
3. Ensure required CSF structure.
4. Add decorators for layout/spacing.
5. Validate Storybook renders all stories.

## CSF Structure (Required)
1. Title
2. Metaobject
3. Storyobjects
4. Decorators

## Validation
- Storybook runs without app startup.
- All variants are visible.
