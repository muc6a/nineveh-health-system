with open("index.html", "r", encoding="utf-8") as f:
    content = f.read()

script = """
    <script>
      window.addEventListener('error', function(e) {
        if (e.message && e.message.includes('UnifiedSidebar is not defined')) {
          console.error("Cache issue detected, clearing caches...");
          caches.keys().then(function(names) {
            for (let name of names) caches.delete(name);
          });
          setTimeout(() => window.location.reload(true), 500);
        }
      });
    </script>
"""

if "window.addEventListener('error'" not in content:
    content = content.replace("</head>", script + "</head>")

with open("index.html", "w", encoding="utf-8") as f:
    f.write(content)
