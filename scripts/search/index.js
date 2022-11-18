const fs = require('node:fs/promises');
const algoliasearch = require('algoliasearch');

const indexName = process.env.ALGOLIA_INDEX_NAME;
const appId = process.env.ALGOLIA_APP_ID;
const apiKey = process.env.ALGOLIA_WRITE_API_KEY;
const referenceIndexFilePath = process.env.REFERENCE_INDEX_FILE_PATH;
const referenceURL = process.env.API_REFERENCE_URL;

console.log(`Start building index ${indexName} for ${referenceURL}`);

const client = algoliasearch(appId, apiKey);

const index = client.initIndex(indexName);

index
    .exists()
	.then(isExist => {
		if (!isExist) {
			console.log(`Configure index`);

			return index.setSettings({
				'searchableAttributes': ['headings', 'pageTitle', 'content', 'parent'],
				'customRanking': ['desc(headings)']
			});
		}
	})
    .then(() => {
        console.log(`Reading Dokka pages index by ${referenceIndexFilePath} path.`);

        return fs.readFile(referenceIndexFilePath);
    })
    .then(dataContent => {
		const pages = JSON.parse(dataContent.toString());

		const indexObjects = pages.map(normalizePageObject);

		console.log(`Submitting  index objects to ${indexName} index.`);

		return index.replaceAllObjects(indexObjects, { safe: true });
	})
	.then(() => {
		console.log(`The index ${indexName} has been updated.`);
	})
    .catch(error => {
        console.error(error);
        process.exit(1);
    });

/**
 *
 * @param {Object} dokkaPage
 * @param {string} dokkaPage.name - api entity sinature, e.g `class SchedulerCoroutineDispatcher(val scheduler: Scheduler) : CoroutineDispatcher, Delay`
 * @param {string} dokkaPage.description - module name, e.g `kotlinx.coroutines.reactor.SchedulerCoroutineDispatcher`
 * @param {string} dokkaPage.location - page path, e.g. `kotlinx-coroutines-reactor/kotlinx.coroutines.reactor/-scheduler-coroutine-dispatcher/index.html`
 * @param {string[]} dokkaPage.searchKeys - array of keywords
 *
 * @returns {Object} algoliaPageObject
 * @returns {string} algoliaPageObject.objectID - page ID
 * @returns {string} algoliaPageObject.headings - primary key
 * @returns {string} algoliaPageObject.pageTitle - page header
 * @returns {string} algoliaPageObject.content  - page description
 * @returns {string} algoliaPageObject.url - page url
 * @returns {string} algoliaPageObject.parent - used for compatibility reason
 */
function normalizePageObject(dokkaPage) {
	if (dokkaPage.searchKeys.length < 3) {
		throw new Error(`Can't normalize page object ${dokkaPage.location}. Search keys are undefined.`);
	}
 return {
	 objectID: dokkaPage.location,
	 headings: dokkaPage.searchKeys[0],
	 pageTitle: dokkaPage.searchKeys[1],
	 content: dokkaPage.searchKeys[2],
	 url: `${referenceURL}/${dokkaPage.location}`,
	 parent: dokkaPage.location
 };
}
