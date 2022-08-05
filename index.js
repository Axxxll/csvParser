const fs = require('fs')
const csv = require('csv-parser')
const resultsOfCsv = []  // Stores innitialy parsed csv document
const result = [] // Stores result of function 
const accId = '0xaf5a05ebe2d24c5c6a6be222f824a8a0c170daec'
let  wallet = {} // stores a key = tokenName & value = amount

fs.createReadStream('export-address-token-0xAf5a05ebe2D24C5C6A6bE222F824A8a0C170dAEC.csv')
  .pipe(csv())
  .on('data', (data) => resultsOfCsv.push(data))
  .on('end', parseCsvDoc)

function parseCsvDoc() {
    for (let i = 0; i < resultsOfCsv.length; i++) {
      let time = resultsOfCsv[i].UnixTimestamp
      let j = i + 1
      let currentTokenName = calcBallance(i)
      let res = {
        blockHight: time, 
        [currentTokenName]: wallet[currentTokenName]
      } 
      while (resultsOfCsv[i].UnixTimestamp === resultsOfCsv[j]?.UnixTimestamp) {
        i += 1
        j += 1
        currentTokenName = calcBallance(i)
        res[currentTokenName] = wallet[currentTokenName]
      }
        result.push(res)     
    }
    fs.writeFileSync('tokenStorage.json', JSON.stringify(result))
}

function calcBallance(i) {
  let currentTokenName = resultsOfCsv[i].TokenName
  if (!wallet[currentTokenName]) {
    wallet[currentTokenName] = 0
  }
  if (resultsOfCsv[i].To === accId) {
    wallet[currentTokenName] += Number(resultsOfCsv[i].Value.replaceAll(',', ""))
  } else if (resultsOfCsv[i].From === accId) {
    wallet[currentTokenName] -= Number(resultsOfCsv[i].Value.replaceAll(',', ""))
  }
  return currentTokenName
}

