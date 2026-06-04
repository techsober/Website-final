---
title: "Is the new Siri actually Google in disguise?"
description: "Apple's WWDC promised a smarter Siri — but a chunk of it runs on Google's Gemini. Here's what's really shipping, what's still a demo, and what it means for you."
category: "AI"
date: 2026-05-12
draft: false
---

Short answer: partly, yes. Apple has confirmed that the most demanding parts of the new Siri lean on a custom Google Gemini model running on Apple's private servers — while simpler requests stay on-device. So Siri isn't "Google" wearing an Apple badge, but Google's model is doing real work behind the scenes.

That nuance matters, because the marketing makes it sound like one seamless Apple brain. It isn't. It's a routing system, and where your request lands changes the answer you get.

## What Apple actually announced

The headline features fall into three buckets:

- **On-device requests** — timers, app actions, basic questions. Fast, private, no model swap.
- **Private Cloud Compute** — heavier reasoning sent to Apple's own servers, now partly powered by a Gemini model Apple says it cannot inspect your data with.
- **Still-a-demo features** — the "personal context" Siri that reads across your apps was shown on stage but isn't in the shipping build yet.

## So is your data going to Google?

Not in the way you'd fear. Apple's framing is that the Gemini model runs inside Private Cloud Compute, isolated from Google's own infrastructure. The promise is that Google never sees the request.

The honest caveat: you're trusting Apple's architecture diagram. It's a strong design on paper, and independent researchers can inspect the server images — but "we can't see it" is still a claim, not something you can personally verify.

## What this means for you in practice

For day-to-day use, you won't notice which model answered. Where it matters:

- Complex, multi-step requests will be slower (they leave the device).
- Some of the best demos won't exist at launch — don't upgrade *for* them yet.
- If on-device privacy is your whole reason for buying Apple, know that the smartest answers now involve a third party's model.

The smart Siri is real, it's genuinely more capable, and it's also more dependent on other companies than Apple's keynote let on. Both things are true.
