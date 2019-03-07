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
INPUT = "data.csv"
OUTPUT_FILE = "data.json"
YEAR = 1980
MEASURE = "KTOE"

def processing(file):
	"""
	Function cleaning and processing file	
	Keep for every country the MEASURE value in the YEAR, both specified in the global constant, only top 20 countries
	Delete the missing values
	Delete OECD Total; gives a distored image of the values since OECD is the sum of all the other countries values
	"""

	# Delete INDICATOR, SUBJECT, FREQUENCY and Flag Code, not necessary
	file = file.drop(['INDICATOR', 'SUBJECT', 'FREQUENCY', 'Flag Codes'], axis=1)

	# Get only MEASURE
	file = file.loc[file['MEASURE'] == MEASURE]
	file = file.loc[file['TIME'] == YEAR]

	# Delete the missing values
	file = file.dropna()

	# Delete OECD value
	file = file.loc[file['LOCATION'] != 'OECD']

	# Sort values
	file = file.sort_values(by='Value', ascending=False)

	# Save top 20 countries
	file = file.head(20)
	
	return(file)

if __name__ == "__main__":

	# open input file
	with open(INPUT) as in_file:
		data_frame = pd.read_csv(in_file, skip_blank_lines=True)
	
	# process data
	data_frame = processing(data_frame)

	# export to json
	export = data_frame.to_json(OUTPUT_FILE, orient='records')
