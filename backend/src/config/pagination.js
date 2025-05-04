const PAGE_SIZE = +process.env.PAGE_SIZE || 20;

const getPageInfo = (query) => {
	var offset = query.offset || 0;
	var limit = query.limit || PAGE_SIZE;
	const page = query.page;
	if (page) {
		offset = (page - 1) * limit;
	}
	return { offset, limit, page };
}

const pagination = (currPage, loadedData, limit = PAGE_SIZE) => {
	const pag = {}
	if (currPage && (loadedData?.length ?? +loadedData) >= limit)
		pag.next = +currPage + 1
	return pag
}

module.exports = { PAGE_SIZE, getPageInfo, pagination };