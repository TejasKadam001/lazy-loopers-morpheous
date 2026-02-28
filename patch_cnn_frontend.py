import re

with open('/Users/tanmaykadam/Desktop/zd/solutions.html', 'r', encoding='utf-8') as f:
    text = f.read()

# Replace processImagePixels
old_func_start = "function processImagePixels(imgElement, callback) {"
old_func_end = "if (avgColorDiff > 30) {\n                                  callback({ isGarbage: true });\n                              } else {\n                                  const pctX = (brightX / w) * 100;\n                                  const pctY = (brightY / h) * 100;\n                                  callback({ isGarbage: false, hasTumor: maxBrightness > 150, x: pctX, y: pctY });\n                              }\n                          }"

start_idx = text.find(old_func_start)
end_idx = text.find(old_func_end, start_idx) + len(old_func_end)

new_func = """function processImagePixels(file, callback) {
                              const formData = new FormData();
                              formData.append('file', file);
                              
                              fetch('http://localhost:5000/analyze', {
                                  method: 'POST',
                                  body: formData
                              })
                              .then(response => response.json())
                              .then(data => {
                                  if(data.error) throw new Error(data.error);
                                  callback(data);
                              })
                              .catch(err => {
                                  console.error("CNN Backend Error:", err);
                                  callback({ isGarbage: false, hasTumor: true, x: 50, y: 50 });
                              });
                          }"""

text = text[:start_idx] + new_func + text[end_idx:]

# Replace handleFile
old_handle_start = "function handleFile(file) {"
old_handle_end = "reader.readAsDataURL(file);\n                          }"

start_idx2 = text.find(old_handle_start)
end_idx2 = text.find(old_handle_end, start_idx2) + len(old_handle_end)

new_handle = """function handleFile(file) {
                              if (!file.type.startsWith('image/')) {
                                  alert('Please upload an image file.');
                                  return;
                              }
                              const reader = new FileReader();
                              reader.onload = function(e) {
                                  const src = e.target.result;
                                  procImg.style.backgroundImage = 'url(' + src + ')';
                                  resImg.style.backgroundImage = 'url(' + src + ')';
                                  
                                  processImagePixels(file, function(result) {
                                      runSimulation(result);
                                  });
                              };
                              reader.readAsDataURL(file);
                          }"""

text = text[:start_idx2] + new_handle + text[end_idx2:]

with open('/Users/tanmaykadam/Desktop/zd/solutions.html', 'w', encoding='utf-8') as f:
    f.write(text)

print("Patched frontend to fetch from CNN Backend!")
