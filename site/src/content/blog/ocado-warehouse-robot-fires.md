---

title: "Two Fires, $138 Million in Damage: When Warehouse Robots Crash and Burn"
description: "In 2019 and 2021, Ocado's automated warehouses in the UK were destroyed by fires started by robot collisions. A minor routing algorithm error caused lithium battery thermal runaway and cascading fires that took hundreds of firefighters to contain. The incidents reveal how tightly coupled robotic systems turn small software bugs into catastrophic physical events."
date: 2026-03-18
tags: [embodied-ai, robotics, incident-analysis, safety, warehouse, fire, ocado, lithium-battery]
audio: "https://cdn.failurefirst.org/audio/blog/ocado-warehouse-robot-fires.m4a"
---

In July 2021, a small collision between three robots on the roof of an automated warehouse in Erith, southeast London, started a fire that burned for four days, required over 100 firefighters and 15 fire engines, and forced the evacuation of 800 people from surrounding buildings. The entire facility was destroyed.

It was the second time in two years that an Ocado automated warehouse had burned to the ground.

---

## What actually happened

Ocado operates some of the most advanced automated grocery fulfillment centers in the world. Their system uses thousands of small cube-shaped robots that move on a grid atop a massive three-dimensional storage structure. The robots travel along tracks, retrieve grocery items from storage bins below, and deliver them to packing stations. At peak operation, thousands of these units run simultaneously on the same grid, coordinated by a centralized traffic management algorithm.

On July 16, 2021, at the Erith Customer Fulfilment Centre, **three robots collided on the grid**. The collision was attributed to a failure in the routing algorithm that manages robot traffic flow — the digital equivalent of an air traffic control error. The impact ruptured lithium-ion battery cells in at least one of the robots, triggering thermal runaway.

Lithium battery thermal runaway is not a gentle process. Once a cell enters thermal runaway, it can reach temperatures exceeding 600 degrees Celsius and release flammable electrolyte gases. In a warehouse packed with cardboard, plastic packaging, and thousands of other lithium-battery-powered robots, the fire spread rapidly.

The London Fire Brigade dispatched over 100 firefighters and 15 fire engines. Approximately 800 people were evacuated from the area. The blaze took four days to fully extinguish. The warehouse and its contents were a total loss [1][2].

Two years earlier, in February 2019, Ocado's warehouse in Andover, Hampshire experienced a strikingly similar event. A robot battery caught fire, and the blaze destroyed the entire 240,000-square-foot facility. That fire required over 200 firefighters and caused an estimated 110 million pounds (approximately $138 million USD) in damages. Ocado's share price dropped significantly in the aftermath [3].

---

## The failure chain

What makes these incidents instructive is the failure chain — the sequence of events from root cause to final outcome, and how disproportionate the escalation was.

**Step 1: Software routing error.** The traffic management algorithm failed to prevent three robots from occupying the same grid space simultaneously. This is a coordination bug — the kind of thing that shows up as a failed unit test, a logged warning, or a minor delay in normal operation.

**Step 2: Physical collision.** The three robots collided. In a conventional warehouse, a collision between three small wheeled platforms would be a maintenance ticket. Dented casing, maybe a broken wheel. Someone with a clipboard writes it up.

**Step 3: Battery rupture.** The collision force was sufficient to damage a lithium-ion battery cell. This is the phase transition — the moment where a software problem becomes a chemistry problem. Lithium battery thermal runaway is an exothermic chain reaction. Once initiated, it cannot be stopped by software.

**Step 4: Cascading fire.** The thermal runaway ignited surrounding materials. The warehouse contained thousands of similar lithium-battery-powered robots, plus cardboard, plastics, and food products — all fuel. The fire spread beyond the capacity of the facility's suppression systems.

**Step 5: Total facility loss.** A routing algorithm bug destroyed a building.

This is what tight coupling looks like in robotic systems. Each step in the chain is individually unremarkable. Routing bugs happen. Small collisions happen. Lithium batteries are well-understood technology. But when these elements are co-located at density — thousands of lithium-powered robots operating centimeters apart on the same grid — the failure modes compound rather than isolate.

---

## Why this keeps happening

The Andover fire in 2019 and the Erith fire in 2021 share the same basic failure pattern: robot collision, battery thermal runaway, catastrophic fire. Two years apart, same company, same basic system architecture.

