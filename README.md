# Personal Projects Explorer

A static collection of interactive modules for personal economics research.
The layout and organization follow the neighboring Mechanism Design Explorer.

Open [index.html](index.html) directly in a browser. There is no build step,
server requirement, account, or runtime network dependency.

## First module

[Bilateral Trade with a Lying Cost](bilateral-trade/lying-cost/index.html)
explores Elvin Jiang's September 2026 paper with independent
`V ~ Uniform[0,1]` and `C ~ Uniform[1-epsilon,2-epsilon]`.
Its two parameters are `gamma` and `epsilon`, each in `[0,1]`.

The [paper PDF](assets/papers/Bilateral_Trade_with_a_Lying_Cost.pdf) is included
for offline reading. The module offers minimum-rent and split-the-difference
presets, with analytic incentive diagnostics and best-response paths.

The project owns its runtime assets. It does not load scripts, styles, or
assets from the neighboring explorer.
