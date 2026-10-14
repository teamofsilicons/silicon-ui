#!/usr/bin/env bash
# One-time: the labels for the component flow (docs/new-components.md). Run by a repository admin:
#   bash scripts/setup-github-flow.sh
set -euo pipefail
repo="${1:-teamofsilicons/silicon-ui}"
label() { gh label create "$1" --repo "$repo" --color "$2" --description "$3" --force; }
label requested    "ededed" "Component request: waiting for review against docs/new-components.md"
label approved     "0e8a16" "Plan approved by design and engineering"
label in-design    "1d76db" "Being built in a branch"
label experimental "fbca04" "Merged: in Storybook and the package, not for production yet"
label stable       "5319e7" "Promoted to stable"
label declined     "b60205" "Answered by an existing component, a composition or a token"
