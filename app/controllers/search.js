import Controller from '@ember/controller';
import config from "../config/environment";
import $ from 'jquery';
import pagedArray from 'ember-cli-pagination/computed/paged-array';
import { alias } from '@ember/object/computed';
import { oneWay } from '@ember/object/computed';
import { run } from '@ember/runloop';

export default Controller.extend({
  initialLoad: true,
  searching: false,
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
  content: '',
  // setup our query params
  queryParams: ["page", "perPage"],

  // set default values, can cause problems if left out
  // if value matches default, it won't display in the URL
  page: 1,
  perPage: 8,

  // iterate over pagedContent in your template
  pagedContent: pagedArray('content', {
    page: alias("parent.page"),
    perPage: alias("parent.perPage")
  }),

  // binding the property on the paged array
  // to a property on the controller
  totalPages: oneWay("pagedContent.totalPages"),

  actions: {
    search(searchTerm) {
      this.set('searching', true);
      $.ajax(this.get('url'), {
        data: {
          q: searchTerm,
          key: config.api_key,
          'search[field]': 'title',
          // page: 2
        },
        headers: {
          "X-Requested-With": "XMLHttpRequest"
        }
      }).then((xmlData) => {
        let jsonData = this.xmlToJson(xmlData)
        run(() => {
          this.set('page', 1);
          this.set('initialLoad', false);
          this.set('searchTermCopy', searchTerm);
          this.set('searching', false);
          let data = jsonData.GoodreadsResponse.search.results.work;
          data.forEach((data) => {
            if (data.original_publication_year["@attributes"]) {
              data.original_publication_year = ''
            }
          });
          this.set('content', data);
        })
      });
    }
  }
});
