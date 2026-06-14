# Scope Control

**Task:** "Fix the bug — `total()` is off by one, it skips the last item."

The bug is one line: a range that stops short.

## Without Ponytail

```diff
- for i in range(len(items) - 1):
+ for i in range(len(items)):
      total += items[i].price

+ # "while I was in here":
+ class CartCalculator:
+     """Encapsulates cart math so we can swap strategies later."""
+     def __init__(self, items, tax_strategy=DefaultTax()):
+         ...
+ # renamed `items` -> `line_items` across cart.py, checkout.py, receipt.py
+ # reformatted the whole file, reordered imports, added type hints to 12 functions
```

One-line bug, forty-line diff across three files. The fix is now buried in a
refactor nobody asked for, the review is an hour instead of a minute, and two
of the touched files weren't even broken.

## With Ponytail

```diff
- for i in range(len(items) - 1):
+ for i in range(len(items)):
      total += items[i].price
```

```python
# ponytail: idiomatic, same fix — sum(item.price for item in items)
```

**40 lines across 3 files → 1 line in 1.** Fix the thing you were sent to
fix. Noticed the loop could be a `sum()`, or that `items` should be
`line_items`? Say it in one line and leave it:

> Fixed the off-by-one. Two things I left alone: the loop reads cleaner as
> `sum(...)`, and `items`/`line_items` is inconsistent across the cart files.
> Want either as a separate change?

The drive-by refactor is the most expensive kind of "helpful" — it grows the
diff, hides the real change, and risks files that were working. Scope control
*is* the laziness: less to review, less to revert, less to break.
