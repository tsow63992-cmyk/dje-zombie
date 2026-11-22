#!/bin/sh
# Joue les 27 combinaisons zombie × lieu dans Chrome (choix au hasard), 5 à la fois.
cd "$(dirname "$0")/.."
: > /tmp/dje_tout.txt
for z in rouille ecouteur vitreux rampeur geant siffleur braise brume sansyeux; do
  for l in village ile metro; do
    echo "$z $l"
  done
done | xargs -P 5 -n 2 sh -c 'timeout 250 python3 tests/navigateur.py --z "$0" --l "$1" --choix hasard --captures aucune > "/tmp/dje_$0_$1.txt" 2>&1; echo "$0 × $1 : code $?" >> /tmp/dje_tout.txt'
sort /tmp/dje_tout.txt
grep -L "OK : partie terminée" /tmp/dje_*_*.txt
