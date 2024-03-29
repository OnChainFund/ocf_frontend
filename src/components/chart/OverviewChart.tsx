import { createChart, ColorType } from "lightweight-charts";
import React, { useEffect, useRef, useState } from "react";
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
function getWindowSize() {
  const { innerWidth, innerHeight } = window;
  return { innerWidth, innerHeight };
}
export const OverviewChart = (props: Prop) => {
  const [windowSize, setWindowSize] = useState(getWindowSize());

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
      setWindowSize(getWindowSize());
      chart.applyOptions({ width: windowSize.innerWidth * 0.7 });
    };

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: backgroundColor },
        textColor,
      },
      width: 900,
      height: 300,
    });
    chart.timeScale().fitContent();

    const newSeries = chart.addAreaSeries({
      lineColor,
      topColor: areaTopColor,
      bottomColor: areaBottomColor,
    });
    newSeries.setData(data);

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      chart.remove();
    };
  }, [data, backgroundColor, lineColor, textColor, areaTopColor, areaBottomColor, windowSize.innerWidth]);

  return (
    <>
      <div ref={chartContainerRef} />
    </>
  );
};
