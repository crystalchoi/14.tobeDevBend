const axios = require('axios')
const url = "https://raw.githubusercontent.com/wapj/jsbackend/main/movieinfo.json"

axios.get(url)
.then(res => {
	if (res.status === 200) {

	} else {
		throw Error(`요청에 실패했음. Error: ${res.status}`);
	}
	if (res.data) {
		return res.data;
	}
	throw new Error("데이터 없음")
})
.then(data => {
	if (!data.articleList || !data.articleList.size === 0) {
		throw new Error("데이터 없음.")
	}
	return data.articleList;
})
.then(articles => {
	return articles.map((article, idx) => {
		return {title: article.title, rank:  idx + 1};
	})
})
.then(results => {
	for (let movieInfo  of results) {
		console.log(`[${movieInfo.rank}위] ${movieInfo.title}`);
	}
})
.catch(err => {
	console.log("에러 발생");
	console.error(err);
})
