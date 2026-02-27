from bs4 import BeautifulSoup

files_to_update = ["index.html", "solutions.html", "wellbeing.html"]

modern_footer_html = """
<footer class="footer" style="padding: 4rem 2rem; background-color: #000; border-top: 1px solid rgba(255,255,255,0.05); font-family: sans-serif; color: #fff;">
  <div style="max-width: 1200px; margin: 0 auto; display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 3rem;">
    <!-- Column 1: Brand -->
    <div style="display: flex; flex-direction: column; gap: 1rem;">
      <a href="/index.html" style="font-size: 1.5rem; font-weight: 700; color: #fff; text-decoration: none; letter-spacing: -0.02em;">Sero</a>
      <p style="color: #7d7d7d; font-size: 0.95rem; line-height: 1.5; margin: 0; max-width: 250px;">
        The Clinical AI Diagnostic Engine. Better data, faster care, instantly.
      </p>
    </div>
    
    <!-- Column 2: Platform -->
    <div style="display: flex; flex-direction: column; gap: 1rem;">
      <h4 style="font-size: 1rem; font-weight: 600; margin: 0;">Platform</h4>
      <div style="display: flex; flex-direction: column; gap: 0.75rem;">
        <a href="/index.html" style="color: #a1a1a1; text-decoration: none; font-size: 0.95rem; transition: color 0.2s;">Home</a>
        <a href="/solutions.html" style="color: #a1a1a1; text-decoration: none; font-size: 0.95rem; transition: color 0.2s;">Solutions</a>
      </div>
    </div>

    <!-- Column 3: Resources -->
    <div style="display: flex; flex-direction: column; gap: 1rem;">
      <h4 style="font-size: 1rem; font-weight: 600; margin: 0;">Resources</h4>
      <div style="display: flex; flex-direction: column; gap: 0.75rem;">
        <a href="/wellbeing.html" style="color: #a1a1a1; text-decoration: none; font-size: 0.95rem; transition: color 0.2s;">Knowledge Hub</a>
        <a href="/about.html" style="color: #a1a1a1; text-decoration: none; font-size: 0.95rem; transition: color 0.2s;">About Us</a>
      </div>
    </div>

    <!-- Column 4: Contact -->
    <div style="display: flex; flex-direction: column; gap: 1rem;">
      <h4 style="font-size: 1rem; font-weight: 600; margin: 0;">Connect</h4>
      <div style="display: flex; flex-direction: column; gap: 0.75rem;">
        <a href="mailto:hello@sero.ai" style="color: #a1a1a1; text-decoration: none; font-size: 0.95rem; transition: color 0.2s;">hello@sero.ai</a>
      </div>
    </div>
  </div>
  
  <div style="max-width: 1200px; margin: 3rem auto 0; padding-top: 2rem; border-top: 1px solid rgba(255,255,255,0.1); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
    <p style="color: #7d7d7d; font-size: 0.85rem; margin: 0;">&copy; 2026 Sero. All rights reserved.</p>
    <div style="display: flex; gap: 1.5rem;">
      <a href="#" style="color: #7d7d7d; text-decoration: none; font-size: 0.85rem;">Privacy Policy</a>
      <a href="#" style="color: #7d7d7d; text-decoration: none; font-size: 0.85rem;">Terms of Service</a>
    </div>
  </div>
</footer>
"""

for filepath in files_to_update:
    try:
        with open(filepath, "r", encoding="utf-8") as f:
            soup = BeautifulSoup(f.read(), "html.parser")
            
        # 1. Update the footer
        old_footer = soup.find("footer", class_="footer")
        if old_footer:
            new_footer_soup = BeautifulSoup(modern_footer_html, "html.parser")
            old_footer.replace_with(new_footer_soup)
            
        # 2. Fix the Sero text logo vertical alignment in the navbar
        # It's an a tag with class navbar12_logo-link containing the text "Sero" usually inside an h3 or directly
        logo_links = soup.find_all("a", class_="navbar12_logo-link")
        for ll in logo_links:
            # Force flexbox centering on the link container itself
            ll["style"] = "display: flex; align-items: center; justify-content: center; height: 100%; text-decoration: none;"
            
            # If Sero is inside an h3, also format the h3 just in case
            h3_logo = ll.find("h3")
            if h3_logo:
                h3_logo["style"] = "margin: 0; padding: 0; line-height: 1; display: flex; align-items: center;"
        
        # 3. Add 'About Us' to the standard navbar if it's missing
        # The navbar links are within <nav class="navbar12_menu ..."> -> <div class="navbar12_menu-links">
        nav_links_container = soup.find("div", class_="navbar12_menu-links")
        if nav_links_container:
            # Check if About Us already exists
            about_exists = False
            for a in nav_links_container.find_all("a"):
                if "About Us" in a.text:
                    about_exists = True
                    break
            
            if not about_exists:
                # Build the new link exactly like existing links
                about_link_html = '<a href="/about.html" class="navbar12_link w-inline-block"><div class="navbar12_link-label">About Us</div></a>'
                about_soup = BeautifulSoup(about_link_html, "html.parser")
                nav_links_container.append(about_soup)

        with open(filepath, "w", encoding="utf-8") as f:
            f.write(str(soup))
            
        print(f"Updated footer, navbar logo alignment, and added About Us link on {filepath}")

    except Exception as e:
        print(f"Failed to process {filepath}: {e}")

