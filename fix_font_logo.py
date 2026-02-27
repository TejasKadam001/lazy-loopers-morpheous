from bs4 import BeautifulSoup
import os

# 1. Update font to sans-serif purely on about.html
try:
    with open("about.html", "r", encoding="utf-8") as f:
        about_soup = BeautifulSoup(f.read(), "html.parser")
        
    # Inject a global sans-serif style specifically overriding whatever the Kooko template had
    font_style = "<style> body, h1, h2, h3, h4, h5, h6, p, a, div, span { font-family: sans-serif !important; } </style>"
    about_soup.head.append(BeautifulSoup(font_style, "html.parser"))
    
    with open("about.html", "w", encoding="utf-8") as f:
        f.write(str(about_soup))
    print("Successfully set font to sans-serif on about.html")
except Exception as e:
    print(f"Failed to update font on about.html: {e}")

# 2. Fix the Sero logo alignment on solutions.html, wellbeing.html, and about.html (BUT NOT index.html)
files_to_fix = ["solutions.html", "wellbeing.html", "about.html"]

for filepath in files_to_fix:
    try:
        with open(filepath, "r", encoding="utf-8") as f:
            soup = BeautifulSoup(f.read(), "html.parser")
            
        # Hard-force vertical alignment mathematically.
        # Find the container that holds the logo link.
        logo_links = soup.find_all("a", class_="navbar12_logo-link")
        for ll in logo_links:
            # We want to ensure it's absolutely centered relative to the navbar.
            # Some webflow templates have weird line-heights or margins on the text itself.
            ll["style"] = "display: flex; align-items: center; justify-content: center; height: 100%; text-decoration: none; padding-bottom: 0px;"
            
            # If Sero is inside an h3 or strong, kill any margin/padding/line-height anomalies.
            for tag in ["span", "strong", "h3", "h4"]:
                inner_text_node = ll.find(tag)
                if inner_text_node:
                    # Let's override its styling to be pure text with no box-model complications
                    inner_text_node["style"] = "color: white; font-size: 1.25rem; line-height: 1; display: inline-flex; align-items: center; margin: 0; padding: 0; position: relative; top: 0px;"

        with open(filepath, "w", encoding="utf-8") as f:
            f.write(str(soup))
            
        print(f"Fixed Sero logo alignment on {filepath}")

    except Exception as e:
        print(f"Failed to update logo alignment on {filepath}: {e}")

