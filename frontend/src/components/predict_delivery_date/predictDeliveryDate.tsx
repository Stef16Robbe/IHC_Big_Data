import React, { useEffect, useState } from 'react';
import { fetchCountries, fetchPredictDeliveryDays } from '../../api';
import Navbar from '../navbar/NavBar';
import './predictDeliveryDate.css';

interface Country {
	title: string,
	code: string
}

interface PredictDeliveryDateResponse {
	Road_Transport?: number,
	Sea_Transport?: number,
	Air_Transport?: number,
	Rail_Transport?: number,
	days: number
}

export const PredictDeliveryDate: React.VoidFunctionComponent = () => {
	const [country, setCountry] = useState<string>("");
	const [deliveryDays, setDeliveryDays] = useState<PredictDeliveryDateResponse>();
	const [date, setDate] = useState<string>('');
	const [countries, setCountries] = useState<Country[]>([]);
	
	useEffect(() => {
		fetchCountries(undefined)
			.then(data => {
				setCountries(data);
			})
	}, []);

	function setCountryByString(input:string) {
		input.includes('(') && input !== null ? setCountry(input.substring(input.length - 3, input.length - 1)) : setCountry(input)
	}

	function predictDeliveryDays() {
		fetchPredictDeliveryDays(country)
			.then(async data => setDeliveryDays(data))
	}

	function printPredictedDate() {
		if (deliveryDays !== undefined) {
			var result = new Date(date);
  			result.setDate(result.getDate() + deliveryDays.days);
			return <h5>Predicted delivery date from NL to {country}: {result.toLocaleDateString()}</h5>
		}
	}

	function shipmentViaCodes() {
		if (deliveryDays !== undefined) {
			return (
				<section className="via_codes">
					<h3>Most used shipment types</h3>
					<ul className="list-group">
						{deliveryDays.Road_Transport !== undefined ? <li className="list-group-item">Road transport: {transformToPercentage(deliveryDays.Road_Transport)}</li> : null }
						{deliveryDays.Air_Transport !== undefined ? <li className="list-group-item">Air transport: {transformToPercentage(deliveryDays.Air_Transport)}</li> : null }
						{deliveryDays.Sea_Transport !== undefined ? <li className="list-group-item">Sea transport: {transformToPercentage(deliveryDays.Sea_Transport)}</li> : null }
						{deliveryDays.Rail_Transport !== undefined ? <li className="list-group-item">Rail transport: {transformToPercentage(deliveryDays.Rail_Transport)}</li> : null }
					</ul>
				</section>
		)}
	}

	function transformToPercentage(num: number) {
		return (num * 100).toFixed(0).toString() + "%"
	}

	return (
		<>
			<Navbar />
			<div id="form-upload" className="card text-center">
				<div className="card-header">
					Predict delivery date
				</div>
				<div className="card-body">
					<label htmlFor="shipdate">Shipdate: </label>&nbsp;
					<input name="shipdate" id="shipdate" type="date" onChange={(event) => setDate(event.target.value)}/><br/>

					<label htmlFor="country">Destination country: </label>&nbsp;
					<input list="countries" name="country" id="country" onChange={(event) => setCountryByString(event.target.value)}/>
					<datalist id="countries">
						{countries.map((country, index) => {
							return <option value={country.title + " (" + country.code +")"} key={index} />
						})}
					</datalist>

					<br /><button type="button" className="btn btn-success" onClick={() => predictDeliveryDays()}>Calculate!</button>
				</div>
				{printPredictedDate()}
				{shipmentViaCodes()}
			</div>
		</>
	)

}

export default PredictDeliveryDate;
