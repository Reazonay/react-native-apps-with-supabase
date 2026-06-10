# KI Agent System – Vollständige Übersicht

> Stand: 2026-06-10 | Version: 1.0

---

## Was ist dieses System?

Das KI-Agenten-System ist ein **modulares, hierarchisches Framework** für KI-gestützte UI-Entwicklung in einem React Native Monorepo.

Es löst ein konkretes Problem:

> **„Die KI hat alles gefickt"** — Design driftet ab, Komponenten werden inkonsistent umgesetzt, das Kontextfenster der KI verliert den Faden.

Die Lösung: Statt einem riesigen Prompt bekommt jeder Agent nur das **Minimum an Kontext**, das er für seinen spezifischen Schritt braucht. Kein Agent sieht alles gleichzeitig.

---

## Die 4 Agenten — Überblick

```
┌─────────────────────────────────────────────────────────────┐
│                     PLANNER AGENT                           │
│   Liest HTML-Snapshots → extrahiert Tokens & Inventar       │
└────────────────────────┬────────────────────────────────────┘
                         │ tokens.json + inventory.json
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                     MANAGER AGENT                           │
│   Erstellt Roadmap → verwaltet Task-State (Backlog/Done)    │
└────────────┬────────────────────────┬───────────────────────┘
             │ Task-Pakete            │ Task-Pakete
             ▼                        ▼
┌────────────────────┐   ┌────────────────────────────────────┐
│   WORKER AGENT     │   │        STORYBOOK AGENT             │
│   Baut React Native│   │   Erstellt CSF Stories pro         │
│   Komponenten      │   │   Komponente (Atoms→Pages)         │
└────────────────────┘   └────────────────────────────────────┘
```

---

## Sichtfeld-Regel (Progressive Disclosure)

> **Jeder Agent sieht nur das Minimum, das er für seinen Schritt braucht.**

Das System arbeitet mit 3 Eskalationsstufen:

| Stufe | Datei | Inhalt |
|-------|-------|--------|
| 1 | `docs/workflow/trigger.yaml` | Problemstatement + Ziel (YAML) |
| 2 | `docs/workflow/instructions.md` | Detaillierte Arbeitsanweisung |
| 3 | `docs/workflow/refs/*.json` | Externe Referenzen (z. B. Farbmapping) — nach Nutzung löschen |

---

## Agent 1: PLANNER

### Skill-Datei
[planner-project-discovery.md](./planner-project-discovery.md)

### Aufgabe
Scannt HTML-Snapshots und extrahiert das Design-System automatisch.

### Was er sieht (Sichtfeld)
```
trigger.yaml
HTML-Snapshot(s) aus docs/workflow/snapshots/
Discovery-Regeln (Pattern-Set)
```

### Was er NICHT sieht
- Roadmap, Task-State, Komponenten-Implementierungen

### Inputs → Outputs

| Input | Output |
|-------|--------|
| `trigger.yaml` | `docs/design-tokens.json` |
| HTML-Dateien aus `/snapshots/` | `docs/ui-inventory.json` |
| Discovery-Regelset | — |

### design-tokens.json – Was drin steckt
```json
{
  "kineticTheme": {
    "colors": { "primary": "#ede900", "background": "#141408", ... },
    "spacing": { "xs": 8, "md": 16, "containerMargin": 24 },
    "radius": { "sm": 12, "pill": 9999 },
    "typography": { "displayXL": { "fontSize": 32, "fontWeight": 700 } }
  },
  "uiTheme": { ... }  // zweites Theme für Admin-App (helles Design)
}
```

> **Zwei Themes:** `kineticTheme` (dunkles UI für Workout-App) und `uiTheme` (helles UI für Admin-App). Beide aus denselben HTML-Snapshots extrahiert.

### Regeln des Planners
- **Nur HTML analysieren** — keine Implementierungsdetails
- Tokens standardisieren und in JSON-Schema validieren
- Eindeutige und konsistente Token-Namen

### Validierungskriterien
- [ ] JSON Schema ist gültig
- [ ] Alle Tokens sind eindeutig benannt
- [ ] Beide Themes (kinetic + ui) vorhanden

