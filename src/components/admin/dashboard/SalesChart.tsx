"use client";

import { useState } from "react";
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
    if (active && payload && payload.length) {
        return (
            <div className="bg-white dark:bg-gray-800 p-3 shadow-md rounded border border-gray-200 dark:border-gray-700">
                <p className="font-medium text-gray-900 dark:text-white">{label}</p>
                <p className="text-sm text-green-600">
                    Revenue: {formatCurrency(payload[0].value as number)}
                </p>
                <p className="text-sm text-blue-600">
                    Orders: {payload[1].value}
                </p>
            </div>
        );
    }
    return null;
};

function SalesChart() {
    const [timeRange, setTimeRange] = useState<'weekly' | 'monthly'>('monthly');
    const data = timeRange === 'weekly' ? weeklyData : monthlyData;

    return (
        <div>
            <div className="flex justify-end mb-4">
                <div className="inline-flex rounded-md shadow-sm" role="group">
                    <button
                        type="button"
                        className={`px-4 py-2 text-sm font-medium rounded-l-md ${timeRange === 'weekly'
                            ? 'bg-primary text-white'
                            : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200'
                            }`}
                        onClick={() => setTimeRange('weekly')}
                    >
                        Weekly
                    </button>
                    <button
                        type="button"
                        className={`px-4 py-2 text-sm font-medium rounded-r-md ${timeRange === 'monthly'
                            ? 'bg-primary text-white'
                            : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200'
                            }`}
                        onClick={() => setTimeRange('monthly')}
                    >
                        Monthly
                    </button>
                </div>
            </div>

            <div style={{ width: '100%', height: 300 }}>
                <ResponsiveContainer>
                    <AreaChart
                        data={data}
                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip content={(props) => <CustomTooltip {...props} />} />
                        <Area
                            type="monotone"
                            dataKey="revenue"
                            stackId="1"
                            stroke="#22c55e"
                            fill="#22c55e"
                            fillOpacity={0.3}
                        />
                        <Area
                            type="monotone"
                            dataKey="orders"
                            stackId="2"
                            stroke="#3b82f6"
                            fill="#3b82f6"
                            fillOpacity={0.3}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

// Export as default for dynamic import
export default SalesChart;
// Also keep named export for backwards compatibility
export { SalesChart }; 