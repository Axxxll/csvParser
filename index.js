// const object = {
//     "name": "test"
// }
// let tokenName = "MANA"

// object.name = "new name"

// object.age = 12
// object.autor = "Axl"
// object[tokenName] = 12
// object[tokenName] += 12

// tokenName = "DAO"

// object[tokenName] = 12

// console.log(object);

const fs = require('fs')
const csv = require('csv-parser')
const resultsOfCsv = []  // Stores innitialy parsed csv document
const result = [] // Stores result of function 
let  obj = {}

fs.createReadStream('export-address-token-0xAf5a05ebe2D24C5C6A6bE222F824A8a0C170dAEC.csv')
  .pipe(csv())
  .on('data', (data) => resultsOfCsv.push(data))
  .on('end', doSomething)

function doSomething() {
    for (let i = 0; i < resultsOfCsv.length; i++) {
      let leBalance = resultsOfCsv[i].TokenName
      if(!obj[leBalance]) {
        obj[leBalance] = 0
      }
      if (resultsOfCsv[i].To === '0xaf5a05ebe2d24c5c6a6be222f824a8a0c170daec') {
        obj[leBalance] += Number(resultsOfCsv[i].Value.replace(',', ""))
      } else if (resultsOfCsv[i].From === '0xaf5a05ebe2d24c5c6a6be222f824a8a0c170daec'){
        obj[leBalance] -= Number(resultsOfCsv[i].Value.replace(',', ""))
      }
      let time = resultsOfCsv[i].UnixTimestamp
      let name = resultsOfCsv[i].TokenName
      let res = {
        blockHight: time, 
        token: name,
        balance: obj[leBalance]
      }
      result.push(res)
    }
    fs.writeFileSync('tokenStorage.json', JSON.stringify(result))
}