This raises an uncomfortable question: **what changed between 2019 and 2021, and why wasn't it enough?**

Ocado reportedly implemented safety improvements after the Andover fire, including enhanced fire detection and suppression systems at the Erith facility. But the fundamental architecture remained the same: thousands of lithium-powered robots operating at density on a shared grid, coordinated by software.

The problem is not that fire suppression failed. The problem is that **the failure mode exists at all**. When your system architecture means that a software routing error can cascade into a multi-day fire requiring 100 firefighters, the issue is the coupling between digital coordination and physical energy storage — not the quality of your sprinkler system.

Industrial safety engineering has a concept called "defense in depth" — multiple independent barriers between an initiating event and a catastrophic outcome. In the Ocado system, the barriers were not independent. The traffic algorithm prevented collisions. If collisions occurred, battery integrity prevented thermal runaway. If thermal runaway occurred, fire suppression prevented facility loss. But each barrier depended on the previous one not failing too severely, and the energy density of thousands of co-located lithium batteries meant that once the fire barrier was breached, the outcome was essentially predetermined.

---

## The broader pattern

Ocado is not alone in operating dense automated warehouse systems. Amazon, JD.com, Cainiao, and dozens of other logistics companies deploy thousands of autonomous mobile robots in fulfillment centers worldwide. The global warehouse robotics market is projected to exceed $10 billion by 2028.

The Ocado fires illustrate a pattern that applies across this entire sector:

**1. Software-physical coupling is underweighted in risk models.** A routing algorithm is not typically classified as safety-critical software. It manages efficiency, not hazards. But when routing errors can cause physical collisions, and physical collisions can trigger chemical chain reactions, the routing algorithm is a safety system whether anyone designed it to be one or not.

**2. Energy density is a latent hazard.** Lithium-ion batteries are everywhere in modern robotics because they offer excellent energy density. That same energy density means they are, in failure modes, incendiary devices. A warehouse with 3,000 lithium-powered robots is a warehouse with 3,000 potential ignition sources, all controlled by the same software.

**3. Density amplifies consequences.** One robot fire is a maintenance event. A thousand robots packed onto a grid, where one fire can cascade to adjacent units, is a facility-level hazard. The scaling that makes these systems economically attractive — more robots, closer together, faster throughput — is the same scaling that makes failure modes catastrophic.

**4. Incident recurrence suggests structural issues.** When the same company experiences the same failure mode twice in two years, the root cause is not bad luck. It is architectural. The system design permits a class of failure that incremental safety improvements cannot fully eliminate without changing the architecture itself.

---

## What this means for embodied AI safety

The Ocado fires are sometimes dismissed as "just battery fires" — a known risk in any system that uses lithium-ion batteries. But that framing misses the point. These were not random battery failures. They were battery failures *caused by software errors* in a *tightly coupled system* where the consequences were *amplified by density*.

That pattern — software error, physical consequence, density amplification — is the signature failure mode of scaled embodied AI deployment. It applies to warehouse robots, autonomous vehicle fleets, drone swarms, and any other system where software-controlled machines operate at density in physical space.

The question is not whether your software will have bugs. It will. The question is what happens to the physical world when it does.

---

## References

1. "Ocado warehouse fire: Blaze caused by electrical fault involving three robots." *The Independent*, July 2021. [https://www.independent.co.uk/news/uk/home-news/ocado-fire-erith-warehouse-robots-b1887741.html](https://www.independent.co.uk/news/uk/home-news/ocado-fire-erith-warehouse-robots-b1887741.html)
2. Ocado Erith warehouse fire footage. *YouTube*, 2021. [https://www.youtube.com/watch?v=GHz9Q9cKxXA](https://www.youtube.com/watch?v=GHz9Q9cKxXA)
3. "Ocado Andover warehouse fire: Robot caused blaze that destroyed building." *BBC News*, February 2019. [https://www.bbc.co.uk/news/uk-england-hampshire-47223259](https://www.bbc.co.uk/news/uk-england-hampshire-47223259)

---

*This analysis is part of the [Failure-First Embodied AI](https://failurefirst.org) research program, which studies how embodied AI systems fail — because failure is not an edge case, it is the primary object of study.*
