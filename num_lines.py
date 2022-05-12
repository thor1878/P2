import os
import re
import sys

sys.stdout = open('output.txt', 'w')

FOLDERS = ['.git', 'node_modules', 'coverage']
FILES = ['package-lock.json', '.gitignore']

total_lines = 0
total_files = 0

print('-' * 100)
print('Lines'.rjust(5) + '  |  ' + 'File'.ljust(30) + '\t' + 'Path')
print('-' * 100)

for root, dirs, files in os.walk('.'):
    if len(root.split('/')) < 2:
        continue
    for folder in FOLDERS:
        if folder in root.split('/'):
            break
    else:

        for file in files:
            if file in FILES: continue
            
            path = f'{root}/{file}'
            try:
                with open(path, 'r') as f:
                    num_lines = 0
                    for line in f.readlines():
                        num_lines += 1
                        total_lines += 1
                total_files += 1
                print(f'{str(num_lines).rjust(5)}  |  {file.ljust(30)}\t{root}')
                print('-' * 100)
            except:
                # print(f'couldn\'t read {path}')
                pass

print(f'Total lines: {total_lines}\tTotal files: {total_files}')
print('-' * 100)

sys.stdout.close()