// ====================================================================
// EXEMPLO: Como capturar frame de vídeo com Canvas (Agora funciona!)
// ====================================================================
// 
// Com o crossorigin="anonymous" configurado, você pode fazer coisas como:
//

// 1. CAPTURAR FRAME DE VÍDEO COMO IMAGEM
// --------------------------------------
function captureVideoFrame(videoElement) {
  // Cria um canvas temporário
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  // Define o tamanho do canvas igual ao vídeo
  canvas.width = videoElement.videoWidth;
  canvas.height = videoElement.videoHeight;
  
  // Desenha o frame atual do vídeo no canvas
  ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
  
  // Retorna a imagem como Data URL (base64)
  return canvas.toDataURL('image/jpeg', 0.9);
}

// Uso:
// const video = document.querySelector('video');
// video.addEventListener('loadeddata', () => {
//   const frameImage = captureVideoFrame(video);
//   console.log('Frame capturado:', frameImage);
//   // Agora você pode usar frameImage para criar thumbnail, etc.
// });


// 2. GERAR THUMBNAIL AUTOMÁTICA DE VÍDEO
// ---------------------------------------
async function generateVideoThumbnail(videoUrl) {
  return new Promise((resolve, reject) => {
    if (!videoUrl || videoUrl.trim() === "") {
      reject(new Error("URL do vídeo está vazia!"));
      return;
    }
    const video = document.createElement('video');
    video.crossOrigin = 'anonymous'; // IMPORTANTE!
    video.preload = 'metadata';
    
    video.onloadedmetadata = () => {
      // Vai para 1 segundo do vídeo
      video.currentTime = 1;
    };
    
    video.onseeked = () => {
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      canvas.toBlob(blob => {
        resolve(blob);
      }, 'image/jpeg', 0.8);
    };
    
    video.onerror = reject;
    video.src = videoUrl;
  });
}

// Uso:
// const thumbnailBlob = await generateVideoThumbnail('https://storage.googleapis.com/...');
// const thumbnailUrl = URL.createObjectURL(thumbnailBlob);


// 3. APLICAR FILTRO EM IMAGEM
// ---------------------------
function applyGrayscaleFilter(imageElement) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  canvas.width = imageElement.naturalWidth;
  canvas.height = imageElement.naturalHeight;
  
  // Desenha a imagem
  ctx.drawImage(imageElement, 0, 0);
  
  // Pega os dados dos pixels
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  
  // Aplica filtro grayscale
  for (let i = 0; i < data.length; i += 4) {
    const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
    data[i] = avg;     // R
    data[i + 1] = avg; // G
    data[i + 2] = avg; // B
    // data[i + 3] é o alpha, não alteramos
  }
  
  // Coloca os pixels de volta
  ctx.putImageData(imageData, 0, 0);
  
  return canvas.toDataURL('image/jpeg', 0.9);
}


// 4. REDIMENSIONAR IMAGEM
// ------------------------
function resizeImage(imageElement, maxWidth, maxHeight) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  let width = imageElement.naturalWidth;
  let height = imageElement.naturalHeight;
  
  // Calcula novo tamanho mantendo proporção
  if (width > maxWidth) {
    height = Math.round((height * maxWidth) / width);
    width = maxWidth;
  }
  
  if (height > maxHeight) {
    width = Math.round((width * maxHeight) / height);
    height = maxHeight;
  }
  
  canvas.width = width;
  canvas.height = height;
  
  // Desenha a imagem redimensionada
  ctx.drawImage(imageElement, 0, 0, width, height);
  
  return canvas.toDataURL('image/jpeg', 0.9);
}


// 5. DETECTAR COR PREDOMINANTE EM IMAGEM
// ---------------------------------------
function getDominantColor(imageElement) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  // Usa uma versão pequena para performance
  canvas.width = 50;
  canvas.height = 50;
  
  ctx.drawImage(imageElement, 0, 0, 50, 50);
  
  const imageData = ctx.getImageData(0, 0, 50, 50);
  const data = imageData.data;
  
  let r = 0, g = 0, b = 0;
  
  for (let i = 0; i < data.length; i += 4) {
    r += data[i];
    g += data[i + 1];
    b += data[i + 2];
  }
  
  const pixelCount = data.length / 4;
  r = Math.round(r / pixelCount);
  g = Math.round(g / pixelCount);
  b = Math.round(b / pixelCount);
  
  return `rgb(${r}, ${g}, ${b})`;
}


