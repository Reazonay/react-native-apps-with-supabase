# KI Workflow Todo (1:1 Mitschrift)

Stand: 2026-05-06

## Ziele
- Sauberes modulares Framework fuer KI-gestuetzte Entwicklung.
- Architektur statt nur Prompt-Ausfuehrung.
- CDD und Atomic Design konsequent anwenden.
- UI-Qualitaet und Design-Identitaet stabil halten.
- Skalierbares Skill- und Agenten-System (Factory-Ansatz).

## Kontext
- Monorepo: React Native Apps + Shared Components + Supabase.
- Aktuell existieren: Shared Components, Storybook Basis, Theme Tokens, Apps.

## TODO (Phasen und Deliverables)

### Phase 0: Projekt-Discovery und Statusaufnahme
- [ ] Repo-Scan: vorhandene UI-Komponenten, Styles, Tokens, Screens, Storybook.
- [ ] Design-Abgleich: Abweichungen zum gewuenschten Design identifizieren.
- [ ] Mapping: Komponentenliste nach Atomic-Design-Stufe (Atom, Molecule, Organism, Template, Page).
- [ ] Output: Inventar-Datei (JSON) fuer Komponenten, Tokens, Typografie, Spacing, Farben.

### Phase 1: Architektur und Agenten-Topologie
- [ ] Architektur-Dokument erstellen: Rollen, Verantwortlichkeiten, Schnittstellen.
- [ ] Hierarchische Agentenstruktur definieren.
- [ ] Planner-Manager-Worker Topologie festlegen (ein Planner, ein Manager, mehrere Worker).
- [ ] Sichtfeld-Regel: jeder Agent hat nur ein definiertes Kontextfenster.

### Phase 2: Skill 1 - Planner Agent (Project Discovery Skill)
- [ ] Skill erstellen: scannt nur HTML-Dateien (oder exportierte HTML-Snapshots).
- [ ] Muster-Erkennung: Typografie, Farben, Spacing, Komponenten.
- [ ] Essenz extrahieren und in JSON standardisieren (Design Tokens).
- [ ] Output-Datei definieren (z. B. docs/design-tokens.json).
- [ ] Token-Qualitaet pruefen (Schema + Validierung).

### Phase 3: Progressive Disclosure (3 Eskalationsstufen)
- [ ] Stufe 1: Trigger-Datei (YAML) mit Problemstatement.
- [ ] Stufe 2: Instruktionen-Datei (konkret fuer Aufgabe).
- [ ] Stufe 3: Externe Referenzdatei (z. B. Farbmapping).
- [ ] Cleanup: Externe Referenzen nach Nutzung entfernen.
- [ ] CDD durchsetzen: Context-Text bleibt minimal und sauber.

### Phase 4: Skill 2 - Manager Agent (Work Breakdown Skill)
- [ ] Skill erstellt eine stabile Roadmap mit Meilensteinen.
- [ ] Task-State Verwaltung (Backlog, In-Progress, Done).
- [ ] Validation Gate: prueft Fortschritt gegen definierte Kriterien.

### Phase 5: Skill 3 - Worker Agent (UI Conversion Skill)
- [ ] Skill fuer UI-Conversion definieren (React/React Native).
- [ ] Flexbox-Regel beachten: RN ist vertikal default.
- [ ] UI-Umsetzung entlang Tokens und Atomic Design.
- [ ] Worker arbeitet nur mit freigegebenen Inputs (Progressive Disclosure).

### Phase 6: Dokumentation und isolierte Tests
- [ ] Alles dokumentieren, isoliert testbar machen.
- [ ] Storybook Generation Skill definieren.
- [ ] CSF Struktur erzwingen: Title, Metaobject, Storyobjects, Decorators.
- [ ] Storybook fuer jeden AI-Zustand, ohne App-Start.

### Phase 7: Meta-Skills (Factory)
- [ ] Skill, der neue Skills erzeugen kann (Skill-Generator).
- [ ] Anpassbar an neue Systeme, Regeln und Architekturen.
- [ ] Versionierung und Governance fuer Skills.

### Phase 8: Design-Qualitaet ("KI hat alles gefickt")
- [ ] Design-Identitaet fixieren (Tokens + Typografie + Layout-Raster).
- [ ] UI-Regression Checks definieren (visuell via Storybook).
- [ ] Abweichungen automatisch flaggen.

## Artefakte (geplant)
- Architektur-Dokument (docs/ki-workflow-architecture.md)
- Token-Extrakt JSON (docs/design-tokens.json)
- Progressive-Disclosure Dateien (docs/workflow/*.yaml, *.md)
- Skill-Spezifikationen (docs/skills/*.md)
- Roadmap und Task-State (docs/ki-roadmap.md)

## Freigabe
- Nach Review dieser TODO-Liste starte ich mit der Implementierung.
