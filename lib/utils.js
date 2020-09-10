const path = require('path')

exports.parseFilename  = function parseFilename(filename) {
  const parts = filename.split("-")
  const name = parts[0].replace("_", " ")
  const repeat = parts[1]
  const speed = parts[2]
  const ext = path.extname(filename).toLowerCase().substr(1) //Drop leading period
  const [wpm, fwpm] = speed.split("x")
  const date = parseInt(parts[3], 10)
  return {
    name,
    repeat,
    wpm: parseInt(wpm, 10),
    fwpm: parseInt(fwpm, 10),
    date,
    filename,
    ext,
  }
}