---

## Agent 2: MANAGER

### Skill-Datei
[manager-work-breakdown.md](./manager-work-breakdown.md)

### Aufgabe
Erstellt eine stabile Roadmap mit Meilensteinen und verwaltet den Task-State (Backlog → In-Progress → Done).

### Was er sieht (Sichtfeld)
```
trigger.yaml
instructions.md
Aktueller Status (falls vorhanden)
tokens.json + inventory.json (vom Planner)
```

### Inputs → Outputs

| Input | Output |
|-------|--------|
| `trigger.yaml` | `docs/ki-roadmap.md` |
| `instructions.md` | Task-State (Backlog/In-Progress/Done) |
| Status-Dokument | `workflow-progress.json` |

### Meilensteine (aktuelle Roadmap)

| Meilenstein | Status | Deliverable |
|-------------|--------|-------------|
| M0 – Discovery | ✅ Done | UI-Inventar + Tokens |
| M1 – Architektur | ✅ Done | Agenten-Topologie dokumentiert |
| M2 – Skills v1 | ✅ Done | Planner, Manager, Worker, Storybook |
| M3 – CDD Durchsetzung | 🔄 In Progress | Atomic Design Mapping + Storybook Coverage |
| M4 – Meta-Skills | ⏳ Backlog | Skill-Generator v1 |

### Regeln des Managers
- Arbeite in Meilensteinen mit klaren Deliverables
- Jede Phase hat ein Validation Gate
- Task-State ist immer nachvollziehbar dokumentiert

---

## Agent 3: WORKER

### Skill-Datei
[worker-ui-conversion.md](./worker-ui-conversion.md)

### Aufgabe
Setzt UI-Komponenten nach Atomic Design und den freigegebenen Tokens um — in React Native.

### Was er sieht (Sichtfeld)
```
instructions.md (seine spezifische Task)
Freigegebene Referenzen: tokens.json + color-mapping.json
Akzeptierte Komponentenliste aus inventory.json
```

### Inputs → Outputs

| Input | Output |
|-------|--------|
| Task vom Manager | Neue/angepasste Komponenten (.tsx) |
| `design-tokens.json` | Aktualisiertes `ui-inventory.json` |
| `color-mapping.json` | Tests + Stories |

### Atomic Design Hierarchie (Soll-Zustand)

```
Atome (kleinste Einheit, keine Abhängigkeiten zu anderen Komponenten)
  ├── KineticText     → packages/shared-components/src/atoms/
  ├── KineticButton   → packages/shared-components/src/atoms/
  ├── KineticBadge    → packages/shared-components/src/atoms/
  ├── KineticCard     → packages/shared-components/src/atoms/
  └── KineticInput    → packages/shared-components/src/atoms/

Moleküle (kombinieren 2-3 Atome)
  ├── WorkoutCard         (KineticCard + KineticText + KineticBadge)
  ├── NavigationPillGroup (KineticButton × n)
  ├── HealthStatusRow     (KineticText + StatusPill)
  └── FormField           (KineticInput + KineticText)

Organismen (komplexe Sektionen, mehrere Moleküle)
  ├── HealthCard
  ├── WorkoutList
  └── AdminWorkoutGrid

Templates (vollständige Layouts ohne echte Daten)
  ├── DashboardTemplate
  ├── HealthTemplate
  └── RegisterTemplate

Pages (Templates + echte Daten + Navigation)
  ├── Workout Dashboard
  ├── Workout Health
  ├── Workout Register / Register Success
  ├── Admin Dashboard
  └── Admin Health
```

### Kritische React Native Regeln
- **Flexbox ist VERTIKAL per default** (nicht horizontal wie im Web)
- Kein `<div>` → stattdessen `<View>`
- Kein `<p>` → stattdessen `<Text>`
- Kein `<button>` → stattdessen `<TouchableOpacity>` oder `<Pressable>`
- Alle Styles über Design Tokens — **keine Inline-Styles ohne Token-Referenz**

### Validierungskriterien
- [ ] Storybook zeigt alle States der Komponente
- [ ] Design Tokens eingehalten (kein Magic Number)
- [ ] Komponente isoliert gebaut und testbar

