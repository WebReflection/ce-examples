#!/usr/bin/env bash

echo '<!DOCTYPE html>
<html lang="en">
  <head>
    <title>Custom Elements Examples</title>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1.0">
    <style>
    body { font-family: sans-serif; }
    h1 { font-size: 1.2em; }
    footer { font-size: .8em; }
    </style>
  </head>
  <body>
    <h1>Custom Elements</h1>
    <ul>' > index.html

for d in $(ls); do
  if [ -d $d ]; then
    echo "      <li><a href='./${d}/'>${d:3}</a></li>" >> index.html
  fi
done

echo '    </ul>
    <footer>
      by Andrea Giammarchi
    </footer>
  </body>
</html>' >> index.html
