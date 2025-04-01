import { readFileSync, writeFileSync } from 'node:fs'

export function readJSON(path) {
  return JSON.parse(readFileSync(path, 'utf-8'))
}

export function writeJSON(path, data) {
  writeFileSync(path, JSON.stringify(data, null, 2), 'utf-8')
}