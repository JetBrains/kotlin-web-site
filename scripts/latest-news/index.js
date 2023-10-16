const https = require('https');
const fs = require('fs');
const path = require('path');
const { XMLParser } = require('fast-xml-parser');

const projectRoot = process.cwd();
const LATEST_NEWS_FOLDER_NAME = 'latest-news';
const NEWS_DATA = 'latest-news.json';

const latestNewsDirectory = path.join(projectRoot, LATEST_NEWS_FOLDER_NAME);

if (!fs.existsSync(latestNewsDirectory)) {
	fs.mkdirSync(latestNewsDirectory);
}

getLatestNews();

async function getLatestNews() {
	const latestNewsXMl = await getLatestNewsXML();

	const parser = new XMLParser({
		ignoreDeclaration: true
	});
	const allJson = parser.parse(latestNewsXMl);
	const items = allJson['rss']['channel']['item'];
	const latestNews = [];

	for (const [i, item] of items.splice(0, 4).entries()) {
		const imagePath = await saveImage(i, item.featuredImage);
		latestNews.push({
			title: item.title,
			date: item.pubDate,
			link: item.link,
			image: imagePath,
			description: item.description
		})
	}

	fs.writeFileSync(path.join(latestNewsDirectory, NEWS_DATA), JSON.stringify(latestNews, null, '  '), 'utf8');
}

async function getLatestNewsXML() {
	return await doRequest({
		hostname: 'blog.jetbrains.com',
		port: 443,
		path: '/kotlin/feed/',
		method: 'GET'
	});
}

async function saveImage(index, imageUrl) {
	const url = new URL(imageUrl);

	const localFilePath = path.join(latestNewsDirectory, 'news-' + index + '.png');
	const relativePath = path.relative(projectRoot, localFilePath);

	if (fs.existsSync(relativePath)) fs.unlinkSync(relativePath);
	const fileStream = fs.createWriteStream(localFilePath);

	return new Promise((resolve, reject) => {
		const request = https.get(url, (response) => {
			if (response.statusCode !== 200) {
				reject(new Error(`Failed to download image. HTTP status code: ${response.statusCode}`));
				return;
			}

			response.pipe(fileStream);

			fileStream.on('finish', () => {
				fileStream.close();
				resolve(relativePath);
			});

			fileStream.on('error', (err) => {
				reject(err);
			});
		});

		request.on('error', reject);

		request.end();
	});
}


function doRequest(options) {
	return new Promise((resolve, reject) => {
		const req = https.request(options, (res) => {
			res.setEncoding('utf8');
			let responseBody = '';

			res.on('data', (chunk) => {
				responseBody += chunk;
			});

			res.on('end', () => {
				resolve(responseBody);
			});
		});

		req.on('error', (err) => {
			reject(err);
		});

		req.end();
	});
}
