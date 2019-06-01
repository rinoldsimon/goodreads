import AjaxService from 'ember-ajax/services/ajax';
import { computed } from '@ember/object';

export default AjaxService.extend({
  trustedHosts: computed(function() {
    return ['https://www.goodreads.com']
  })
});