---

## Agent 4: STORYBOOK

### Skill-Datei
[storybook-generation.md](./storybook-generation.md)

### Aufgabe
Erstellt CSF Stories für jede Komponente, damit UI isoliert ohne App-Start verifiziert werden kann.

### Was er sieht (Sichtfeld)
```
Komponentenliste (aus inventory.json)
design-tokens.json
UI-States der Komponente
```

### Inputs → Outputs

| Input | Output |
|-------|--------|
| Komponentenliste | CSF Story Files (.stories.tsx) |
| `design-tokens.json` | Meta-Objekt + Story-Objekte |
| UI-States | Decorators |

### CSF Struktur (Pflicht — in dieser Reihenfolge)

```typescript
// 1. Title
export default {
  title: 'Atoms/KineticButton',   // ← Atomic-Level/ComponentName

// 2. Meta-Objekt
  component: KineticButton,
  parameters: { /* Storybook config */ },
  argTypes: { /* Props-Definitionen */ },
} satisfies Meta<typeof KineticButton>;

// 3. Story-Objekte (ein Export pro Variant/State)
export const Primary: Story = { args: { variant: 'primary', label: 'Start' } };
export const Ghost: Story   = { args: { variant: 'ghost', label: 'Cancel' } };
export const Pill: Story    = { args: { variant: 'pill', label: 'Health' } };

// 4. Decorators (optional, für Theming/Padding)
```

### Vorhandene Stories (aktueller Stand)
```
packages/shared-components/stories/
  ├── KineticText.stories.tsx        ✅ Atom
  ├── KineticButton.stories.tsx      ✅ Atom
  ├── KineticBadge.stories.tsx       ✅ Atom
  ├── KineticCard.stories.tsx        ✅ Atom
  ├── KineticInput.stories.tsx       ✅ Atom
  ├── StatusPill.stories.tsx         ✅ Atom
  ├── FormField.stories.tsx          ✅ Molekül
  ├── NavigationPills.stories.tsx    ✅ Molekül
  ├── WorkoutCard.stories.tsx        ✅ Molekül
  ├── HealthStatusRow.stories.tsx    ✅ Molekül
  ├── HealthCard.stories.tsx         ✅ Organismus
  ├── WorkoutList.stories.tsx        ✅ Organismus
  ├── AdminWorkoutGrid.stories.tsx   ✅ Organismus
  ├── DashboardTemplate.stories.tsx  ✅ Template
  ├── HealthTemplate.stories.tsx     ✅ Template
  ├── RegisterCard.stories.tsx       ✅ Molekül
  ├── RegisterTemplate.stories.tsx   ✅ Template
  └── RegisterSuccessTemplate.stories.tsx ✅ Template
```

### Validierungskriterien
- [ ] Storybook läuft ohne App-Start
- [ ] Alle Varianten (States) sind sichtbar
- [ ] Kein Story importiert App-Code direkt

---

## Meta-Skill: SKILL GENERATOR

### Skill-Datei
[skill-generator.md](./skill-generator.md)

### Aufgabe
Erzeugt neue Skill-Spezifikationen — ein "Skill für Skill-Erstellung".

### Inputs → Outputs

| Input | Output |
|-------|--------|
| Zielsystem | Neue Skill-Spezifikation (.md) |
| Rollenbeschreibung | Versionierungshinweis |
| Input/Output-Format | — |

### Regeln
- Jeder Skill muss Inputs, Outputs, Regeln und Validierung enthalten
- Skills sind minimal, klar und deterministisch
- Maximallänge: 500 Zeilen

---

## Aktueller Zustand des Systems

### Was bereits funktioniert ✅

| Komponente | Status |
|------------|--------|
| Skill-Spezifikationen (alle 4 Agenten) | ✅ Vorhanden |
| design-tokens.json | ✅ Extrahiert (v0.2.0) |
| ui-inventory.json | ✅ Erstellt |
| ki-workflow-architecture.md | ✅ Dokumentiert |
| ki-roadmap.md | ✅ Erstellt (M0–M4) |
| trigger.yaml | ✅ Aktiv |
| instructions.md | ✅ Vorhanden |
| color-mapping.json | ✅ Vorhanden |
| HTML-Snapshots (4 Screens) | ✅ Vorhanden |
| Storybook Stories (18 Dateien) | ✅ Inventarisiert |
| Shared Components (Atome) | ✅ 5 Atome + 1 Molekül |

