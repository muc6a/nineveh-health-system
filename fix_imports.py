import re

with open('src/pages/TeamDashboard.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace("import { Compass, Mail, Activity, useState, useContext, useMemo } from 'react';", "import React, { useState, useContext, useMemo } from 'react';")
content = content.replace("import { Plus, Search", "import { Compass, Mail, Plus, Search")

with open('src/pages/TeamDashboard.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

