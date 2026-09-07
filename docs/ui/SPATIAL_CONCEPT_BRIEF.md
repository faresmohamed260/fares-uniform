# Fares Uniform spatial UI concept brief

Status: SUPERSEDED FOR DENSE OPERATIONAL ERP / RETAINED AS EXPRESSIVE-SURFACE EXPLORATION, 2026-09-07.

## Approval resolution

The client later clarified that the dashboard and other dense ERP work surfaces should be **modern and practical**, then explicitly approved that direction. This document therefore no longer governs Dashboard, POS, Products, Production, Sales Orders or Customers as a 3D-first composition. D-033 and `DESIGN_SYSTEM.md` are authoritative for those operational surfaces.

The ideas below remain useful for suitable expressive surfaces—especially public/marketing and product showcase/detail—where richer 3D, physics and morphing can add value without hurting operational clarity.

## Why this replaces the current visual baseline

The client rejected both technically passing Phase 0B visual baselines as still too basic. The second baseline used maintained shadcn/Base UI components and stronger Motion effects, but its fundamental composition remained a mostly flat 2D application with animation layered onto cards and panels.

That is not the target anymore.

The next visual direction must be **spatial by construction**: real 3D elements, depth, lighting, camera response, object physics, morphing geometry and state changes that behave physically. The design should feel closer to an interactive product/AI demo or creative-tool showcase than a conventional admin dashboard, while preserving transaction speed, accessibility and operational clarity.

Working concept name: **Spatial Atelier OS**.

This is a design target, not a production implementation decision or client visual approval.

## 1. Core idea

Treat important Fares entities as tangible objects inside a spatial workspace:

- garments/products can exist as rendered 3D objects or textile forms rather than flat thumbnail cards;
- cart, order and production states can act like physical trays, rails, stacks or staged surfaces;
- panels can occupy different depth planes and morph between compact and expanded forms;
- pointer/touch movement can influence parallax, tilt, lighting and local camera response;
- selected objects can travel/morph continuously into their next state instead of disappearing and reappearing in a modal;
- physically meaningful spring, inertia, collision and magnetic-snap behavior can communicate state changes.

The result must still read as a serious Fares Uniform business system, not a game skin over ERP data.

## 2. Prebuilt-first still applies

D-031 remains mandatory.

### Ordinary UI
Use maintained components first for:
- buttons;
- inputs/search;
- dialogs/sheets/drawers;
- tabs/segmented navigation;
- menus;
- form controls;
- badges/status text;
- tables/lists where needed;
- accessibility/focus infrastructure.

Public Next.js: shadcn/Base UI first unless another maintained source is documented as materially better for the requirement.

Internal Odoo/POS: native maintained Odoo/Owl components and extension points first.

### Spatial/3D layer
Custom scene code is acceptable where there is no ordinary maintained UI primitive that can supply the required 3D/physics behavior. Even here, prefer maintained abstractions/helpers over low-level reimplementation.

Candidate public-review stack after visual approval:
- React Three Fiber for Three.js scene composition;
- Drei for maintained scene/camera/performance abstractions;
- React Three Rapier for actual rigid-body/spring/collision behavior;
- Motion for DOM layout/shared-element morphing and coordinated non-WebGL transitions.

Exact versions are selected and hosted-tested only when implementation is authorized.

## 3. Visual grammar

### Depth
Use at least three deliberate planes:
1. spatial environment / atmospheric layer;
2. primary interactive 3D object layer;
3. crisp accessible application controls above/alongside it.

Do not fake the entire design with CSS perspective cards.

### Materials
Prefer restrained premium materials:
- dark smoked glass;
- satin/soft-touch panels;
- brushed metal accents;
- translucent acrylic;
- realistic textile/fabric surfaces on garment objects.

Avoid generic neon cyberpunk, excessive glow and game-HUD styling.

### Lighting
Use soft directional/key lighting and local interaction response. Lighting should reveal material and depth, not become an RGB effect.

### Geometry
Use a small family of recurring physical forms rather than arbitrary 3D decoration:
- garment/textile object;
- tray/dock;
- rail/timeline;
- magnetic selector/puck;
- morphing fabric/brand sculpture;
- depth panel/sheet.

### Typography
Text and transactional controls remain sharp DOM UI. Do not place important operational text into a constantly moving 3D canvas.

## 4. Required behavior language

The new concept must visibly imply or demonstrate these behaviors.

### A. Product object physics
A garment/product object should:
- subtly orient toward pointer/focus;
- lift in Z-depth on selection;
- react with a spring rather than a linear hover;
- optionally be draggable with inertia;
- support real collision/snap behavior where used.

### B. Add-to-cart / POS object transfer
A selected product can travel into a cart tray/dock with a physical arc/spring and settle into place.

Preferred expressive interaction:
- drag/throw toward cart;
- magnetic capture region;
- object settles with spring/damping.

Mandatory accessible/fast path:
- ordinary maintained Add button performs the same state change immediately;
- scanning/barcode insertion never waits on the physics animation;
- rapid repeated scans remain stable.

