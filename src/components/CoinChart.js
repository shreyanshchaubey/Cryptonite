'use client';

import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { ZoomIn, ZoomOut } from "lucide-react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis, ResponsiveContainer, Tooltip, ReferenceDot, Brush } from "recharts";
import Image from 'next/image';
import { FaChartBar, FaDollarSign } from 'react-icons/fa';
// If you need an activity icon, you can try importing it from a different set
import { AiOutlineAreaChart } from 'react-icons/ai';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";


const fetchCoinData = async (id) => {
  try {
    const response = await axios.get(`https://api.coingecko.com/api/v3/coins/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching data for ${id}:`, error);
    return null;
  }
};

const getChartData = async (id, period) => {
  try {
    const response = await axios.get(`https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=usd&days=${period}`);
    return response.data.prices.map(price => ({
      date: new Date(price[0]),
      price: price[1],
    }));
  } catch (error) {
    console.error(`Error fetching chart data for ${id}:`, error);
    return [];
  }
};

export default function CoinChartComponent({ id }) {
  const [coinData, setCoinData] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [selectedTab, setSelectedTab] = useState("30");
  const [zoomDomain, setZoomDomain] = useState(null);
  const chartRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      const coin = await fetchCoinData(id);
      setCoinData(coin);
      const chart = await getChartData(id, selectedTab);
      setChartData(chart);
      setZoomDomain(null); // Reset zoom when data changes
    };
    fetchData();
  }, [id, selectedTab]);

  const priceChange = coinData?.market_data?.price_change_percentage_24h;
  const isPriceUp = priceChange > 0;

  const handleZoomOut = () => {
    setZoomDomain(null);
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-800 p-4 border border-gray-700 rounded-lg shadow-lg text-white">
          <p className="font-bold text-lg">{new Date(label).toLocaleDateString()}</p>
          <p className="text-green-400 text-xl">${payload[0].value.toFixed(2)}</p>
        </div>
      );
    }
    return null;
  };

  const significantPoints = chartData.reduce((acc, point, index, array) => {
    if (index === 0 || index === array.length - 1) {
      acc.push(point);
    } else if (index % Math.floor(array.length / 5) === 0) {
      acc.push(point);
    }
    return acc;
  }, []);

  return (
    <Card className="w-full max-w-4xl mx-auto shadow-lg border border-gray-200 rounded-lg bg-gray-100">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-gray-800">
          {coinData?.name} ({coinData?.symbol.toUpperCase()})
        </CardTitle>
        <CardDescription className="text-sm text-gray-600">
          {coinData?.description?.en.slice(0, 150)}...
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative">
          <ResponsiveContainer width="100%" height={400}>
            <LineChart
              data={chartData}
              ref={chartRef}
              onMouseDown={(e) => e && setZoomDomain({ startIndex: e.activeTooltipIndex })}
              onMouseMove={(e) => e && zoomDomain && setZoomDomain({ ...zoomDomain, endIndex: e.activeTooltipIndex })}
              onMouseUp={() => {
                if (zoomDomain && zoomDomain.startIndex !== undefined && zoomDomain.endIndex !== undefined) {
                  const { startIndex, endIndex } = zoomDomain;
                  const start = chartData[Math.min(startIndex, endIndex)].date;
                  const end = chartData[Math.max(startIndex, endIndex)].date;
                  setZoomDomain([start, end]);
                }
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="date"
                domain={zoomDomain || ['dataMin', 'dataMax']}
                tickFormatter={(value) => new Date(value).toLocaleDateString()}
                type="number"
                scale="time"
                tick={{ fill: '#6b7280' }}
                axisLine={{ stroke: '#e5e7eb' }}
              />
              <YAxis
                tickFormatter={(value) => `$${value.toLocaleString()}`}
                domain={['auto', 'auto']}
                tick={{ fill: '#6b7280' }}
                axisLine={{ stroke: '#e5e7eb' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="price"
                stroke={isPriceUp ? "#10B981" : "#EF4444"}
                strokeWidth={2}
                dot={{ strokeWidth: 2, stroke: 'rgba(0,0,0,0.1)', r: 4 }}
                activeDot={{ r: 6 }}
              />
              {significantPoints.map((point, index) => (
                <ReferenceDot
                  key={index}
                  x={point.date}
                  y={point.price}
                  r={6}
                  fill="#8884d8"
                  stroke="none"
                />
              ))}
              <Brush
                dataKey="date"
                height={30}
                stroke="#8884d8"
                startIndex={0}
                endIndex={chartData.length - 1}
                onChange={(e) => e && setZoomDomain([e.startIndex, e.endIndex])}
                style={{ cursor: 'pointer' }}
              />
            </LineChart>
          </ResponsiveContainer>
          <Button
            className="absolute top-0 right-0 m-2 flex items-center bg-blue-600 text-white hover:bg-blue-700"
            onClick={handleZoomOut}
            disabled={!zoomDomain}
          >
            <ZoomOut className="h-4 w-4 mr-2" />
            Reset Zoom
          </Button>
        </div>
      </CardContent>
      <CardFooter className="flex-col items-start gap-4 text-sm">
        <div className="flex items-center gap-2 text-gray-800">
          <FaDollarSign className={`h-5 w-5 ${isPriceUp ? "text-green-500" : "text-red-500"}`} />
          <p className={`font-semibold ${isPriceUp ? "text-green-500" : "text-red-500"}`}>
            {isPriceUp ? "Price Up" : "Price Down"} ({priceChange.toFixed(2)}%)
          </p>
        </div>
        <div className="flex items-center gap-2 text-gray-600">
          <FaChartBar className="h-5 w-5 text-gray-400" />
          <p className="font-semibold">Volume: ${coinData?.market_data?.total_volume?.usd.toLocaleString()}</p>
        </div>
        <div className="flex items-center gap-2 text-gray-600">
          <AiOutlineAreaChart className="h-5 w-5 text-gray-400" />
          <p className="font-semibold">Market Cap: ${coinData?.market_data?.market_cap?.usd.toLocaleString()}</p>
        </div>
      </CardFooter>
    </Card>
  );
}