### Was noch fehlt / In Progress 🔄

| Komponente | Status | Phase |
|------------|--------|-------|
| CDD Analysis Skill | 🔄 Neu | M3 |
| workflow-progress.json | 🔄 Neu | M3 |
| Deduplizierungsskript | 🔄 Neu | M3 |
| Fehlende Stories (Organismen, Pages) | ⏳ Backlog | M3 |
| Skill-Generator v1 | ⏳ Backlog | M4 |

---

## Dateistruktur

```
docs/
├── AGENT-SYSTEM-OVERVIEW.md         ← Diese Datei
├── design-tokens.json               ← Planner-Output
├── ui-inventory.json                ← Planner-Output
├── ki-workflow-architecture.md      ← Architektur-Dokument
├── ki-roadmap.md                    ← Manager-Output
├── ki-workflow-todo.md              ← Roh-Mitschrift
├── ui-implementation-plan.md        ← Worker-Leitfaden
│
├── skills/
│   ├── README.md
│   ├── planner-project-discovery.md
│   ├── manager-work-breakdown.md
│   ├── worker-ui-conversion.md
│   ├── storybook-generation.md
│   ├── skill-generator.md
│   └── cdd-analysis-skill/          ← NEU (Aufgabe 1-3)
│       ├── SKILL.md
│       ├── scripts/
│       │   └── deduplicate_and_parse.py
│       └── references/
│           ├── workflow-progress.template.json
│           └── deduplicated-components.template.json
│
└── workflow/
    ├── trigger.yaml                 ← Progressive Disclosure Stufe 1
    ├── instructions.md              ← Progressive Disclosure Stufe 2
    ├── refs/
    │   └── color-mapping.json      ← Progressive Disclosure Stufe 3
    └── snapshots/
        ├── workout-app-dashboard.html
        ├── workout-app-health.html
        ├── admin-app-dashboard.html
        └── admin-app-health.html
```

---

## Wie ein Workflow abläuft (Schritt für Schritt)

```
Schritt 1: Trigger
  → User legt trigger.yaml ab
  → Beschreibt das Problem in YAML

Schritt 2: Planner wird aktiviert
  → Sieht: trigger.yaml + HTML-Snapshots
  → Erzeugt: design-tokens.json + ui-inventory.json

Schritt 3: Manager wird aktiviert
  → Sieht: trigger.yaml + instructions.md + Planner-Outputs
  → Erzeugt: Roadmap + Task-Pakete für Worker/Storybook

Schritt 4a: Worker-Schleife
  → Bekommt: 1 Task-Paket + freigegebene Tokens/Refs
  → Erzeugt: Komponenten-Code (.tsx) + aktualisiertes Inventar

Schritt 4b: Storybook-Schleife
  → Bekommt: neue Komponenten-Liste + Tokens
  → Erzeugt: CSF Stories (.stories.tsx)

Schritt 5: Validation Gate
  → Storybook läuft ohne App-Start
  → Manager prüft Fortschritt
  → Nächste Phase oder Korrekturen

Schritt 6: Cleanup
  → Externe Referenzen (Stufe 3) werden nach Nutzung gelöscht
  → Kontext-Fenster bleibt sauber
```

---

## Warum dieser Ansatz funktioniert

| Problem | Lösung |
|---------|--------|
| KI verliert den Faden | Progressive Disclosure: Agent sieht nur seinen Kontext |
| Inkonsistente Designs | Design Tokens als Single Source of Truth |
| Doppelter Code | Deduplizierung via Content-Hashing (CDD Analysis Skill) |
| Schwer nachvollziehbar | workflow-progress.json als Checkpoint |
| KI "halluziniert" Komponenten | Strenge Sichtfeld-Regel + cdd-id Traceability |
| Web-Code in React Native | Worker-Skill kennt explizit die RN-Regeln |
