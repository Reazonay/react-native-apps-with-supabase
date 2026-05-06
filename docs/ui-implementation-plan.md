# UI Implementation Plan

Stand: 2026-05-06

## Ziel
Die UI wird entlang Atomic Design und CDD umgesetzt. Jede Komponente bekommt Storybook-States nach CSF und nutzt die definierten Tokens.

## Scope (Apps)
- workout-app: Dashboard, Health, Register (aktuell Platzhalter), Register Success (aktuell Platzhalter)
- admin-app: Dashboard, Health

## Atomic Design Mapping (Soll)

### Atome
- Typography: Heading, Subheading, Label, Meta
- Button: Primary, Pill, Ghost
- Badge / Status Pill
- Divider / Spacer

### Molekuele
- Nav Pill Group
- Workout Card
- Health Status Row
- Form Field (Input + Label + Hint)

### Organismen
- Health Card
- Workout List
- Admin Workout Grid

### Templates
- Dashboard Template
- Health Template
- Register Template

### Pages
- Workout Dashboard
- Workout Register
- Workout Register Success
- Workout Health
- Admin Dashboard
- Admin Health

## Umsetzungsschritte
1) Tokens in Shared Components anwenden (Theme + Stylesheet Helpers).
2) Atome bauen und in Storybook dokumentieren.
3) Molekuele bauen und Storybook-States anlegen.
4) Organismen zusammensetzen, Storybook Variants definieren.
5) Templates erstellen und in Apps einsetzen.
6) Pages finalisieren und visuell validieren.

## Storybook / CSF Regeln
- Title
- Metaobject
- Storyobjects
- Decorators

## Validierung
- Visueller Abgleich pro Screen im Storybook
- Keine Inline-Styles ohne Tokens
- Abweichungen dokumentieren und korrigieren
