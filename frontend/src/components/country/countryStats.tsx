import React, { useEffect, useState } from 'react';
import {fetchCountryStats} from '../../api';
import MUIDataTable from "mui-datatables";
import './countryStats.css'

interface CountryProps {
    country: string
}

export const LastStats: React.FC<CountryProps> = ({ country }) => {
	
    const [stats, setStats] = useState('');
    const [time_span, setTimeSpan] = useState(31);
	const columns = ["Shipment ID", "Delivery Terms", "Shipper City", "Customer City", "Ship Date", "Shipper Name", "Order Nr.", "State"];
    const time_spans = {
        "Last Month": 31,
        "Last Year": 366,
        "Next Month": -31,
        "Next Year": -366
    }

	useEffect(() => {
		fetchCountryStats(country, time_span)
			.then(async data => {
				setStats((await data.text()).replaceAll(", ,", ",").replaceAll(/'/g, '"').replaceAll("nan", '"nan"').replaceAll("<NA>", '"nan"'));
			})
	}, [time_span]);

	return (
		<section className="duo_graph2">
			{Object.entries(time_spans).map(([span, index]) => (
				<button type="button" className="btn btn-success" key={index} onClick={() => setTimeSpan(index)}>{span}</button>
			))}
			<MUIDataTable
				title={`Last shipments for: ${country}`}
				data={stats === '' ? [] : JSON.parse(stats)}
				columns={columns}
				options={{
					tableBodyMaxHeight: '700px',
					rowsPerPage: 100,
					rowsPerPageOptions: [20, 40, 100]
				}}
			/>
		</section>
	)

}

export default LastStats;
