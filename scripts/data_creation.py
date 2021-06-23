import json
import pandas as pd
from datetime import datetime, timedelta

class DataCreation:
	default_path = ""
	log = None
	routes = None

	def __init__(self, log):
		self.log = log
		self.default_path = "../frontend/src/data/"
	
	def vizualize_most_used_providers(self, df):
		pd.options.display.float_format = '{:.5f}'.format
		tot = df["supplier_name"].value_counts()[df["supplier_name"].value_counts() > 10]

		most_used_providers = []
		dictionary = tot.to_dict()

		for key in dictionary:
			temp_dict = {}
			temp_dict.update(column=key)
			temp_dict.update(value=dictionary[key])
			most_used_providers.append(temp_dict)
	
		return json.dumps(most_used_providers, indent = 4)
	
	def product_group_avg_cost(self, df):
		pd.options.display.float_format = '{:.5f}'.format
		df.groupby("product_group")["net_amount_eur"].sum()

		tot = df.groupby("product_group")[["count_of_invoices", "net_amount_eur"]].sum()
		tot = tot["net_amount_eur"].div(tot["count_of_invoices"].values, axis=0)

		product_group_avg_cost = []
		dictionary = tot.to_dict()

		for key in dictionary:
			temp_dict = {}
			temp_dict.update(column=key)
			temp_dict.update(value=dictionary[key])
			product_group_avg_cost.append(temp_dict)

		return json.dumps(product_group_avg_cost, indent = 4)

	def decide_scale(self, size):
		if (size < 30):
			return 0.15
		elif (size < 100):
			return 0.2
		return 0.25

	def get_all_countries(self, df, continent):
		shipper_countries = df["shipper_country"].unique().tolist()
		customer_countries = df["customer_country"].unique().tolist()
		to_be_used_countries = list(set(shipper_countries + customer_countries))

		used_countries = []
		with open(f"{self.default_path}all_countries.json", 'r') as json_file:
			all_countries = json.load(json_file)
			
			for country in all_countries:
				if country["code"].lower() in to_be_used_countries and (country["region"] == continent or continent == None):
					sizes = self.routes[self.routes["customer_country"] == country["code"].lower()]
					size = sizes["size"].sum()
					country.update(scale=self.decide_scale(int(size)))
					country.update(size=int(size))
					used_countries.append(country)

		return json.dumps(used_countries, indent = 4)

	def get_routes(self, df):
		routes = df[["shipper_country", "customer_country"]]
		routes = routes.groupby(routes.columns.tolist(), as_index=False).size().drop_duplicates()
		self.routes = routes[routes["size"] != 0]

	def get_all_routes(self, df, continent):
		shipper_countries = self.routes["shipper_country"].tolist()
		customer_countries = self.routes["customer_country"].tolist()

		# not our fault this shit library wants a dogshit format
		with open(f"{self.default_path}all_countries.json", 'r') as json_file:
			countries = json.load(json_file)

			routes_list = []
			for i, country in enumerate(shipper_countries):
				temp_list = []
				temp_dict= {}
				shipperdict = {}
				custdict = {}
				for c in countries:
					in_cont = False
					if country == c["code"].lower():
						shipperdict.update(longitude=c["longitude"])
						shipperdict.update(latitude=c["latitude"])

						for c_ in countries:
							if customer_countries[i] == c_["code"].lower() and (c_["region"] == continent or continent == None):
								in_cont = True
								custdict.update(longitude=c_["longitude"])
								custdict.update(latitude=c_["latitude"])

						if in_cont:
							temp_list.append(shipperdict)
							temp_list.append(custdict)
				temp_dict.update(multiGeoLine=[temp_list])
				routes_list.append(temp_dict)

			actual_routes = []
			for entry in routes_list:
				if entry["multiGeoLine"][0]:
					actual_routes.append(entry)
		
		return json.dumps(actual_routes, indent = 4)
	
	def get_incoterms(self, df, country_code=None):
		if country_code != None:
			df = df.loc[(df['shipper_country'] == country_code.lower()) | (df['customer_country'] == country_code.lower())]
		df['delivery_terms'] = df['delivery_terms'].str.replace('\d+', '')
		incoterms_df = df[["shipment_id", "delivery_terms"]].drop_duplicates()
		incoterms = incoterms_df["delivery_terms"].value_counts().to_dict()

		temp_list = []
		for incoterm in incoterms:
			temp_dict = {}
			temp_dict.update(column=incoterm)
			temp_dict.update(value=incoterms[incoterm])
			temp_list.append(temp_dict)

		return json.dumps(temp_list, indent = 4)
	

	def supplier_avg_spend_data(self, inc_df):
		df = inc_df.groupby("supplier_name")[["net_amount_eur", "count_of_invoices"]].sum()
		df["avg_eur_per_invoice"] = df["net_amount_eur"] / df["count_of_invoices"]
		df = df[df["avg_eur_per_invoice"] > 0]

		supplier_avg_spend_data = []
		df2 = df.sort_values("avg_eur_per_invoice", ascending=False)["avg_eur_per_invoice"].round(2)
		dictionary = df2.to_dict()

		for key in dictionary:
			temp_dict = {}
			temp_dict.update(column=key)
			temp_dict.update(invoices=int(inc_df[inc_df["supplier_name"] == key]["count_of_invoices"].sum()))
			temp_dict.update(value=dictionary[key])
			supplier_avg_spend_data.append(temp_dict)

		return json.dumps(supplier_avg_spend_data, indent = 4)

	def get_country_stats(self, df, country_code, time_span):
		if country_code != None:
			df = df.loc[(df['shipper_country'] == country_code.lower()) | (df['customer_country'] == country_code.lower())]
		
		df["ship_date"] = pd.to_datetime(df['ship_date'])
		days = datetime.now() - timedelta(int(time_span))
		
		countrystats_df = df[["shipment_id", "delivery_terms", "shipper_city", "customer_city", "ship_date", "shipper_name", "order_no", "state"]]
		
		countrystats_df = countrystats_df[(df["ship_date"] >= days) & (df["ship_date"] < datetime.now())]
		countrystats_df["ship_date"] = countrystats_df["ship_date"].dt.strftime('%d-%m-%Y')
		countrystats_df = countrystats_df.drop_duplicates()
		
		return countrystats_df.values.tolist()
