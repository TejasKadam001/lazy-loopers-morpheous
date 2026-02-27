from bs4 import BeautifulSoup
import copy

with open("about.html", "r", encoding="utf-8") as f:
    soup = BeautifulSoup(f.read(), "html.parser")

# 1. Find the existing section_company-ceo block (which currently houses Tejas Kadam)
ceo_section = soup.find("section", class_="section_company-ceo")

if not ceo_section:
    print("CEO section not found.")
    exit(1)

# Ensure it's not nested inside something that would break. We will just locate its parent.
parent_container = ceo_section.parent

# 2. Extract the actual CEO block as a template
ceo_template = copy.copy(ceo_section)

# 3. Find and remove the old "Founding Team" section entirely to make room for our new linear layout
team_section = soup.find("section", class_="section_company-team")
if team_section:
    team_section.decompose()

# 4. Remove the original CEO section from the DOM so we can rebuild it purely from our data array
ceo_section.decompose()

# Data array for our 4 team members
team_data = [
    {
        "name": "Tejas Kadam",
        "role": "Founder & CEO",
        "desc": "Leading the charge at Sero to revolutionize medical triage and build instantaneous AI systems for clinical diagnostics.",
        "linkedin": "#",
        "x": "#"
    },
    {
        "name": "Shruti Panchal",
        "role": "Founding Team",
        "desc": "Core architect designing Sero's intuitive interfaces and ensuring seamless interactions for clinical providers.",
        "linkedin": "#",
        "x": "#"
    },
    {
        "name": "Vaibhav Marne",
        "role": "Founding Team",
        "desc": "Systems engineer optimizing clinical data pathways, integrations, and platform reliability.",
        "linkedin": "#",
        "x": "#"
    },
    {
        "name": "Gayatri Yadav",
        "role": "Founding Team",
        "desc": "Medical researcher validating diagnostic algorithms and bridging the gap between clinical intent and AI execution.",
        "linkedin": "#",
        "x": "#"
    }
]

# 5. Build and insert the new blocks
# We will insert them right before the next section. Wait, we know the original ceo_section was a child of parent_container.
# Let's find the investor section so we can insert *before* it, or just append to main-wrapper.
main_wrapper = soup.find("div", class_="main-wrapper")
investor_section = soup.find("section", class_="section_company-investor")

for idx, member in enumerate(team_data):
    # Clone the template
    new_block = copy.copy(ceo_template)
    
    # Update Name
    name_tag = new_block.find("h4", class_="text-weight-medium")
    if name_tag:
        name_tag.string = member["name"]
        
    # Update Role
    role_tag = new_block.find("p", class_="t-paragraph-20")
    if role_tag:
        role_tag.string = member["role"]
        
    # Update Description
    desc_tag = new_block.find("p", class_="t-paragraph-16")
    if desc_tag:
        desc_tag.string = member["desc"]
        
    # Let's also add some margin bottom so they don't stick directly to each other
    if idx < len(team_data) - 1:
        # Add internal style margin Bottom
        current_style = new_block.get('style', '')
        new_block['style'] = current_style + " margin-bottom: 2rem;"
        
    # Insert back into DOM
    if investor_section:
        investor_section.insert_before(new_block)
    else:
        main_wrapper.append(new_block)

# 6. Write out the changes
with open("about.html", "w", encoding="utf-8") as f:
    f.write(str(soup))

print("Successfully injected all 4 team members with pictures!")

