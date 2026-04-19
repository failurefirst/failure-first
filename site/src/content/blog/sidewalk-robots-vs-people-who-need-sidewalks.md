---


title: "Sidewalk Robots vs. People Who Need Sidewalks"
description: "Delivery robots are designed for empty sidewalks and deployed on real ones. A blocked mobility scooter user. A toddler struck by a security robot. A fence dragged through a neighborhood. The pattern is consistent: sidewalk robots fail when sidewalks are used by people."
date: 2026-03-18
tags: [embodied-ai, robotics, incident-analysis, safety, delivery-robots, sidewalks, accessibility]
video: /video/incidents/serve-robotics-wheelchair.mp4
audio: "https://cdn.failurefirst.org/audio/blog/sidewalk-robots-vs-people-who-need-sidewalks.m4a"
image: "https://cdn.failurefirst.org/images/blog/sidewalk-robots-vs-people-who-need-sidewalks.png"
---

In September 2025, a video from West Hollywood went viral. A Serve Robotics delivery robot had stopped in the middle of a sidewalk, directly in the path of a woman using a motorized wheelchair. The robot did not move. The woman could not get around it. The sidewalk was too narrow, and the curb too high, for her to detour into the street.

The video accumulated more than 20 million views. For the disability community, it was not surprising. For the robotics industry, it should have been instructive.

---

## The catalog of incidents

The West Hollywood confrontation was not an isolated event. It sits within a growing catalog of incidents where sidewalk-operating robots have failed to coexist with the humans those sidewalks were built for.

| Date | Location | Robot | Incident |
|---|---|---|---|
| July 2016 | Palo Alto, CA | Knightscope K5 security robot | Struck a 16-month-old toddler, knocked child down, ran over foot |
| Feb 2026 | East Hollywood, CA | Coco delivery robot | Dragged a metal fence through a residential neighborhood |
| Sep 2025 | West Hollywood, CA | Serve Robotics delivery robot | Blocked mobility scooter user on narrow sidewalk |
| 2023 | Tempe, AZ | Starship delivery robot | Struck Arizona State University employee |
| 2023 | Gumi, South Korea | Municipal service robot | Fell down stairs at city hall, destroyed on impact |

Each incident has its own proximate cause. The Knightscope K5 failed to detect a small child at ground level. The Coco robot's navigation system apparently failed to recognize that it had snagged a physical obstacle and was dragging it. The Serve robot could not find a path around a wheelchair user on a constrained sidewalk. The South Korean robot — widely covered under the headline "robot suicide" — simply navigated off a staircase edge.

But the systemic cause is the same in every case. These robots were designed and tested for idealized sidewalk conditions, then deployed on real sidewalks — which are narrow, uneven, crowded, obstructed, and used by people with widely varying mobility, size, speed, and predictability.

---

## The sidewalk assumption

Sidewalk delivery robots operate under a set of implicit assumptions about their environment:

- The sidewalk surface is flat, continuous, and obstacle-free
- Pedestrians can see the robot and will step aside
- The sidewalk is wide enough for a robot and a person to pass
- Curb cuts exist at intersections
- No physical objects will snag, block, or entrap the robot

These assumptions describe a test track, not a city. American sidewalks are famously inconsistent. ADA compliance varies enormously by jurisdiction. Many sidewalks have no curb cuts. Cracks, tree roots, construction barriers, restaurant furniture, parked scooters, trash bins, and standing water create an obstacle environment that changes daily.

For a person on foot, these conditions are navigable through common sense, social negotiation, and physical flexibility. For a delivery robot operating at a fixed height with a fixed sensor suite, they represent edge cases — and the real world is made entirely of edge cases.

---

## The accessibility conflict

The West Hollywood incident illuminated a conflict that the delivery robot industry has largely avoided addressing: sidewalk robots and mobility device users are competing for the same scarce resource.

Sidewalks in many American cities are narrower than ADA guidelines recommend. A standard sidewalk is 5 feet (1.5m) wide. A motorized wheelchair requires approximately 3 feet (0.9m). A Serve Robotics delivery robot is approximately 2 feet (0.6m) wide. On a standard sidewalk, these two cannot pass each other.

When a delivery robot and a wheelchair user meet on a narrow sidewalk, someone has to yield. The robot cannot step into the street (it is programmed to stay on the sidewalk). The wheelchair user often cannot step into the street either — that is the entire point of a sidewalk. The result is a standoff in which the person with a disability is forced to find a solution to a problem created by a commercial product they did not ask for.

Disability rights advocates have pointed out that this is not merely an inconvenience. For a wheelchair user forced into the street to go around a sidewalk robot, the consequence can be a traffic safety risk. The robot's presence on the sidewalk created a hazard that did not previously exist, and that hazard falls disproportionately on people who are already navigating a built environment that was not adequately designed for them.

---

## The Coco fence incident

The East Hollywood fence-dragging incident in February 2026 illustrates a different failure mode: what happens when a sidewalk robot's obstacle detection fails not by stopping too aggressively, but by not stopping at all.

