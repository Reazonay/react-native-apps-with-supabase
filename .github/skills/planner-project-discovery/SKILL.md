---
name: planner-project-discovery
description: 'Scan HTML snapshots, extract design tokens, and produce a UI inventory. Use for project discovery, token extraction, or atomic design inventory creation.'
argument-hint: 'Provide trigger YAML, HTML snapshots, and discovery rules if available.'
user-invocable: true
disable-model-invocation: false
---

# Planner - Project Discovery

## What this skill does
Scans HTML snapshots, identifies UI patterns, extracts design tokens, and produces a UI inventory mapped to atomic levels.

## When to use
- You need design tokens from existing UI.
- You want an atomic design inventory.
- You need a discovery pass before UI work.

## Inputs
- Trigger YAML
- HTML snapshot(s)
- Discovery rules (pattern set)

## Outputs
- tokens.json (colors, typography, spacing, radius)
- inventory.json (component list with atomic levels)

## Procedure
1. Read trigger and confirm discovery scope.
2. Scan HTML snapshots for tokens and UI patterns.
3. Extract tokens (colors, typography, spacing, radius).
4. Build component inventory and assign atomic levels.
5. Standardize outputs as JSON.
6. Validate for duplicates and missing tokens.

## Validation
- JSON schema valid.
- Tokens are unique and consistent.
- Inventory covers all detected components.
