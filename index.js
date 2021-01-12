const EventEmitter = require('events')

class Banjo extends EventEmitter {
  strings = [
    new BanjoString({ basePitch: 62 }),
    new BanjoString({ basePitch: 59 }),
    new BanjoString({ basePitch: 55 }),
    new BanjoString({ basePitch: 50 }),
    new BanjoString({ basePitch: 67 })
  ]

  fretString(stringIdx, fret) {
    if (stringIdx === 4 && fret > 0 && fret < 6) {
      throw new Error (`Fret ${fret} does not exist on stringIdx 4`)
    }

    const fretPosition = stringIdx === 4 ? fret - 5 : fret
    this.strings[stringIdx].fret(fretPosition)
  }

  pickString(stringIdx, strength) {
    const tone = this.strings[stringIdx].pick(strength)
    tone.string = stringIdx
    this.emit('tone', tone)
  }
}

class BanjoString {

  fretPosition = 0

  constructor(opts = { basePitch: 0 }) {
    this.basePitch = opts.basePitch
  }

  fret(fretPosition) {
    this.fretPosition = fretPosition
  }

  pick(strength) {
    return {
      pitch: this.basePitch + this.fretPosition,
      volume: strength,
      duration: strength * strength
    }
  }
}

const banjo = new Banjo()
banjo.on('tone', (tone) => console.log(tone))
const pitch = banjo.pickString(2, 50)
