const axios = require('axios')
const url = "https://raw.githubusercontent.com/wapj/jsbackend/main/movieinfo.json"


async function getMovies(){
	try {
	  const result = await axios.get(url)
		const {data} = result
		if (!data.articleList || !data.articleList.size === 0) {
			throw new Error("데이터 없음.")
		}
		const articles = data.articleList;
		const movieInfos = articles.map((article, idx) => {
			return {title: article.title, rank: idx + 1};
		})

		for (let movieInfo  of movieInfos) {
			console.log(`[${movieInfo.rank}위] ${movieInfo.title}`);
		}

	} catch (error) {
		throw error;
		// console.log(error)
	}
}

getMovies()
