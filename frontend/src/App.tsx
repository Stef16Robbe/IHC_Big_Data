import Map from './components/graph/map';
import Incoterms from './components/graph/incoterms'
import PrdAvgCost from './components/graph/PrdAvgCost'
import SupplierSpend from './components/graph/SupplierSpend';
import MostUsedProviders from './components/graph/MostUsedProv'
import Navbar from './components/navbar/NavBar';
import { Helmet } from 'react-helmet'
import './App.css';

function App() {
  return (
    <div className="App">
		<Navbar />
	  	<Map />
		<section className="sided_graphs">
			<PrdAvgCost />
			<Incoterms width={500}/>
		</section>
		<SupplierSpend />
		<MostUsedProviders />

		<Helmet>
          <title>IHC Dashboard</title>
        </Helmet>
    </div>
  );
}

export default App;
