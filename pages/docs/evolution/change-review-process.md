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
  * Use the template [below](#issue-template)
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

# Issue Template

``` java
# Summary
> This section is optional, may contain some motivation and background  

# Existing behavior/pattern/bug
> 1. (Minimal) code example
> 2. What's wrong with it
> 3. Detailed explanation of why and how this happens
> 4. Any known reasoning behind such behavior 

# Proposed behavior/pattern
> 1. How it fixes the issue?
> 2. Describe automated migration, if possible

# Impact of this change
> If possible: 
> * number of impacted users
> * how common this pattern is
> * if we believe it's a rare case, why
> * is automated migration possible

# Applicable policies 
> Quotes of relevant sections of the policies 
> from http://kotlinlang.org/docs/evolution/breaking-changes.html

# Affected versions 
> * Provide a detailed step-by-step migration plan
> * Refer to relevant policy sections to justify the proposed changes
> Example:
> * Alter signatures of `MutableMap.getValue` and `setValue`
>   * 1.2.20: add new declarations, deprecate old ones warning 
>     and `ReplaceWith` per section 5.1
>   * 1.3: elevate warning to error per section 5.2
>   * 1.4: remove old declarations (section 5.3: HIDDEN is not needed, because of 
>     `@InlineOnly`)
```
