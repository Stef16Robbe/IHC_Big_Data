import os
import pandas as pd
import yaml
import flask
from flask import Response
from flask_cors import CORS
from flask import request
from werkzeug.utils import redirect, secure_filename
from logger import Logger
from data_creation import DataCreation
from data_cleaning import DataCleaning
from date_prediction import DatePrediction

app = flask.Flask(__name__)
accepted_type = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet application/vnd.ms-excel"
app.config["DEBUG"] = True
CORS(app)
cors = CORS(app, resource={
    r"/*":{
        "origins":"*"
    }
})
routes = None

def read_tables():
	with open("../tables.yml", 'r') as stream:
		out = yaml.load(stream, Loader=yaml.FullLoader)
		tables = out["d_tables"]

	return tables

def remove_file_ext(filename):
	name = filename.split(".")
	name.remove(name[len(name) - 1])
	name = "".join(name)

	return name

def check_columns(file):
	log.info("Saving " + file.filename + "...")
	tables = read_tables()
	if file.content_type not in accepted_type:
		raise Exception("This file type is not supported.")
	
	name = remove_file_ext(file.filename)
	data_xls = pd.read_excel("../temp/" + file.filename, index_col=None)
	data_xls.to_csv("../temp/" + name + '.csv', encoding='utf-8', index=False, sep=';', date_format='%d-%m-%Y %H:%M')
	df = pd.read_csv("../temp/" + name + ".csv", sep=';')

	for table in tables:
		correct_file = True
		for t in tables[table]:
			if t.get("column") not in df.columns.tolist():
				correct_file = False
		if correct_file:
			return table

	raise Exception("File does not contain required columns.")

if __name__ == "__main__":
	log = Logger()
	d_cleaning = DataCleaning(log)
	d_creation = DataCreation(log)
	date_prediction = DatePrediction(log)
	dfs = d_cleaning.get_dfs()

	@app.route("/upload", methods=["POST"])
	def post_files():
		files_status = []
		try:
			for f in request.files.getlist("file"):
				temp_dict = {}
				f.filename = secure_filename(f.filename)
				if not os.path.isdir("../temp"):
					os.mkdir("../temp")
				f.save("../temp/" + f.filename)
				try:
					name = check_columns(f)
					os.remove("../temp/" + f.filename)
					os.remove("../data/" + name)
					os.rename("../temp/"  + remove_file_ext(f.filename) + ".csv", "../temp/" + name)
					os.rename("../temp/" + name, "../data/" + name)
					temp_dict.update({"status": "success", "name": f.filename})
					f.close()
				except Exception as e:
					log.err(str(e))
					if os.path.isfile("../temp/" + f.filename):
						os.remove("../temp/" + f.filename)
					if os.path.isfile("../temp/" + remove_file_ext(f.filename) + ".csv"):
						os.remove("../temp/" + remove_file_ext(f.filename) + ".csv")
					temp_dict.update({"status": "failed", "name": f.filename, "error": str(e)})

				files_status.append(temp_dict)
		except Exception as e:
			log.err(str(e))
			files_status.append({"status": "failed", "name": f.filename, "error": str(e)})
			if os.path.isfile("../temp/" + f.filename):
				os.remove("../temp/" + f.filename)

		d_cleaning = DataCleaning(log)
		return redirect(location="http://localhost:3000/success?files=" + str(files_status), code=302)


	@app.route("/suppliers", methods=["GET"])
	def get_logistics_suppliers():
		# barchart avg cost
		return Response(d_creation.product_group_avg_cost(dfs["5_raw_spend_data_logistics_suppliers_final.csv"]), mimetype="application/json")

	@app.route("/countries", methods=["GET"])
	def get_all_countries():
		# worldmap and countries
		d_creation.get_routes(dfs["7_raw_all_shipment_lines.csv"])
		continent = request.args.get("continent")
		return Response(d_creation.get_all_countries(dfs["7_raw_all_shipment_lines.csv"], continent), mimetype="application/json")

	@app.route("/routes", methods=["GET"])
	def get_routes():
		# routes and countries
		d_creation.get_routes(dfs["7_raw_all_shipment_lines.csv"])
		continent = request.args.get("continent")
		return Response(d_creation.get_all_routes(dfs["7_raw_all_shipment_lines.csv"], continent), mimetype="application/json")

	@app.route("/incoterms", methods=["GET"])
	def get_incoterms():
		# incoterms
		country_code = request.args.get("country")
		return Response(d_creation.get_incoterms(dfs["7_raw_all_shipment_lines.csv"], country_code), mimetype="application/json")

	@app.route("/providers", methods=["GET"])
	def most_used_providers():
		# Overview most used logistiscs providers
		return Response(d_creation.vizualize_most_used_providers(dfs["5_raw_spend_data_logistics_suppliers_final.csv"]), mimetype="application/json")

	@app.route("/avgspend", methods=["GET"])
	def avg_spend_data():
		# Overview average spend data per supplier
		return Response(d_creation.supplier_avg_spend_data(dfs["5_raw_spend_data_logistics_suppliers_final.csv"]), mimetype="application/json")

	@app.route("/countrystats", methods=["GET"])
	def get_country_stats():
		# get all the stats of a selected country
		country_code = request.args.get("country")
		time_span = request.args.get("timespan")
		return str(d_creation.get_country_stats(dfs["7_raw_all_shipment_lines.csv"], country_code, time_span))

	@app.route("/predictDeliveryDate", methods=["GET"])
	def get_predicted_delivery_days():
		country_code = request.args.get("country")
		return Response(date_prediction.predict_delivery_days(country_code), mimetype="application/json")

	log.info("Job Finished!")

app.run(host="0.0.0.0")