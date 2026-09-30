Redesign Room 01 completely.

Keep the existing story, UV scanner mechanic, evidence examination area, decoder, password flow, and FOCUS solution.

Change only the evidence cards and investigation experience.

━━━━━━━━━━━━━━━━━━━━━━━━━━

GOAL

This room should feel like a professional design review investigation.

Players should not be looking for obviously broken screens.

Players should be comparing near-identical UI review cards and identifying subtle inconsistencies.

The experience should feel like:

Design QA
+
Design System Audit
+
UX Investigation
+
Detective Mystery

NOT

Spot the Difference

NOT

Find the Broken Screenshot

━━━━━━━━━━━━━━━━━━━━━━━━━━

VISUAL CONCEPT

The missing researcher was reviewing a new product feature before launch.

Twelve review cards were recovered.

Most passed review.

Seven contain inconsistencies.

The researcher secretly encoded a message using those inconsistencies.

Investigators must discover the affected cards.

━━━━━━━━━━━━━━━━━━━━━━━━━━

IMPORTANT DESIGN CHANGE

Replace all existing evidence cards.

Do not use unrelated review screenshots.

Create 12 nearly identical design-review cards.

Each card must contain:

Primary Heading

Secondary Description

Status Chip

Primary Button

Secondary Button

Card Border

Tag

Meta Information

Divider

The same component structure must appear repeatedly.

The cards should look like components from a design system.

━━━━━━━━━━━━━━━━━━━━━━━━━━

BASE COMPONENT

Normal Card Example

Heading:

Premium Protection Plan

Description:

Choose a healthcare plan that fits your needs and lifestyle.

Status:

Recommended

Primary Button:

Continue

Secondary Button:

Learn More

Tag:

Coverage Included

Meta:

Updated 2 Days Ago

━━━━━━━━━━━━━━━━━━━━━━━━━━

NORMAL STATE

Five cards should be identical.

These establish the "correct" pattern.

Use:

24px heading

16px body

consistent spacing

perfect alignment

correct capitalization

high contrast

outlined secondary button

selected primary button

These become the visual baseline.

━━━━━━━━━━━━━━━━━━━━━━━━━━

ALTERED CARDS

Create exactly seven altered cards.

The cards should NOT look obviously broken.

The differences should be subtle.

Only experienced designers should notice quickly.

━━━━━━━━━━━━━━━━━━━━━━━━━━

CARD O

Letter:

O

Problem:

Title size reduced by 4pts

Correct:

24px

Altered:

20px

Everything else remains correct.

━━━━━━━━━━━━━━━━━━━━━━━━━━

CARD B

Letter:

B

Problem:

Content shifted 8px left

Only the internal content alignment changes.

Card structure remains intact.

━━━━━━━━━━━━━━━━━━━━━━━━━━

CARD S

Letter:

S

Problem:

Supporting description uses lower contrast text.

Correct:

#4A4A4A

Altered:

#767676

The issue should feel like an accessibility concern.

━━━━━━━━━━━━━━━━━━━━━━━━━━

CARD E

Letter:

E

Problem:

Primary button appears unselected.

Looks like the default state rather than active state.

Everything else remains normal.

━━━━━━━━━━━━━━━━━━━━━━━━━━

CARD R

Letter:

R

Problem:

Vertical spacing inconsistency.

One gap is 24px instead of 16px.

Feels subtly awkward.

━━━━━━━━━━━━━━━━━━━━━━━━━━

CARD V

Letter:

V

Problem:

Capitalization inconsistency.

Normal:

Premium Protection Plan

Altered:

Premium protection plan

Looks like a design-system inconsistency.

━━━━━━━━━━━━━━━━━━━━━━━━━━

CARD E

Letter:

E

Problem:

Secondary button border missing.

Button still exists.

Only the border has disappeared.

━━━━━━━━━━━━━━━━━━━━━━━━━━

IMPORTANT

Do NOT visually label these cards.

Do NOT call them broken.

Do NOT use red colors.

Do NOT use warning icons.

Do NOT use error states.

All cards should initially look valid.

━━━━━━━━━━━━━━━━━━━━━━━━━━

INVESTIGATION FLOW

STEP 1

Players inspect all 12 cards.

STEP 2

Players determine which cards do not match the system.

STEP 3

Players drag suspicious cards into:

Evidence Examination Area

STEP 4

Each card receives a small physical stamp:

UNDER REVIEW

━━━━━━━━━━━━━━━━━━━━━━━━━━

UV SCANNER MECHANIC

The UV scanner is the most important interaction.

Do NOT reveal letters directly.

Do NOT reveal the password.

Do NOT reveal clues on hover.

Instead:

Only when BOTH conditions are true:

1. Card is inside Examination Area

2. UV Scanner overlaps the card

Reveal hidden forensic markings.

Example:

Archive ID

Inspection Number

Review Code

Invisible Ink

Forensic Mark

━━━━━━━━━━━━━━━━━━━━━━━━━━

REVEALS

Card O → V-15

Card B → V-02

Card S → V-19

Card E → V-05

Card R → V-18

Card V → V-22

Card E → V-05

Players decode them using the archive decoder.

Result:

OBSERVE

━━━━━━━━━━━━━━━━━━━━━━━━━━

MAKE THE ROOM FEEL PREMIUM

Add:

Audit Checklist

Design Review Notes

Researcher's Handwritten Comments

Tiny Investigation Stickers

Review Status Marks

Version Numbers

Design System References

Examples:

"Check spacing rhythm"

"Feels slightly off"

"Component mismatch?"

"Review failed QA"

These should add atmosphere without giving away answers.

━━━━━━━━━━━━━━━━━━━━━━━━━━

AHA MOMENT

The room should create the feeling:

"I wasn't looking for broken screens."

"I was looking for broken design decisions."

Players should feel like design investigators, not puzzle solvers.

The experience should naturally teach:

Hierarchy
Alignment
Contrast
Component States
Spacing
Consistency
Design Systems

without explicitly explaining them.