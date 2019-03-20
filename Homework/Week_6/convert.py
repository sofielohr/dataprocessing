#!/usr/bin/env python
# Name: Sofie Löhr
# Student number: 11038926
"""
This script parses and processes the data from a csv file
"""

import csv
import pandas as pd 
import numpy
import json

# Global constants
INPUT = "NFA_2018.csv"
OUTPUT_FILE = "data.json"
data_variable = "EFConsPerCap"

def processing(file):
	"""
	Function cleaning and processing file	
	"""

	# Delete INDICATOR, SUBJECT, FREQUENCY and Flag Code, not necessary
	file = file.drop(['Percapita GDP (2010 USD)', 'UN_region', 'UN_subregion'], axis=1)

	# Get only MEASURE
	file = file.loc[file['record'] == data_variable]

	# Delete the missing values
	file = file.dropna()

	file = file.rename(columns = {'ISO alpha-3 code' : 'CountryCode'})

	print(file)

	return(file)

if __name__ == "__main__":

	# open input file
	with open(INPUT) as in_file:
		data_frame = pd.read_csv(in_file, skip_blank_lines=True)
	
	# process data
	data_frame = processing(data_frame)

	# export to json
	export = data_frame.to_json(OUTPUT_FILE, orient='records')
