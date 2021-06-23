import { useLocation } from "react-router-dom";
import Navbar from "../navbar/NavBar";

interface files {
	status: string,
	name: string,
	error: string
}

function UploadResult() {
	const search = useLocation().search;
	const fileInfo: string = new URLSearchParams(search).get('files')?.replace(/'/g, '"') || "";
	let obj: files[] = JSON.parse(fileInfo)
	
	const getContextualClass = (status: string) => {
		const className = status === "success"? "list-group-item-success": "list-group-item-danger"
		return "list-group-item " + className;
	}

	return (
		<>
			<Navbar />
			<div id="form-upload" className="card text-center">
				<div className="card-header">
					Upload information:
				</div>
				<div className="card-body">
					<ul className="list-group">
						{obj.map((file, index) => {
							return (
								<>
									<li key={index} className={getContextualClass(file.status)}>{file.name}</li>
									{file.error ? <p>{file.error}</p> : <></>}
								</>
							)
						})}
					</ul>
				</div>
			</div>
		</>
	);
}

export default UploadResult;