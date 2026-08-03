---
title: "RoboCritics: Enabling Reliable End-to-End LLM Robot Programming through Expert-Informed Critics"
collection: publications
permalink: /publication/HRI26
excerpt: "<img width='600px' src='/images/robocritics-teaser.png'>"
date: 2026-03-16
venue: "Proceedings of the 21st ACM/IEEE International Conference on Human-Robot Interaction (HRI '26)"
paperurl:
citation: "Callie Y. Kim, Nathan Thomas White, Evan He, Frederic Sala, and Bilge Mutlu. 2026. RoboCritics: Enabling Reliable End-to-End LLM Robot Programming through Expert-Informed Critics. In Proceedings of the 21st ACM/IEEE International Conference on Human-Robot Interaction (HRI '26). Association for Computing Machinery, New York, NY, USA, 914–923. https://doi.org/10.1145/3757279.3785550"
---

[Download Paper Here](https://dl.acm.org/doi/abs/10.1145/3757279.3785550)

**Abstract:** End-user robot programming grants users the flexibility to re-task robots in situ, yet it remains challenging for novices due to the need for specialized robotics knowledge. Large Language Models (LLMs) hold the potential to lower the barrier to robot programming by enabling task specification through natural language. However, current LLM-based approaches generate opaque, "black-box" code that is difficult to verify or debug, creating tangible safety and reliability risks in physical systems. We present RoboCritics, an approach that augments LLM-based robot programming with expert-informed motion-level critics. These critics encode robotics expertise to analyze motion-level execution traces for issues such as joint speed violations, collisions, and unsafe end-effector poses. When violations are detected, critics surface transparent feedback and offer one-click fixes that forward structured messages back to the LLM, enabling iterative refinement while keeping users in the loop. We instantiated RoboCritics in a web-based interface connected to a UR3e robot and evaluated it in a between-subjects user study (n=18). Compared to a baseline LLM interface, RoboCritics reduced safety violations, improved execution quality, and shaped how participants verified and refined their programs. Our findings demonstrate that RoboCritics enables more reliable and user-centered end-to-end robot programming with LLMs.
