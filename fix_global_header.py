import re

path = "src/components/GlobalHeader.jsx"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

pattern = r"    return \(\n    <div className=\"flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8 relative z-40\">"
replacement = """    return () => clearInterval(timer);
  }, []);

  const dayName = new Intl.DateTimeFormat('ar-IQ', { weekday: 'long' }).format(now);
  const gregorian = new Intl.DateTimeFormat('ar-IQ', { day: 'numeric', month: 'long', year: 'numeric' }).format(now);
  const numericDate = new Intl.DateTimeFormat('en-GB').format(now);
  const hijri = new Intl.DateTimeFormat('ar-SA-u-ca-islamic', { day: 'numeric', month: 'long', year: 'numeric' }).format(now);
  const time = new Intl.DateTimeFormat('ar-IQ', { hour: '2-digit', minute: '2-digit', hour12: true }).format(now).replace('AM', 'ص').replace('PM', 'م').replace('am', 'ص').replace('pm', 'م');

  return (
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8 relative z-40">"""
content = re.sub(pattern, replacement, content)

with open(path, "w", encoding="utf-8") as f:
    f.write(content)

print("Fixed GlobalHeader")
