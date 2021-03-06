const { XMLSerializer } = require('xmldom')
const xpath = require('xpath')
const xmltools = require('./xmltools.js')

module.exports = {

  template_md: {
    label: {},
    value: {}
  },

  terminology: {
    objectWorkType: {
      "en": "Object type",
      "de": "Objekttyp"
    },
    displayActorInRole: {
      "en": "Person",
      "de": "Person"
    },
    creationYear: {
      "en": "Year (Creation)",
      "de": "Jahr (Entstehung)"
    },
    creationPlace: {
      "en": "GND, Place (Creation)",
      "de": "GND, Ort (Entstehung)"
    }
  },

  // should be good for many LIDO dialects
  useNamespaces: function() {
    return xpath.useNamespaces({
      "lido": "http://www.lido-schema.org",
      "xsi": "http://www.w3.org/2001/XMLSchema-instance",
      "oai": "http://www.openarchives.org/OAI/2.0/"
    })
  },

  getRecordID: function(node,select) {
    return xmltools.getXmlValue('.//lido:administrativeMetadata/lido:recordWrap/lido:recordID',node,select)
  },

  getLidoRecordID: function(node,select) {
    return xmltools.getXmlValue('.//lido:lido/lido:lidoRecID',node,select)
  },

  getRelatedLinks: function(node,select) {
    let nodes = xmltools.getNodes('.//lido:lido/lido:objectPublishedID[@lido:type="http://terminology.lido-schema.org/identifier_type/uri"]',node,select)
    let retval = []
    for(let key in nodes) {
      let url = xmltools.getXmlValue('.',nodes[key],select)
      if(url) {
        retval.push(url)
      }
    }
    return retval
  },

  getKenomResourceRepresentations: function(node,select) {
    let nodes = xmltools.getNodes('.//lido:resourceRepresentation',node,select)
    let retval = []
    for(let key in nodes) {
      try {
        let url = xmltools.getXmlValue('./lido:linkResource',nodes[key],select)
        let width = xmltools.getXmlValue('./lido:resourceMeasurementsSet[lido:measurementType = "width"]/lido:measurementValue',nodes[key],select)
        let height = xmltools.getXmlValue('./lido:resourceMeasurementsSet[lido:measurementType = "height"]/lido:measurementValue',nodes[key],select)
        let perspective = xmltools.getXmlValue('./lido:resourcePerspective/lido:term',node,select)
        let qp = width*height
        retval.push({url:url,width:width,height:height,perspective:perspective,qp:qp})
      } catch (e) { console.log(e) }
    }
    return retval
  },

  getKenomMaxResourceRepresentation: function(node,select) {
    let reps = this.getKenomResourceRepresentations(node,select)
    let retval = false
    let maxqp = 0
    for(let key in reps) {
      if(reps[key].qp>=maxqp) {
        retval = reps[key]
        maxqp = reps[key].qp
      }
    }
    return retval
  },

  getKenomImages: function(node,select) {
    let rnodes = xmltools.getNodes('.//lido:administrativeMetadata/lido:resourceWrap/lido:resourceSet',node,select)
    let retval =  []
    for(let key in rnodes) {
      let img = {}
      img = Object.assign(img,this.getKenomMaxResourceRepresentation(rnodes[key],select))
      retval.push(img)
    }
    return retval
  },

  getWorkType: function(node,select,defaultLanguages) {
    let result = xmltools.getXmlValue('.//lido:descriptiveMetadata/lido:objectClassificationWrap/lido:objectWorkTypeWrap/lido:objectWorkType/lido:term',node,select)
    if(result===null) {
      result = xmltools.getXmlValue('.//lido:descriptiveMetadata/lido:objectClassificationWrap/lido:objectWorkTypeWrap/lido:objectWorkType/lido:term[lido:pref="preferred"]',node,select)
    }
    return result
  },

  getLabel: function(node,select) {
    return xmltools.getXmlValue('.//lido:descriptiveMetadata/lido:objectIdentificationWrap/lido:titleWrap/lido:titleSet/lido:appellationValue',node,select)
  },

  // Returns [{name:"",unit:"",value:""},...]
  getPhysicalMeasurements: function(node,select) {
    let retval = []
    let nodes = xmltools.getNodes('.//lido:descriptiveMetadata/lido:objectIdentificationWrap/lido:objectMeasurementsWrap/lido:objectMeasurementsSet/lido:objectMeasurements/lido:measurementsSet',node,select)
    for(let key in nodes) {
      let t = xmltools.getXmlValue('./lido:measurementType',nodes[key],select)
      let u = xmltools.getXmlValue('./lido:measurementUnit',nodes[key],select)
      let v = xmltools.getXmlValue('./lido:measurementValue',nodes[key],select)
      retval.push({name:t,unit:u,value:v})
    }
    return retval
  },

  getMaterial: function(node,select) {
    let retval = []
    let nodes = xmltools.getNodes('.//lido:materialsTech/lido:termMaterialsTech',node,select)
    for(let key in nodes) {
      let cids = xmltools.getXmlValues('./lido:conceptID',nodes[key],select)
      let t = xmltools.getXmlValues('./lido:term',nodes[key],select)
      retval.push({uris:cids,terms:t})
    }
    return retval
  },

  getCreationYear: function(node,select) {
    let nodes = xmltools.getNodes('.//lido:descriptiveMetadata/lido:eventWrap/lido:eventSet/lido:event',node,select)
    for(let key in nodes) {
      let concept = xmltools.getXmlValue('./lido:eventType/lido:conceptID',nodes[key],select)
      if(
        ['http://terminology.lido-schema.org/lido00007'
        ,'http://terminology.lido-schema.org/lido00031'
        ,'http://terminology.lido-schema.org/lido00224'
        ,'http://terminology.lido-schema.org/lido00228'
        ,'http://terminology.lido-schema.org/eventType/production'
        ].includes(concept)) {

          let date = xmltools.getXmlValue('./lido:eventDate/lido:date/lido:earliestDate',nodes[key],select)
          if(date!==null) {
            return date.match(/\-?\d{1,4}/g)[0]
          }

          date = xmltools.getXmlValue('./lido:eventDate/lido:date/lido:latestDate',nodes[key],select)
          if(date!==null) {
            return date.match(/\-?\d{1,4}/g)[0]
          }

          date = xmltools.getXmlValue('./lido:eventDate/lido:displayDate',nodes[key],select)
          if(date!==null && date.match(/\d{4}/)!==null) {
            return date.match(/\-?\d{1,4}/g)[0]
          }

      }
    }
    return null
  },

  getCreationPlace: function(node,select) {
    let nodes = xmltools.getNodes('.//lido:descriptiveMetadata/lido:eventWrap/lido:eventSet/lido:event',node,select)
    for(let key in nodes) {
      let concept = xmltools.getXmlValue('.//lido:eventType/lido:conceptID',nodes[key],select)
      if(
        ['http://terminology.lido-schema.org/lido00007'
        ,'http://terminology.lido-schema.org/lido00031'
        ,'http://terminology.lido-schema.org/lido00224'
        ,'http://terminology.lido-schema.org/lido00228'
        ,'http://terminology.lido-schema.org/eventType/production'
        ].includes(concept)) {

          let place = xmltools.getXmlValue('./lido:eventPlace[lido:place[@lido:politicalEntity="minting_place"]]/lido:displayPlace',nodes[key],select)
          if(place!==null) {
            return place
          }

          place = xmltools.getXmlValue('./lido:eventPlace/lido:displayPlace',nodes[key],select)
          if(place!==null) {
            return place
          }

          place = xmltools.getXmlValue('./lido:eventPlace/lido:namePlaceSet/lido:appellationValue[@lido:pref="preferred"]',nodes[key],select)
          if(place!==null) {
            return place
          }
      }
    }
    return null
  },

  getIdentificationByType: function(node,select,type) {
    return xmltools.getXmlValue(`.//lido:objectIdentificationWrap/lido:repositoryWrap/lido:repositorySet/lido:workID[@lido:type="${type}"]`,node,select)
  },

  getRecordInfoLink: function(node,select) {
    return xmltools.getXmlValue(`.//lido:recordInfoSet/lido:recordInfoLink`,node,select)
  },

  getClassificationByType: function(node,select,type) {
    let nodes = xmltools.getNodes(`.//lido:descriptiveMetadata/lido:objectClassificationWrap/lido:classificationWrap/lido:classification[@lido:type="${type}"]`,node,select)
    if(nodes.length>0) {
      return xmltools.getXmlValue('.//lido:term[@lido:addedSearchTerm="no" and @lido:pref="preferred"]',nodes[0],select)
    } else {
      return null
    }
  },

  getCreationPlaceIDs: function(node,select) {
    let nodes = xmltools.getNodes('.//lido:descriptiveMetadata/lido:eventWrap/lido:eventSet/lido:event',node,select)
    for(let key in nodes) {
      let concept = xmltools.getXmlValue('.//lido:eventType/lido:conceptID',nodes[key],select)
      if(
        ['http://terminology.lido-schema.org/lido00007'
        ,'http://terminology.lido-schema.org/lido00031'
        ,'http://terminology.lido-schema.org/lido00224'
        ,'http://terminology.lido-schema.org/lido00228'
        ,'http://terminology.lido-schema.org/eventType/production'
        ].includes(concept)) {

          let ids = xmltools.getXmlValues('.//lido:eventPlace/lido:place[@lido:politicalEntity="minting_place"]/lido:placeID',nodes[key],select)
          if(ids.length>0) {
            return ids
          }

          ids = xmltools.getXmlValues('.//lido:eventPlace/lido:place/lido:placeID',nodes[key],select)
          if(ids.length>0) {
            return ids
          }

      }
    }
    return null
  },

  getLicenseUri: function(node,select) {
    let retval = xmltools.getXmlValue('.//lido:administrativeMetadata/lido:rightsWorkWrap/lido:rightsWorkSet/lido:rightsType/lido:conceptID',node,select)
    if(retval!==null) {
      return retval
    }
    retval = xmltools.getXmlValue('.//lido:administrativeMetadata/lido:recordWrap/lido:recordRights/lido:rightsType/lido:conceptID',node,select)
    return retval
  },

  getReqStatement: function(node,select) {
    let stmt = xmltools.getXmlValue('.//lido:administrativeMetadata/lido:resourceWrap/lido:resourceSet/lido:rightsResource/lido:creditLine',node,select)
    if(stmt===null) {
      stmt = ""
      stmt += xmltools.getXmlValue('.//lido:administrativeMetadata/lido:recordWrap/lido:recordRights/lido:rightsHolder/lido:legalBodyName/lido:appellationValue',node,select)
      stmt += ", "+xmltools.getXmlValue('.//lido:administrativeMetadata/lido:recordWrap/lido:recordRights/lido:rightsType[lido:conceptID]/lido:term',node,select)
    }
    return stmt
    // return {
    //   label: { en: ["Attribution"] },
    //   value: { en: [stmt] }
    // }
  },

  getEventActorRoles: function(node,select) {
    let results = xmltools.getXmlValue('.//lido:descriptiveMetadata/lido:eventWrap/lido:eventSet/lido:event/lido:eventActor/lido:displayActorInRole',node,select)
    // console.log(results)
    // if(results.length===0 || results===null) {
    //   return null
    // }
    // let retval = this.clone(this.template_md)
    // for(let key in results) {
    //   retval.label[key] = [this.terminology.displayActorInRole[key]]
    //   retval.value[key] = results[key]
    // }
    return results
  },

  getAllCreators: function(node,select) {
    let results = []
    let nodes = xmltools.getNodes('.//lido:descriptiveMetadata/lido:eventWrap/lido:eventSet/lido:event',node,select)
    for(let key in nodes) {
      let concept = xmltools.getXmlValue('.//lido:eventType/lido:conceptID',nodes[key],select)
      if(
        ['http://terminology.lido-schema.org/lido00007'
        ,'http://terminology.lido-schema.org/lido00031'
        ,'http://terminology.lido-schema.org/lido00224'
        ,'http://terminology.lido-schema.org/lido00228'
        ,'http://terminology.lido-schema.org/eventType/production'
        ].includes(concept)) {
          results = [...results,...xmltools.getXmlValues('.//lido:eventActor/lido:displayActorInRole',node,select)]
      }
    }
    return [...new Set(results)]
  },

  clone: function(i) {
    return JSON.parse(JSON.stringify(i))
  }

}
