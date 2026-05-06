# Skill: Planner - Project Discovery

## Ziel
HTML-Snapshots scannen, UI-Muster erkennen und Design-Tokens extrahieren.

## Inputs (Minimal)
- Trigger YAML
- HTML-Snapshot (nur die HTML-Datei)
- Discovery-Regeln (Pattern-Set)

## Outputs
- tokens.json (Farben, Typografie, Spacing, Radius)
- inventory.json (Komponentenliste mit Atomic-Levels)

## Regeln
- Nur HTML analysieren.
- Extrahiere essenzielle Tokens, keine Implementation.
- Standardisiere Tokens in JSON.

## Validierung
- JSON Schema gueltig
- Tokens sind eindeutig und konsistent
