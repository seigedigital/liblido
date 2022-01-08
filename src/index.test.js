const LidoReader = require('./index.js')
const fs = require('fs');

describe('Part 1', () => {
  let records = []
  let recn = 0
  let lid = ''
  let rid = ''
  let label = ''
  let images = []
  let md={}
  let links = []

  beforeEach(() => {
    const data = fs.readFileSync('./testdata/lido1.xml').toString()
    let myreader = new LidoReader(data)
    records = myreader.getAllRecords()
    lid = records[0].getLidoRecordID()
    rid = records[0].getRecordID()
    label = records[0].getLabel()
    images = records[1].getKenomImages()
    md.year = records[0].getCreationYear()
    md.license = records[0].getLicenseUri()
    md.stmt = records[0].getReqStatement()
    md.place = records[1].getCreationPlace()
    md.person = records[0].getEventActorRoles()
    links = records[0].getRelatedLinks()
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
    expect(images[1].perspective).toBe('back')
  })

  it('Test metadata.', () => {
    expect(md.year).toBe('1847')
    expect(md.license).toBe('https://creativecommons.org/publicdomain/zero/1.0/deed.de')
    expect(md.place).toBe('Großbritannien')
    expect(md.person).toBe('Viktoria <Großbritannien, Königin> (Münzherr)')
    expect(md.stmt).toBe('Universitätsbibliothek Leipzig, kein Copyright / Public domain (CC0 1.0)')
  })

  it('Test metadata.', () => {
    expect(links[0]).toBe('http://www.kenom.de/id/record_DE-15_kenom_161017')
    expect(links[1]).toBe('http://hdl.handle.net/428894.vzg/1ef66282-82d5-4f33-bdfc-3b51f9c59f26')
  })

})