### C. Shared morph into detail
Product/object selection should use continuous identity:
- 3D object or preview grows/lifts forward;
- surrounding DOM surface morphs into the detail/order context;
- closing reverses the continuity where practical.

Do not use a basic fade-in modal as the signature interaction.

### D. Physical selector behavior
Payment or mode selection can use a magnetic puck/slider with:
- spring attraction;
- overshoot/damping;
- tactile press/depth feedback;
- stable text labels and immediate keyboard operation.

### E. Offline/sync state morph
Connection state should transform shape and behavior rather than only change label color.

Example concept:
- healthy state: quiet orbit/flow indicator;
- pending local state: orbit collapses into a contained suspended form;
- syncing: objects/particles converge;
- synced: resolves into a compact stable status token.

The state must remain understandable without animation.

### F. Production physical queue
Production should not become another dashboard card grid.

Candidate spatial model:
- a depth rail/conveyor containing task blocks;
- urgency pulls a block nearer or changes elevation/lighting;
- expanding a task lifts it off the rail into a focused work surface;
- transitions among Queued → In production → Finished use physical repositioning along the rail;
- `Ready for collection` stays a separate retail receipt state and must not be visually conflated with production completion.

### G. Public-site textile sculpture
The public landing experience should have one strong 3D hero object, not dozens of decorative widgets.

Candidate:
- an abstract textile/fabric sculpture or garment form floating in a studio environment;
- pointer movement produces restrained parallax and cloth-like response;
- scroll changes its form/material/composition to introduce school, restaurant/cafe and hospitality work;
- a catalog selection can morph the sculpture/object into the chosen product/detail scene.

This is the strongest place for cinematic camera movement and environmental depth.

## 5. Representative concept set

Do not implement production UI from this brief alone. First create visual concepts.

Required concept sequence:

1. **POS desktop English — spatial primary screen**
   - search/scanning + maintained controls;
   - 3D garment/product field;
   - physical cart tray/dock;
   - Cash/InstaPay controls;
   - visible sync state;
   - no loss of operational clarity.

2. **POS interaction state board**
   - product idle;
   - product lifted/selected;
   - drag/throw or magnetic add-to-cart;
   - settled cart state;
   - detail morph.

3. **POS narrow Arabic RTL**
   - same system, not a separate simplified theme;
   - spatial canvas remains useful rather than consuming the screen;
   - primary checkout controls remain reachable and stable.

4. **Production queue desktop**
   - physical rail/queue concept;
   - selected task lifted into focus;
   - urgency/deadline represented without turning into decorative noise.

5. **Public desktop landing/catalog**
   - large 3D textile/garment hero;
   - spatial transition into catalog/product detail;
   - large-client manufacturing positioning remains primary;
   - no prices or stock availability.

6. **Public narrow Arabic**
   - true RTL;
   - reduced but still distinctive 3D composition.

7. **Reduced-motion / WebGL fallback concept**
   - same visual identity using static rendered depth, image/DOM composition and instant state changes;
   - no essential information lost.

## 6. Performance and resilience constraints

Fancy does not mean fragile.

The implementation must plan for:
- adaptive device pixel ratio / quality;
- bounded mesh/object counts;
- on-demand or reduced render activity when scenes are idle where compatible;
- lazy-loading of non-critical 3D assets;
- no giant uncompressed GLTF/textures;
- fallback when WebGL is unavailable or intentionally disabled;
- touch/pointer equivalence;
- no transaction data state stored only inside the 3D scene;
- ordinary checkout remains functional if the scene fails;
- reduced-motion removes non-essential camera travel, object throws and spatial transforms;
- low-performance mode may replace live physics with immediate/simplified transitions while preserving visual hierarchy.

## 7. Accessibility constraints

- Every physics-only gesture has an equivalent maintained control.
- 3D objects are not the sole representation of price, quantity, customer, payment or readiness state.
- Keyboard/focus navigation operates on DOM controls independent of pointer physics.
- Reduced-motion is a first-class design state, not a post-build patch.
- Screen reader operation does not require understanding canvas geometry.
- Arabic RTL behavior is designed before implementation, including mixed-direction codes and numbers.

## 8. Rejection criteria

Reject the next concept if it:
- still reads as flat cards with a 3D blob in the background;
- uses only CSS perspective/box-shadow and calls it 3D;
- has no tangible physics behavior;
- shows a Three.js scene but ordinary state changes still only fade/slide;
- adds many floating decorative objects with no workflow meaning;
- looks like a game HUD, crypto dashboard or generic neon sci-fi admin template;
- sacrifices scanning/payment speed for cinematic transitions;
- makes the 3D canvas the only way to perform an action;
- cannot gracefully degrade for reduced motion / weak GPU / WebGL failure;
- treats mobile Arabic as a flattened afterthought.

## 9. Approval state

The current `fa9ef241...` representative visual baseline is technically valid but **rejected by the client for visual ambition** and must not be used as the accepted design reference.

The spatial/3D-first direction is **not** the approved dense operational ERP baseline. Phase 1 is no longer blocked by this concept. Future use of these ideas must stay within D-033.
