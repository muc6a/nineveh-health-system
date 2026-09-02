with open('src/pages/ExecutivePortal.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

lines = content.split('\n')
start = max(0, 1108 - 25)
end = min(len(lines), 1108 + 5)
print("ExecutivePortal snippet around 1108:")
for i in range(start, end):
    print(f"{i+1}: {lines[i]}")
