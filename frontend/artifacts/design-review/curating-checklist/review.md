# Curation loading screen review

The loading screen now uses five cards that complete in order as setup details, pace, Library material, and the starting reply are prepared. The fifth card completes just before Coach opens. The right card uses the student's actual class, board, and pace. If the starting reply fails, the screen says Coach can still take a question.

## Iterations

| Pass | Screenshots | Finding and change |
| --- | --- | --- |
| Before | [Desktop](before-desktop.png), [mobile](before-mobile.png) | The waveform gave no visible progress or explanation of what was being prepared. |
| First pass | [Desktop](pass-1-desktop-late.png), [mobile](pass-1-mobile-late.png), [320px phone](pass-1-small-late.png) | The 320px view clipped the footer. The final step also retained a plan-building headline. Tightened narrow-screen spacing and updated the headline. |
| Layout correction | [Desktop](final-desktop.png), [mobile](final-mobile.png), [320px phone](final-small.png) | A UTF-8 byte-order mark prevented the first CSS selector from applying, shifting desktop content left and widening the phone viewport. Removed it and verified computed layout. |
| Final | [Desktop](after-final-desktop.png), [mobile](after-final-mobile.png), [320px phone](after-final-small.png), [reply unavailable](fallback-desktop.png) | The checklist is centered, the 320px view fits, the active step is readable, and the fallback does not claim a plan was made. |

Final viewport checks: 1440x900, 390x844, and 320x568 all have document dimensions equal to the viewport. The active card and timeline markers animate in blue. Reduced-motion settings disable the repeating animations.
