import json
import numpy as np
import pandas as pd
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn import metrics

class DatePrediction:
	log = None
	df = None
	model = None

	def __init__(self, log):
		self.log = log
		self.log.info("Creating date prediction model... ")
		self.df = self.calculate_days_between_ship_date_and_delivery_date()
		self.df = self.define_columns()
		self.model, score = self.train_model()
		self.log.info("Prediction model created, with a score of: " + str(score * 100) + " % ")

	def calculate_days_between_ship_date_and_delivery_date(self):
		df = pd.read_csv("../data/date_prediction.csv", sep=';')
		df = df.dropna()

		df["Customer Country"] = pd.Categorical(df["Customer Country"])
		df["Shipper Country"] = pd.Categorical(df["Shipper Country"])

		df["Customer Country Codes"] = df["Customer Country"].cat.codes
		df["Shipper Country Codes"] = df["Shipper Country"].cat.codes

		df["Ship Date"] = pd.to_datetime(df["Ship Date"], format='%d-%m-%Y %H:%M', errors="coerce")
		df["Actual Del Date"] = pd.to_datetime(df["Actual Del Date"], format='%d-%m-%Y %H:%M', errors="coerce")

		df["days between"] = df["Actual Del Date"] - df["Ship Date"]
		df = df.drop_duplicates()
		df["Shipment Time"] = (df["days between"]).dt.days
		del df["days between"]

		return df

	def define_columns(self):
		df = self.df
		indexNames = df[ df['Shipment Time'] < 1].index
		df.drop(indexNames , inplace=True)

		indexNames = df[ df['Shipper Country Codes'] < 1].index
		df.drop(indexNames , inplace=True)

		df = df.dropna()
		df["Shipment Time"] = df["Shipment Time"].astype("int32")

		indexNames = df[ df['Shipment Time'] > 365 ].index
		df.drop(indexNames , inplace=True)

		df = df.reset_index(drop=True)

		return df

	def train_model(self):
		df = self.df
		x = df["Customer Country Codes"].to_numpy()
		y = df["Shipment Time"].to_numpy()
		xRes = x.reshape((-1,1))
		yRes = y.reshape((-1,1))

		x_train, x_test, y_train, y_test = train_test_split(xRes, yRes, test_size=0.3, random_state=101)

		scaler = StandardScaler()
		scaler.fit(x_train)

		X_trainScaled = scaler.transform(x_train)
		X_testScaled = scaler.transform(x_test)

		accScores = pd.DataFrame(columns = ['model', 'score'])
		model = LogisticRegression(multi_class='multinomial')
		model.fit(X_trainScaled, y_train.ravel())
		y_pred = model.predict(X_testScaled)
		score = metrics.accuracy_score(y_test, y_pred)
		pd.Series(["Logistic Regression", score], index=accScores.columns)

		return model, score

	def predict_delivery_days(self, country_code):
		df = self.df
		country_code = country_code.upper()

		country_code_number = df[df['Customer Country'] == country_code]['Customer Country Codes'].iloc[0]
		pred = self.model.predict(np.array([[country_code_number]]))
		self.log.info("Predicted delivery dates: " + str(pred))

		df = df[df["Customer Country"] == country_code]
		df["Ship Via Code"] = df["Ship Via Code"].str.replace(' ', '_')
		ship_via_percentages = df["Ship Via Code"].value_counts(normalize=True)
		temp_dict = ship_via_percentages.to_dict()
		temp_dict.update(days = int(pred[0]))

		return json.dumps(temp_dict, indent = 4)
