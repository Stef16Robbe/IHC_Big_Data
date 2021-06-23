import React from 'react';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import { fetchIncoterms } from '../../api';

am4core.useTheme(am4themes_animated);

interface CountryProps {
    country?: string,
	width: number
}

class Incoterms extends React.Component<CountryProps> {
    chart: am4charts.XYChart | undefined;

    componentDidMount() {
		const x = "column";
		const y = "value"

        let chart = am4core.create("chart_incoterms", am4charts.XYChart);
		
		fetchIncoterms(this.props.country)
			.then(data => {
				chart.data = data;

			})

		// X-as
        let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
        categoryAxis.dataFields.category = x;
        categoryAxis.renderer.minGridDistance = 50;
		categoryAxis.renderer.labels.template.disabled = true;

        chart.yAxes.push(new am4charts.ValueAxis());

        let series = chart.series.push(new am4charts.ColumnSeries());
        series.dataFields.valueY = y;
        series.dataFields.categoryX = x;
        series.columns.template.tooltipText = "{categoryX}: [bold]{valueY}[/]";
        
		const valueLabel = series.columns.template.createChild(am4core.Label);
		valueLabel.text = "{categoryX}";
		valueLabel.fontSize = 20;
		valueLabel.valign = "bottom";
		valueLabel.strokeWidth = 0;
		valueLabel.align = "center"
		valueLabel.dy = -20;

        let columnTemplate = series.columns.template;
        columnTemplate.strokeWidth = 2;
        columnTemplate.strokeOpacity = 1;

        this.chart = chart;
    }

    render() {
        return (
            <section className="duo_graph">
				<h2>Most used incoterms per shipment</h2>
                <div id="chart_incoterms" style={{ width: "100%", height: this.props.width + "px" }}></div>
            </section>
        );
    }
}

export default Incoterms;