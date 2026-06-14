# Email Validation

**Task:** "Validate an email address in Python."

## Without Ponytail

```python
import re

EMAIL_PATTERN = re.compile(
    r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
)

class EmailValidator:
    """Validates email addresses against RFC-like rules."""

    def __init__(self, pattern: re.Pattern = EMAIL_PATTERN):
        self.pattern = pattern

    def validate(self, email: str) -> bool:
        if not isinstance(email, str):
            raise TypeError("email must be a string")
        email = email.strip()
        if not email:
            return False
        return bool(self.pattern.match(email))


def validate_email(email: str) -> bool:
    """Convenience wrapper around EmailValidator."""
    return EmailValidator().validate(email)
```

A class, a wrapper, a regex that still rejects valid addresses and accepts invalid ones. Regex cannot validate email. Only a delivery attempt can.

## With Ponytail

No format check proves an address is real, so stop pretending one does. The
real validation is a round-trip — send a confirmation link and act on the
click:

```python
# ponytail: the only real validation is delivery; confirm via a clicked link
send_confirmation(email)
```

Want a cheap gate before sending (catch the empty box and the obvious typo)?
The standard library parses it, so you don't hand-roll a regex:

```python
# ponytail: stdlib parse; rejects "" and "no-at-sign", and nothing more — a UX nicety, not proof
from email.utils import parseaddr
addr = parseaddr(email)[1]
ok = "@" in addr and not addr.startswith("@") and not addr.endswith("@")
```

The naive `"@" in email` check (and every RFC regex) still waves through
junk like `xx!rr@tt55**@pp@..` and still can't tell you the mailbox exists.
That's fine — the gate is convenience, delivery is truth.

The one thing the gate must **not** skip is the trust boundary. The address
is attacker-controlled text: `"victim@x.com\nBcc: attacker@evil.com"` is a
header-injection waiting to land in your outbound mail. Strip control
characters before it goes near a header:

```python
# ponytail: not optional — newlines in an address are an attack, not an address
if "\n" in email or "\r" in email:
    raise ValueError("invalid address")
```

**The honest version is shorter and safer:** parse with stdlib, reject
newlines, let the confirmation email be the judge. The RFC regex was always
theater — it looked rigorous and validated nothing.
