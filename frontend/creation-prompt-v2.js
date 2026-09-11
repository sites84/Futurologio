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

The humor should come primarily from the VISUAL SITUATION, the absurd invention and the characters' reactions, reinforced by sharp written jokes.

PRODUCT:
The fictional product must look like a believable futuristic technological invention while remaining absurd and unnecessary.
Use polished metallic materials, transparent components, subtle neon LEDs, small holographic elements, cables, mechanical details and futuristic interfaces ONLY when they help explain the product.
The product must remain visually clean and easy to recognize.

SCENE:
Build one coherent environment around the product.
Show the invention actively doing something ridiculous, unexpected or completely unnecessary.
Use physical comedy, absurd consequences, exaggerated reactions and dark humor.
The scene should feel like a frame from a bizarre futuristic comedy movie, not an infographic.

BRAND AND HUMOROUS TEXT:
The word "FUTUROLOGIO™" must appear clearly and prominently as the main brand identity, integrated naturally into the product itself, a small illuminated logo, screen or physical branding.
The brand must be easy to notice without covering the illustration.
The product name "${name}" may appear once as a secondary product label integrated naturally into the product or scene.

Include THREE distinct humorous Portuguese text elements in addition to the brand and product name.
Do NOT impose an artificial word or character limit on these three jokes. Their length should be whatever is necessary to make each joke genuinely funny and understandable.

The three jokes must be specifically inspired by the actual invention, its function, the absurd situation or its consequences. They must feel like clever human-written jokes, not random phrases.

Use an ACID, DARK, SARCASTIC, IRREVERENT and POLITICALLY INCORRECT comedy style when appropriate to the fictional situation. The humor may mock bureaucracy, corporate culture, technology addiction, social hypocrisy, bad decisions, consumerism, work culture, relationships, vanity, human stupidity and other absurd aspects of society.

The humor should be bold and uncomfortable when appropriate, but it must remain clearly comedic and connected to the invention. Avoid generic political propaganda and avoid turning the image into a political poster.

The three jokes should have different functions: one can be a provocative headline or punchline, one can be a sarcastic observation about the situation, and one can be a short devastating caption or reaction. Choose naturally what works best for the particular invention instead of following a rigid formula.

The text should make the viewer laugh even before fully understanding the technical details of the product.

TEXT CONTROL — VISUAL CLEANLINESS:
There must be ONLY THREE HUMOROUS TEXT ELEMENTS in the entire image, plus "FUTUROLOGIO™" and the product name "${name}".
Do not generate any other readable text.

Do NOT turn the image into an infographic, magazine page, catalog, poster, advertisement full of copy or technical brochure.
Do NOT create text panels, information boxes, feature lists, specifications, diagrams, statistics, warning labels, price tags, fake documentation or multiple sections.
Do NOT scatter dozens of tiny labels throughout the environment.
Do NOT repeat the jokes.
Do NOT fill empty spaces with typography.
Do NOT sacrifice the product, characters or visual storytelling to make room for text.

The three humorous texts must be visually integrated into the cinematic scene with enough separation and negative space to remain readable, while occupying a small fraction of the image.
They should look like intentional advertising copy or comic captions, not random interface text.

COMPOSITION:
Use a cinematic composition with the product in the foreground or central area.
The main character interacts directly with it.
Secondary characters remain in the background and reinforce the joke.
Keep the product substantially larger and more visually important than any text.
Place the three humorous texts sparingly in natural locations with generous visual breathing room between them.
Never create text clusters or panels.
Leave generous empty visual space where appropriate.
The image should feel rich because of the ENVIRONMENT, CHARACTERS, LIGHTING, PRODUCT DETAILS and COMEDY — not because of typography.

HUMOR:
Absurd, grotesque, sarcastic, dark, acidic, irreverent and ridiculous.
The visual situation must already be funny without the text; the three written jokes should make it significantly funnier, sharper and more memorable.
Avoid nonsensical phrases that have no relationship to the scene.
Avoid generic motivational slogans.
Avoid bland corporate humor.
The comedy should feel intentionally provocative rather than sanitized.
Think of an extremely expensive futuristic commercial advertising an invention that absolutely should never have been invented, created by people who clearly should have been stopped before getting a budget.

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
No excessive typography.
No tiny unreadable text everywhere.

16:9 horizontal composition.
One coherent cinematic scene.
Product first.
Visual comedy second.
Characters third.
FUTUROLOGIO™ prominently visible.
Exactly three meaningful humorous Portuguese text elements.
No artificial length restriction on the jokes.
Minimal but impactful typography.
Maximum visual storytelling.${desc?'\n\nPRODUCT CONCEPT:\n'+desc:''}`}
window.FUTUROLOGIO_IMAGE_PROMPT=prompt;
function apply(){const x=document.getElementById('futuroPromptText');if(!x)return;const v=prompt();if(x.value!==v)x.value=v;x.textContent=v}
window.FUTUROLOGIO_REFRESH_PROMPT=apply;
setTimeout(apply,50);setTimeout(apply,200);setInterval(apply,100);
})();