import os
import re

num_lines = 0
num_files = 0

print('\n\n')
for root, dirs, files in os.walk('.'):
    if len(root.split('/')) < 2:
        continue
    if '.git' in root.split('/') or 'node_modules' in root.split('/') or 'package-lock' in root.split('/'):
        # print(root.split('/'))
        continue

    for file in files:
        if file == 'package-lock.json': continue
        num_files += 1
        print(file)
        path = f'{root}/{file}'
        try:
            with open(path, 'r') as f:
                for line in f.readlines():
                    num_lines += 1
                
                
                
        except:
            # print(f'couldn\'t read {path}')
            pass

print(num_files)
print(num_lines)