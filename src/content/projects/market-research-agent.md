---
title: "Market Research Agent"
description: "Wires live stock and crypto data into an AI workflow that summarises the picture — and flags where the data is thin or the model is guessing."
tagline: "Live market data, summarised by AI — with the gaps called out."
tech: ["Claude", "Alpha Vantage", "Supabase", "n8n"]
category: "AI Tools"
status: "Demo"
launchUrl: "https://example.com/market-agent"
buildUrl: "https://www.youtube.com/@techsober"
order: 2
features:
  - title: "Live data in"
    body: "Pulls current prices and fundamentals from market APIs at request time, not from stale snapshots."
    icon: "trend"
  - title: "Plain-English summary"
    body: "Turns the raw numbers into a readable brief you can skim in thirty seconds."
    icon: "doc"
  - title: "Flags the unknowns"
    body: "When data is missing or the model is extrapolating, it says so instead of bluffing."
    icon: "warning"
honesty:
  - "This is not financial advice and the app says so on every screen. It's a research toy, not a trading tool."
  - "Free market APIs rate-limit hard — during heavy use it will slow down or queue."
  - "Crypto data quality varies wildly by source. Treat smaller coins' numbers with suspicion."
  - "The summary can miss context a human analyst wouldn't. Always read the underlying figures."
---

The Market Research Agent exists to test a simple idea: can an AI make raw market data *understandable* without overstating its confidence? The build deliberately leans into the limits — where the data is thin, the app tells you, rather than smoothing it over with a confident-sounding paragraph.

## How to try it

1. Enter a ticker or coin.
2. The agent fetches live data and fundamentals.
3. Read the summary — and the "what we couldn't verify" note underneath it.

It's a demo, not a product. The interesting part isn't the answer; it's watching where an honest agent draws the line on what it knows.
