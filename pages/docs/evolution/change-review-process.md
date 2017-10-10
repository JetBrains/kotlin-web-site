---
type: doc
layout: reference
category: "Language Evolution"
title: "Change Review Process"
toc: true
---

# Scheduling a proposed change for review

The committee meets every few weeks to review any upcoming changes.

To get a change scheduled for review:

*   Ensure there is a bug tracking the change in the
    [Kotlin Issue Tracker](https://youtrack.jetbrains.com/issues/KT)
*   Include the following information in the bug:
    *   Concrete sample of the existing behavior/pattern/bug
    *   Concrete sample of the proposed behavior/pattern
    *   If possible an indication of the impact of this change
        (# impacted users, how common this pattern is, etc..)
    *   Description what part of the above deprecation policy this
        change should fall
    *   Proposed compiler versions where this change will land
        (e.g. when will the warning show up, when will it become an
        error)
*   Add the tag
'[for-language-committee](https://youtrack.jetbrains.com/issues/KT?q=project:%20Kotlin%20tag:%20for-language-committee%20%23Unresolved)'
to make the bug show up on the committee's radar.


# Committee review & response

*   The committee members preview bugs in the queue a couple of days
    before the committee meets and might post additional questions on
    the bugs.
*   At the committee meeting, members review the bugs in the queue
    together and try to make a decision.
*   The committee will post their notes to the bug, this can be a
    request for more information or a decision.
*   When the committee approves the change, they will mark the bug
    with 'language-committee-approved'

# Urgent Reviews

Reviews that need a decision before the next committee meeting (e.g.
because of a release deadline) can be done by the committee in
email/chat. These type of reviews need to be requested by the Lead
Kotlin Language Designer (currently Andrey Breslav).
