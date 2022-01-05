import LidoReader from './LidoReader.js'
const fs = require('fs');

describe('Part 1', () => {
  let records = []
  let recn = 0
  let lid = ''
  let rid = ''
  let label = ''

  beforeEach(() => {
    const data = fs.readFileSync('./testdata/lido1.xml').toString()
    let myreader = new LidoReader(data)
    records = myreader.getAllRecords()
    lid = records[0].getLidoRecordID()
    rid = records[0].getRecordID()
    label = records[0].getLabel()
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


})
