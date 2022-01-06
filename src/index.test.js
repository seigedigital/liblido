const LidoReader = require('./index.js')
const fs = require('fs');

describe('Part 1', () => {
  let records = []
  let recn = 0
  let lid = ''
  let rid = ''
  let label = ''
  let images = []

  beforeEach(() => {
    console.log({LidoReader:LidoReader})
    const data = fs.readFileSync('./testdata/lido1.xml').toString()
    let myreader = new LidoReader(data)
    records = myreader.getAllRecords()
    lid = records[0].getLidoRecordID()
    rid = records[0].getRecordID()
    label = records[0].getLabel()
    images = records[1].getKenomImages()
  })

  it('Test parsed OAI-PMH file.', () => {
    expect(typeof records).toBe('object')
    expect(records.length).toBe(20)
  })

  it('Test primary record data.', () => {
    expect(lid).toBe('record_DE-15_kenom_161017')
    expect(rid).toBe('161017')
    expect(label).toBe('Münze, 1 Crown, 1847')
  })

  it('Test images.', () => {
    expect(images.length).toBe(2)
    expect(images[0].url).toBe('https://www.kenom.de/iiif/image/record_DE-15_kenom_161081/record_DE-15_kenom_161081_vs.jpg/full/full/0/default.jpg')
    expect(images[1].width).toBe('2924')
  })

})
