# Test Cases

| ID | Title | Priority | Steps (summary) | Expected | Automated |
|---|---|---|---|---|---|
| TC-01 | Six slots render | P1 | Open page | Exactly 6 slots | ✅ |
| TC-02 | Empty box blocked | P1 | Click Add to cart with no pieces | Cart stays empty | ✅ |
| TC-03 | First piece prices | P1 | Choose one flavour | Subtotal > 0 | ✅ |
| TC-04 | Repeats scale exactly | P1 | Same flavour in two slots | Subtotal = 2 × single price | ✅ |
| TC-05 | Remove restores price | P2 | Add two pieces, remove one | Subtotal returns to previous value | ✅ |
| TC-06 | Replace keeps count | P2 | Change a filled slot's flavour | New label shown, count unchanged | ✅ |
| TC-07 | Clear-all resets | P2 | Fill slots, Clear all | Subtotal = 0 | ✅ |
| TC-08 | Full-box savings | P1 | Fill all six | Savings shown, ≥ 0 (and equals agreed rule if set) | ✅ |
| TC-09 | Cart handoff | P1 | Build 3 pieces, add to cart | Cart contains the chosen flavours | ✅ |
| TC-10 | Mobile entry point | P2 | Mobile homepage, tap Shop Gift Boxes | Lands on /collections/bundles | ✅ |
| TC-11 | Critical URLs | P2 | Request key pages | HTTP 200, no redirects | ✅ |
| TC-12 | Out-of-stock flavour | P2 | Search for a sold-out flavour | Not selectable, or clearly marked | Manual |
| TC-13 | Keyboard-only build | P3 | Complete a box with keyboard only | Every control reachable and operable | Manual |
| TC-14 | Refresh mid-build | P3 | Build 3 pieces, reload | Behaviour matches the agreed spec (kept or cleared) | Manual |
