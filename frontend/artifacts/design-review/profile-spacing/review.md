# My profile visual review

Captured at 1440 x 900 desktop and 390 x 844 mobile with a sample Rahul profile. The completed-task fixture is for layout review only; the product continues to calculate activity from actual completed tasks.

## Before

- [Desktop before](desktop-before.png) and [mobile before](mobile-before.png): task, day, and plan totals appeared twice; every detail was an input field; six tiny badge cards competed with the activity cards. Most labels were 10-11 px.

## Iterations

1. [Desktop pass 1](desktop-pass-1.png), [mobile pass 1](mobile-pass-1.png), and [edit state](desktop-edit-pass-1.png): moved editable fields behind Edit details, retained a readable summary, grouped activity metrics once, and enlarged badge cards. Review found overlapping chart copy, a stretched activity card while editing, and awkward mobile badge controls.
2. [Desktop pass 2](desktop-pass-2.png), [mobile pass 2](mobile-pass-2.png), [desktop edit state](desktop-edit-pass-2.png), and [mobile edit state](mobile-edit-pass-2.png): separated chart copy, stopped card stretching, aligned mobile badge controls, and spaced detail rows more evenly. [No-activity pass 2](desktop-empty-pass-2.png) exposed a remaining row of zeros and locked badges.
3. [Final desktop](desktop-final.png), [final mobile](mobile-final.png), [new-student desktop](desktop-empty-final.png), and [new-student mobile](mobile-empty-final.png): replaced the empty metrics and chart with one action, previewed only the first upcoming badge, muted unset optional values, and shortened the mobile empty state.

The final captures show no horizontal overflow or browser runtime errors at either viewport. The profile deliberately allows vertical scrolling so fields and badges retain readable type and spacing.
