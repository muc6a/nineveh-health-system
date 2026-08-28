import re

filepath = "/Users/admin/web/منظومة الرقابة الصحية الرقمية/src/components/AnimatedLogo.jsx"
with open(filepath, "r", encoding="utf-8") as f:
    content = f.read()

# Change video path
content = content.replace("const baseVideoPath = '/logo-animated.mp4';", "const baseVideoPath = '/logo-black.mp4';")

# Update 'login' variant
target_login = """        <video
          src={baseVideoPath}
          autoPlay
          loop
          muted
          playsInline
          className="w-48 h-48 md:w-56 md:h-56 object-contain z-10 drop-shadow-[0_15px_15px_rgba(13,148,136,0.2)] transition-transform duration-500 hover:scale-105 mix-blend-multiply dark:invert dark:mix-blend-screen rounded-full"
          style={{ clipPath: 'circle(49% at 50% 50%)' }}
        />"""

replacement_login = """        <video
          src={baseVideoPath}
          autoPlay
          loop
          muted
          playsInline
          className="w-48 h-48 md:w-56 md:h-56 object-cover z-10 drop-shadow-[0_15px_15px_rgba(13,148,136,0.2)] transition-transform duration-500 hover:scale-105 invert mix-blend-multiply dark:invert-0 dark:mix-blend-screen rounded-full border-none outline-none bg-transparent"
        />"""
content = content.replace(target_login, replacement_login)

# Update 'sidebar' variant
target_sidebar = """          <video
            src={baseVideoPath}
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover scale-110 mix-blend-multiply dark:invert dark:mix-blend-screen"
          />"""

replacement_sidebar = """          <video
            src={baseVideoPath}
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover scale-110 invert mix-blend-multiply dark:invert-0 dark:mix-blend-screen rounded-xl border-none outline-none bg-transparent"
          />"""
content = content.replace(target_sidebar, replacement_sidebar)

# Update 'seal' variant
target_seal = """            <video
              src={baseVideoPath}
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover mix-blend-multiply dark:invert dark:mix-blend-screen"
            />"""

replacement_seal = """            <video
              src={baseVideoPath}
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover invert mix-blend-multiply dark:invert-0 dark:mix-blend-screen rounded-full border-none outline-none bg-transparent"
            />"""
content = content.replace(target_seal, replacement_seal)

with open(filepath, "w", encoding="utf-8") as f:
    f.write(content)
print("Updated AnimatedLogo.jsx")
