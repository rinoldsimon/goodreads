import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import config from "../config/environment";
import $ from 'jquery';

export default Controller.extend({
  ajax: service(),
  // url: 'https://www.goodreads.com/search/index.xml',
  url: 'https://cors-anywhere.herokuapp.com/https://www.goodreads.com/search.xml',
  // Changes XML to JSON
  xmlToJson(xml) {
    // Create the return object
    var obj = {};

    if (xml.nodeType == 1) { // element
      // do attributes
      if (xml.attributes.length > 0) {
      obj["@attributes"] = {};
        for (var j = 0; j < xml.attributes.length; j++) {
          var attribute = xml.attributes.item(j);
          obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
        }
      }
    } else if (xml.nodeType == 3) { // text
      obj = xml.nodeValue;
    }

    // do children
    // If just one text node inside
    if (xml.hasChildNodes() && xml.childNodes.length === 1 && xml.childNodes[0].nodeType === 3) {
      obj = xml.childNodes[0].nodeValue;
    }
    else if (xml.hasChildNodes()) {
      for(var i = 0; i < xml.childNodes.length; i++) {
        var item = xml.childNodes.item(i);
        var nodeName = item.nodeName;
        if (typeof(obj[nodeName]) == "undefined") {
          obj[nodeName] = this.xmlToJson(item);
        } else {
          if (typeof(obj[nodeName].push) == "undefined") {
            var old = obj[nodeName];
            obj[nodeName] = [];
            obj[nodeName].push(old);
          }
          obj[nodeName].push(this.xmlToJson(item));
        }
      }
    }
    return obj;
  },
  actions: {
    search(searchTerm) {
      $.ajax(this.get('url'), {
        data: {
          q: searchTerm,
          key: config.api_key,
          'search[field]': 'title'
        },
        headers: {
          "X-Requested-With": "XMLHttpRequest"
        }
      }).then((xmlData) => {
        let jsonData = this.xmlToJson(xmlData)
        debugger;
      });
    }
  }
});
