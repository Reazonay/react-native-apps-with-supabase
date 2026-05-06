---
name: skill-generator
description: 'Generate new SKILL.md files based on target system and role definitions. Use for creating new skills or adapting to new architectures.'
argument-hint: 'Provide target system, role description, inputs, outputs, and validation rules.'
user-invocable: true
disable-model-invocation: false
---

# Skill Generator (Meta)

## What this skill does
Creates new skill specifications with clear inputs, outputs, procedures, and validation.

## When to use
- You need to create a new skill.
- You need to adapt skills to a new system.
- You want consistent skill templates.

## Inputs
- Target system
- Role description
- Input/output format
- Validation criteria

## Outputs
- New SKILL.md specification
- Versioning note

## Procedure
1. Capture target system and role.
2. Define inputs and outputs.
3. Write step-by-step procedure.
4. Add validation checks.
5. Ensure YAML frontmatter is correct.

## Validation
- Inputs/outputs are explicit.
- Procedure is actionable.
- Validation is testable.
