const baseUrl = "http://localhost:5000";


async function fetchRoutes(continent:string | undefined) {
	const response = !continent ? await fetch(`${baseUrl}/routes`):
		await fetch(`${baseUrl}/routes?continent=${continent}`)
	return await response.json();
}

async function fetchCountries(continent:string | undefined) {
	const response = !continent ? await fetch(`${baseUrl}/countries`):
		await fetch(`${baseUrl}/countries?continent=${continent}`)
	return await response.json();
}

async function fetchSuppliersCost(country:string | undefined) {
	const response = !country ? await fetch(`${baseUrl}/suppliers`):
		await fetch(`${baseUrl}/suppliers?country=${country}`)

	return await response.json();
}

async function fetchIncoterms(country:string | undefined) {
	const response = !country ? await fetch(`${baseUrl}/incoterms`):
		await fetch(`${baseUrl}/incoterms?country=${country}`)
	return await response.json();
}

async function fetchCountryStats(country:string | undefined, timespan:number) {
		let requestUrl = `${baseUrl}/countrystats`
		let isFirst = false
		if (timespan !== undefined){
			requestUrl = requestUrl + `${isFirst ? '&' : '?'}timespan=${timespan}`
			isFirst = true
		}
		if (country !== undefined){
			requestUrl = requestUrl + `${isFirst ? '&' : '?'}country=${country}`
			isFirst = true
		}
	const response = await fetch(requestUrl)	
	return response;
}

async function fetchMostUsedProviders() {
	const response = await fetch(`${baseUrl}/providers`);
	return await response.json();
}

async function fetchSupplierAvgCost() {
	const response = await fetch(`${baseUrl}/avgspend`);
	return await response.json();
}

async function fetchPredictDeliveryDays(country:string) {
	const response = await fetch(`${baseUrl}/predictDeliveryDate?country=${country}`)
	return await response.json();
}

export {fetchRoutes, fetchCountries, fetchSuppliersCost, fetchIncoterms, fetchMostUsedProviders, fetchSupplierAvgCost, fetchCountryStats, fetchPredictDeliveryDays};