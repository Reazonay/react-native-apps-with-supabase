---
skill_id: cdd-analysis-skill
version: "1.0.0"
role: manager
trigger: trigger.yaml
scope: monorepo
framework: react-native
progressive_disclosure_level: 2
max_context_lines: 500
inputs:
  - docs/workflow/snapshots/*.html          # HTML-Prototypen
  - scripts/deduplicate_and_parse.py        # Pre-Processing-Skript
  - references/deduplicated-components.template.json
outputs:
  - references/deduplicated-components.json # Klassifizierte Komponenten
  - references/workflow-progress.json       # Checkpoint-Datei
dependencies:
  - skill: planner-project-discovery
    output: docs/design-tokens.json
---

# CDD Analysis Skill – Manager Agent Instruktionen

## Ziel

Analysiere HTML-Prototypen, klassifiziere alle UI-Elemente nach Atomic Design und erstelle
eine deduplizierte, tracebare Komponentenliste als Basis für die React Native Implementierung.

## Phase 1 – Pre-Processing (Skript ausführen)

**Bevor du mit der Klassifizierung beginnst, führe das Skript aus:**

```bash
python docs/skills/cdd-analysis-skill/scripts/deduplicate_and_parse.py \
  --input  docs/workflow/snapshots/ \
  --output docs/skills/cdd-analysis-skill/references/deduplicated-components.json
```

Das Skript liefert dir eine JSON-Datei mit:
- Jedem sichtbaren HTML-Element
- Einem injizierten `cdd-id` (z. B. `atm-btn-01`)
- Einem `content_hash` für Deduplizierung
- Duplikat-Referenzen (`duplicate_of`)

**Du darfst keine Komponenten analysieren, die nicht im Skript-Output vorhanden sind.**
Referenziere immer mit der `cdd-id` aus dem JSON-Output.

---

## Phase 2 – CDD Klassifizierung

Verwende den Skript-Output und klassifiziere jede Komponente nach diesen **deterministischen Regeln**:

### Regel A: ATOM erkennen

Ein Element ist ein **Atom**, wenn ALLE folgenden Bedingungen zutreffen:

1. Es hat **keine Kind-Elemente**, die selbst eigenständige UI-Komponenten sind
2. Es erfüllt **genau eine** visuelle Funktion (z. B. nur Text zeigen, nur klickbar sein, nur Label)
3. Es ist **nicht zusammengesetzt** aus mehreren semantisch verschiedenen Teilen
4. Es stammt aus einem dieser CSS-Klassen-Pattern:
   - `.nav-button` → Atom: **NavButton** (Pill)
   - `.heading`, `h1`, `h2` → Atom: **Heading**
   - `.subheading`, `.meta` → Atom: **BodyText**
   - `.label` → Atom: **LabelCaps**
   - `.badge`, `.status-pill` → Atom: **Badge**
   - `.health-button` → Atom: **ActionButton**
   - `.endpoint` → Atom: **BodyText** (Variante)

**React Native Mapping für Atome:**
```
Text-Elemente  → <Text style={tokens.typography.X}>
Button-Elemente → <TouchableOpacity> + <Text>
Badge/Pill     → <View style={radius.pill}> + <Text>
```

---

### Regel B: MOLEKÜL erkennen

Ein Element ist ein **Molekül**, wenn:

1. Es **2 bis 4 Atome kombiniert**, die zusammen eine klar benennbare UI-Einheit bilden
2. Es hat eine **eigene Layout-Logik** (flex, gap, justify-content)
3. Es ist **wiederverwendbar mit verschiedenen Daten** (Props)

Erkennungspattern aus den HTML-Snapshots:

| HTML-Muster | Molekül-Name | Enthält Atome |
|-------------|--------------|---------------|
| `.card-header` (title + badge) | **WorkoutCardHeader** | Heading + Badge |
| `.nav-row` (mehrere nav-buttons) | **NavigationPillGroup** | NavButton × n |
| `.status-row` (label + pill) | **HealthStatusRow** | LabelCaps + Badge |
| `div` (label + endpoint) | **EndpointRow** | LabelCaps + BodyText |

**React Native Mapping für Moleküle:**
```
Layout-Container → <View style={{ flexDirection: 'row', gap: tokens.spacing.X }}>
```

---

### Regel C: ORGANISMUS erkennen

Ein Element ist ein **Organismus**, wenn:

1. Es **Moleküle und/oder Atome** zu einer vollständigen Sektion kombiniert
2. Es eine **eigenständige Funktion** hat (z. B. eine komplette Karte, eine Liste)
3. Es eigene Business-Logik-Props braucht (z. B. Workout-Daten, Health-Status)

Erkennungspattern:

| HTML-Muster | Organismus-Name | Enthält |
|-------------|-----------------|---------|
| `article.card` (header + meta + badge) | **WorkoutCard** | WorkoutCardHeader + BodyText |
| `section.card` (heading + status-row + button) | **HealthCard** | Heading + HealthStatusRow + ActionButton |
| `section.list/grid` (mehrere WorkoutCards) | **WorkoutList / AdminWorkoutGrid** | WorkoutCard × n |

---

### Regel D: DEDUPLIZIERUNG anwenden

1. Prüfe den `content_hash` im Skript-Output
2. Elemente mit identischem Hash → **nur ein Eintrag** in der Komponentenliste
3. Duplikate werden als `"duplicate_of": "cdd-id-des-originals"` referenziert
4. **Niemals dasselbe Atom/Molekül zweimal implementieren**

```json
// RICHTIG: Eine Implementierung, eine Referenz
{ "cdd-id": "atm-badge-01", "component": "Badge" }
{ "cdd-id": "atm-badge-02", "duplicate_of": "atm-badge-01" }

// FALSCH: Zwei separate Implementierungen
{ "cdd-id": "atm-badge-01", "component": "Badge" }
{ "cdd-id": "atm-badge-02", "component": "Badge" }  // ← niemals!
```

---

## Phase 3 – React Native Konsolidierung

Für jede eindeutige Komponente (keine Duplikate) erstelle einen Konsolidierungs-Eintrag:

```json
{
  "cdd-id": "atm-badge-01",
  "component": "KineticBadge",
  "atomicLevel": "atom",
  "rnFile": "packages/shared-components/src/atoms/KineticBadge.tsx",
  "storyFile": "packages/shared-components/stories/KineticBadge.stories.tsx",
  "tokens": ["colors.badgeSuccessBg", "colors.badgeSuccessText", "radius.pill"],
  "props": ["label", "variant"],
  "rnMapping": {
    "html": "<span class='badge'>",
    "rn": "<View style={styles.badge}><Text style={styles.badgeText}>"
  }
}
```

---

## Phase 4 – workflow-progress.json aufbauen

Nach der Klassifizierung aktualisiere die `workflow-progress.json`:

### Initialer Stand
```json
{
  "_comment": "Checkpoint-Datei des Manager-Agents. Wird nach jedem Lauf aktualisiert.",
  "last_run": "ISO-8601-Timestamp",
  "phase": "cdd-classification",
  "status": "in_progress"
}
```

### Delta-Update Regel

Wenn das Skript beim nächsten Durchlauf **geänderte Hashes** meldet:

1. Vergleiche `content_hash` des neuen Laufs mit `workflow-progress.json → processed_files[].hash`
2. Wenn Hash geändert → Status der betroffenen Komponente auf `"needs_update": true`
3. Prüfe `dependencies`-Array: Alle Moleküle/Organismen, die das geänderte Atom verwenden, erhalten ebenfalls `"needs_update": true`
4. Nur die als `needs_update` markierten Komponenten neu generieren

```
Atom ändert sich → Moleküle die es nutzen → Organismen die Moleküle nutzen
     ↓                      ↓                           ↓
Badge Hash ≠        WorkoutCard → needs_update    WorkoutList → needs_update
```

---

## Output-Validierung (Checkliste)

Bevor du den Workflow als abgeschlossen meldest:

- [ ] Alle cdd-ids aus Skript-Output sind klassifiziert (atom/molecule/organism)
- [ ] Keine doppelten Implementierungen (Duplikate referenzieren via `duplicate_of`)
- [ ] Jede Komponente hat ein `rnMapping` (HTML → React Native)
- [ ] Jede Komponente referenziert konkrete Token-Namen (keine Hex-Werte direkt)
- [ ] `workflow-progress.json` ist aktuell und enthält `processed_files` mit Hashes
- [ ] Abhängigkeits-Graph (`dependencies`) ist vollständig

---

## Wichtige Konstanten

```
Token-Datei:    docs/design-tokens.json
Inventar-Datei: docs/ui-inventory.json
Snapshots:      docs/workflow/snapshots/*.html
Output:         docs/skills/cdd-analysis-skill/references/
```

**Niemals Hex-Farbwerte hardcoden.** Immer auf Token-Namen referenzieren:
```
✅ tokens.colors.badgeSuccessBg
❌ "#d1fae5"
```
