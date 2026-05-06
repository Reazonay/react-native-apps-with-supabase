---
name: manager-work-breakdown
description: 'Create a milestone-based roadmap, task-state tracking, and validation plan. Use when you need a work breakdown, roadmap, backlog/in-progress/done tracking, or phased delivery planning.'
argument-hint: 'Provide trigger YAML, instructions, and current status if available.'
user-invocable: true
disable-model-invocation: false
---

# Manager - Work Breakdown

## What this skill does
Creates a milestone-based roadmap, manages task-state (Backlog/In-Progress/Done), and defines a validation plan.

## When to use
- You need a roadmap with phased deliverables.
- You want to track task-state across phases.
- You need a validation plan to confirm completion criteria.

## Inputs
- Trigger YAML
- Instructions
- Status (if available)

## Outputs
- Roadmap
- Task-State (Backlog, In-Progress, Done)
- Validation plan

## Procedure
1. Read the trigger and extract goals, scope, and priority.
2. Read instructions and map requirements to phases.
3. Build milestone plan with clear deliverables per phase.
4. Ensure the following phases are present when applicable:
	- Discovery
	- Architecture
	- Build
	- Validate
5. Convert plan into task-state items (Backlog/In-Progress/Done).
6. Define validation checks for each milestone.
7. Review for completeness and prioritization.

## Validation
- Roadmap covers all phases in the instructions.
- Each milestone has clear deliverables.
- Task-state is consistent and prioritized.
- Validation plan is explicit and testable.
- Required phases (Discovery, Architecture, Build, Validate) appear when applicable.
