import sys
from pypdf import PdfReader
reader = PdfReader(sys.argv[1])
text = ""
for page in reader.pages:
    text += page.extract_text() + "\n"

with open('c:\\Users\\rishj\\myclaw\\myclaw\\perform_output.txt', 'w', encoding='utf-8') as f:
    f.write(text)
print("Done")
