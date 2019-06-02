import { module, test } from 'qunit';
import { visit, currentURL, click, fillIn } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';

module('Acceptance | search', function(hooks) {
  setupApplicationTest(hooks);

  test('visiting /search', async function(assert) {
    await visit('/');

    assert.equal(currentURL(), '/');
  });

  test('should do a search and return results', async function(assert) {
    await visit('/');
    await fillIn('input.t-search', 'Harry Potter');
    await click('button.t-submit');
    assert.equal(currentURL(), '/');
  });

  test('should do a search and return no results found', async function(assert) {
    await visit('/');
    await fillIn('input.t-search', 'asdfghjkl');
    await click('button.t-submit');
    assert.equal(this.element.querySelector('p').textContent, 'No Results Found for asdfghjkl');
  });
});
