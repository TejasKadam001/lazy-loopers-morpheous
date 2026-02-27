from bs4 import BeautifulSoup
import os

with open("about.html", "r", encoding="utf-8") as f:
    soup = BeautifulSoup(f.read(), "html.parser")

# Delete the 4 large company-ceo sections we added
ceo_sections = soup.find_all("section", class_="section_company-ceo")
for sec in ceo_sections:
    sec.decompose()

# Define the 4 team members
team_data = [
    {
        "name": "Tejas Kadam",
        "role": "Founder & CEO",
        "desc": "Leading the charge at Sero to revolutionize medical triage and build instantaneous AI systems for clinical diagnostics."
    },
    {
        "name": "Shruti Panchal",
        "role": "Founding Team",
        "desc": "Core architect designing Sero's intuitive interfaces and ensuring seamless interactions for clinical providers."
    },
    {
        "name": "Vaibhav Marne",
        "role": "Founding Team",
        "desc": "Systems engineer optimizing clinical data pathways, integrations, and platform reliability."
    },
    {
        "name": "Gayatri Yadav",
        "role": "Founding Team",
        "desc": "Medical researcher validating diagnostic algorithms and bridging the gap between clinical intent and AI execution."
    }
]

# Generate a new elegant 4-column grid section
html_section = """
<section class="section_company-team" style="padding: 6rem 2rem; background-color: #000; color: #fff;">
  <div class="container" style="max-width: 1200px; margin: 0 auto;">
    <h2 style="font-size: 2.5rem; font-weight: 500; margin-bottom: 3rem; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 1rem;">Founding Team</h2>
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 2rem;">
"""

placeholder_img = "images/698a39f53eea950d493dc631_IMG_7464.webp"

for member in team_data:
    html_section += f"""
      <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 1.5rem; display: flex; flex-direction: column; gap: 1rem; transition: transform 0.2s; cursor: pointer;">
        <img src="{placeholder_img}" alt="{member['name']}" style="width: 100%; aspect-ratio: 1; object-fit: cover; border-radius: 8px;" />
        <div>
            <h4 style="font-size: 1.25rem; font-weight: 600; margin: 0;">{member['name']}</h4>
            <p style="font-size: 0.95rem; color: #c4c4c4; margin: 0.25rem 0 1rem 0;">{member['role']}</p>
            <p style="font-size: 0.9rem; color: #9a9a9a; line-height: 1.5; margin: 0;">{member['desc']}</p>
        </div>
      </div>
    """

html_section += """
    </div>
  </div>
</section>
"""

new_soup = BeautifulSoup(html_section, "html.parser")

main_wrapper = soup.find("div", class_="main-wrapper")
investor_section = soup.find("section", class_="section_company-investor")

if investor_section:
    investor_section.insert_before(new_soup)
elif main_wrapper:
    main_wrapper.append(new_soup)

with open("about.html", "w", encoding="utf-8") as f:
    f.write(str(soup))
    
print("Successfully generated 4-column team grid.")
