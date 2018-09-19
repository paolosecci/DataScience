#dependencies
from flask import Flask, jsonify

import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func
from sqlalchemy import inspect

###LINK DB###
#setup data_engine
engine = create_engine("sqlite:///Resources/hawaii.sqlite")
#create base from model
Base = automap_base()
#reflect tables
Base.prepare(engine, reflect=True)
Base.classes.keys()
#create references to each table
Measurement = Base.classes.measurement
Station = Base.classes.station
#link py to db
session = Session(engine)
#set inspector
inspector = inspect(engine)



###APP USING FLASK
app = Flask(__name__)

@app.route("/") #home
def welcome1():
    "Listing of the available API routes"
    string_out = "Available Routes:<br/>"
    string_out += "/api/v1.0/precipitation<br/>"
    string_out += "/api/v1.0/stations<br/>"
    string_out += "/api/v1.0/tobs<br/>"
    string_out += "/api/v1.0/yyyy-mm-dd<br/>"
    string_out += "/api/v1.0/yyyy-mm-dd/yyyy-mm-dd"
    
    return(string_out)

@app.route("/api/v1.0/precipitation") #precipitation
def precipitation():
    
    "Queries for the dates and temperature observations since 1 Jan 2017"
    
    #query for dates and tobs
    prcp_re = session.query(Measurement.date, Measurement.tobs).filter(Measurement.date > '2017-01-01').all()
    
    #create dictionary of lists, fill list 
    prcp_dict = {
        'date': [],
        'tobs': [],
    }
    for prcp in prcp_re:
        prcp_dict['date'].append(Measurement.date)
        prcp_dict['tobs'].append(Measurement.tobs)
        
    prcp_json = jsonify(prcp_dict)
    return prcp_json

@app.route("/api/v1.0/stations") #stations
def stations():
    
    "Returns a JSON list of stations from the dataset"
    
    station_re = session.query(Station.station).all()
    
    station_list = []
    for row in station_re:
        station_list.append(row.station)
    
    stations_json = jsonify(station_list)
    return stations_json

@app.route("/api/v1.0/tobs") #tobs
def tobs():
    
    "Returns a JSON list of Temperature Observations (tobs) since 1 Jan 2017"
    
    tobs_re = session.query(Measurement.tobs).filter(Measurement.date > '2017-01-01').all()
    
    tobs_list = []
    for row in tobs_re:
        tobs_list.append(row.tobs)
    
    tobs_json = jsonify(tobs_list)
    return tobs_json

@app.route("/api/v1.0/<start>") #start
def start(start):
    
    "Returns a JSON list of the minimum temperature, the average temperature, and the max temperature for a given start"
    
    s_re_uf = session.query(func.min(Measurement.tobs), func.avg(Measurement.tobs), func.max(Measurement.tobs))
    s_re = s_re_uf.filter(Measurement.date >= start)
    
    s_dict = {
        'min': s_re[0][0],
        'mean': s_re[0][1],
        'max': s_re[0][2]
    }
    
    s_json = jsonify(s_dict)
    return s_json

@app.route("/api/v1.0/<start>/<end>") #start/end
def start_end(start, end):
    
    "Returns a JSON list of the minimum temperature, the average temperature, and the max temperature for a given start-end"
    
    se_re_uf = session.query(func.min(Measurement.tobs), func.avg(Measurement.tobs), func.max(Measurement.tobs))
    se_re = se_re_uf.filter(Measurement.date >= start).filter(Measurement.date <= end)
    
    se_dict = {
        'min': se_re[0][0],
        'mean': se_re[0][1],
        'max': se_re[0][2]
    }
    
    se_json = jsonify(se_dict)
    return se_json

if __name__ == '__main__':
    app.run(debug=True)