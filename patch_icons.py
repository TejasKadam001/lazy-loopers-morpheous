import re

with open('/Users/tanmaykadam/Desktop/zd/index.html', 'r', encoding='utf-8') as f:
    text = f.read()

# Define new SVGs
pytorch_svg = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="100%" height="100%"><path fill="#EE4C2C" d="M125.7 13.9C104.9 3.5 83.2 24.3 84.6 47.9c.4 7.2 2.9 14 7 19.9l31.4-17.5c2.4-1.3 5.4 0 5.4 2.8v34.1h.4V53.2c0-2.8 3-4.1 5.4-2.8l31.4 17.5c4.1-5.9 6.6-12.7 7-19.9 1.4-23.6-20.3-44.4-41.1-34.1l-6-5.8zM240 76.7c-17.7-15.6-45.7-1.1-45 22.4.2 7.2 2.7 14 6.8 19.9l-31.4-17.5c-2.4-1.3-5.4 0-5.4 2.8v34.1h-.4V104.2c0-2.8-3-4.1-5.4-2.8l-31.4 17.5c-4.1-5.9-6.6-12.7-7-19.9-.7-23.5-28.7-38-46.4-22.4L64.2 82.2c16.5-16.8 44.4-4.8 44.2 19 .1-7.2-2.4-14-6.5-19.9l31.4 17.5c2.4 1.3 5.3 0 5.4-2.8V61.9h.4v34.1c0 2.8 3 4.1 5.3 2.8l31.4-17.5c4.1 5.9 6.6 12.7 6.5 19.9-.2-23.8 27.7-35.8 44.2-19l19.3-5.5zM140.2 243.6c20.8 10.4 42.5-10.4 41.1-34-.4-7.2-2.9-14-7-19.9l-31.4 17.5c-2.4 1.3-5.4 0-5.4-2.8v-34.1h-.4v34.1c0 2.8-3 4.1-5.4 2.8l-31.4-17.5c-4.1 5.9-6.6 12.7-7 19.9-1.4 23.6 20.3 44.4 41.1 34l6 5.8z" /></svg>"""

tensorflow_svg = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="100%" height="100%"><path fill="#FF6F00" d="M22.82 108.79l9.31-7.81L113.8 54.89v23.4l-64.84 41.15z"/><path fill="#FFA800" d="M113.8 78.29l64.84 41.15v25.21L113.8 103.5zm0 25.21l47.58 30.13v25.21l-47.58-30.13z"/><path fill="#FF6F00" d="M113.8 128.71l47.58 30.13V184l-47.58-30.13zM66.42 127l47.38-30.01v25.12L66.42 152.1z"/><path fill="#FFD15B" d="M128 35.53L48.96 85.58v41.15l17.46-11.08v-19l61.58-39 61.58 39v60l-44.12 28v-19L113.8 145v9l23.18-14.7v50.41l-23.18 14.7v9.06l14.2 9.06 61.54-39.11V85.58z"/><path fill="#FF6F00" d="M128 35.53L113.8 44.53v180.1l14.2 9.06 14.2-9.06V44.53C142.2 35.53 128 35.53 128 35.53z"/></svg>"""

python_svg = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="100%" height="100%"><path fill="#3776AB" d="M128 15c-55.9 0-52 24.1-52 24.1v25.7h53.7v7.6H72.8C45.3 72.4 42 98.4 42 98.4s-3.7 26.5 24 35.5h16.2v-23S81 83 95.8 83h53s20.9-1.2 20.9-20.5V36.7C169.7 17.5 151 15 151 15h-23ZM101.4 34.3c4.1 0 7.4 3.3 7.4 7.4 0 4.1-3.3 7.4-7.4 7.4a7.4 7.4 0 0 1-7.4-7.4c0-4.1 3.3-7.4 7.4-7.4Z"/><path fill="#FFD43B" d="M128 241c55.9 0 52-24.1 52-24.1v-25.7H126.3v-7.6h56.9c27.5 0 30.8-26 30.8-26s3.7-26.5-24-35.5h-16.2v23s1.2 27.9-13.6 27.9h-53s-20.9 1.2-20.9 20.5v25.8c0 19.2 18.7 21.7 18.7 21.7h23Zm26.6-19.3a7.4 7.4 0 0 1-7.4-7.4c0-4.1 3.3-7.4 7.4-7.4 4.1 0 7.4 3.3 7.4 7.4 0 4.1-3.3 7.4-7.4 7.4Z"/></svg>"""

react_svg = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="-11.5 -10.23174 23 20.46348" width="100%" height="100%"><circle cx="0" cy="0" r="2.05" fill="#61DAFB"/><g stroke="#61DAFB" stroke-width="1" fill="none"><ellipse rx="11" ry="4.2"/><ellipse rx="11" ry="4.2" transform="rotate(60)"/><ellipse rx="11" ry="4.2" transform="rotate(120)"/></g></svg>"""

brain_cnn_svg = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="100%" height="100%" fill="none" stroke="#A78BFA" stroke-width="1.5"><path d="M14 6c0-2-1-3-3-3S8 4 8 6s.5 2 2 3c-1.5 1-2.5 3-2.5 5 0 3 2 5 4 5s4-2 4-5c0-2-1-4-2.5-5 1.5-1 2-1 2-3Z"/><circle cx="11.5" cy="11.5" r="1.5"/><path d="M11.5 13v3m-2-4.5H8m5 0h1.5"/></svg>"""

# Replace in pairs
social_icon_starts = [m.start() for m in re.finditer(r'<div class="social-icon">', text)]

if len(social_icon_starts) >= 5:
    for i, svg_code in enumerate([pytorch_svg, tensorflow_svg, python_svg, react_svg, brain_cnn_svg]):
        start_idx = text.find('<div class="icon-1x1-xxlarge w-embed">', social_icon_starts[i]) + len('<div class="icon-1x1-xxlarge w-embed">')
        end_idx = text.find('</div>', start_idx)
        text = text[:start_idx] + svg_code + text[end_idx:]

with open('/Users/tanmaykadam/Desktop/zd/index.html', 'w', encoding='utf-8') as f:
    f.write(text)

print("Icons swapped successfully!")
