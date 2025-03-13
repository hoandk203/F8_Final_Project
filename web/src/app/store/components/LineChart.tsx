"use client";

import { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

interface LineChartProps {
  data: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      borderColor: string;
      backgroundColor: string;
    }[];
  };
}

const LineChart = ({ data }: LineChartProps) => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);

  useEffect(() => {
    if (chartRef.current) {
      // Nếu đã có biểu đồ, hủy nó trước khi tạo mới
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      const ctx = chartRef.current.getContext("2d");
      if (ctx) {
        chartInstance.current = new Chart(ctx, {
          type: "line",
          data: data,
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              y: {
                beginAtZero: true,
                ticks: {
                  callback: function (value: any) {
                    return "$" + value.toLocaleString();
                  },
                },
                grid: {
                  color: "rgba(0, 0, 0, 0.05)",
                },
              },
              x: {
                grid: {
                  color: "rgba(0, 0, 0, 0.05)",
                },
              }
            },
            plugins: {
              legend: {
                position: "top",
                align: "end",
                labels: {
                  boxWidth: 10,
                  usePointStyle: true,
                  pointStyle: "circle"
                }
              },
              tooltip: {
                callbacks: {
                  label: function (context: any) {
                    let label = context.dataset.label || "";
                    if (label) {
                      label += ": ";
                    }
                    if (context.parsed.y !== null) {
                      label += "$" + context.parsed.y;
                    }
                    return label;
                  },
                },
              },
            },
          },
        });
      }
    }

    // Thêm event listener để resize biểu đồ khi kích thước container thay đổi
    const resizeObserver = new ResizeObserver(() => {
      if (chartInstance.current) {
        chartInstance.current.resize();
      }
    });
    
    if (chartRef.current && chartRef.current.parentElement) {
      resizeObserver.observe(chartRef.current.parentElement);
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
      resizeObserver.disconnect();
    };
  }, [data]);

  return <canvas ref={chartRef} style={{ width: '100%', height: '100%'}} />;
};

export default LineChart;
