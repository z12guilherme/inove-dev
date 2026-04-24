import re
import sys

with open('c:\\Users\\santa fe\\Desktop\\inove-dev\\index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Remove Services up to Contact Section
content = re.sub(r'<!-- Services Section -->.*?<!-- Contact Section -->', '<!-- Contact Section -->', content, flags=re.DOTALL)

# Remove Game Section up to </main>
content = re.sub(r'<!-- Game Section \(Mantido mas estilizado\) -->.*?</main>', '</main>', content, flags=re.DOTALL)

with open('c:\\Users\\santa fe\\Desktop\\inove-dev\\index.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("Cleanup complete.")