// 6. EXEMPLO COMPLETO: CRIAR THUMBNAIL AUTOMÁTICA AO FAZER UPLOAD
// ----------------------------------------------------------------
async function handleVideoUpload(file) {
  // 1. Upload do vídeo para Firebase Storage (código existente)
  const videoUrl = await uploadToFirebase(file);
  
  // 2. Gera thumbnail automática
  const thumbnailBlob = await generateVideoThumbnail(videoUrl);
  
  // 3. Faz upload da thumbnail
  const thumbnailUrl = await uploadThumbnailToFirebase(thumbnailBlob);
  
  // 4. Salva no Firestore com as duas URLs
  await savePost({
    mediaUrls: [videoUrl],
    thumbUrl: thumbnailUrl,
    type: 'video',
    // ... outros campos
  });
  
  return { videoUrl, thumbnailUrl };
}


// 7. INTEGRAÇÃO COM O CÓDIGO EXISTENTE
// -------------------------------------
// Adicione isso na função openPostModal para capturar frame:

/*
function renderSlide() {
  const url = SLIDES[SLIDE_IDX] || "";
  const ext = (url.split("?")[0].split(".").pop()||"").toLowerCase();
  const isVideo = ["mp4","mov","webm","m4v","avi"].includes(ext);
  const hasMany = SLIDES.length > 1;
  let arrows = hasMany ? `<div class="pv-arrow left" id="pvLeft">‹</div><div class="pv-arrow right" id="pvRight">›</div>` : "";
  
  // NOVO: Botão para capturar frame
  const captureBtn = isVideo ? '<button id="captureFrame" class="btn small" style="margin-top:10px">📸 Capturar Frame</button>' : '';
  
  modalPreview.innerHTML = `
    <div class="pv-stage">
      <div class="pv-media">
        ${isVideo ? `<video src="${url}" controls playsinline crossorigin="anonymous"></video>` : `<img src="${url}" alt="" crossorigin="anonymous">`}
      </div>
      ${arrows}
    </div>
    ${captureBtn}
  `;
  
  // NOVO: Handler para capturar frame
  if (isVideo) {
    const captureBtn = document.getElementById('captureFrame');
    const video = modalPreview.querySelector('video');
    
    captureBtn?.addEventListener('click', () => {
      const frameUrl = captureVideoFrame(video);
      
      // Opção 1: Baixar
      const a = document.createElement('a');
      a.href = frameUrl;
      a.download = `frame-${Date.now()}.jpg`;
      a.click();
      
      // Opção 2: Usar como thumbnail
      // uploadCoverImage(selectedPost.id, dataURLtoBlob(frameUrl));
    });
  }
}

// Helper para converter DataURL em Blob
function dataURLtoBlob(dataURL) {
  const arr = dataURL.split(',');
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
}
*/


// ====================================================================
// NOTAS IMPORTANTES
// ====================================================================
//
// 1. TODAS as funções acima só funcionam porque adicionamos:
//    crossorigin="anonymous" nas tags <img> e <video>
//
// 2. E porque o Firebase Storage está configurado com CORS
//    (veja README_CORS.md)
//
// 3. Sem essas duas coisas, você receberia erros como:
//    - "Tainted canvas may not be exported"
//    - "SecurityError: The operation is insecure"
//    - "Access to image/video blocked by CORS policy"
//
// 4. Agora você pode implementar recursos avançados como:
//    - Geração automática de thumbnails
//    - Filtros e efeitos em tempo real
//    - Análise de cores e conteúdo
//    - Marca d'água automática
//    - Compressão de imagens
//    - E muito mais!
//
// ====================================================================
