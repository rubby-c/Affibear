import { GetPrettyDate, Round } from "./helpers";

export function GetAffiliateChart(arr) {
    if (arr === undefined || arr === null) {
        return;
    }

    const x = arr.map(i => GetPrettyDate(i.date));
    const clicks = arr.map(i => i.clicks);

    const revenue = arr.map(day => {
        return day.orders.reduce((totalRevenue, conversion) => {
            return Round(totalRevenue + conversion.commission);
        }, 0);
    });

    const chart = structuredClone(DefaultChart);
    chart.xAxis.data = x;

    // X axis dates, etc.
    chart.series[0] = {
        name: 'Clicks',
        data: clicks,
        type: 'bar',
        barWidth: '50%',
        itemStyle: {
            color: '#63B3ED',
            width: 2
        }
    };

    // Revenue series.
    chart.series[1] = {
        name: 'Commissions',
        color: '#68D391',
        data: revenue,
        type: 'line',
        smooth: true,
        showSymbol: false,
        lineStyle: {
            color: '#68D391',
            opacity: 0.8,
            width: 3
        }
    }

    return chart;
}

const DefaultChart = {
    legend: {},
    grid: {
        bottom: '0',
        left: '2%',
        right: '2%',
        top: '15%',
        containLabel: true
    },
    xAxis: {
        type: 'category',
        data: []
    },
    yAxis: {
        type: 'value',
        min: 0,
        splitLine: {
            lineStyle: {
                color: '#80808050'
            }
        }
    },
    series: [],
    tooltip: {
        trigger: 'axis'
    }
}