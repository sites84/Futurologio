(()=>{
'use strict';
if(window.__FUTUROLOGIO_CREATION_PROMPT_V2)return;
window.__FUTUROLOGIO_CREATION_PROMPT_V2=true;
function current(){return window.FUTUROLOGIO_CURRENT_PRODUCT||null}
function prompt(){const p=current()||{};const name=String(p.name||document.getElementById('name')?.textContent||'NOME DO PRODUTO').trim();const desc=String(p.description||p.what||p.funcao||p.function||p.how_it_works||'').trim();return `Create a single horizontal 16:9 promotional illustration for the fictional futuristic product "${name}" from FUTUROLOGIO™.

Create ONE strong cinematic scene showing the product actually being used in an absurd, ridiculous and darkly funny situation.

The PRODUCT is the absolute visual protagonist. Make it large, clearly visible, fully readable as an object, and visibly performing its intended function. The viewer should immediately understand what the invention does just by looking at the scene.

Show ONE main character actively using or interacting with the product, with an exaggerated grotesque comedic expression. Add at most TWO secondary characters reacting naturally with shock, confusion, fear, disgust or uncontrollable laughter.

VISUAL STYLE:
Satirical futuristic comic-book illustration mixed with gritty cyberpunk graphic-novel aesthetics.
Highly detailed illustrated rendering, grotesque caricature, exaggerated anatomy, expressive faces, dramatic perspective, dirty futuristic urban atmosphere, cinematic lighting, strong shadows, neon reflections and atmospheric depth.

The humor should come primarily from the VISUAL SITUATION, the absurd invention and the characters' reactions — not from written jokes.

PRODUCT:
The fictional product must look like a believable futuristic technological invention while remaining absurd and unnecessary.
Use polished metallic materials, transparent components, subtle neon LEDs, small holographic elements, cables, mechanical details and futuristic interfaces ONLY when they help explain the product.
The product must remain visually clean and easy to recognize.

SCENE:
Build one coherent environment around the product.
Show the invention actively doing something ridiculous, unexpected or completely unnecessary.
Use physical comedy, absurd consequences, exaggerated reactions and dark humor.
The scene should feel like a frame from a bizarre futuristic comedy movie rather than an infographic.

BRAND AND HUMOROUS TEXT:
The word "FUTUROLOGIO™" must appear clearly and prominently as the main brand identity, integrated naturally into the product itself, a small illuminated logo, screen or physical branding.
The brand must be easy to notice without covering the illustration.
The product name "${name}" may appear ONCE as a small secondary product label integrated into the product.

In addition to the FUTUROLOGIO™ brand and the product name, include EXACTLY THREE short humorous Portuguese advertising phrases.
Each phrase must be very short, punchy and visually integrated into the scene.
The three phrases should be different from one another and directly related to the absurd product or situation.
Prefer dark humor, sarcasm, absurdity or ridiculous consequences.
The phrases should support the joke, never explain the product.
Keep each phrase to approximately 2–7 words.
Do not create any other text.

TEXT LIMIT — EXTREMELY IMPORTANT:
The image may contain ONLY:
1. "FUTUROLOGIO™" as the main brand.
2. "${name}" once as the product name.
3. EXACTLY THREE short humorous Portuguese phrases as described above.

NO paragraphs.
NO text blocks.
NO information panels.
NO technical specifications.
NO lists.
NO infographics.
NO diagrams.
NO statistics.
NO warning boxes.
NO price tags.
NO additional slogans beyond the three allowed phrases.
NO magazine layout.
NO feature lists.
NO fake documentation.
NO large advertising copy.
NO crowded typography.
Do not repeat any phrase.
Do not fill empty areas with text.
The illustration must remain visually dominant.

COMPOSITION:
Use a cinematic composition with the product in the foreground or central area.
The main character interacts directly with it.
Secondary characters remain in the background and reinforce the joke.
Place the three short humorous phrases sparingly in natural locations, with generous empty space between them.
Never create text panels or clusters.
Leave generous visual breathing room around the characters and product.
Do not fill empty areas with text, panels or decorative information.
The image should feel rich because of the ENVIRONMENT, CHARACTERS, LIGHTING and PRODUCT DETAILS — not because of typography.

HUMOR:
Absurd, grotesque, sarcastic, dark and ridiculous.
The joke must be understandable visually even without reading the text.
The three phrases should act only as small comedic accents.
Think of an extremely expensive futuristic commercial advertising an invention that absolutely should never have been invented.

COLOR AND LIGHTING:
Dark industrial futuristic environment with controlled neon cyan, electric blue, magenta and purple accents.
Cinematic lighting, dramatic rim light, deep shadows, subtle volumetric light and realistic reflections on the futuristic product.

IMPORTANT:
No photorealistic human photography.
No anime.
No minimalist flat illustration.
No generic stock image.
No conventional corporate advertisement.
No infographic.
No poster filled with text.
No magazine page layout.
No collage.
No multiple panels.

16:9 horizontal composition.
One coherent cinematic scene.
Product first.
Visual comedy second.
Characters third.
FUTUROLOGIO™ prominently visible.
Exactly three short humorous phrases.
Minimal text.
Maximum visual storytelling.${desc?'\n\nPRODUCT CONCEPT:\n'+desc:''}`}
window.FUTUROLOGIO_IMAGE_PROMPT=prompt;
function apply(){const x=document.getElementById('futuroPromptText');if(!x)return;const v=prompt();if(x.value!==v)x.value=v;x.textContent=v}
window.FUTUROLOGIO_REFRESH_PROMPT=apply;
setTimeout(apply,50);setTimeout(apply,200);setInterval(apply,100);
})();