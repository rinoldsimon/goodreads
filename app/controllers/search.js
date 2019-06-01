import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import config from "../config/environment";

export default Controller.extend({
  ajax: service(),
  url: 'https://www.goodreads.com/search/index.xml',
  actions: {
    search(searchTerm) {
      return this.get('ajax').request(this.get('url'), {
        data: {
          q: searchTerm,
          key: config.api_key
        }
      });
    }
  }
});
