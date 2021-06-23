import React from 'react';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import { fetchSuppliersCost } from '../../api';

am4core.useTheme(am4themes_animated);

interface CountryProps {
    country?: string
}

class PrdAvgCost extends React.Component<CountryProps> {
    chart: am4charts.XYChart | undefined;

    componentDidMount() {
		const x = "column";
		const y = "value"

        let chart = am4core.create("chart_product_group_avg_cost", am4charts.XYChart);
		fetchSuppliersCost(this.props.country)
			.then(data => {
				chart.data = data;
			})

		// X-as
        let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
        categoryAxis.dataFields.category = x;
        categoryAxis.renderer.minGridDistance = 50;

		let label = categoryAxis.renderer.labels.template;
		label.inside = true;
		label.verticalCenter = "middle";
		label.horizontalCenter = "left";
		label.rotation = 270;
		label.fontSize = 20;

        var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
		valueAxis.title.text = "Average cost per invoice (€)";
		valueAxis.title.fontSize = 18;

		chart.numberFormatter.numberFormat = "#,###.00";

        let series = chart.series.push(new am4charts.ColumnSeries());
        series.dataFields.valueY = y;
        series.dataFields.categoryX = x;
        series.columns.template.tooltipText = "{categoryX}: [bold]€{valueY}[/]";

        this.chart = chart;
    }

    render() {
        return (
            <section className="duo_graph">
				<h2>Product group average cost</h2>
                <div id="chart_product_group_avg_cost" style={{ width: "100%", height: "500px" }}></div>
                {this.props.country}
            </section>
        );
    }
}

export default PrdAvgCost;