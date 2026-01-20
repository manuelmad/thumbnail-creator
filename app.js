(function(){
  const platform = document.getElementById('platform');
  const youtubeOptions = document.getElementById('youtubeOptions');
  const ytRadios = document.getElementsByName('ytOrient');
  const fileInput = document.getElementById('fileInput');
  const dropInput = document.getElementById('dropInput');
  const thumb = document.getElementById('thumbContainer');
  const watermark = document.getElementById('watermark');
  const titleInput = document.getElementById('titleInput');
  const titlePreview = document.getElementById('titlePreview');
  const dims = document.getElementById('dims');
  const fontSizeRange = document.getElementById('fontSizeRange');
  const fontSizeNumber = document.getElementById('fontSizeNumber');
  const fontColorInput = document.getElementById('fontColor');

  const sizes = {
    tiktok: {w:118,h:224,ratio:'9:16'},
    youtube_h: {w:1280,h:720,ratio:'16:9'},
    youtube_v: {w:1080,h:1920,ratio:'9:16'}
  };

  let currentImage = null;
  let currentSize = {w: sizes.tiktok.w, h: sizes.tiktok.h};
  const DEFAULT_FONT_SIZE = 10;
  const DEFAULT_FONT_COLOR = '#ffffff';

  function setDimensions(w,h){
    thumb.style.width = w + 'px';
    thumb.style.height = h + 'px';
    dims.textContent = w + ' × ' + h;
    currentSize = {w: w, h: h};
  }

  function resetThumbnail(){
    currentImage = null;
    thumb.style.backgroundImage = '';
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
  }

  function applyImageFromFile(file){
    if(!file) return;
    const reader = new FileReader();
    reader.onload = function(e){
      currentImage = e.target.result;
      thumb.style.backgroundImage = `url('${currentImage}')`;
      thumb.style.backgroundSize = 'cover';
      thumb.style.backgroundPosition = 'center';
      watermark.style.display = 'none';
    };
    reader.readAsDataURL(file);
  }

  // Platform change handler
  platform.addEventListener('change', ()=>{
    const p = platform.value;
    if(p === 'youtube'){
      youtubeOptions.classList.remove('hidden');
      // default horizontal
      setDimensions(sizes.youtube_h.w,sizes.youtube_h.h);
    } else {
      youtubeOptions.classList.add('hidden');
      setDimensions(sizes.tiktok.w,sizes.tiktok.h);
    }
    resetThumbnail();
  });

  // YouTube orientation radios
  ytRadios.forEach(r => r.addEventListener('change', ()=>{
    if(platform.value !== 'youtube') return;
    if(r.checked){
      if(r.value === 'horizontal') setDimensions(sizes.youtube_h.w,sizes.youtube_h.h);
      else setDimensions(sizes.youtube_v.w,sizes.youtube_v.h);
      resetThumbnail();
    }
  }));

  // File input
  fileInput.addEventListener('change', (e)=>{
    const f = e.target.files[0];
    applyImageFromFile(f);
  });

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
          ctx.drawImage(img, dx, dy, dw, dh);
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
      const lines = text.split('\n');
      const fontSize = parseInt(fontSizeNumber.value,10) || DEFAULT_FONT_SIZE;
      const lineHeight = Math.round(fontSize * 1.05);
      ctx.font = `${fontSize}px "Press Start 2P", monospace`;
      ctx.fillStyle = (fontColorInput && fontColorInput.value) ? fontColorInput.value : DEFAULT_FONT_COLOR;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.shadowColor = 'rgba(0,0,0,0.6)';
      ctx.shadowBlur = Math.max(2, Math.round(fontSize/6));

      const totalHeight = lines.length * lineHeight;
      let startY = canvas.height/2 - totalHeight/2 + lineHeight/2;
      for(let i=0;i<lines.length;i++){
        ctx.fillText(lines[i], canvas.width/2, startY + i*lineHeight);
      }
      // reset shadow
      ctx.shadowBlur = 0;
    };

    drawBackground(currentImage).then(()=>{
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

  // Center title both horizontally and vertically
  function updateTitlePosition(){
    titlePreview.style.left = '50%';
    titlePreview.style.top = '50%';
    titlePreview.style.transform = 'translate(-50%, -50%)';
  }
  updateTitlePosition();

  // Initialize default sizes and state
  (function init(){
    setDimensions(sizes.tiktok.w,sizes.tiktok.h);
    resetThumbnail();
  })();

})();
