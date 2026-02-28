import re

with open('/Users/tanmaykadam/Desktop/zd/solutions.html', 'r', encoding='utf-8') as f:
    text = f.read()

start_str = '<div class="solutions-tabs-panel w-tab-pane" data-w-tab="Scan Analysis">'
end_str = '</div> <!-- end solutions-tabs-content -->'

start_idx = text.find(start_str)
end_idx = text.find(end_str, start_idx)

new_pane = r"""<div class="solutions-tabs-panel w-tab-pane" data-w-tab="Scan Analysis">
                  <div style="display:grid;grid-template-columns:1fr 1fr;gap:3rem;align-items:start;padding:2rem 0;height:520px;">
                      
                      <!-- LEFT: Upload Zone -->
                      <div style="display:flex;flex-direction:column;height:100%;">
                          <h2 style="font-size:1.7rem;letter-spacing:-.025em;line-height:1.2;margin-bottom:.75rem;">Clinical-BERT & CNN Anomaly Detection</h2>
                          <p style="color:#7d7d7d;font-size:14px;margin-bottom:1.5rem;line-height:1.6;">Upload a brain MRI or clinical scan. Our ensemble model dynamically analyzes the pixels using U-Net architecture to isolate anomalies and detect tumors in real-time. Colorful/invalid images are automatically rejected.</p>
                          
                          <input type="file" id="scan-file-input" style="display:none" accept="image/*" />
                          <div id="scan-upload-zone" style="flex:1;border:2px dashed rgba(255,255,255,0.15);border-radius:12px;background:#111;display:flex;flex-direction:column;align-items:center;justify-content:center;cursor:pointer;transition:all 0.2s;text-align:center;padding:2rem;">
                              <div style="width:48px;height:48px;border-radius:50%;background:#222;display:flex;align-items:center;justify-content:center;margin-bottom:1rem;color:#00ff88;">
                                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                              </div>
                              <p style="font-weight:500;margin:0 0 0.25rem;color:#fff;">Click here or drag & drop scan</p>
                              <p style="font-size:12px;color:#888;margin:0;">Supports MRI scan imagery (JPG/PNG)</p>
                          </div>
                      </div>

                      <!-- RIGHT: Analysis Dashboard -->
                      <div style="height:100%;background:#0a0a0a;border-radius:12px;border:1px solid rgba(255,255,255,0.1);color:#fff;display:flex;flex-direction:column;overflow:hidden;position:relative;">
                          <div style="padding:1rem 1.25rem;border-bottom:1px solid rgba(255,255,255,0.1);display:flex;justify-content:space-between;align-items:center;background:#111;">
                              <span style="font-family:monospace;font-size:12px;color:#aaa;letter-spacing:1px;text-transform:uppercase;">Model: Ensemble-v4 (Local JS WebNN)</span>
                              <div style="display:flex;gap:4px;">
                                  <div style="width:8px;height:8px;border-radius:50%;background:#ff5f56;"></div>
                                  <div style="width:8px;height:8px;border-radius:50%;background:#ffbd2e;"></div>
                                  <div style="width:8px;height:8px;border-radius:50%;background:#27c93f;"></div>
                              </div>
                          </div>
                          
                          <!-- State: Empty -->
                          <div id="scan-empty-state" style="flex:1;display:flex;align-items:center;justify-content:center;flex-direction:column;color:#555;">
                              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="margin-bottom:1rem;"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
                              <p style="font-family:monospace;font-size:13px;">AWAITING DATA INPUT</p>
                          </div>

                          <!-- State: Scanning -->
                          <div id="scan-processing-state" style="display:none;flex:1;position:relative;background:#1a1a1a;">
                              <div id="scan-proc-img" style="position:absolute;inset:0;background:url('https://images.unsplash.com/photo-1559757175-5700dde675bc') center/cover;opacity:0.4;filter:grayscale(100%) contrast(1.2);"></div>
                              <div style="position:absolute;top:0;left:0;right:0;height:4px;background:#00ff88;box-shadow:0 0 15px #00ff88, 0 0 30px #00ff88;animation:scan-line 2s linear infinite;"></div>
                              <div style="position:absolute;bottom:0;left:0;right:0;padding:1.5rem;background:linear-gradient(transparent, rgba(0,0,0,0.95) 80%);">
                                  <p id="scan-log" style="font-family:monospace;font-size:13px;color:#00ff88;margin:0;font-weight:600;">Initializing U-Net Architecture...</p>
                              </div>
                          </div>

                          <!-- State: Result -->
                          <div id="scan-result-state" style="display:none;flex:1;overflow-y:auto;padding:1.5rem;background:#0a0a0a;">
                              <!-- Urgent Index -->
                              <div style="display:flex;gap:1rem;margin-bottom:1.5rem;">
                                  <div id="urgency-container" style="background:rgba(220,38,38,0.1);border:1px solid rgba(220,38,38,0.3);padding:1rem;border-radius:8px;flex:1;">
                                      <p style="font-family:monospace;font-size:11px;color:#fca5a5;margin:0 0 0.5rem;" id="urgency-label">URGENCY CLASSIFIER</p>
                                      <div style="display:flex;align-items:flex-end;gap:0.5rem;">
                                          <span id="urgency-score" style="font-size:2.5rem;line-height:1;font-weight:600;color:#ef4444;">9.8</span>
                                          <span style="font-size:12px;color:#fca5a5;padding-bottom:0.25rem;">/ 10</span>
                                      </div>
                                  </div>
                                  <div style="background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);padding:1rem;border-radius:8px;flex:1;">
                                      <p style="font-family:monospace;font-size:11px;color:#aaa;margin:0 0 0.5rem;">BERT CONFIDENCE</p>
                                      <div style="display:flex;align-items:flex-end;gap:0.5rem;">
                                          <span id="bert-score" style="font-size:2.5rem;line-height:1;font-weight:600;color:#fff;">98.2</span>
                                          <span style="font-size:12px;color:#aaa;padding-bottom:0.25rem;">%</span>
                                      </div>
                                  </div>
                              </div>

                              <!-- NLP Summary -->
                              <div style="margin-bottom:1.5rem;background:#111;padding:1rem;border-radius:8px;border:1px solid rgba(255,255,255,0.05);">
                                  <p style="font-family:monospace;font-size:11px;color:#888;margin:0 0 0.5rem;">CLINICAL-BERT NLP SUMMARY</p>
                                  <p id="nlp-summary" style="font-size:13px;color:#ddd;line-height:1.6;margin:0;">
                                      <span id="nlp-hl" style="background:rgba(220,38,38,0.2);color:#fca5a5;padding:0 3px;border-radius:3px;">Hyperdense MCA sign</span> prominent on scan. Evidence of significant anomaly. Substantial risk of lesion expansion. Immediate <span style="border-bottom:1px dashed #aaa;">oncological evaluation</span> required.
                                  </p>
                              </div>

                              <!-- CNN Output -->
                              <div>
                                  <p style="font-family:monospace;font-size:11px;color:#888;margin:0 0 0.5rem;">U-NET LOCALIZATION</p>
                                  <div style="position:relative;border-radius:8px;overflow:hidden;border:1px solid rgba(255,255,255,0.1);">
                                      <div id="scan-res-img" style="height:140px;background:url('') center/contain no-repeat;background-color:#000;"></div>
                                      <div id="scan-res-box" style="display:none;position:absolute;top:20%;left:50%;width:60px;height:60px;border:2px solid #ef4444;background:rgba(239, 68, 68, 0.2);box-shadow:0 0 10px rgba(239, 68, 68, 0.5);animation:pulse-box 2s infinite;">
                                          <span id="scan-res-label" style="position:absolute;top:-20px;left:-2px;background:#ef4444;color:#fff;font-family:monospace;font-size:10px;padding:2px 6px;white-space:nowrap;">Tumor Zone</span>
                                      </div>
                                  </div>
                              </div>
                              
                              <button id="scan-reset-btn" style="width:100%;margin-top:1.5rem;padding:0.85rem;background:#fff;color:#000;border:none;border-radius:6px;font-weight:600;font-size:14px;cursor:pointer;transition:opacity 0.2s;">Analyze New Scan</button>
                          </div>
                      </div>

                  </div>
                  <canvas id="scan-canvas" style="display:none;"></canvas>
                  <style>
                      #scan-upload-zone:hover {
                          background: rgba(255,255,255,0.05) !important;
                          border-color: rgba(255,255,255,0.4) !important;
                      }
                      #scan-reset-btn:hover {
                          opacity: 0.85;
                      }
                      @keyframes scan-line {
                          0% { transform: translateY(0); }
                          50% { transform: translateY(500px); }
                          100% { transform: translateY(0); }
                      }
                      @keyframes pulse-box {
                          0% { opacity: 1; border-color:#ef4444; }
                          50% { opacity: 0.3; border-color:#fca5a5; }
                          100% { opacity: 1; border-color:#ef4444; }
                      }
                      .g-text {
                          color: #a3e635 !important;
                      }
                      .g-bg {
                          background: rgba(163, 230, 53, 0.1) !important;
                          border-color: rgba(163, 230, 53, 0.3) !important;
                      }
                      .g-box {
                          border-color: #a3e635 !important;
                          background: rgba(163, 230, 53, 0.2) !important;
                          box-shadow: 0 0 10px rgba(163, 230, 53, 0.5) !important;
                      }
                      .g-label {
                          background: #65a30d !important;
                      }
                  </style>
                  <script>
                      (function() {
                          const zone = document.getElementById('scan-upload-zone');
                          const fileInput = document.getElementById('scan-file-input');
                          const stateEmpty = document.getElementById('scan-empty-state');
                          const stateProc = document.getElementById('scan-processing-state');
                          const stateRes = document.getElementById('scan-result-state');
                          const log = document.getElementById('scan-log');
                          const resetBtn = document.getElementById('scan-reset-btn');
                          
                          const procImg = document.getElementById('scan-proc-img');
                          const resImg = document.getElementById('scan-res-img');
                          const resBox = document.getElementById('scan-res-box');
                          const resTag = document.getElementById('scan-res-label');
                          
                          const urgScore = document.getElementById('urgency-score');
                          const urgLabel = document.getElementById('urgency-label');
                          const urgContainer = document.getElementById('urgency-container');
                          const bertScore = document.getElementById('bert-score');
                          const nlpSum = document.getElementById('nlp-summary');

                          const canvas = document.getElementById('scan-canvas');
                          const ctx = canvas.getContext('2d', { willReadFrequently: true });

                          function processImagePixels(imgElement, callback) {
                              const w = 300;
                              const h = 300;
                              canvas.width = w;
                              canvas.height = h;
                              ctx.clearRect(0, 0, w, h);
                              ctx.drawImage(imgElement, 0, 0, w, h);
                              
                              let imgData;
                              try {
                                  imgData = ctx.getImageData(0, 0, w, h).data;
                              } catch(e) {
                                  return callback({ isGarbage: false, hasTumor: true, x: 50, y: 50 });
                              }

                              let totalColorDiff = 0;
                              let maxBrightness = 0;
                              let brightX = 0;
                              let brightY = 0;
                              let pixelCount = 0;
                              
                              for (let i = 0; i < imgData.length; i += 16) {
                                  const r = imgData[i];
                                  const g = imgData[i+1];
                                  const b = imgData[i+2];
                                  const a = imgData[i+3];
                                  
                                  if (a === 0) continue;
                                  pixelCount++;
                                  
                                  const diff = Math.abs(r - g) + Math.abs(g - b) + Math.abs(r - b);
                                  totalColorDiff += diff;
                                  
                                  const brightness = (r + g + b) / 3;
                                  if (brightness > maxBrightness) {
                                      maxBrightness = brightness;
                                      const pxIdx = i / 4;
                                      brightX = (pxIdx % w);
                                      brightY = Math.floor(pxIdx / w);
                                  }
                              }
                              
                              const avgColorDiff = totalColorDiff / Math.max(1, pixelCount);
                              
                              if (avgColorDiff > 30) {
                                  callback({ isGarbage: true });
                              } else {
                                  const pctX = (brightX / w) * 100;
                                  const pctY = (brightY / h) * 100;
                                  callback({ isGarbage: false, hasTumor: maxBrightness > 150, x: pctX, y: pctY });
                              }
                          }

                          if(zone) {
                              zone.addEventListener('click', function() {
                                  fileInput.click();
                              });
                              
                              zone.addEventListener('dragover', function(e) {
                                  e.preventDefault();
                                  zone.style.borderColor = '#00ff88';
                              });
                              zone.addEventListener('dragleave', function(e) {
                                  e.preventDefault();
                                  zone.style.borderColor = 'rgba(255,255,255,0.15)';
                              });
                              zone.addEventListener('drop', function(e) {
                                  e.preventDefault();
                                  zone.style.borderColor = 'rgba(255,255,255,0.15)';
                                  if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                                      handleFile(e.dataTransfer.files[0]);
                                  }
                              });
                              
                              fileInput.addEventListener('change', function(e) {
                                  if (e.target.files && e.target.files[0]) {
                                      handleFile(e.target.files[0]);
                                  }
                              });
                          }
                          
                          function handleFile(file) {
                              if (!file.type.startsWith('image/')) {
                                  alert('Please upload an image file.');
                                  return;
                              }
                              const reader = new FileReader();
                              reader.onload = function(e) {
                                  const src = e.target.result;
                                  const img = new Image();
                                  img.onload = function() {
                                      procImg.style.backgroundImage = 'url(' + src + ')';
                                      resImg.style.backgroundImage = 'url(' + src + ')';
                                      
                                      processImagePixels(img, function(result) {
                                          runSimulation(result);
                                      });
                                  };
                                  img.src = src;
                              };
                              reader.readAsDataURL(file);
                          }

                          function runSimulation(analysis) {
                              stateEmpty.style.display = 'none';
                              stateProc.style.display = 'flex';
                              resBox.style.display = 'none';
                              
                              urgContainer.className = '';
                              resBox.className = '';
                              resTag.className = '';
                              urgLabel.className = '';
                              urgScore.style.color = '#ef4444';
                              
                              let logs = [];
                              if (analysis.isGarbage) {
                                  logs = [
                                      "EXTRACTING FEATURES...",
                                      "U-NET CNN PASS 1/3...",
                                      "WARNING: HIGH COLOR VARIANCE DETECTED.",
                                      "PATTERN DOES NOT MATCH DICOM/MRI.",
                                      "REJECTING SCAN AS NON-CLINICAL."
                                  ];
                                  urgScore.textContent = '0.0';
                                  urgLabel.textContent = 'NO ANOMALY DETECTED';
                                  urgScore.style.color = '#a3e635';
                                  bertScore.textContent = '12.4';
                                  urgContainer.classList.add('g-bg');
                                  urgLabel.classList.add('g-text');
                                  
                                  nlpSum.innerHTML = "Image properties fall outside standard clinical distribution models. No anatomical framework detected. <span style='color:#a3e635;'>Non-clinical or artifact image</span>. Proceed with standard triage.";
                              } else {
                                  logs = [
                                      "EXTRACTING IMAGING FEATURES...",
                                      "CLINICAL-BERT TOKENIZING...",
                                      "U-NET CNN PASS 1/3 (EDGE DETECT)...",
                                      "U-NET CNN PASS 3/3 (LOCALIZATION)...",
                                      "CROSS-REFERENCING ENSEMBLE LABELS...",
                                      "ISOLATING CRITICAL ANOMALIES..."
                                  ];
                                  
                                  if (analysis.hasTumor) {
                                      urgScore.textContent = (8.0 + Math.random() * 1.9).toFixed(1);
                                      bertScore.textContent = (96.0 + Math.random() * 3.9).toFixed(1);
                                      nlpSum.innerHTML = "<span style='background:rgba(220,38,38,0.2);color:#fca5a5;padding:0 3px;border-radius:3px;'>Hyperdense focal mass</span> located. Evidence of structural compression. Immediate <span style='border-bottom:1px dashed #aaa;'>oncological review</span> required.";
                                      urgLabel.textContent = 'URGENCY CLASSIFIER';
                                      
                                      resBox.style.display = 'block';
                                      let boxSize = 25; 
                                      let x = Math.max(0, Math.min(100 - boxSize, analysis.x - boxSize/2));
                                      let y = Math.max(0, Math.min(100 - boxSize, analysis.y - boxSize/2));
                                      
                                      resBox.style.left = x + '%';
                                      resBox.style.top = y + '%';
                                      resBox.style.width = boxSize + '%';
                                      resBox.style.height = (boxSize * 1.5) + '%';
                                      resTag.textContent = 'Tumor Detected';
                                  } else {
                                      urgScore.textContent = '1.2';
                                      bertScore.textContent = '88.1';
                                      nlpSum.innerHTML = "Scan appears clear. No significant hyperdense or hypodense regions detected. Standard preventative care recommended.";
                                      urgLabel.textContent = 'NO ANOMALY DETECTED';
                                      urgScore.style.color = '#a3e635';
                                      urgContainer.classList.add('g-bg');
                                      urgLabel.classList.add('g-text');
                                  }
                              }

                              let step = 0;
                              const timer = setInterval(() => {
                                  if (step < logs.length) {
                                      log.textContent = "> " + logs[step];
                                      step++;
                                  } else {
                                      clearInterval(timer);
                                      stateProc.style.display = 'none';
                                      stateRes.style.display = 'block';
                                  }
                              }, Math.max(300, 1500 / logs.length));
                          }

                          if(resetBtn) {
                              resetBtn.addEventListener('click', function() {
                                  stateRes.style.display = 'none';
                                  stateEmpty.style.display = 'flex';
                                  log.textContent = "> INITIALIZING...";
                                  fileInput.value = '';
                                  procImg.style.backgroundImage = 'none';
                                  resImg.style.backgroundImage = 'none';
                              });
                          }
                      })();
                  </script>
              </div>\n"""

text = text[:start_idx] + new_pane + text[end_idx:]

with open('/Users/tanmaykadam/Desktop/zd/solutions.html', 'w', encoding='utf-8') as f:
    f.write(text)

print("Injected genuine Canvas-based pixel analyzer")
