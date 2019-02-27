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
INPUT = "KNMI_20190101.csv"
OUTPUT_FILE = "data.json"

def processing(file):
	"""
	Function cleaning and processing file	
	"""

	# delete the first row (contains nothing)
	file = file.drop(0, axis=0)

	# change column names
	file = file.rename(columns={'# STN':'STN', 'YYYYMMDD':'Date', '   SP':'SP'})

	i = 1;
	# convert Date to date time
	for elementen in file.loc[:, 'Date']:
		date_time = pd.to_datetime(elementen, format='%Y%m%d')
		file.loc[i, 'Date'] = date_time
		i += 1

	# Delete STN, not necessary
	file = file.drop('STN', axis=1)

	return(file)


if __name__ == "__main__":

	# open input file
	with open(INPUT) as in_file:
		data_frame = pd.read_csv(in_file, header=10, skip_blank_lines=True)
	
	# process data
	data_frame = processing(data_frame)

	# export to json
	export = data_frame.to_json(OUTPUT_FILE, orient='records')
