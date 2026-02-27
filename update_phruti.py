from bs4 import BeautifulSoup
import re

with open("solutions.html", "r", encoding="utf-8") as f:
    html = f.read()

soup = BeautifulSoup(html, "html.parser")

# Update Title and Meta 
if soup.title:
    soup.title.string = "Sero | Solutions and Products"

# 1. Update Hero Section
# Find H1
h1 = soup.find("h1")
if h1:
    h1.string = "A Fully Integrated Clinical Ecosystem"

# Find paragraph under H1
hero_p = soup.find("div", class_=re.compile(r"max-width _66ch"))
if hero_p and hero_p.p:
    hero_p.p.string = "Seamlessly connecting patients, providers, and emergency logistics with zero latency. Sero checks symptoms, handles OCR for documents, and provides specialized diagnostic pathways."

# Find "SOLUTIONS BY WORKFLOW"
sol_wf = soup.find("p", string=re.compile(r"SOLUTIONS BY WORKFLOW", re.IGNORECASE))
if sol_wf:
    sol_wf.string = "SOLUTIONS AND PRODUCTS"

# Update buttons to GET A DEMO
for btn in soup.find_all('a', class_=re.compile('.*c-button.*')):
    if "BOOK A DEMO" in btn.text.upper() or "GET DEMO" in btn.text.upper():
        pass # Fine as is
        
# 2. Update Tabs Menu
tabs_menu = soup.find('div', class_='solutions-tabs-menu')
if tabs_menu:
    tabs = tabs_menu.find_all('a', class_='solutions-tabs-link')
    tab_names = ['Voice Triage', 'SLM Chat', 'Doc Upload', 'Specialty', 'AI Content']
    for idx, tab in enumerate(tabs[:4]):
        label = tab.find('div', class_='solutions-tabs-link_label')
        if label:
            label.string = tab_names[idx]
        tab['data-w-tab'] = tab_names[idx]
    
    # Remove 5th tab menu item
    if len(tabs) > 4:
        tabs[4].decompose()

# 3. Update Tab Content Panels
tabs_content = soup.find('div', class_='solutions-tabs-content')
if tabs_content:
    panels = tabs_content.find_all('div', class_='solutions-tabs-panel')
    
    panel_data = [
        {
            "id": "Voice Triage",
            "title": "Voice-Activated Triage",
            "today": "Symptom reporting is manual, tedious, and patients struggle to explain their condition.",
            "sero": "Hands-free symptom reporting using Sarvam AI for highly accurate, regional language processing. Patients speak naturally, Sero understands."
        },
        {
            "id": "SLM Chat",
            "title": "Medical SLM Live Chat",
            "today": "Patients wait hours for basic consultations or rely on generic, unsafe web searches for therapy.",
            "sero": "An on-demand AI assistant and therapist powered by specialized Small Language Models for safe, hallucination-free psychological and medical support."
        },
        {
            "id": "Doc Upload",
            "title": "Smart Document Upload",
            "today": "Doctors spend valuable time manually reading through unorganized, handwritten past prescriptions and test reports.",
            "sero": "An OCR-powered system where users upload test reports and handwritten prescriptions, which the AI instantly converts into a Clinical Executive Summary."
        },
        {
            "id": "Specialty",
            "title": "Specialty Diagnostics",
            "today": "Specialized care requires dedicated appointments. Initial lesion analysis or maternal tracking is largely offline.",
            "sero": "Dedicated AI pathways specifically for Maternal Health, Menstrual Tracking, and Dermatology (visual lesion analysis)."
        }
    ]

    for idx, panel in enumerate(panels[:4]):
        # Update datta-w-tab
        panel['data-w-tab'] = panel_data[idx]['id']
        
        # Title
        h2 = panel.find('h2')
        if h2:
            h2.string = panel_data[idx]['title']
            
        groups = panel.find_all('div', class_='solutions-tabs-grid_left-group')
        if len(groups) >= 2:
            # First group (Today)
            today_p = groups[0].find('p')
            if today_p:
                today_p.string = panel_data[idx]['today']
            
            # Second group (With Sero)
            sero_h5 = groups[1].find('h5')
            if sero_h5:
                sero_h5.string = "With Sero"
            sero_p = groups[1].find('p')
            if sero_p:
                sero_p.string = panel_data[idx]['sero']
                
        # Update the tags
        if len(groups) >= 3:
            who_uses_h5 = groups[2].find('h5')
            if who_uses_h5:
                 who_uses_h5.string = "Use Cases"
            tags = groups[2].find_all('div', class_='tag')
            tag_texts = ["Patients", "Providers", "Hospitals"]
            for tag_idx, tag in enumerate(tags):
                label = tag.find('div', class_='font-family-fono')
                if label and tag_idx < len(tag_texts):
                    label.string = tag_texts[tag_idx]

    # Remove 5th panel
    if len(panels) > 4:
        panels[4].decompose()
        
# 4. Remove ZeroDrift references in navbar and footer
# Navbar logo
logo = soup.find('img', class_='navbar12_logo')
if logo:
    # Just replace it with a text logo for now to keep the brand
    text_logo = soup.new_tag("strong", style="color: white; font-size: 1.5rem; font-weight: 600; font-family: 'Inter', sans-serif;")
    text_logo.string = "Sero"
    logo.replace_with(text_logo)

# Footer logo
footer_logo = soup.find('img', class_='footer-logo')
if footer_logo:
    text_logo = soup.new_tag("strong", style="color: black; font-size: 1.5rem; font-weight: 600; font-family: 'Inter', sans-serif;")
    text_logo.string = "Sero"
    footer_logo.replace_with(text_logo)
    
# Footer Copyright
for p in soup.find_all('p', class_='text-color-7d7d7d'):
    if 'ZeroDrift' in p.text:
        p.string = "© 2026 Sero. All rights reserved."

with open("solutions.html", "w", encoding="utf-8") as f:
    f.write(str(soup))

print("DOM correctly modified.")
