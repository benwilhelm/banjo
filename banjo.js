class Banjo extends EventTarget {

  muted = false

  strings = [
    new BanjoString({ basePitch: 62 }),
    new BanjoString({ basePitch: 59 }),
    new BanjoString({ basePitch: 55 }),
    new BanjoString({ basePitch: 50 }),
    new BanjoString({ basePitch: 67 })
  ]

  fretString(stringIndex, fret) {
    if (stringIndex === 4 && fret > 0 && fret < 6) {
      throw new Error (`Fret ${fret} does not exist on stringIndex 4`)
    }

    const fretPosition = (stringIndex === 4 && fret !== 0)
                       ? fret - 5
                       : fret
    this.strings[stringIndex].fret(fretPosition)
  }

  pickString(stringIndex, strength) {
    try {
      const stringTone = this.strings[stringIndex].pick(strength)
      const emittedTone = {
        ...stringTone,
        stringIndex,
        volume: this.muted ? stringTone.volume / 2 : stringTone.volume
      }
      this.dispatchEvent(new CustomEvent('tone', { detail: emittedTone }))
      return emittedTone
    } catch (err) {
      console.warn(err.message)
      return null
    }
  }
}

class BanjoString {

  fretPosition = 0
  broken = false

  constructor(opts = { basePitch: 0 }) {
    this.basePitch = opts.basePitch
  }

  fret(fretPosition) {
    this.fretPosition = fretPosition
  }

  pick(strength) {
    // if string is already broken, throw early
    if (this.broken) {
      throw new Error("Can't pick a broken string")
    }

    // correlate chance of breakage to strength of pick
    const breakChance = strength * .00001
    if (breakChance > Math.random()) {
      this.broken = true
      throw new Error("String Broke")
    }

    return {
      pitch: this.basePitch + this.fretPosition,
      volume: strength,
      duration: strength * strength
    }
  }
}
