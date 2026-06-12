#!/bin/bash
DIR="$(cd "$(dirname "$0")" && pwd)"
export PATH="$DIR/node_modules/.bin:$DIR/venv/bin:/usr/bin:/bin"
cd "$DIR"
exec electron .
