# KI-Agenten-System & CDD Analysis Skill – Dokumentation

Dieses Dokument bietet eine strukturierte Übersicht über das hier eingesetzte KI-Agenten-System, die benutzerdefinierten Skills und die Projekt-Architektur für dieses Monorepo.

---

## 1. Die Agenten-Topologie (Hierarchie & Rollen)

Das System basiert auf vier spezialisierten Agenten, die Hand in Hand arbeiten, um UI-Entwürfe in lauffähigen React Native Code zu überführen:

```
        [ PLANNER ] (Analysiert Figma/HTML-Mockups und extrahiert Tokens)
             │
             ▼
        [ MANAGER ] (Erstellt Roadmaps, Meilensteine und Validierungs-Schritte)
             │
      ┌──────┴──────┐
      ▼             ▼
  [ WORKER ]   [ STORYBOOK ] (Generiert isolierte Komponenten & CSF Stories)
  (Schreibt Code)
```

### Die Stufen der Informationsfreigabe (Progressive Disclosure)
Um Redundanzen und Kontext-Überflutung zu vermeiden, wird der Informationsfluss über drei strikte Abstraktionsebenen gesteuert:

1. **Stufe 1 – Trigger (`trigger.yaml`):** Definiert globale Einstiegspunkte und Metadaten, die für alle Agenten sichtbar sind.
2. **Stufe 2 – Instruktionen (`instructions.md`):** Beschreibt spezifische Umsetzungsdetails. Nur für Manager und Worker sichtbar.
3. **Stufe 3 – Externe Referenzen (`refs/color-mapping.json`):** Beinhaltet technische Details (z. B. Farbmappings). Wird nur vom Worker zur Laufzeit ausgewertet und anschließend verworfen.

---

## 2. Die custom Skills & Verzeichnisse

In deinem Workspace befindet sich unter `docs/skills/` die Definition unserer intelligenten Entwicklungs-Skills:

### A. CDD Analysis Skill (`docs/skills/cdd-analysis-skill/`)
Implementiert **Component-Driven Development (CDD)** Prinzipien zur Extraktion und Modularisierung von Komponenten.
* **`SKILL.md`:** Enthält deterministische Regeln zur Klassifizierung von Komponenten in:
  - **Atom:** Eine visuelle Funktion, keine Kind-Komponenten (z. B. `KineticButton`, `KineticBadge`).
  - **Molekül:** 2–4 Atome kombiniert mit eigener Layout-Logik (z. B. `FormField`, `NavigationPills`).
  - **Organismus:** Kombinationen aus Molekülen und Atomen zu einer vollwertigen Sektion (z. B. `StatsBentoGrid`, `WorkoutCard`).
* **`scripts/deduplicate_and_parse.js` & `.py`:** Skripte, die rohe HTML-Entwürfe einlesen, doppelte Layouts identifizieren (68% Einsparung durch Deduplizierung) und eindeutige `data-cdd-id` Attribute injizieren.
* **`references/workflow-progress.json`:** Pflegt den Live-Status aller Komponenten sowie deren Abhängigkeitsgraphen (wenn ein Atom geändert wird, wissen wir sofort, welche Organismen und Listen neu kompiliert oder getestet werden müssen).

### B. Storybook Generation Skill (`docs/skills/storybook-generation.md`)
Regelt die Generierung von CSF Stories (Component Story Format) für Storybook, um Komponenten isoliert zu testen.

### C. Skill Generator (`docs/skills/skill-generator.md`)
Regelt, wie neue Skills basierend auf Benutzeranforderungen und Best Practices erzeugt und validiert werden.

---

## 3. Monorepo & Architektur-Übersicht

Das Projekt ist als **Turborepo Monorepo** strukturiert, was eine saubere Trennung von UI, Backend und Hilfsfunktionen ermöglicht:

```
react-native-apps-with-supabase/
├── apps/
│   ├── workout-app/        # React Native / Expo App (Haupt-Workout-App mit Neon-Theme)
│   ├── admin-app/          # React Native / Expo App (Verwaltungs-Portal mit Light-Theme)
│   └── graphql-server/     # GraphQL API Server
├── packages/
│   ├── shared-components/  # UI-Bibliothek (Atoms, Molecules, Organisms) mit Storybook-Support
│   ├── shared-types/       # TypeScript-Typdefinitionen
│   └── shared-utils/       # Shared Utilities (z. B. Formatierungs-Helfer)
├── supabase/
│   ├── migrations/         # SQL Datenbank-Migrationen (workouts, etc.)
│   └── functions/          # Supabase Edge Functions (client-connection-check)
└── docs/
    ├── prototype/
    │   └── ui/             # Zentraler Ort für alle HTML/UI-Prototypen & Mockups
    └── design-tokens.json  # Exportierte Stitch Design Tokens (Farben, Spacing, Radius)
```

---

## 4. Nutzung und Verifizierung

### Storybook starten
Um die Komponenten in Isolation zu testen:
```bash
cd packages/shared-components
npm run storybook
```

### TypeScript Typ-Prüfung
Um das gesamte Monorepo auf Typsicherheit zu validieren:
```bash
npm run check-types
```
