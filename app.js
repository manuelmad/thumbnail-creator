(function(){
  const btnTiktok = document.getElementById('btnTiktok');
  const btnYoutubeH = document.getElementById('btnYoutubeH');
  const btnYoutubeV = document.getElementById('btnYoutubeV');
  const fileInput = document.getElementById('fileInput');
  const dropInput = document.getElementById('dropInput');
  const thumb = document.getElementById('thumbContainer');
  const bgImage = document.getElementById('bgImage');
  const watermark = document.getElementById('watermark');
  const titleInput = document.getElementById('titleInput');
  const titlePreview = document.getElementById('titlePreview');
  const dims = document.getElementById('dims');
  const fontSizeRange = document.getElementById('fontSizeRange');
  const fontSizeNumber = document.getElementById('fontSizeNumber');
  const imageOpacityRange = document.getElementById('imageOpacity');
  const imageOpacityNumber = document.getElementById('imageOpacityNumber');
  const fontColorInput = document.getElementById('fontColor');
  const titleXRange = document.getElementById('titleX');
  const titleXNumber = document.getElementById('titleXNumber');
  const titleYRange = document.getElementById('titleY');
  const titleYNumber = document.getElementById('titleYNumber');
  const posTopBtn = document.getElementById('posTop');
  const posMiddleBtn = document.getElementById('posMiddle');
  const posBottomBtn = document.getElementById('posBottom');
  const overlayInput = document.getElementById('overlayInput');
  const overlayElement = document.getElementById('overlayImage');
  const overlaySizeRange = document.getElementById('overlaySize');
  const overlaySizeNumber = document.getElementById('overlaySizeNumber');
  const overlayOpacityRange = document.getElementById('overlayOpacity');
  const overlayOpacityNumber = document.getElementById('overlayOpacityNumber');
  const overlayXRange = document.getElementById('overlayX');
  const overlayXNumber = document.getElementById('overlayXNumber');
  const overlayYRange = document.getElementById('overlayY');
  const overlayYNumber = document.getElementById('overlayYNumber');
  //const fontColorInput = document.getElementById('fontColor');

  const sizes = {
    tiktok: {w:324,h:432,ratio:'3:4'},
    youtube_h: {w:1280,h:720,ratio:'16:9'},
    youtube_v: {w:1080,h:1920,ratio:'9:16'}
  };

  let currentImage = null;
  let currentSize = {w: sizes.tiktok.w, h: sizes.tiktok.h};
  const DEFAULT_FONT_SIZE = 10;
  const DEFAULT_FONT_COLOR = '#ffffff';
  const DEFAULT_IMAGE_OPACITY = 100;
  const DEFAULT_OVERLAY_SCALE = 100;
  const DEFAULT_OVERLAY_OPACITY = 100;
  const DEFAULT_OVERLAY_POS = {x:50,y:50};
  const DEFAULT_TITLE_POS = {x:50,y:50};
  let currentOverlay = null;

  function setDimensions(w,h){
    //thumb.style.width = w + 'px';
    //thumb.style.height = h + 'px';

    if(window.innerWidth <= 600) {
      if(w==324) {
        thumb.style.width = 300 + 'px';
        thumb.style.height = 400 + 'px';
      } else if (w==1280) {
        thumb.style.width = 300 + 'px';
        thumb.style.height = 168.75 + 'px';
      } else if (w==1080) {
        thumb.style.width = 300 + 'px';
        thumb.style.height = 533.33 + 'px';
      }
    } else if (window.innerWidth <= 1024 && window.innerWidth > 600) {
      if(w==324) {
        thumb.style.width = w + 'px';
        thumb.style.height = h + 'px';
      } else if (w==1280) {
        thumb.style.width = 500 + 'px';
        thumb.style.height = 281.25 + 'px';
      } else if (w==1080) {
        thumb.style.width = 500 + 'px';
        thumb.style.height = 888.9 + 'px';
      }
    } else if (window.innerWidth > 1024) {
      if(w==324) {
        thumb.style.width = w + 'px';
        thumb.style.height = h + 'px';
      } else if (w==1280) {
        thumb.style.width = 800 + 'px';
        thumb.style.height = 450 + 'px';
      } else if (w==1080) {
        thumb.style.width = 500 + 'px';
        thumb.style.height = 888.9 + 'px';
      }
    }

    if(w==324) {
      dims.textContent = `${w} x ${h} (${(sizes.tiktok.ratio)})`;
    } else if (w==1280) {
      dims.textContent = `${w} x ${h} (${(sizes.youtube_h.ratio)})`;
    } else if (w==1080) {
      dims.textContent = `${w} x ${h} (${(sizes.youtube_v.ratio)})`;
    }
    //dims.textContent = w + ' × ' + h;
    currentSize = {w: w, h: h};
  }

  function resetThumbnail(){
    currentImage = null;
    if(bgImage) bgImage.style.backgroundImage = '';
    watermark.style.display = 'block';
    titlePreview.textContent = '';
    titleInput.value = '';
    fontSizeRange.value = DEFAULT_FONT_SIZE;
    fontSizeNumber.value = DEFAULT_FONT_SIZE;
    titlePreview.style.fontSize = DEFAULT_FONT_SIZE + 'px';
    if(fontColorInput) {
      fontColorInput.value = DEFAULT_FONT_COLOR;
      titlePreview.style.color = DEFAULT_FONT_COLOR;
    }
    if(imageOpacityRange) imageOpacityRange.value = DEFAULT_IMAGE_OPACITY;
    if(imageOpacityNumber) imageOpacityNumber.value = DEFAULT_IMAGE_OPACITY;
    if(bgImage) bgImage.style.opacity = DEFAULT_IMAGE_OPACITY/100;
    if(titleXRange) titleXRange.value = DEFAULT_TITLE_POS.x;
    if(titleXNumber) titleXNumber.value = DEFAULT_TITLE_POS.x;
    if(titleYRange) titleYRange.value = DEFAULT_TITLE_POS.y;
    if(titleYNumber) titleYNumber.value = DEFAULT_TITLE_POS.y;
    // reset overlay
    currentOverlay = null;
    if(overlayElement) {
      // clear any preview image
      overlayElement.style.backgroundImage = '';
      overlayElement.innerHTML = '';
      overlayElement.style.opacity = DEFAULT_OVERLAY_OPACITY/100;
      overlayElement.style.width = DEFAULT_OVERLAY_SCALE + '%';
      overlayElement.style.left = DEFAULT_OVERLAY_POS.x + '%';
      overlayElement.style.top = DEFAULT_OVERLAY_POS.y + '%';
    }
    if(overlaySizeRange) overlaySizeRange.value = DEFAULT_OVERLAY_SCALE;
    if(overlaySizeNumber) overlaySizeNumber.value = DEFAULT_OVERLAY_SCALE;
    if(overlayOpacityRange) overlayOpacityRange.value = DEFAULT_OVERLAY_OPACITY;
    if(overlayOpacityNumber) overlayOpacityNumber.value = DEFAULT_OVERLAY_OPACITY;
    updateTitlePosition();
  }

  function applyImageFromFile(file){
    if(!file) return;
    const reader = new FileReader();
    reader.onload = function(e){
      currentImage = e.target.result;
      if(bgImage){
        bgImage.style.backgroundImage = `url('${currentImage}')`;
        bgImage.style.backgroundSize = 'cover';
        bgImage.style.backgroundPosition = 'center';
      } else {
        thumb.style.backgroundImage = `url('${currentImage}')`;
        thumb.style.backgroundSize = 'cover';
        thumb.style.backgroundPosition = 'center';
      }
      watermark.style.display = 'none';
    };
    reader.readAsDataURL(file);
  }

  function applyOverlayFromFile(file){
    if(!file) return;
    const reader = new FileReader();
    reader.onload = function(e){
      currentOverlay = e.target.result;
      if(overlayElement){
        // create an <img> inside overlayElement so it has intrinsic height for preview
        overlayElement.innerHTML = '';
        const img = new Image();
        img.src = currentOverlay;
        img.style.width = '100%';
        img.style.height = 'auto';
        img.style.display = 'block';
        overlayElement.appendChild(img);

        const size = (overlaySizeNumber && overlaySizeNumber.value) ? overlaySizeNumber.value : DEFAULT_OVERLAY_SCALE;
        overlayElement.style.width = size + '%';
        const op = (overlayOpacityNumber && overlayOpacityNumber.value) ? (overlayOpacityNumber.value/100) : (DEFAULT_OVERLAY_OPACITY/100);
        overlayElement.style.opacity = op;
        const ox = (overlayXNumber && overlayXNumber.value) ? overlayXNumber.value : DEFAULT_OVERLAY_POS.x;
        const oy = (overlayYNumber && overlayYNumber.value) ? overlayYNumber.value : DEFAULT_OVERLAY_POS.y;
        overlayElement.style.left = ox + '%';
        overlayElement.style.top = oy + '%';
      }
    };
    reader.readAsDataURL(file);
  }

  // Platform buttons handlers
  function selectPlatform(selectedBtn){
    const btns = [btnTiktok, btnYoutubeH, btnYoutubeV];
    btns.forEach(b => {
      if(!b) return;
      const pressed = (b === selectedBtn);
      b.setAttribute('aria-pressed', pressed ? 'true' : 'false');
    });
  }
  if(btnTiktok) {
    btnTiktok.addEventListener('click', ()=>{ selectPlatform(btnTiktok); setDimensions(sizes.tiktok.w,sizes.tiktok.h); resetThumbnail(); });
    btnTiktok.addEventListener('keydown', (e)=>{ if(e.key==='Enter' || e.key===' ') { e.preventDefault(); btnTiktok.click(); } });
  }
  if(btnYoutubeH) {
    btnYoutubeH.addEventListener('click', ()=>{ selectPlatform(btnYoutubeH); setDimensions(sizes.youtube_h.w,sizes.youtube_h.h); resetThumbnail(); });
    btnYoutubeH.addEventListener('keydown', (e)=>{ if(e.key==='Enter' || e.key===' ') { e.preventDefault(); btnYoutubeH.click(); } });
  }
  if(btnYoutubeV) {
    btnYoutubeV.addEventListener('click', ()=>{ selectPlatform(btnYoutubeV); setDimensions(sizes.youtube_v.w,sizes.youtube_v.h); resetThumbnail(); });
    btnYoutubeV.addEventListener('keydown', (e)=>{ if(e.key==='Enter' || e.key===' ') { e.preventDefault(); btnYoutubeV.click(); } });
  }

  // File input
  fileInput.addEventListener('change', (e)=>{
    const f = e.target.files[0];
    applyImageFromFile(f);
  });

  // Overlay file input
  if(overlayInput){
    overlayInput.addEventListener('change', (e)=>{
      const f = e.target.files[0];
      applyOverlayFromFile(f);
    });
  }

  // Overlay position controls
  if(overlayXRange){
    overlayXRange.addEventListener('input', ()=>{
      const v = overlayXRange.value;
      if(overlayXNumber) overlayXNumber.value = v;
      if(overlayElement) overlayElement.style.left = v + '%';
    });
  }
  if(overlayXNumber){
    overlayXNumber.addEventListener('input', ()=>{
      let v = parseInt(overlayXNumber.value,10);
      if(isNaN(v)) v = DEFAULT_OVERLAY_POS.x;
      v = Math.max(0, Math.min(100, v));
      if(overlayXRange) overlayXRange.value = v;
      overlayXNumber.value = v;
      if(overlayElement) overlayElement.style.left = v + '%';
    });
  }
  if(overlayYRange){
    overlayYRange.addEventListener('input', ()=>{
      const v = overlayYRange.value;
      if(overlayYNumber) overlayYNumber.value = v;
      if(overlayElement) overlayElement.style.top = v + '%';
    });
  }
  if(overlayYNumber){
    overlayYNumber.addEventListener('input', ()=>{
      let v = parseInt(overlayYNumber.value,10);
      if(isNaN(v)) v = DEFAULT_OVERLAY_POS.y;
      v = Math.max(0, Math.min(100, v));
      if(overlayYRange) overlayYRange.value = v;
      overlayYNumber.value = v;
      if(overlayElement) overlayElement.style.top = v + '%';
    });
  }

  // Drag & drop on thumb
  thumb.addEventListener('dragover', (e)=>{e.preventDefault(); thumb.classList.add('dragover');});
  thumb.addEventListener('dragleave', ()=>{thumb.classList.remove('dragover');});
  thumb.addEventListener('drop', (e)=>{
    e.preventDefault(); thumb.classList.remove('dragover');
    const f = e.dataTransfer.files && e.dataTransfer.files[0];
    if(f) applyImageFromFile(f);
  });

  // Also allow clicking the container to open file dialog
  thumb.addEventListener('click', ()=> fileInput.click());

  const exportBtn = document.getElementById('exportBtn');

  function exportThumbnail(){
    const canvas = document.createElement('canvas');
    canvas.width = currentSize.w;
    canvas.height = currentSize.h;
    const ctx = canvas.getContext('2d');

    // fill background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0,0,canvas.width,canvas.height);

    // draw background image (cover)
    const drawBackground = (imgSrc) => {
      return new Promise((resolve)=>{
        if(!imgSrc){ resolve(); return; }
        const img = new Image();
        img.onload = function(){
          const iw = img.width, ih = img.height;
          const scale = Math.max(canvas.width/iw, canvas.height/ih);
          const dw = iw * scale, dh = ih * scale;
          const dx = (canvas.width - dw)/2;
          const dy = (canvas.height - dh)/2;
          const opacity = (imageOpacityRange && imageOpacityRange.value) ? (imageOpacityRange.value/100) : 1;
          ctx.save();
          ctx.globalAlpha = opacity;
          ctx.drawImage(img, dx, dy, dw, dh);
          ctx.restore();
          resolve();
        };
        img.onerror = () => resolve();
        img.src = imgSrc;
      });
    };

    const drawOverlay = (imgSrc) => {
      return new Promise((resolve)=>{
        if(!imgSrc){ resolve(); return; }
        const img = new Image();
        img.onload = function(){
          // desired width based on overlaySize percent of canvas width
          const overlayScale = (overlaySizeNumber && overlaySizeNumber.value) ? Number(overlaySizeNumber.value) : DEFAULT_OVERLAY_SCALE;
          const desiredW = Math.max(1, Math.round((overlayScale/100) * canvas.width));
          const scale = desiredW / img.width;
          const dw = img.width * scale;
          const dh = img.height * scale;
          // position based on overlay X/Y percent (center of overlay)
          const xPercent = (overlayXNumber && overlayXNumber.value) ? Number(overlayXNumber.value) : DEFAULT_OVERLAY_POS.x;
          const yPercent = (overlayYNumber && overlayYNumber.value) ? Number(overlayYNumber.value) : DEFAULT_OVERLAY_POS.y;
          const xCoord = Math.round((xPercent/100) * canvas.width);
          const yCoord = Math.round((yPercent/100) * canvas.height);
          const dx = Math.round(xCoord - dw/2);
          const dy = Math.round(yCoord - dh/2);
          const opacity = (overlayOpacityRange && overlayOpacityRange.value) ? (overlayOpacityRange.value/100) : 1;
          ctx.save();
          ctx.globalAlpha = opacity;
          ctx.drawImage(img, dx, dy, dw, dh);
          ctx.restore();
          resolve();
        };
        img.onerror = () => resolve();
        img.src = imgSrc;
      });
    };

    const drawWatermark = ()=>{
      ctx.fillStyle = 'rgba(0,0,0,0.35)';
      const size = Math.max(14, Math.floor(Math.min(canvas.width, canvas.height)/12));
      ctx.font = `${size}px "Press Start 2P", monospace`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('aquí tu miniatura', canvas.width/2, canvas.height/2);
    };

    const drawTitle = ()=>{
      const text = titlePreview.textContent || '';
      if(!text) return;
      const fontSize = parseInt(fontSizeNumber.value,10) || DEFAULT_FONT_SIZE;
      const lineHeight = Math.round(fontSize * 1.05);
      ctx.font = `${fontSize}px "Press Start 2P", monospace`;
      ctx.fillStyle = (fontColorInput && fontColorInput.value) ? fontColorInput.value : DEFAULT_FONT_COLOR;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.shadowColor = 'rgba(0,0,0,0.6)';
      ctx.shadowBlur = Math.max(2, Math.round(fontSize/6));

      // max text width (leave some horizontal padding)
      const maxTextWidth = Math.max(10, Math.floor(canvas.width * 0.9));

      // wrap text (respect explicit newlines)
      const wrapLines = [];
      const paragraphs = text.split('\n');
      const measure = (t) => ctx.measureText(t).width;

      for(const p of paragraphs){
        const words = p.split(' ');
        let cur = '';
        for(const w of words){
          const test = cur ? (cur + ' ' + w) : w;
          if(measure(test) <= maxTextWidth){
            cur = test;
          } else {
            if(cur) wrapLines.push(cur);
            // if single word too long, break by characters
            if(measure(w) <= maxTextWidth){
              cur = w;
            } else {
              let part = '';
              for(const ch of w){
                const t2 = part + ch;
                if(measure(t2) <= maxTextWidth){
                  part = t2;
                } else {
                  if(part) wrapLines.push(part);
                  part = ch;
                }
              }
              cur = part;
            }
          }
        }
        if(cur) wrapLines.push(cur);
      }

      const totalHeight = wrapLines.length * lineHeight;
      const xPercent = (titleXNumber && titleXNumber.value) ? Number(titleXNumber.value) : DEFAULT_TITLE_POS.x;
      const yPercent = (titleYNumber && titleYNumber.value) ? Number(titleYNumber.value) : DEFAULT_TITLE_POS.y;
      const xCoord = Math.round((xPercent/100) * canvas.width);
      const yCoord = Math.round((yPercent/100) * canvas.height);
      let startY = Math.max(lineHeight/2, yCoord - totalHeight/2 + lineHeight/2);
      for(let i=0;i<wrapLines.length;i++){
        ctx.fillText(wrapLines[i], xCoord, startY + i*lineHeight);
      }
      ctx.shadowBlur = 0;
    };

    drawBackground(currentImage).then(()=> drawOverlay(currentOverlay) ).then(()=>{
      if(!currentImage) drawWatermark();
      drawTitle();
      const data = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = data;
      a.download = 'thumbnail.png';
      document.body.appendChild(a);
      a.click();
      a.remove();
    });
  }

  if(exportBtn) exportBtn.addEventListener('click', exportThumbnail);

  // Opacity controls
  if(imageOpacityRange){
    imageOpacityRange.addEventListener('input', ()=>{
      const v = imageOpacityRange.value;
      if(imageOpacityNumber) imageOpacityNumber.value = v;
      if(bgImage) bgImage.style.opacity = v/100;
    });
  }
  if(imageOpacityNumber){
    imageOpacityNumber.addEventListener('input', ()=>{
      let v = parseInt(imageOpacityNumber.value,10);
      if(isNaN(v)) v = DEFAULT_IMAGE_OPACITY;
      v = Math.max(0, Math.min(100, v));
      if(imageOpacityRange) imageOpacityRange.value = v;
      if(bgImage) bgImage.style.opacity = v/100;
    });
  }

  // Color picker handler
  if(fontColorInput){
    fontColorInput.addEventListener('input', ()=>{
      titlePreview.style.color = fontColorInput.value;
    });
  }

  // Title input
  titleInput.addEventListener('input', ()=>{
    titlePreview.textContent = titleInput.value;
    // If there's no image, keep watermark visible under title; requirement says watermark is initial; we'll keep watermark only if no image
    if(!currentImage) watermark.style.display = 'block';
    else watermark.style.display = 'none';
  });

  // Font size sync
  function setFontSize(v){
    titlePreview.style.fontSize = v + 'px';
    fontSizeRange.value = v;
    fontSizeNumber.value = v;
  }
  fontSizeRange.addEventListener('input', ()=> setFontSize(fontSizeRange.value));
  fontSizeNumber.addEventListener('input', ()=> setFontSize(fontSizeNumber.value));

  // Title position (percent from 0 to 100)
  function updateTitlePosition(){
    const x = (titleXNumber && titleXNumber.value) ? Number(titleXNumber.value) : DEFAULT_TITLE_POS.x;
    const y = (titleYNumber && titleYNumber.value) ? Number(titleYNumber.value) : DEFAULT_TITLE_POS.y;
    titlePreview.style.left = x + '%';
    titlePreview.style.top = y + '%';
    titlePreview.style.transform = 'translate(-50%, -50%)';
  }
  // Sync range/number inputs and bind events
  if(titleXRange){
    titleXRange.addEventListener('input', ()=>{
      const v = titleXRange.value;
      if(titleXNumber) titleXNumber.value = v;
      updateTitlePosition();
    });
  }
  if(titleXNumber){
    titleXNumber.addEventListener('input', ()=>{
      let v = parseInt(titleXNumber.value,10);
      if(isNaN(v)) v = DEFAULT_TITLE_POS.x;
      v = Math.max(0, Math.min(100, v));
      if(titleXRange) titleXRange.value = v;
      titleXNumber.value = v;
      updateTitlePosition();
    });
  }
  if(titleYRange){
    titleYRange.addEventListener('input', ()=>{
      const v = titleYRange.value;
      if(titleYNumber) titleYNumber.value = v;
      updateTitlePosition();
    });
  }
  if(titleYNumber){
    titleYNumber.addEventListener('input', ()=>{
      let v = parseInt(titleYNumber.value,10);
      if(isNaN(v)) v = DEFAULT_TITLE_POS.y;
      v = Math.max(0, Math.min(100, v));
      if(titleYRange) titleYRange.value = v;
      titleYNumber.value = v;
      updateTitlePosition();
    });
  }
  if(posTopBtn) posTopBtn.addEventListener('click', ()=>{ if(titleYRange && titleYNumber){ titleYRange.value=10; titleYNumber.value=10; updateTitlePosition(); } });
  if(posMiddleBtn) posMiddleBtn.addEventListener('click', ()=>{ if(titleYRange && titleYNumber){ titleYRange.value=50; titleYNumber.value=50; updateTitlePosition(); } });
  if(posBottomBtn) posBottomBtn.addEventListener('click', ()=>{ if(titleYRange && titleYNumber){ titleYRange.value=90; titleYNumber.value=90; updateTitlePosition(); } });
  // Overlay size controls
  if(overlaySizeRange){
    overlaySizeRange.addEventListener('input', ()=>{
      const v = overlaySizeRange.value;
      if(overlaySizeNumber) overlaySizeNumber.value = v;
      if(overlayElement) overlayElement.style.width = v + '%';
    });
  }
  if(overlaySizeNumber){
    overlaySizeNumber.addEventListener('input', ()=>{
      let v = parseInt(overlaySizeNumber.value,10);
      if(isNaN(v)) v = DEFAULT_OVERLAY_SCALE;
      v = Math.max(10, Math.min(200, v));
      if(overlaySizeRange) overlaySizeRange.value = v;
      overlaySizeNumber.value = v;
      if(overlayElement) overlayElement.style.width = v + '%';
    });
  }
  // Overlay opacity controls
  if(overlayOpacityRange){
    overlayOpacityRange.addEventListener('input', ()=>{
      const v = overlayOpacityRange.value;
      if(overlayOpacityNumber) overlayOpacityNumber.value = v;
      if(overlayElement) overlayElement.style.opacity = v/100;
    });
  }
  if(overlayOpacityNumber){
    overlayOpacityNumber.addEventListener('input', ()=>{
      let v = parseInt(overlayOpacityNumber.value,10);
      if(isNaN(v)) v = DEFAULT_OVERLAY_OPACITY;
      v = Math.max(0, Math.min(100, v));
      if(overlayOpacityRange) overlayOpacityRange.value = v;
      if(overlayElement) overlayElement.style.opacity = v/100;
      overlayOpacityNumber.value = v;
    });
  }
  updateTitlePosition();

  // Initialize default sizes and state
  (function init(){
    setDimensions(sizes.tiktok.w,sizes.tiktok.h);
    resetThumbnail();
    if(typeof selectPlatform === 'function') selectPlatform(btnTiktok);
  })();

})();
