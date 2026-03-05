# 🎨 AI Automation - Visual UI Guide

## Overall Layout

```
┌─────────────────────────────────────────────────────────────────┐
│                         DASHBOARD                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────────────────────────────────┐                       │
│  │ 📊 Projects                         │                       │
│  │ Manage and track your projects      │  [🤖 AI Generate] [+ New Project]
│  └─────────────────────────────────────┘                       │
│                                                                  │
│  Projects Grid:                                                │
│  ┌────────────┐ ┌────────────┐ ┌────────────┐                 │
│  │ Project 1  │ │ Project 2  │ │ Project 3  │                 │
│  │ Draft      │ │ Active     │ │ Active     │                 │
│  │ 5 tasks    │ │ 8 tasks    │ │ 12 tasks   │                 │
│  └────────────┘ └────────────┘ └────────────┘                 │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Button Location

```
┌────────────────────────────────────────────────────────┐
│  📊 Projects                                           │
│  Manage and track your projects                       │
└────────────────────────────────────────────────────────┘
                                                         ↑
                                    [🤖 AI Generate] [+ New]
                                                         ↑
                                    NEW BUTTON           EXISTING BUTTON
```

### Button Styling

**AI Generate Button** (NEW)
- Color: Purple gradient (`from-purple-500 to-purple-700`)
- Icon: 🤖 Robot emoji
- Text: "AI Generate"
- Hover: Glowing shadow, slight upward movement
- Size: Same as "New Project" button

```
┌──────────────────┐
│ 🤖 AI Generate   │
└──────────────────┘
Hover: Shadow + lift effect
```

---

## Modal Structure

### Full Modal View

```
┌─────────────────────────────────────────────────────────────┐
│ 🤖 AI Automation                                          X │
│ Generate projects and tasks using AI                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ ┌─── Progress Bar ───────────────────────────────────────┐ │
│ ├─── Step 1                 (33.3% full)                ─┤ │
│                                                             │
│ ● ─ ○ ─ ○    (Step indicators: filled, current, pending)  │
│ 1   2   3                                                   │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ STEP 1, 2, or 3 CONTENT (scrollable if needed)            │
│ [Content changes based on step]                            │
│                                                             │
│ (min-height: 400px, max-height: auto)                      │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│ [← Previous] (if step > 1)                [Confirm/Next →] │
└─────────────────────────────────────────────────────────────┘
```

### Modal Dimensions
- **Desktop**: 
  - Width: Max 800px (max-w-2xl)
  - Height: 90vh max
  - Centered on screen

- **Mobile**:
  - Width: 100% with 20px padding
  - Height: 90vh (scrollable if needed)
  - Stacked layout

- **Backdrop**:
  - Semi-transparent black (black/10)
  - Blur effect (backdrop-blur-sm)
  - Click outside to close

---

## Step 1: Input Configuration

### Automation Type Selection

```
┌─────────────────────────────────────────────┐
│ Select Automation Type:                     │
├─────────────┬─────────────────────────────┤
│   🎯        │         ✅                   │
│ Create      │       Add                    │
│ Project     │       Tasks                  │
│             │                              │
│ Generate    │ Generate tasks for           │
│ full        │ existing project             │
│ project     │                              │
│ with        │                              │
│ tasks       │                              │
└─────────────┴─────────────────────────────┘
```

Each button:
- Size: 50% width (flex-1)
- Gap: 1rem between
- Padding: 1rem (p-4)
- Border: 2px (border-2)
- Active: Blue border (border-blue-500) + light blue bg (bg-blue-50)
- Inactive: Gray border + light gray bg
- Transition: 200ms smooth

### For "Create Project" Mode

```
┌─────────────────────────────────────────────┐
│ PROJECT DESCRIPTION                         │
│ ┌──────────────────────────────────────────┐│
│ │ E.g., "Create website redesign project  ││
│ │ with modern UI, mobile optimization,     ││
│ │ and payment integration"                 ││
│ │ [4 rows textarea]                        ││
│ └──────────────────────────────────────────┘│
│                                             │
│ START DATE        │  END DATE              │
│ ┌──────────────┐  │  ┌──────────────┐    │
│ │ DD/MM/YYYY   │  │  │ DD/MM/YYYY   │    │
│ └──────────────┘  │  └──────────────┘    │
└─────────────────────────────────────────────┘
```

Form Fields:
- **Description textarea**:
  - Rows: 4
  - Placeholder: Helpful example
  - Resize: Not allowed (resize-none)
  - Focus: Blue ring (focus:ring-blue-500)

- **Date inputs**:
  - Type: date (HTML5 date picker)
  - Grid: 2 columns
  - Gap: 1rem (gap-4)
  - Native date picker on all devices

### For "Add Tasks" Mode

```
┌─────────────────────────────────────────────┐
│ SELECT PROJECT                              │
│ ┌──────────────────────────────────────────┐│
│ │ ⌄ -- Choose a project --                ││
│ │   • Project Name 1                       ││
│ │   • Project Name 2                       ││
│ │   • Project Name 3                       ││
│ │   • [more projects...]                   ││
│ └──────────────────────────────────────────┘│
│                                             │
│ TASK DESCRIPTION                            │
│ ┌──────────────────────────────────────────┐│
│ │ E.g., "API development, database setup" ││
│ │ [4 rows textarea]                        ││
│ └──────────────────────────────────────────┘│
│                                             │
│ NUMBER OF TASKS (1-10)                      │
│ ┌──────────────────────────────────────────┐│
│ │ [5_] (number spinner)                   ││
│ │      ^                                    ││
│ │  up/down buttons                         ││
│ └──────────────────────────────────────────┘│
└─────────────────────────────────────────────┘
```

---

## Step 2: Review Generated Data

```
┌─────────────────────────────────────────────┐
│ Review Generated Data                       │
│ AI will create the following structure      │
├─────────────────────────────────────────────┤
│                                             │
│ [Scrollable area showing:]                  │
│                                             │
│ ┌─ PROJECT SUMMARY ─────────────────────┐ │
│ │ 📋 E-commerce Website Development     │ │
│ │ Build responsive e-commerce platform  │ │
│ │ with payment integration               │ │
│ │ 💰 Budget: $15,000                    │ │
│ └─────────────────────────────────────────┤ │
│                                             │
│ ┌─ TASKS (5 total) ─────────────────────┐ │
│ │ 1. Frontend Development               │ │
│ │    [High] ⏱️ 80h ✓ 3 subtasks        │ │
│ │    Build responsive UI and components │ │
│ │                                       │ │
│ │ 2. Backend API Development           │ │
│ │    [High] ⏱️ 100h ✓ 3 subtasks       │ │
│ │    Create REST API and services       │ │
│ │                                       │ │
│ │ [More tasks shown...]                │ │
│ └─────────────────────────────────────────┤ │
│                                             │
│ Max height: 384px (max-h-96)                │
│ Overflow: Auto scroll (overflow-y-auto)     │
│                                             │
└─────────────────────────────────────────────┘
```

### Project Summary Card
```
┌──────────────────────────────────────────┐
│ 📋 Project Name                          │
│ Project description with details about   │
│ what will be built...                    │
│ 💰 Budget: $XXXX                         │
└──────────────────────────────────────────┘
   ↑ Blue background (bg-blue-50)
   ↑ Border: Blue (border-blue-200)
