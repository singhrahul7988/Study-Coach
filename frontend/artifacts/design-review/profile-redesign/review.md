# My profile redesign review

The reference layout has a compact title and encouragement row, a full-width identity and metrics band, profile fields beside a progress snapshot, and a horizontal badge row. The implementation follows that structure while keeping the app shell and responsive navigation.

These captures use a local visual-review fixture with four completed tasks across two days and two finished rooms. Runtime figures come from the current demo tab's recorded task completions. Accuracy, subject mastery, streaks, and study hours are omitted because the app does not record evidence for them yet.

| Iteration | Desktop | Mobile | Finding and change |
| --- | --- | --- | --- |
| Before | [Screenshot](./before-desktop.png) | [Screenshot](./before-mobile.png) | Identity used half a column and badges occupied a tall side panel. Rebuilt the page around the reference's horizontal bands. |
| First pass | [Screenshot](./first-pass-desktop.png) | [Screenshot](./first-pass-mobile.png) | Structure matched, but a badge card was cut through mid-text and the activity panel had unused space. |
| Second pass | [Screenshot](./second-pass-desktop.png) | [Screenshot](./second-pass-mobile.png) | Six complete badge cards were visible on desktop, with one full card at a time on mobile. The shared account padding still created extra desktop scroll and some text was too small. |
| Final | [Screenshot](./final-desktop.png) | [Screenshot](./final-mobile.png) | Profile-specific padding and readable labels brought the desktop page into a 1440 × 900 viewport without horizontal or vertical overflow. Badge arrows scroll by one card. |

[Final content crop](./final-content-desktop.png) · [Empty activity desktop](./empty-desktop.png) · [Empty activity mobile](./empty-mobile.png)

The empty state uses zero counts, "None yet," neutral weekly bars, and grey locked badges. A personal goal is optional. Photo changes stay in this browser tab, appear in the header, and clear on sign out.

