import { createChart, ColorType } from "lightweight-charts";
import React, { useEffect, useRef } from "react";
interface Prop {
  data;
  colors: {
    backgroundColor: string;
    lineColor: string;
    textColor: string;
    areaTopColor: string;
    areaBottomColor: string;
  };
}
interface ChartData {
  time: string;
  value: number;
}
export const SimpleChart = (props: Prop) => {
  const {
    data,
    colors: {
      backgroundColor = "white",
      lineColor = "#2962FF",
      textColor = "black",
      areaTopColor = "#2962FF",
      areaBottomColor = "rgba(41, 98, 255, 0.28)",
    },
  } = props;
  const chartContainerRef = useRef();

  useEffect(() => {
    const handleResize = () => {
      chart.applyOptions({ width: 100 });
    };

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: backgroundColor },
        textColor,
      },
      width: 600,
      height: 300,
    });
    chart.timeScale().fitContent();

    const newSeries = chart.addAreaSeries({
      lineColor,
      topColor: areaTopColor,
      bottomColor: areaBottomColor,
    });
    let newDataList: ChartData[] = [];
    for (var index in data) {
      newDataList.push({ time: data[index].time, value: data[index].value });
    }
    //newSeries.setData(data);
    newSeries.setData(newDataList);

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);

      chart.remove();
    };
  }, [
    data,
    backgroundColor,
    lineColor,
    textColor,
    areaTopColor,
    areaBottomColor,
  ]);

  return (
    <>
      <div ref={chartContainerRef} />
    </>
  );
};
