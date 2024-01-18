import fs from 'fs'

const updateVersion = () => {
  const infoBuffer = fs.readFileSync('../package.json')
  const info =JSON.parse(infoBuffer.toString())
  

  const { version } = info

  if (version.indexOf('-') === -1) {
    return
  }

  const newVersion = version.split('-')[0]
  info.version = newVersion

  fs.writeFileSync('../package.json', JSON.stringify(info))
}

updateVersion()
