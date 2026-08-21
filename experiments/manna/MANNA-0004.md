# MANNA-0004 — Discrete Economic Choice Test

Question: can awareness, planning, and discipline improve economic mobility when they do not directly create income or reduce expenses, but only affect which real economic opportunities are perceived, selected, and executed?

## Protocol

- 100 synthetic households
- 120 monthly steps (10 years)
- 200 matched seeds
- Same stochastic income/need shocks across conditions
- Initial awareness/planning/discipline sampled independently in [0.15, 0.85]
- Opportunities: refinance debt, reduce an expense, train for higher income
- Awareness controls whether an opportunity is visible
- Planning controls whether the highest-valued visible opportunity is selected versus a random visible choice
- Discipline controls whether the selected choice is executed
- A/P/D do not directly alter money
- Cash/full condition receives an equalized share of a $100,000 assistance budget when income is below need

## Preliminary results

| condition | sufficient at year 10 | durable sufficiency | median net |
|---|---:|---:|---:|
| control | 43.75 | 39.90 | -1119.29 |
| cash | 43.89 | 39.98 | -1108.99 |
| navigation only | 55.10 | 45.19 | 875.96 |
| full (navigation + cash) | 55.17 | 45.29 | 895.96 |

## Interpretation

The discrete-choice version preserves a large navigation advantage without directly granting economic improvement from awareness/planning/discipline. However, the opportunity effect sizes and opportunity frequency are still assumptions. This result establishes a mechanism worth stress-testing, not an empirical claim about real households.

The marginal effect of cash remains small under this protocol. The next test should calibrate opportunity arrival rates, costs, payoff distributions, failure probabilities, and execution persistence against external empirical literature, then rerun blind parameter ranges and ablations.
