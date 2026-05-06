# KI Workflow Architektur

Stand: 2026-05-06

## Ziel
Eine modulare, skalierbare KI-Architektur fuer UI- und Systemarbeit. Der Fokus liegt auf CDD, Atomic Design, stabiler Design-Identitaet und einer klaren Agenten-Topologie.

## Probleme, die geloest werden
- "KI hat alles gefickt": Design driftet ab, Inkonsistenz entsteht.
- Ein Prompt ist keine Architektur: fehlende Zustandsverwaltung und fehlende Isolation.
- Kontextfenster sind begrenzt: LLM verliert den Faden ohne progressive Struktur.

## Architekturprinzipien
- CDD und Atomic Design als Basis (Atome zuerst).
- Progressive Disclosure (3 Stufen), damit Kontext sauber bleibt.
- Hierarchische Agentenstruktur mit Sichtfeld-Regeln.
- Jede Rolle hat klar definierte Inputs und Outputs.

## Agenten-Topologie
- Planner Agent
  - Aufgabe: Projekt-Discovery und Token-Extraktion.
  - Sichtfeld: nur Trigger + HTML-Snapshot + Discovery-Regeln.
- Manager Agent
  - Aufgabe: Work Breakdown, Roadmap, Task-State.
  - Sichtfeld: Trigger + Instruktionen + Status.
- Worker Agents
  - Aufgabe: Umsetzung (UI, Tests, Storybook) gemaess freigegebenem Kontext.
  - Sichtfeld: Instruktionen + relevante Referenzdateien.

## Sichtfeld-Regel
- Ein Agent sieht nur das Minimum, das er fuer seinen Schritt braucht.
- Kein Agent sieht gleichzeitig alle Stufen.

## Progressive Disclosure (3 Stufen)
1) Trigger
   - YAML mit Problemstatement und Ziel.
2) Instruktionen
   - Detaillierte Arbeitsanweisung fuer die Rolle.
3) Externe Referenzen
   - Z. B. Farbmapping, Typografie, Tokens.
   - Werden nach Nutzung geloescht.

## CDD-Workflow
- Atome -> Molekuele -> Organismen -> Templates -> Pages.
- Jede Komponente bekommt Storybook Stories.
- UI wird in Storybook validiert, ohne App-Start.

## Output-Artefakte
- Design Tokens JSON
- UI-Inventar JSON
- Roadmap und Status
- Skill-Spezifikationen
- Storybook Stories nach CSF

## Skill-Zuordnung (Infrastruktur)
- Discovery: `planner-project-discovery`
- Roadmap/Task-State: `manager-work-breakdown`
- UI-Umsetzung: `worker-ui-conversion`
- Storybook/CSF: `storybook-generation`
- Neue Skills: `skill-generator`

## Governance
- Validierungsschritte nach jedem Agenten.
- Versionierung der Skills.
- Meta-Skill zur Skill-Erzeugung.
