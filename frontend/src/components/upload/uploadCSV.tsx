import Navbar from "../navbar/NavBar";
import "./uploadCSV.css"


function UploadCSV() {
	return (
		<>
			<Navbar />
			<div id="form-upload" className="card text-center">
				<div className="card-header">
					Upload files
				</div>
				<div className="card-body">
					<form className="form-group" action = "http://localhost:5000/upload" method = "POST" encType = "multipart/form-data">
						<input type = "file" className="form-control-file" name = "file" multiple={true} accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"/>
						<input className="btn btn-primary mb-2" type = "submit"/>
					</form>
				</div>
			</div>
		</>
	);
}

export default UploadCSV;
