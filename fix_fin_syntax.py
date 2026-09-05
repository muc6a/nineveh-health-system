with open("src/components/FinancialReports.jsx", "r", encoding="utf-8") as f:
    content = f.read()

# Replace the incorrect end
content = content.replace("      </div>\n    </div>}\n  );\n};", "      </div>}\n    </div>\n  );\n};")
content = content.replace("      </div>\n    </div>}\n", "      </div>}\n    </div>\n")
content = content.replace("    </div>}\n  );\n};", "      </div>}\n    </div>\n  );\n};")

with open("src/components/FinancialReports.jsx", "w", encoding="utf-8") as f:
    f.write(content)

print("Syntax fixed")
