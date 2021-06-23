import React, { useEffect, useState } from 'react';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4maps from "@amcharts/amcharts4/maps";
import am4geodata_worldLow from "@amcharts/amcharts4-geodata/worldLow";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import {fetchRoutes, fetchCountries} from '../../api';
import './map.css'

am4core.useTheme(am4themes_animated);

export const Map: React.VoidFunctionComponent = () => {
	
	let chart: am4maps.MapChart | undefined;
	const continents = [
		"Asia",
		"Europe",
		"Africa",
		"Oceania",
		"Americas"
	]

	const SVG = "https://upload.wikimedia.org/wikipedia/commons/b/b7/Rule_Segment_-_Circle_open_-_20px.svg";
	const latitude = "latitude";
	const longitude = "longitude";
	const multiGeoLine = "multiGeoLine";

	// Create map instance
	chart = am4core.create("chart_world_map", am4maps.MapChart);
	let interfaceColors = new am4core.InterfaceColorSet();

	// Set map definition
	chart.geodata = am4geodata_worldLow;

	// Set projection
	chart.projection = new am4maps.projections.Mercator();

	// Add zoom control
	chart.zoomControl = new am4maps.ZoomControl();

	// Set initial zoom
	chart.homeZoomLevel = 2.5;
	chart.homeGeoPoint = {
		latitude: 52,
		longitude: 5
	};

	chart.chartContainer.wheelable = false;

	// Create map polygon series
	let polygonSeries = chart.series.push(new am4maps.MapPolygonSeries());
	polygonSeries.exclude = ["AQ"];
	polygonSeries.useGeodata = true;
	polygonSeries.mapPolygons.template.nonScalingStroke = false;
	
	// Add images
	let imageSeries = chart.series.push(new am4maps.MapImageSeries());
	let imageTemplate = imageSeries.mapImages.template;
	imageTemplate.tooltipText = "{title} \n Number of shipments: {size}";
	imageTemplate.nonScaling = true;

	// Markers
	let marker = imageTemplate.createChild(am4core.Image);
	marker.href = SVG;
	marker.horizontalCenter = "middle";
	marker.verticalCenter = "middle";
	marker.propertyFields.scale = "scale"
	marker.fill = interfaceColors.getFor("alternativeBackground");
	marker.url = "country/{code}"

	imageTemplate.propertyFields.latitude = latitude;
	imageTemplate.propertyFields.longitude = longitude;

	fetchCountries("")
		.then(data => {
			imageSeries.data = data;
		})

	// Add lines
	let lineSeries = chart.series.push(new am4maps.MapLineSeries());
	lineSeries.dataFields.multiGeoLine = multiGeoLine;

	let lineTemplate = lineSeries.mapLines.template;
	lineTemplate.nonScalingStroke = true;
	lineTemplate.arrow.nonScaling = true;
	lineTemplate.arrow.width = 4;
	lineTemplate.arrow.height = 6;
	lineTemplate.stroke = interfaceColors.getFor("alternativeBackground");
	lineTemplate.fill = interfaceColors.getFor("alternativeBackground");
	lineTemplate.line.strokeOpacity = 0.4;

	fetchRoutes("")
		.then(data => {
			lineSeries.data = data
		})


	const [continent, setContinent] = useState('');

	useEffect(() => {
		fetchCountries(continent)
			.then(data => {
				imageSeries.data = data;
			})
		fetchRoutes(continent)
			.then(data => {
				lineSeries.data = data
			})
	}, [continent]);


	return (
		<>
			<h2>World map</h2>
			{continents.map((continent, index) => (
				<button type="button" className="btn btn-success" key={index} onClick={() => setContinent(continent)}>{continent}</button>
			))}
			<div id="chart_world_map" style={{ width: "100%", height: "700px" }}></div>
		</>
	);
}

export default Map;
