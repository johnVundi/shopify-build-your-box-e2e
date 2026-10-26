# Test Cases

Expected values verified by hand on the live page (Oct 2026): every flavour is $12.00 per ½ lb; six eligible pieces make the cheapest one free.

| ID | Title | Priority | Steps (summary) | Expected | Automated |
|---|---|---|---|---|---|
| TC-01 | Six fields render | P1 | Open page | 6 flavour fields; "0 pieces selected" | ✅ |
| TC-02 | Empty box blocked | P1 | Open page, no selection | Button disabled ("Choose a flavor to begin"); Clear all disabled; cart empty | ✅ |
| TC-03 | First piece prices | P1 | Choose one flavour | "1 piece selected", subtotal $12.00, button "Add 1 piece to cart" | ✅ |
| TC-04 | Repeats scale exactly | P1 | Same flavour in two fields | "2 pieces selected", subtotal = 2 × single | ✅ |
| TC-05 | Clear one field | P2 | Add two, clear field 2 | Back to 1 piece and previous subtotal | ✅ |
| TC-06 | Replace keeps count | P2 | Change a filled field's flavour | New flavour shown, still 2 pieces | ✅ |
| TC-07 | Clear-all resets | P2 | Fill fields, Clear all flavors | 0 pieces, $0.00, button disabled | ✅ |
| TC-08 | Six-piece offer | P1 | Fill all six | Subtotal $72.00, savings $12.00, total $60.00, "qualify" message | ✅ |
| TC-09 | Total arithmetic | P1 | 1, 5 and 6 pieces | Total = subtotal − savings every time | ✅ |
| TC-10 | Five pieces don't qualify | P1 | Fill five | Savings $0.00; prompt to choose a sixth piece | ✅ |
| TC-11 | Cart handoff | P1 | Build 3 pieces, add to cart | Cart has 3 items with the chosen flavours | ✅ |
| TC-12 | Mobile entry point | P2 | Mobile homepage, tap Shop Gift Boxes | Lands on /collections/bundles | ✅ |
| TC-13 | Critical URLs | P2 | Request key pages | HTTP 200, no redirects | ✅ |
| TC-14 | Existing cart affects estimate | P2 | Put an item in cart, then build a box | "Existing cart subtotal" row appears; totals include it | Manual |
| TC-15 | Search with no match | P3 | Type "zzz" in a field | Clear empty state; no piece added | Manual |
| TC-16 | Keyboard-only build | P3 | Arrow keys + Enter in the combobox | Every control reachable and operable | Manual |