```

### Task Items
```
┌──────────────────────────────────────────┐
│ 1. Task Title                  [Priority]│
│    Task description details              │
│    ⏱️ XX hours  ✓ X subtasks            │
└──────────────────────────────────────────┘
   ↑ Gray background (bg-gray-50)
   ↑ Border: Gray (border-gray-200)
   ↑ Priority badge color changes
```

Priority Badges:
```
[High]   - Red badge (bg-red-100, text-red-700)
[Medium] - Yellow badge (bg-yellow-100, text-yellow-700)  
[Low]    - Green badge (bg-green-100, text-green-700)
```

---

## Step 3: Confirmation

```
┌─────────────────────────────────────────────┐
│                                             │
│         ✓ Ready to Generate!               │
│         [Green checkmark circle]            │
│                                             │
│ Your AI-powered project structure is ready.│
│ Click confirm to create the project with   │
│ all tasks and subtasks.                    │
│                                             │
├─────────────────────────────────────────────┤
│                                             │
│ ┌─ SUMMARY ─────────────────────────────┐ │
│ │ ✓ Project: Project Name               │ │
│ │ ✓ Tasks: 5 total                      │ │
│ │ ✓ Subtasks: 15 total                  │ │
│ │                                        │ │
│ │ 💡 Tip: Review and adjust tasks after │ │
│ │    creation. Projects start in draft  │ │
│ │    mode.                              │ │
│ └────────────────────────────────────────┤ │
│                                             │
└─────────────────────────────────────────────┘
```

### Checkmark Circle
```
    ┌───────┐
    │   ✓   │
    │ Green │
    │circle │
    └───────┘
