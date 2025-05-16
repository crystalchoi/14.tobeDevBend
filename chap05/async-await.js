function waitOneSecond(msg) {
	return new Promise((resolve, _) => {
		setTimeout(() => resolve(`resolve: ${msg}`), 1000)});
}

async function countOneToTen() {
	for (let x of [ ...Array(10).keys() ]) {
		let result = await waitOneSecond(`${ x + 1}초 대기 중`)
			// .then(msg => (msg + msg) )
		// console.log(`countOneToTen: ${x}`);
		console.log(result)
	}
}

countOneToTen()
