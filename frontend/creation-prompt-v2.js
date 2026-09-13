(()=>{
'use strict';
if(window.__FUTUROLOGIO_CREATION_PROMPT_V3)return;
window.__FUTUROLOGIO_CREATION_PROMPT_V3=true;
function current(){return window.FUTUROLOGIO_CURRENT_PRODUCT||null}
function clean(v,fallback){return String(v||fallback||'').replace(/\s+/g,' ').trim()}
function short(v,n=150){const s=clean(v,'');return s.length>n?s.slice(0,n-1).trim()+'…':s}
function prompt(){
 const p=current()||{};
 const name=clean(p.name,document.getElementById('name')?.textContent||'NOME DO PRODUTO');
 const desc=clean(p.description||p.what||p.funcao||p.function||p.how_it_works,'uma invenção absurda funcionando de forma inesperadamente desastrosa');
 const absurd=short(p.dangers||p.curiosity||desc,170);
 const tagline=`Porque ${short(name,70)} parecia uma excelente ideia na reunião.`;
 const features=[clean(p.realTech,'tecnologia real'),clean(p.specTech,'tecnologia especulativa'),clean(p.inventedTech,'tecnologia impossível')].map(x=>short(x,105));
 return `A satirical, premium dark-humor corporate product advertisement infographic for a fictional absurd invention by the brand "FUTUROLOGIO". The scene is split into a professional product/service showcase and a live demonstration, maintaining a highly clean, spacious layout with plenty of negative space to avoid visual clutter.

Visual Focus: A detailed look at the creation called "${name}", styled as a high-end, realistic but completely ridiculous consumer product, service, or concept. The official corporate brand logo "FUTUROLOGIO" is cleanly and subtly integrated into the design or environment.

Practical Demonstration: A clear, deeply ironic, and dark-humor demonstration showing the core concept functioning in a real-world scenario: ${desc}. The overall mood must reflect a perfect contrast between an elite, serious corporate presentation and a completely unethical, dystopian, or bizarre premise based on ${absurd}.

Text elements: The image must be clean and elegant. Do not include random floating speech bubbles or chaotic scrambled text. Include exactly three clean, legible, and professionally typeset text blocks written in perfect Portuguese:
1. A large main title: "${name}"
2. A cynical, dark-humor tagline or corporate slogan placed neatly in the environment: "${tagline}"
3. Three small, clean icon-labels or bullet points explaining its absurd features or specifications: ${features.join(' | ')}.

The three numbered text blocks above are the ONLY deliberate text blocks besides the official "FUTUROLOGIO" logo. Do not add extra captions, speech bubbles, warning text, labels, posters, random letters, fake UI text, watermarks, collection names or inventory codes. Keep all three Portuguese text blocks exactly as provided, perfectly legible and professionally typeset.

Style: High-end commercial product photography, cinematic studio lighting, premium design aesthetic, sharp focus, 8k resolution, professional advertising layout.

The invention must remain a physical, photographable object. Do not depict an app, website, software-only product, subscription, digital service, wearable, or generic smartphone feature. The product must be the undisputed visual protagonist and its physical mechanism and real-world operation must be immediately understandable. Keep the composition premium, spacious, bright enough for excellent readability, satirical, absurd and darkly humorous while avoiding visual clutter, collage-like panels, muddy shadows and excessive typography.`
}
window.FUTUROLOGIO_IMAGE_PROMPT=prompt;
function apply(){const x=document.getElementById('futuroPromptText');if(!x)return;const v=prompt();if(x.value!==v)x.value=v;x.textContent=v}
window.FUTUROLOGIO_REFRESH_PROMPT=apply;
setTimeout(apply,50);setTimeout(apply,200);setInterval(apply,100);
})();
