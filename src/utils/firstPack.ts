// We purposely do NOT store this in localStorage
// so every time you refresh, it resets — and you again get a Legendary
let firstPackClaimed = false

export function isFirstPackClaimed(): boolean {
  return firstPackClaimed
}

export function claimFirstPack(): void {
  firstPackClaimed = true
}

