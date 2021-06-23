import json
import requests
from bs4 import BeautifulSoup

import pandas as pd
df = pd.read_csv("../data/continents2.csv")
df.dropna()

def get_continent(country_code):
	continent = df[df['alpha-2'] == country_code]['region'].to_list()[0]
	return continent if type(continent) != float else ""

url = "https://developers.google.com/public-data/docs/canonical/countries_csv"
page = requests.get(url)

soup = BeautifulSoup(page.text, "html.parser")

table = soup.find("table")

table_titles = table.find_all("th")
column_titles = []
output_rows = []

for column_title in table_titles:
    column_titles.append(column_title.text)

for table_row in table.find_all("tr"):
	columns = table_row.find_all("td")
	output_row = []
	for column in columns:
		output_row.append(column.text)

	output_rows.append(output_row)

def clean_json(countries):
	del output_rows[0]
	for item in output_rows:
		temp_dict = {}
		temp_dict.update(title=item[3])

		try:
			temp_dict.update(region=get_continent(item[0]))
		except:
			temp_dict.update(region="")

		try:
			temp_dict.update(latitude=float(item[1]))
			temp_dict.update(longitude=float(item[2]))
		except:
			temp_dict.update(latitude=0)
			temp_dict.update(longitude=0)
		
		temp_dict.update(code=item[0])
		countries.append(temp_dict)

countries = []
clean_json(countries)
json_object = json.dumps(countries, indent = 4)

with open("../frontend/src/data/all_countries.json", "w") as outfile:
	    outfile.write(json_object)
