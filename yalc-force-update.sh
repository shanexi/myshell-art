#!/bin/bash


cat << EOF
read more: https://github.com/pnpm/pnpm/pull/6623
EOF


RESET='\033[0m'
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BOLD='\033[1m'

SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )

cd $SCRIPT_DIR
cd .

echo -e "${YELLOW}find .yalc and rm....${RESET}\n"
find ./node_modules/.pnpm -type d -name "file+.yalc+*" -print -exec rm -r {} +
echo -e "${GREEN}DONE.${RESET}\n"
pnpm dlx pnpm@7 i
