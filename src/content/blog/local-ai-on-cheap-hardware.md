---
title: "Local AI on cheap hardware: worth it?"
description: "Running models locally with LM Studio and Ollama on a modest machine — what works, what's painfully slow, and when the cloud is just the smarter call."
category: "Gadgets"
date: 2026-04-28
draft: false
---

Honest answer: a £600 machine with 16GB of RAM can run useful local models today — but only the small ones, and only if you're patient. For privacy-sensitive notes, offline drafting, and tinkering, it's genuinely worth it. For anything you need to be fast or frontier-quality, the cloud still wins on cost-per-result.

## What actually runs on cheap hardware

With LM Studio or Ollama on a mid-range laptop:

- **7–8B models** run fine for chat, summaries, and simple coding help.
- **Quantized 13B** models work but get sluggish.
- **Anything bigger** needs a dedicated GPU or a lot of patience.

## The costs nobody mentions

The model is free. The rest isn't:

- **RAM is the real gate.** 16GB is the floor; 32GB changes everything.
- **Battery and heat.** Local inference hammers both. This is a plugged-in activity.
- **Your time.** Setup, model selection, and prompt tuning add up.

## When local genuinely beats the cloud

- You're handling private data you can't send anywhere.
- You're offline or on a metered connection.
- You're learning how these models actually behave.

## When to just use the cloud

If you need GPT-class quality, fast responses, or you're doing this occasionally, a few pounds of API credit will outperform a hardware upgrade every time.

Local AI on cheap hardware is real and improving fast. Just go in knowing it's a hobby-grade setup, not a quiet free replacement for the frontier models.
