<?php
/**
 * Title: 3D Logo Carousel – Advanced Wide Slim
 * Slug: kadence-child/carousel-3d-ring-adv
 * Categories: kadence-child, featured
 * Description: Advanced experimental 3D carousel variant (wide & slim) with per-tile pop and controls.
 */
?>
<!-- wp:group {"align":"full","className":"kc-adv-stage-wrap","style":{"spacing":{"padding":{"top":"40px","bottom":"40px"}}},"layout":{"type":"constrained","contentSize":"1900px"}} -->
<div class="wp-block-group alignfull kc-adv-stage-wrap">
  <!-- wp:html -->
  <section class="kc-adv-carousel" aria-label="Brand logo carousel (advanced)">
    <div class="kc-adv-panel" data-playing="true">
      <div class="kc-adv-world">
        <div class="kc-adv-ring">
          <?php $logos = [
            'Wilsonart','Vicostone','Viatera','Vadara','UGM Surfaces','Trends','Teracanto','Silestone','Q Quartz','Pionite','Nevamar','HI-MACS','Formica','Dekton','Corian','Cambria','Caesarstone'
          ];
          $slug_map = [ 'Vadara' => 'Vadara-Capture-the-world-in-quartz' , 'HI-MACS' => 'Hi-Macs', 'Caesarstone' => 'Caesarstone-01-scaled' ];
          $i=0; foreach($logos as $name){
            $file = isset($slug_map[$name])? $slug_map[$name] : $name; $file = strtolower(str_replace([' ','\' . "u{2011}"],'-',$file));
            echo '<div class="kc-adv-tile" style="--n:'.$i++.'"><img loading="lazy" decoding="async" src="https://elevatedcountertopexperts.com/wp-content/uploads/2025/08/'.esc_attr($file).'-01.png" alt="'.esc_attr($name).'" /></div>';
          } ?>
        </div>
        <div class="kc-adv-floor" aria-hidden="true"></div>
      </div>
      <div class="kc-adv-spotlight" aria-hidden="true"></div>
      <div class="kc-adv-controls" aria-label="Carousel controls" role="group">
        <button type="button" class="kc-adv-btn" data-action="prev" aria-label="Previous">⟨</button>
        <button type="button" class="kc-adv-btn" data-action="playpause" aria-pressed="true" aria-label="Pause autoplay">Pause</button>
        <button type="button" class="kc-adv-btn" data-action="next" aria-label="Next">⟩</button>
      </div>
    </div>
  </section>
  <!-- /wp:html -->
</div>
<!-- /wp:group -->
<!-- wp:html -->
<style>
:root{--spin-seconds:22;--center-scale:1.16;--center-lift:8px;}
.kc-adv-stage-wrap{--panel-h-min:120px;--panel-h-max:210px;--tile-min:80px;--tile-max:120px;--radius-min:320px;--radius-max:600px;}
.kc-adv-carousel{position:relative;display:grid;place-items:center;min-height:clamp(240px,40vh,520px);}
.kc-adv-panel{--count:17;width:min(96vw,1280px);height:clamp(var(--panel-h-min),28vh,var(--panel-h-max));perspective:1000px;perspective-origin:50% 52%;position:relative;overflow:hidden;border-radius:16px;background:radial-gradient(140% 100% at 50% -30%,rgba(255,255,255,.05),transparent 70%),rgba(10,12,18,.78);outline:1px solid rgba(255,255,255,.08);box-shadow:0 18px 60px rgba(0,0,0,.5);}
.kc-adv-panel:before{content:"";position:absolute;inset:0;pointer-events:none;background:radial-gradient(160% 120% at 50% 120%,rgba(0,0,0,.55),transparent 55%),linear-gradient(180deg,rgba(255,255,255,.05),transparent 35%);}
.kc-adv-world{position:absolute;inset:0;transform-style:preserve-3d;}
.kc-adv-ring{position:absolute;inset:0;transform-style:preserve-3d;will-change:transform;}
.kc-adv-panel{--r:clamp(var(--radius-min),calc(52cqw - 0.40 * clamp(var(--tile-min),11vw,var(--tile-max))),var(--radius-max));}
.kc-adv-tile{position:absolute;top:50%;left:50%;width:clamp(var(--tile-min),11vw,var(--tile-max));aspect-ratio:1/1;border-radius:12px;background:#fff;border:1px solid rgba(0,0,0,.10);box-shadow:0 10px 20px rgba(0,0,0,.18),0 2px 6px rgba(0,0,0,.16);display:grid;place-items:center;transform-style:preserve-3d;overflow:hidden;--n:0;transform:translate(-50%,-50%) rotateY(calc(var(--n)*(360deg/var(--count)))) translateZ(calc(var(--r) + var(--z))) scale(var(--s));transition:filter .22s ease,box-shadow .22s ease,opacity .22s ease;}
.kc-adv-tile:after{content:"";position:absolute;inset:0;pointer-events:none;background:linear-gradient(180deg,rgba(255,255,255,.22),transparent 35%),radial-gradient(90% 70% at 50% 55%,rgba(255,255,255,.10),transparent 60%);mix-blend-mode:screen;}
.kc-adv-tile img{max-width:82%;max-height:82%;object-fit:contain;filter:drop-shadow(0 3px 8px rgba(0,0,0,.16));}
.kc-adv-spotlight{position:absolute;inset:0;pointer-events:none;background:radial-gradient(30% 44% at 50% 60%,rgba(255,255,255,.18),transparent 60%),radial-gradient(65% 85% at 50% 110%,rgba(0,0,0,.62),transparent 60%);mix-blend-mode:screen;}
.kc-adv-floor{position:absolute;left:8%;right:8%;bottom:-36%;height:45%;background:radial-gradient(80% 80% at 50% 0%,rgba(255,255,255,.05),transparent 70%),radial-gradient(70% 140% at 50% 100%,rgba(0,0,0,.72),transparent 60%);transform:translateZ(-220px) rotateX(78deg);filter:blur(2px);pointer-events:none;}
.kc-adv-controls{position:absolute;inset-inline:0;bottom:8px;display:flex;gap:8px;justify-content:center;align-items:center;z-index:4;}
.kc-adv-btn{background:rgba(255,255,255,.10);border:1px solid rgba(255,255,255,.18);color:#fff;padding:6px 10px;border-radius:999px;font-size:13px;line-height:1;backdrop-filter:blur(8px);cursor:pointer;user-select:none;}
.kc-adv-btn:hover{background:rgba(255,255,255,.16)}
@media (prefers-reduced-motion:reduce){.kc-adv-controls{display:none}}
</style>
<!-- /wp:html -->
