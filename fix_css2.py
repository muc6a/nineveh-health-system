import re

def main():
    with open('src/index.css', 'r', encoding='utf-8') as f:
        code = f.read()

    # We need to replace the body.print-certificate-only block and the body.print-qr-only block
    
    old_css_cert = """  body.print-certificate-only * {
    visibility: hidden;
  }
  body.print-certificate-only .print-only-report, body.print-certificate-only .print-only-report * {
    visibility: visible !important;
  }
  body.print-certificate-only .print-only-report {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    margin: 0;
    padding: 0;
  }
  body.print-certificate-only .print-only-report > *:not(.certificate-wrapper) {
    display: none !important;
  }
  body.print-certificate-only .certificate-wrapper {
    display: flex !important;
    visibility: visible !important;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    align-items: center;
    justify-content: center;
  }"""

    new_css_cert = """  @media print {
    body.print-certificate-only * {
      visibility: hidden;
    }
    body.print-certificate-only .print-only-certificate, 
    body.print-certificate-only .print-only-certificate * {
      visibility: visible !important;
    }
    body.print-certificate-only .print-only-certificate {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      margin: 0;
      padding: 0;
      box-shadow: none !important;
      border: none !important;
      outline: none !important;
      background: white !important;
      transform: none !important;
    }
    .no-print {
      display: none !important;
    }
  }"""
  
    if old_css_cert in code:
        code = code.replace(old_css_cert, new_css_cert)
    else:
        print("old_css_cert not found, appending manually")
        # Let's just find and replace using regex if needed, or we might need to be less specific.
        pass

    old_css_qr = """  body.print-qr-only .main-tab-content {
    display: none !important;
  }
  body.print-qr-only .qr-poster-wrapper {
    display: flex !important;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    align-items: center;
    justify-content: center;
    z-index: 9999;
    background: white;
  }
  @media print {
    .no-print {
      display: none !important;
    }
    @page {
      size: auto;
      margin: 0mm;
    }
    body {
      margin: 0;
      padding: 0;
    }
  }"""
  
    new_css_qr = """  @media print {
    body.print-qr-only * {
      visibility: hidden;
    }
    body.print-qr-only .print-only-qr, 
    body.print-qr-only .print-only-qr * {
      visibility: visible !important;
    }
    body.print-qr-only .print-only-qr {
      position: absolute;
      left: 0;
      top: 0;
      margin: 0;
      padding: 0;
      transform: none !important;
      width: 100% !important;
      height: 100% !important;
    }
    .no-print {
      display: none !important;
    }
    @page {
      size: auto;
      margin: 0mm;
    }
  }"""
  
    if old_css_qr in code:
        code = code.replace(old_css_qr, new_css_qr)
    
    # Just in case they aren't matching perfectly, I will append the CSS fixes to the end
    code += """\n
@media print {
  body.print-certificate-only * { visibility: hidden; }
  body.print-certificate-only .print-only-certificate, body.print-certificate-only .print-only-certificate * { visibility: visible !important; }
  body.print-certificate-only .print-only-certificate { position: absolute; left: 0; top: 0; margin: 0; padding: 0; width: 100%; height: 100%; box-shadow: none !important; outline: none !important; }
  
  body.print-qr-only * { visibility: hidden; }
  body.print-qr-only .print-only-qr, body.print-qr-only .print-only-qr * { visibility: visible !important; }
  body.print-qr-only .print-only-qr { position: absolute; left: 0; top: 0; margin: 0; padding: 0; box-shadow: none !important; }
  
  .no-print { display: none !important; }
}
"""

    with open('src/index.css', 'w', encoding='utf-8') as f:
        f.write(code)

    print("index.css updated successfully!")

if __name__ == '__main__':
    main()