Size: 64px (w-16 h-16)
Background: bg-green-100
Checkmark: text-green-600
```

### Summary Box
```
┌──────────────────────────────────────┐
│ ✓ Project: Name               │
│ ✓ Tasks: 5 total              │
│ ✓ Subtasks: 15 total          │
│                                │
│ 💡 Helpful tip about using...  │
└──────────────────────────────────────┘
Background: bg-blue-50
Border: border-blue-200
Checkmarks: text-blue-600
```

---

## Loading States

### During Generation

```
┌─────────────────────────────────────────────┐
│                                             │
│  [Spinning loader icon]                     │
│  🤖 AI is analyzing your requirements...   │
│                                             │
│  or                                         │
│                                             │
│  🤖 AI is creating tasks for project...    │
│                                             │
│  or                                         │
│                                             │
│  ✅ Creating project and tasks...          │
│                                             │
└─────────────────────────────────────────────┘
```

Loader Animation:
- Icon: Spinning SVG circle
- Color: Blue (text-blue-600)
- Speed: 1s continuous spin
- Message updates: Different per step

### Button States

**Next Button**
```
Default: [Next →]
Loading: [⟳ Generating...]
```

**Confirm Button**
```
Default: [✓ Confirm & Generate]
Loading: [⟳ Creating...]
```

Button State Changes:
- During loading: `disabled={isLoading}`
- Opacity: `disabled:opacity-50`
- Cursor: `disabled:cursor-not-allowed`
- No transform on disabled

---

## Error Handling

### Error Alert

```
┌─────────────────────────────────────────────┐
│ ⚠  Please describe your project            │
│                                             │
│ or                                          │
│                                             │
│ ⚠  End date must be after start date       │
│                                             │
│ or                                          │
│                                             │
│ ⚠  Failed to generate project. Try again.  │
└─────────────────────────────────────────────┘
```

Error Alert Styling:
- Background: bg-red-50
- Border: border-red-200
- Text: text-red-700
- Icon: Error symbol (⚠ or ✕)
- Position: Above buttons (mx-6 mb-4)
- Animation: Fade in (instant)

---

## Footer (Navigation Buttons)

```
┌─────────────────────────────────────────────┐
│                                             │
│ [← Previous] (if step > 1)                 │
│                         [Cancel] [Next →]  │
│                                             │
│ or on last step:                           │
│                         [Cancel] [✓ Confirm│
│                                             │
└─────────────────────────────────────────────┘
```

Button Styles:
- **Previous/Cancel**: Gray buttons
  - Background: bg-gray-50
  - Border: border-gray-200
  - Text: text-gray-600
  - Hover: bg-gray-100

- **Next**: Blue gradient button
  - Background: `from-blue-500 to-blue-700`
  - Text: text-white
  - Hover: shadow-lg, -translate-y-0.5

- **Confirm**: Green gradient button
  - Background: `from-green-500 to-green-700`
  - Text: text-white
  - Hover: shadow-lg, -translate-y-0.5

---

## Responsive Behavior

### Desktop (1920px+)
```
Modal width: 800px (max-w-2xl)
Modal position: Centered
Form layout: 2 columns where applicable
Font sizes: 16px base
Spacing: Generous (1rem+ gaps)
```

### Tablet (768px-1024px)
```
Modal width: 90vw or 600px
Form layout: Responsive grid
Font sizes: 14-16px
Spacing: Moderate (0.75rem+ gaps)
Touch targets: 44px minimum
```

### Mobile (320px-767px)
```
Modal width: 100% - 40px padding
Form layout: Stacked (1 column)
Font sizes: 14px
Spacing: Compact (0.5rem+ gaps)
Touch targets: 44px minimum
Textarea rows: Reduced to 3
Buttons: Full width stacked
```

---

## Color Palette

```
Primary Blue:       #3B82F6 (from-blue-500)
Blue Dark:          #1E40AF (to-blue-700)
Primary Purple:     #A855F7 (from-purple-500)
Purple Dark:        #7C3AED (to-purple-700)
Success Green:      #10B981 (from-green-500)
Green Dark:         #047857 (to-green-700)
Warning Yellow:     #FBBF24 (from-yellow-100)
Error Red:          #EF4444 (text-red-700)
Gray Light:         #F3F4F6 (bg-gray-50)
Gray Border:        #D1D5DB (border-gray-200)
Gray Dark:          #374151 (text-gray-700)
Text Primary:       #111827 (text-gray-800)
Text Secondary:     #6B7280 (text-gray-600)
```

---

## Animations

### Modal Entry
```
Fade In: opacity 0 → 1 (300ms)
Slide Up: translateY 20px → 0 (300ms)
Timing: ease-out
```

### Button Hover
```
Scale/Lift: -translate-y-0.5 (2px upward)
Shadow: shadow-lg appears
Duration: 200ms transition
```

### Loading Spinner
```
Rotation: 360° continuous
Duration: 1s loop
Easing: linear
```

### Progress Bar
```
Fill: width changes smoothly
Duration: 300ms transition
Fill order: 33% → 67% → 100%
```

---

## Accessibility

- **Keyboard Navigation**: Tab through all inputs and buttons
- **Focus Indicators**: Blue ring on focus (focus:ring-2)
- **Color Contrast**: WCAG AA compliant
- **Labels**: All inputs have associated labels
- **Error Messages**: Associated with fields
- **Screen Reader**: Semantic HTML structure
- **Disabled States**: Clear visual indication

---

**This visual guide complements the code and documentation for complete understanding of the AI Automation UI.**
