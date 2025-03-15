"use client";

import { useEffect, useState } from "react";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    TooltipProps
} from "recharts";
import { formatCurrency } from "@/lib/utils";
import { NameType, ValueType } from "recharts/types/component/DefaultTooltipContent";

// Fixed sample data for the chart
const monthlyData = [
    { name: "Jan", revenue: 4000, orders: 24 },
    { name: "Feb", revenue: 3000, orders: 18 },
    { name: "Mar", revenue: 5000, orders: 35 },
    { name: "Apr", revenue: 8000, orders: 42 },
    { name: "May", revenue: 6000, orders: 38 },
    { name: "Jun", revenue: 9500, orders: 63 },
    { name: "Jul", revenue: 11000, orders: 82 },
    { name: "Aug", revenue: 13500, orders: 94 },
    { name: "Sep", revenue: 12000, orders: 87 },
    { name: "Oct", revenue: 14000, orders: 105 },
    { name: "Nov", revenue: 17000, orders: 123 },
    { name: "Dec", revenue: 21000, orders: 145 },
];

const weeklyData = [
    { name: "Mon", revenue: 1200, orders: 8 },
    { name: "Tue", revenue: 1400, orders: 12 },
    { name: "Wed", revenue: 1600, orders: 14 },
    { name: "Thu", revenue: 1700, orders: 15 },
    { name: "Fri", revenue: 2100, orders: 18 },
    { name: "Sat", revenue: 2400, orders: 20 },
    { name: "Sun", revenue: 1900, orders: 16 },
];

type CustomTooltipProps = TooltipProps<ValueType, NameType>;

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
    if (active && payload && payload.length && payload[0] && payload[1]) {
        return (
            <div className="bg-white dark:bg-gray-800 p-2 sm:p-3 shadow-md rounded border border-gray-200 dark:border-gray-700 text-xs sm:text-sm">
                <p className="font-medium text-gray-900 dark:text-white">{label}</p>
                <p className="text-xs sm:text-sm text-green-600">
                    {`Revenue: ${formatCurrency(payload[0].value as number)}`}
                </p>
                <p className="text-xs sm:text-sm text-blue-600">
                    {`Orders: ${payload[1].value}`}
                </p>
            </div>
        );
    }

    return null;
};

type TimeRange = "weekly" | "monthly";

export function SalesChart() {
    const [timeRange, setTimeRange] = useState<TimeRange>("weekly");
    const [showNote, setShowNote] = useState(true);
    const [chartHeight, setChartHeight] = useState(300);
    const [mounted, setMounted] = useState(false);
    const [fontSize, setFontSize] = useState(12);
    const [tickFontSize, setTickFontSize] = useState(12);
    const [yAxisWidth, setYAxisWidth] = useState(40);

    // Get the correct data based on the selected time range
    const data = timeRange === "weekly" ? weeklyData : monthlyData;

    const handleTimeRangeChange = (newRange: TimeRange) => {
        setTimeRange(newRange);
    };

    // Automatically hide the note after 5 seconds
    useEffect(() => {
        const timer = setTimeout(() => {
            setShowNote(false);
        }, 5000);

        return () => clearTimeout(timer);
    }, []);

    // Set mounted state and adjust chart dimensions based on screen size
    useEffect(() => {
        setMounted(true);

        const handleResize = () => {
            if (typeof window !== 'undefined') {
                if (window.innerWidth < 640) { // sm breakpoint
                    setChartHeight(200);
                    setFontSize(10);
                    setTickFontSize(10);
                    setYAxisWidth(30);
                } else if (window.innerWidth < 768) { // md breakpoint
                    setChartHeight(250);
                    setFontSize(11);
                    setTickFontSize(11);
                    setYAxisWidth(35);
                } else {
                    setChartHeight(300);
                    setFontSize(12);
                    setTickFontSize(12);
                    setYAxisWidth(40);
                }
            }
        };

        // Set initial height
        handleResize();

        // Add event listener
        window.addEventListener('resize', handleResize);

        // Cleanup
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div>
            {showNote && (
                <div className="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 p-2 mb-3 sm:mb-4 rounded text-xs sm:text-sm">
                    This is fixed data for display purposes only
                </div>
            )}

            <div className="flex justify-end mb-3 sm:mb-4">
                <div className="inline-flex rounded-md shadow-sm">
                    <button
                        onClick={() => handleTimeRangeChange("weekly")}
                        className={`px-2 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm font-medium rounded-l-md border ${timeRange === "weekly"
                            ? "bg-primary text-white border-primary"
                            : "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-600"
                            }`}
                    >
                        Weekly
                    </button>
                    <button
                        onClick={() => handleTimeRangeChange("monthly")}
                        className={`px-2 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm font-medium rounded-r-md border border-l-0 ${timeRange === "monthly"
                            ? "bg-primary text-white border-primary"
                            : "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-600"
                            }`}
                    >
                        Monthly
                    </button>
                </div>
            </div>
            <div className="h-[300px]" style={{ height: chartHeight }}>
                {mounted && (
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                            data={data}
                            margin={{
                                top: 10,
                                right: 10,
                                left: 0,
                                bottom: 0,
                            }}
                        >
                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
                            <XAxis
                                dataKey="name"
                                stroke="#6B7280"
                                fontSize={fontSize}
                                tickLine={false}
                                axisLine={false}
                                tick={{ fontSize: tickFontSize }}
                            />
                            <YAxis
                                stroke="#6B7280"
                                fontSize={fontSize}
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={(value) => `$${value}`}
                                tick={{ fontSize: tickFontSize }}
                                width={yAxisWidth}
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Area
                                type="monotone"
                                dataKey="revenue"
                                stackId="1"
                                stroke="#10B981"
                                fill="#10B981"
                                fillOpacity={0.2}
                            />
                            <Area
                                type="monotone"
                                dataKey="orders"
                                stackId="2"
                                stroke="#3B82F6"
                                fill="#3B82F6"
                                fillOpacity={0.2}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                )}
            </div>
        </div>
    );
} 