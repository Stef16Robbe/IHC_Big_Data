import ReactDOM from 'react-dom';
import App from './App';
import {Route} from 'react-router';
import { BrowserRouter, Switch } from 'react-router-dom';
import CountryInfo from './components/graph/CountryInfo';
import 'bootstrap/dist/css/bootstrap.css'
import './index.css';
import UploadCSV from './components/upload/uploadCSV';
import UploadResult from './components/upload/uploadResult';
import PredictDeliveryDate from './components/predict_delivery_date/predictDeliveryDate';

ReactDOM.render(
   <BrowserRouter basename={process.env.PUBLIC_URL}>
           <Switch>
               <Route exact path="/" render={() => <App />} />
               <Route
                   exact
                   path="/country/:code"
                   render={(props) => <CountryInfo code = {props.match.params.code} />}
               />
			   <Route
			   		exact
					path="/upload"
					render={() => <UploadCSV />}
				/>
				<Route
			   		exact
					path="/success"
					render={() => <UploadResult />}
				/>
				<Route
			   		exact
					path="/predict-delivery-date"
					render={() => <PredictDeliveryDate />}
				/>
           </Switch>
   </BrowserRouter>,
document.getElementById('root'),
);
