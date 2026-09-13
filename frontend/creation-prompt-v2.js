(()=>{
'use strict';
if(window.__FUTUROLOGIO_CREATION_PROMPT_V2)return;
window.__FUTUROLOGIO_CREATION_PROMPT_V2=true;
function current(){return window.FUTUROLOGIO_CURRENT_PRODUCT||null}
function prompt(){const p=current()||{};const name=String(p.name||document.getElementById('name')?.textContent||'NOME DO PRODUTO').trim();const desc=String(p.description||p.what||p.funcao||p.function||p.how_it_works||'').trim();return `Create a single horizontal 16:9 promotional illustration for the fictional futuristic product "${name}" from FUTUROLOGIO™.

Create ONE strong cinematic scene showing the product actually being used in an absurd, ridiculous and darkly funny situation.

The PRODUCT is the absolute visual protagonist. Make it large, dominant and immediately recognizable. Show its complete physical form and the mechanism that makes it work. The viewer should understand the invention from the image itself, without needing a wall of text or diagrams.

Show ONE main character actively using or reacting to the product, with an exaggerated grotesque comedic expression. At most ONE secondary character may appear if it genuinely strengthens the joke. Do not fill the scene with crowds or extra characters.

VISUAL STYLE — FUTUROLOGIO™:
Unique brand look: satirical editorial graphic-novel illustration mixed with a bright collectible commercial.
Highly detailed illustrated rendering, grotesque caricature, exaggerated anatomy, expressive faces, dramatic perspective, sharp textures.
Materials: polished toy-like plastics, matte steel, dirty off-white enamel, acid-lime LED edges.
The image must look like a premium, well-lit display card that POPS against a dark website. Keep the artwork bright, clean and visually controlled.
Never write the words "Museu Lima" anywhere in the image.

VISUAL PRIORITY — CRITICAL:
Reduce visual clutter aggressively.
Use a very clear hierarchy: PRODUCT FIRST, CHARACTER SECOND, HUMOROUS DETAIL THIRD.
Approximately 70% of the visual attention should belong to the invention and its action, 20% to the character(s), and only 10% to humorous graphic details.
Use generous negative space and clean areas around the main product.
Do not try to fill every empty area of the canvas.
A simpler composition with fewer elements is preferable to a busy composition.

PRODUCT:
The fictional product must look like a believable futuristic technological invention while remaining absurd and unnecessary.
Use polished metallic materials, transparent components, lime LEDs, cables and interfaces ONLY when they physically help explain the product.
Use very few secondary mechanisms or decorative details.
Do not cover the product with labels, screens, diagrams or accessories.
The product must remain visually clean, bright and easy to recognize from a distance.

SCENE:
Build ONE coherent physical environment around the product.
Show the invention actively doing something ridiculous, unexpected or completely unnecessary.
Use physical comedy, absurd consequences and the character's reaction to create the humor.
Keep the background simple and relevant to the situation. Use only a few environmental objects needed to establish the location.
The scene should feel like a brightly lit frame from a bizarre futuristic comedy, not an infographic, magazine page or product catalog spread.

TEXT — STRICTLY MINIMAL:
Text must NOT dominate the image.
Use ONLY these text elements:
1. "FUTUROLOGIO™" once, preferably as a small lime-on-black illuminated logo physically integrated into the product.
2. The product name "${name}" may appear ONCE on the product as a small secondary label, but omit it if it would clutter the composition.
3. ONE short humorous Portuguese phrase OR ONE speech bubble, maximum one joke.
No other text.

Do NOT add multiple jokes, comments, captions, warning plates, signs, posters, stickers, reaction texts, data screens, scoreboards, technical specifications, instruction panels, fake advertisements, subtitles, inventory codes or decorative typography.
Do NOT create side panels or UI panels around the product.
Do NOT put text in every corner of the image.
Do NOT create a collage or multi-panel composition.
The single humorous phrase must be specific to the invention, acid, dark, sarcastic and irreverent. It should reinforce the visual joke rather than explain everything.
Avoid political posters, political propaganda and generic motivational slogans.

COMPOSITION — CRITICAL:
Cinematic 16:9.
One scene only.
Large product in the foreground or central midground.
One main character positioned to support the product, not compete with it.
Simple background with depth, atmosphere and a few relevant objects.
Leave visible negative space.
No symmetrical wall of information around the product.
No side columns, no multiple boxes, no control panels surrounding the scene.
Do not make the image resemble a technical brochure, infographic or trading card packed with information.
The composition must read instantly even if all text is removed.

HUMOR:
The comedy must come primarily from the visual situation, the absurd invention and the character's reaction.
The image should still be funny with the text ignored.
Prefer one excellent visual gag over many small jokes.
Make the absurd consequence obvious through the action itself.

COLOR AND LIGHTING:
BRIGHT high-key lighting so every face, material and product detail is easy to see.
Brand palette: acid lime #d8ff55, dirty off-white, steel gray, warm skin; deep navy only as a small shadow accent — never the whole picture.
Strong fill light plus lime rim light. Open shadows. High contrast. No crushed blacks, no muddy fog, no cyan-magenta cyberpunk night.
The artwork will sit on a dark website, so it must be LIGHTER than the site background and immediately pop.

IMPORTANT NEGATIVE CONSTRAINTS:
No photoreal photography, anime, flat vector, stock, corporate ad, infographic, magazine layout, text-heavy poster, collage, multi-panel, excessive typography, side panels, multiple signs, multiple speech bubbles, data dashboards, scoreboards, instruction boards, dark underexposed image, rainbow neon cyberpunk, or the words "Museu Lima".

FINAL VISUAL RULE:
If there is a choice between adding another joke/detail and keeping the composition clean, ALWAYS keep it clean.
The product, its function and the main visual gag are more important than decorative information.

16:9. One scene. Product first. Function clearly visible. One main character. Minimal text. Clean composition. FUTUROLOGIO™ visible. Bright readable lighting.${desc?'\n\nPRODUCT CONCEPT:\n'+desc:''}`}
window.FUTUROLOGIO_IMAGE_PROMPT=prompt;
function apply(){const x=document.getElementById('futuroPromptText');if(!x)return;const v=prompt();if(x.value!==v)x.value=v;x.textContent=v}
window.FUTUROLOGIO_REFRESH_PROMPT=apply;
setTimeout(apply,50);setTimeout(apply,200);setInterval(apply,100);
})();
