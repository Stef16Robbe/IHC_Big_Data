import React from 'react';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import { fetchSupplierAvgCost } from '../../api';

am4core.useTheme(am4themes_animated);

class SupplierSpend extends React.Component {
    chart: am4charts.XYChart | undefined;

    componentDidMount() {
		const x = "column";
		const y = "value";

        let chart = am4core.create("chart_supplier_spend", am4charts.XYChart);

        fetchSupplierAvgCost()
			.then(data => {
				chart.data = data;
			})

		// X-as
		let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
		categoryAxis.dataFields.category = x;

		let label = categoryAxis.renderer.labels.template;
		label.inside = true;
		label.verticalCenter = "middle";
		label.horizontalCenter = "left";
		label.rotation = 270;
		label.fontSize = 20;

		var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
		valueAxis.title.text = "Total expences (€)";
		valueAxis.title.fontSize = 18;

		let series = chart.series.push(new am4charts.ColumnSeries());
		series.dataFields.valueY = y;
		series.dataFields.categoryX = x;
		series.columns.template.tooltipText = "{categoryX}: [bold]€{valueY}[/] ({invoices} invoices)";
		
		chart.scrollbarX = new am4core.Scrollbar();
		chart.scrollbarX.startGrip.disabled = true;
		chart.scrollbarX.endGrip.disabled = true;
        chart.scrollbarX.parent = chart.bottomAxesContainer;
		chart.zoomOutButton.disabled = true;
		
        chart.events.on("appeared", function () {
			categoryAxis.zoomToIndexes(0, 12);
		});

		chart.exporting.menu = new am4core.ExportMenu();
		
        this.chart = chart;
    }
	
    render() {
		return (
            <>
				<h2>Expenses per supplier</h2>
                <div id="chart_supplier_spend" style={{ width: "100%", height: "500px" }}></div>
            </>
        );
    }
}

export default SupplierSpend;