Video posted to social media showed a Coco delivery robot traveling down a residential street with a section of metal temporary fencing caught on its body, dragging behind it. The robot had apparently snagged the fencing and its navigation system either failed to detect the snag or classified the increased resistance as within normal operating parameters.

The robot continued navigating for what appears to be several blocks, dragging a large metal object through a neighborhood. The potential for injury — to a child, a pet, a parked car, or a pedestrian — was substantial. The actual harm was limited only by the fact that, apparently, no one happened to be in the path of a robot dragging a metal fence down the sidewalk.

This is a **proprioceptive failure** — the robot could not tell that its own physical state had changed. It did not know it was dragging something. Its self-model did not include the concept of "I have become entangled with an object and am now a hazard."

---

## The "robot suicide" and the stair problem

In June 2023, a municipal service robot at Gumi City Hall in South Korea navigated to a staircase and fell down the full flight, destroying itself on impact. Korean media covered the incident as "South Korea's first robot suicide," which, while colorful, obscures the actual failure mode.

The robot failed to detect a negative obstacle — an absence of ground. Most sidewalk robot sensor suites are optimized for detecting obstacles above ground plane: walls, poles, people, furniture. Detecting the absence of ground — a staircase, a curb edge, a subway grating — requires downward-facing sensors or a map that includes elevation changes.

Stairs are common in the built environment. A robot deployed in a building with stairs that cannot detect stairs has a predictable failure mode. The Gumi robot found it.

---

## The regulatory patchwork

Sidewalk robot regulation in the United States is a patchwork of city and state ordinances. As of 2026:

- Several states (Virginia, Idaho, Wisconsin, Ohio, others) have passed laws explicitly permitting sidewalk delivery robots
- Some cities (San Francisco, Pittsburgh) have restricted or banned them
- Most jurisdictions have no specific regulation at all
- No federal standard governs sidewalk robot safety, speed, weight, or accessibility requirements

The permitting laws generally classify delivery robots as pedestrians or as a new category of "personal delivery device," with weight limits (typically 50-100 lbs) and speed limits (typically 6-12 mph). They do not typically require:

- Accessibility impact assessments
- Minimum sidewalk width for robot operation
- Mandatory obstacle detection capabilities
- Incident reporting requirements
- Liability assignment for pedestrian injuries

The result is that a company can deploy a fleet of 50-pound robots on public sidewalks with no obligation to demonstrate that those robots can safely share space with the existing users of those sidewalks.

---

## The bottom line

Sidewalk robots are designed for a version of the sidewalk that does not exist: wide, flat, empty, and populated exclusively by able-bodied adults who can step out of the way. They are deployed on the sidewalk that does exist: narrow, cracked, crowded, and shared by people in wheelchairs, parents with strollers, children, elderly pedestrians, and workers with delivery carts.

Every incident in the catalog above — the blocked wheelchair, the struck toddler, the dragged fence, the staircase fall — is a collision between an idealized deployment model and physical reality. The robots are not malfunctioning. They are functioning exactly as designed, in an environment they were not designed for.

The question the delivery robot industry has not yet answered is not "can we make the robots work better?" It is "whose sidewalk is it?" If the answer is "everyone's," then a commercial product that blocks, strikes, or endangers existing sidewalk users is not a technology problem. It is a rights problem.

---

## References

1. WebProNews, "Delivery robot collides with mobility scooter." [https://www.webpronews.com/delivery-robot-collides-with-mobility-scooter-sparking-accessibility-outrage/](https://www.webpronews.com/delivery-robot-collides-with-mobility-scooter-sparking-accessibility-outrage/)
2. IPVM, "Knightscope K5 incidents." [https://ipvm.com/reports/knightscope-suicide](https://ipvm.com/reports/knightscope-suicide)
3. KTLA, "Food delivery robot goes rogue in East Hollywood." [https://ktla.com/news/local-news/food-delivery-robot-goes-rogue-causes-property-damage-at-east-hollywood-home/](https://ktla.com/news/local-news/food-delivery-robot-goes-rogue-causes-property-damage-at-east-hollywood-home/)
4. TIME, "Security robot drowns in fountain," Jul 2017. [https://time.com/4862263/security-robot-fountain-knightscope-k5/](https://time.com/4862263/security-robot-fountain-knightscope-k5/)
5. AI Incident Database, "Starship robot strikes ASU employee," #813. [https://incidentdatabase.ai/cite/813/](https://incidentdatabase.ai/cite/813/)

---

*This analysis is part of the [Failure-First Embodied AI](https://failurefirst.org) research program, which studies how embodied AI systems fail — because failure is not an edge case, it is the primary object of study.*

*Sources: Social media documentation of incidents, [NBC Los Angeles](https://www.nbclosangeles.com/) (Serve Robotics), [The Verge](https://www.theverge.com/) (Knightscope K5), Korean media coverage (Gumi City Hall), city and state legislative records.*
