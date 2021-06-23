import yaml
import numpy as np
import pandas as pd

class DataCleaning:
	dfs = {}
	log = None

	def __init__(self, log):
		self.log = log
		tables = self.read_tables()

		for table in tables:
			df = pd.read_csv("../data/"+table, sep=';', engine="c", decimal=',')
			df = self.clean_columns(table, df, tables[table])
			df = self.change_dtypes(df, tables[table])
		
			df.columns = df.columns.str.lower()
			df.columns = df.columns.str.replace(' ', '_')

			self.dfs.update({table: df})

	def get_dfs(self):
		return self.dfs

	def read_tables(self):
		with open("../tables.yml", 'r') as stream:
			out = yaml.load(stream, Loader=yaml.FullLoader)
			tables = out["d_tables"]

		return tables

	def clean_columns(self, table, df, columns):
		self.log.info("Cleaning '" + table + "'...")
		yml_columns = list(map(lambda x : x["column"], columns))

		for column in df.columns:
			if column not in yml_columns:
				df.pop(column)

		return df

	def replace_nan_empty(self, values):
		# change "floats" (NaN's) to empty strings so category doesn't crash
		temp = []
		for v in values:
			if type(v) != float:
				temp.append(v)
			else:
				temp.append("")

		return temp

	def change_dtypes(self, df, columns):
		# columns is a list of dictionaries, with columns and dytpes as keys, get those as individual lists...
		yml_columns = list(map(lambda x : x["column"], columns))
		yml_dtypes = list(map(lambda x : x["dtype"], columns))
		for column in df.columns:
			index = yml_columns.index(column)
			dtype = yml_dtypes[index]

			if dtype == "int32" or dtype == "int64":
				df[column] = df[column].astype(float)
				df[column] = df[column].replace("#N/B", np.nan)
				df[column] = df[column].fillna(0).astype(dtype)
				df[column] = df[column].astype(dtype)
			elif dtype == "float32" or dtype == "float64":
				df[column] = df[column].astype(dtype)
			elif dtype == "categorical":
				df[column] = df[column].replace("NA", np.nan)
				df[column] = df[column].astype(str).str.lower()
				values = self.replace_nan_empty(list(df[column].unique()))
				df[column] = pd.Categorical(df[column], categories = values)
			elif dtype == "string":
				df[column] = df[column].astype(dtype)
			elif dtype == "datetime":
				df[column] = pd.to_datetime(df[column], format='%d-%m-%Y %H:%M')

		return df
