import React from 'react';
import LastStats from '../country/countryStats';
import Navbar from '../navbar/NavBar';
import Incoterms from './incoterms';

interface CountryProps {
    code: string
}

export const CountryInfo : React.FC<CountryProps> = ({code}) => {
    return (
        <>
			<Navbar />
			<section className="sided_graphs">
				<LastStats country = {code}/>
				<Incoterms width={800} country = {code}/>
			</section>
        </>
    );
}

export default CountryInfo;
