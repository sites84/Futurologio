(()=>{
'use strict';
if(window.__FUTUROLOGIO_CREATION_PROMPT_V2)return;
window.__FUTUROLOGIO_CREATION_PROMPT_V2=true;
function current(){return window.FUTUROLOGIO_CURRENT_PRODUCT||null}
function prompt(){const p=current()||{};const name=String(p.name||document.getElementById('name')?.textContent||'NOME DO PRODUTO').trim();const desc=String(p.description||p.what||p.funcao||p.function||p.how_it_works||'').trim();return `Create a single horizontal 16:9 promotional illustration for the fictional futuristic product "${name}" from FUTUROLOGIO™.

Create ONE rich cinematic scene in which the product is physically operating and causing an absurd, ridiculous, darkly funny situation. The image must tell a complete visual joke. Do not make a generic product portrait. Show the cause, the mechanism and the ridiculous consequence in the same scene.

PRODUCT IS THE HERO:
Make the invention large, prominent and unmistakable. Show its COMPLETE physical structure and clearly visible functional mechanism: moving parts, openings, valves, pistons, sensors, tubes, levers, motors, articulated components, emitted effects or other mechanisms appropriate to the specific invention. Only use mechanisms that make sense for this product concept. The viewer must understand HOW IT WORKS by looking at the scene.
Show the exact moment of operation, not the product sitting unused.

COMEDY IS MANDATORY:
The scene must contain genuine visual comedy and dark satire. The invention should solve a trivial problem in an outrageously excessive way, create an embarrassing consequence, make an innocent situation catastrophically ridiculous, or expose an absurd human weakness.
The main character must visibly suffer, panic, celebrate incorrectly, regret using it, or react with exaggerated grotesque comedy according to the invention.
Make the consequence unmistakable and funny even without reading the text.
Use irony, humiliation, absurd escalation, deadpan reactions and macabre-but-comedic consequences. No generic smiling people. No bland futuristic laboratory scene.

CHARACTERS:
ONE main character, actively involved in the action, with an exaggerated grotesque caricature expression appropriate to the joke. At most TWO secondary characters only when necessary for the punchline. No crowds.
Characters must interact physically with the invention or its consequences.

VISUAL STYLE — FUTUROLOGIO™:
Satirical editorial graphic-novel illustration mixed with a bright collectible commercial.
Highly detailed illustrated rendering, grotesque caricature, exaggerated anatomy, expressive faces, dramatic perspective, sharp textures and rich environmental storytelling.
Polished toy-like plastics, matte steel, dirty off-white enamel, transparent components, cables, mechanical joints and acid-lime LED accents.
Premium cinematic illustration, bright and highly readable, with strong depth and carefully staged action.
Never write the words "Museu Lima" anywhere.

COMPOSITION:
One coherent physical environment, one cinematic moment, one visual story.
Use a dynamic perspective and layered depth: foreground reaction, dominant product, background consequence.
The product should occupy roughly 45–60% of the visual importance, while the character and consequence occupy the rest.
The composition should be detailed and rich, but NOT chaotic. Every visible object must support the story, the function or the joke.
Do not leave the scene empty merely to make it minimalist.
Instead, create controlled visual richness around one clear focal action.

SHOW THE MECHANISM:
Explicitly visualize the product's operation. If it produces something, show it being produced. If it detects something, show the detection happening. If it moves something, show the movement. If it transforms something, show before-and-after states within the same physical scene. If it measures something, show the measurement device physically reacting.
Use visible cause-and-effect: action → mechanism → absurd result.
Never hide the important mechanism behind decorative casing, text panels or UI.

HUMOROUS ENVIRONMENTAL DETAILS:
Include several small environmental details that reward a closer look: a ridiculous object being affected, a horrified bystander, an animal reacting, a broken ordinary object, an absurd warning sticker, a discarded failed attempt, or another detail directly connected to the invention.
These details must remain secondary to the main gag.

TEXT — AT LEAST THREE TEXT ELEMENTS:
Include AT LEAST THREE readable Portuguese text elements integrated naturally into the physical environment. They must look like real objects or markings inside the scene, not a graphic-design overlay.
Possible placements: a small label on the machine, warning sticker, product plate, handwritten note, sign in the room, tiny display, packaging, wall notice, speech bubble, newspaper, instruction sticker, or humorous environmental sign.
Use different sizes and positions. They may be discreet and partially integrated into the environment.

Required text hierarchy:
1. "FUTUROLOGIO™" once, integrated into the product as its brand mark.
2. The product name "${name}" once, preferably printed on a small physical plate or label on the invention.
3. At least ONE additional short Portuguese joke, warning or sarcastic comment directly related to what is happening.
You may add 1–3 additional short environmental texts when they strengthen the comedy, but NEVER turn the image into an infographic.
Text should support the joke, not explain the entire invention.

The humorous text must be specific, acidic, dark, sarcastic and irreverent. Avoid generic phrases and motivational slogans.

DO NOT:
Do not create a wall of text.
Do not create multiple large panels around the product.
Do not create a brochure, infographic, magazine page, catalog spread, dashboard, scoreboard or collage.
Do not put text in every corner.
Do not use multiple competing speech bubbles.
Do not cover the product with labels.
Do not make every surface contain information.
Do not use political propaganda or generic political posters.

VISUAL STORY EXAMPLE LOGIC:
The character activates the invention → the machine visibly performs its mechanism → the mechanism produces an absurd consequence → the character realizes what happened → the environment contains a few discreet texts that make the situation even funnier.
Do this specifically for the product "${name}" and its concept below. Do NOT copy this example literally.

COLOR AND LIGHTING:
Bright high-key cinematic lighting. The scene must be vivid and readable against a dark website.
Brand palette: acid lime #d8ff55, dirty off-white, steel gray, warm skin and small deep-navy shadows.
Strong fill light, acid-lime rim light, open shadows, rich material contrast and crisp details.
No muddy darkness, no crushed blacks and no rainbow cyberpunk palette.

IMPORTANT NEGATIVE CONSTRAINTS:
No photoreal photography, anime, flat vector, stock art, corporate advertising, infographic layout, magazine layout, collage, multi-panel composition, empty minimalist product shot, generic smiling character, generic laboratory scene, excessive typography, giant text blocks, multiple large speech bubbles, dashboard UI, scoreboard, dark underexposure, rainbow neon cyberpunk, or the words "Museu Lima".

FINAL RULE:
The image must be visually rich, mechanically informative and genuinely funny while remaining one coherent cinematic scene.
Prioritize this order:
1. Product clearly functioning.
2. Mechanism visibly understandable.
3. Absurd consequence and dark comedy.
4. Character reaction.
5. Three or more discreet environmental text elements.
6. Rich but controlled details.

16:9 horizontal. One scene. Product functioning. Mechanism visible. Dark comedy. Grotesque caricature. At least three integrated Portuguese text elements. FUTUROLOGIO™ branding. Bright cinematic illustration.${desc?'\n\nPRODUCT CONCEPT:\n'+desc:''}`}
window.FUTUROLOGIO_IMAGE_PROMPT=prompt;
function apply(){const x=document.getElementById('futuroPromptText');if(!x)return;const v=prompt();if(x.value!==v)x.value=v;x.textContent=v}
window.FUTUROLOGIO_REFRESH_PROMPT=apply;
setTimeout(apply,50);setTimeout(apply,200);setInterval(apply,100);
})();
