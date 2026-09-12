(()=>{
'use strict';
if(window.__FUTUROLOGIO_CREATION_PROMPT_V2)return;
window.__FUTUROLOGIO_CREATION_PROMPT_V2=true;
function current(){return window.FUTUROLOGIO_CURRENT_PRODUCT||null}
function prompt(){const p=current()||{};const name=String(p.name||document.getElementById('name')?.textContent||'NOME DO PRODUTO').trim();const desc=String(p.description||p.what||p.funcao||p.function||p.how_it_works||'').trim();return `Create a single horizontal 16:9 promotional illustration for the fictional futuristic product "${name}" from FUTUROLOGIO™.

Create ONE strong cinematic scene showing the product actually being used in an absurd, ridiculous and darkly funny situation.

The PRODUCT is the absolute visual protagonist. Make it large, clearly visible, fully readable as an object, and visibly performing its intended function. The viewer should immediately understand what the invention does just by looking at the scene.

Show ONE main character actively using or interacting with the product, with an exaggerated grotesque comedic expression. Add at most TWO secondary characters reacting naturally with shock, confusion, fear, disgust or uncontrollable laughter.

VISUAL STYLE — FUTUROLOGIO™:
Unique brand look: satirical editorial graphic-novel illustration mixed with a bright collectible commercial.
Highly detailed illustrated rendering, grotesque caricature, exaggerated anatomy, expressive faces, dramatic perspective, sharp textures.
Materials: polished toy-like plastics, matte steel, dirty off-white enamel, acid-lime LED edges.
The image must look like a well-lit display card that POPS against a dark website. Do NOT make a dark, muddy or underexposed picture.
Never write the words "Museu Lima" anywhere in the image.

The humor should come primarily from the VISUAL SITUATION, the absurd invention and the characters' reactions, reinforced by sharp written jokes.

PRODUCT:
The fictional product must look like a believable futuristic technological invention while remaining absurd and unnecessary.
Use polished metallic materials, transparent components, lime LEDs, small holographic elements, cables and interfaces ONLY when they help explain the product.
The product must remain visually clean, bright and easy to recognize.

SCENE:
Build one coherent environment around the product.
Show the invention actively doing something ridiculous, unexpected or completely unnecessary.
Use physical comedy, absurd consequences, exaggerated reactions and dark humor.
The scene should feel like a brightly lit frame from a bizarre futuristic comedy, not an infographic and not a night-only cyberpunk still.

BRAND AND HUMOROUS TEXT:
The only brand name allowed on the image is "FUTUROLOGIO™", as a lime-on-black plaque or illuminated logo on the product.
Do NOT write "Museu Lima", collection names, inventory codes or extra brand subtitles.
The product name "${name}" may appear once as a secondary label.
Include THREE distinct humorous Portuguese text elements in addition to the brand and product name.
Do NOT impose an artificial word or character limit on these three jokes.
The three jokes must be inspired by the invention, its function or consequences, in an ACID, DARK, SARCASTIC, IRREVERENT comedy style.
Avoid political posters and generic slogans.

TEXT CONTROL:
ONLY THREE HUMOROUS TEXT ELEMENTS plus "FUTUROLOGIO™" and "${name}".
No infographic, magazine layout, spec boxes, tiny scattered labels or extra copy.

COMPOSITION:
Cinematic 16:9. Product foreground/center. Characters support the joke. Generous negative space.

COLOR AND LIGHTING:
BRIGHT high-key lighting so every face, material and product detail is easy to see.
Brand palette: acid lime #d8ff55, dirty off-white, steel gray, warm skin; deep navy only as a small shadow accent — never the whole picture.
Strong fill light plus lime rim light. Open shadows. High contrast. No crushed blacks, no muddy fog, no cyan-magenta cyberpunk night.
The artwork will sit on a dark website, so it must be LIGHTER than the site background and immediately pop.

IMPORTANT:
No photoreal photography, anime, flat vector, stock, corporate ad, infographic, text-heavy poster, collage, multi-panel, excessive typography, dark underexposed image, rainbow neon cyberpunk, or the words "Museu Lima".

16:9. One scene. Product first. Comedy second. FUTUROLOGIO™ visible. Three Portuguese jokes. Bright readable lighting.${desc?'\n\nPRODUCT CONCEPT:\n'+desc:''}`}
window.FUTUROLOGIO_IMAGE_PROMPT=prompt;
function apply(){const x=document.getElementById('futuroPromptText');if(!x)return;const v=prompt();if(x.value!==v)x.value=v;x.textContent=v}
window.FUTUROLOGIO_REFRESH_PROMPT=apply;
setTimeout(apply,50);setTimeout(apply,200);setInterval(apply,100);
})();
