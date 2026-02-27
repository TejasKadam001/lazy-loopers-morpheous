from bs4 import BeautifulSoup
import os

# 1. Load the "Sero" template (to extract Sero's standard navbar and the new footer)
with open("index.html", "r", encoding="utf-8") as f:
    sero_soup = BeautifulSoup(f.read(), "html.parser")
    
sero_navbar = sero_soup.find("div", class_="navbar12_component")
sero_footer = sero_soup.find("footer", class_="footer")

if not sero_navbar or not sero_footer:
    print("Error: Could not find Sero's navbar or footer in index.html")
    exit(1)

# 2. Load the "Kooko" template which will become the "About Us" page
with open("kooko/index.html", "r", encoding="utf-8") as f:
    about_soup = BeautifulSoup(f.read(), "html.parser")

# Replace the Kooko navbar with the Sero navbar
kooko_navbar = about_soup.find("div", class_="navbar12_component")
if kooko_navbar:
    kooko_navbar.replace_with(BeautifulSoup(str(sero_navbar), "html.parser"))

# Replace the Kooko footer with the Sero footer
kooko_footer = about_soup.find("footer", class_="footer")
if kooko_footer:
    kooko_footer.replace_with(BeautifulSoup(str(sero_footer), "html.parser"))

# 3. Update the content to reflect Sero instead of Kooko
# Make title Sero
title_tag = about_soup.find("title")
if title_tag:
    title_tag.string = "About Us | Sero Ecosystem"

# Hero Text
hero_h1 = about_soup.find("h1")
if hero_h1:
    hero_h1.string = "We're building the infrastructure for the next generation of clinical triage."
hero_p = about_soup.find("p", string=lambda s: s and "COMPANY" in s)
if hero_p:
    hero_p.string = "ABOUT US"

# Replace Kumesh section with Tejas Kadam as the CEO/Lead
ceo_name = about_soup.find("h4", string=lambda s: s and "Kumesh Aroomoogan" in s)
if ceo_name:
    ceo_name.string = "Tejas Kadam"
ceo_desc = about_soup.find("p", class_="t-paragraph-16")
if ceo_desc:
    ceo_desc.string = "Leading the charge at Sero to revolutionize medical triage and build instantaneous AI systems for clinical diagnostics."

# Update the "Founding Team" section to include Vaibhav Marne, Shruti Panchal, and Gayatri Yadav
# In the original, there are a tags holding image assets for the team.
peoples_container = about_soup.find("div", class_="company-team-people")
if peoples_container:
    peoples_container.clear() # Clear the old faces
    # Insert new minimalist blocks for the team members
    team_members = ["Vaibhav Marne", "Shruti Panchal", "Gayatri Yadav"]
    
    # We will just inject some clean typography divs instead of broken image links
    for name in team_members:
        member_html = f'''
        <div style="background: rgba(255,255,255,0.05); padding: 2rem; border-radius: 8px; border: 1px solid rgba(255,255,255,0.1); width: 100%; max-width: 300px; margin-bottom: 1rem;">
            <div class="t-paragraph-20 text-weight-medium">{name}</div>
            <div class="t-paragraph-16 text-color-7d7d7d" style="margin-top: 0.5rem;">Core Founding Team</div>
        </div>
        '''
        peoples_container.append(BeautifulSoup(member_html, "html.parser"))

# Change the "Founding Team" intro text
intro_text = about_soup.find("div", class_="max-width _50ch")
if intro_text:
    p_intro = intro_text.find("p")
    if p_intro:
        p_intro.string = "We are an ambitious team of engineers, medical researchers, and designers committed to creating the clinical standard of the future."

# Write to about.html in the root
with open("about.html", "w", encoding="utf-8") as f:
    f.write(str(about_soup))

print("Successfully generated about.html from kooko/index.html, replaced navbar+footer, and updated names.")

