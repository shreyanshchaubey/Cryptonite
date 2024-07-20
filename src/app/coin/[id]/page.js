'use client'

import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from 'next/navigation';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CartesianGrid, Line, LineChart, XAxis, YAxis, ResponsiveContainer } from "recharts";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Separator } from "@/components/ui/separator";
import Image from 'next/image';


const getStartAndEndDate = (tab) => {
  const now = new Date();
  let startDate = new Date();
  switch (tab) {
    case "1 day":
      startDate.setDate(now.getDate() - 1);
      break;
    case "1 week":
      startDate.setDate(now.getDate() - 7);
      break;
    case "1 month":
      startDate.setMonth(now.getMonth() - 1);
      break;
    case "1 year":
      startDate.setFullYear(now.getFullYear() - 1);
      break;
    default:
      startDate = new Date(0);
  }
  return {
    start: Math.floor(startDate.getTime() / 1000),
    end: Math.floor(now.getTime() / 1000),
  };
};

const fetchChartData = async (id, start, end) => {
  try {
    const response = await axios.get(
      `https://api.coingecko.com/api/v3/coins/${id}/market_chart/range?vs_currency=USD&from=${start}&to=${end}`
    );
    const coinData = await axios.get(
      `https://api.coingecko.com/api/v3/coins/${id}`
    );
    return { prices: response.data.prices, coinData: coinData.data };
  } catch (error) {
    console.error(`Error fetching data for ${id}:`, error);
    return { prices: [], coinData: null };
  }
};

export default function CoinPage() {
  const params = useParams();
  const { id } = params;
  const [chartData, setChartData] = useState([]);
  const [coinData, setCoinData] = useState(null);
  const [selectedTab, setSelectedTab] = useState("1 month");
  const [hoveredData, setHoveredData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const { start, end } = getStartAndEndDate(selectedTab);
      const { prices, coinData } = await fetchChartData(id, start, end);
      const formattedData = prices.map((item) => ({
        timestamp: new Date(item[0]).toLocaleDateString(),
        price: item[1],
      }));
      setChartData(formattedData);
      setCoinData(coinData);
    };
    fetchData();
  }, [id, selectedTab]);

  const chartConfig = {
    price: {
      label: id,
      color: "hsl(var(--chart-1))",
    },
  };

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              {coinData && (
                <Image
                  src={coinData.image.small}
                  alt={coinData.name}
                  width={24}
                  height={24}
                  className="mr-2"
                />
              )}
              {coinData ? coinData.name : id} Price Chart
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig}>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart
                  data={chartData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                  onMouseMove={(e) => {
                    if (e && e.activePayload && e.activePayload.length) {
                      setHoveredData(e.activePayload[0].payload);
                    } else {
                      setHoveredData(null);
                    }
                  }}
                  onMouseLeave={() => setHoveredData(null)}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="timestamp" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line
                    type="monotone"
                    dataKey="price"
                    stroke="#8884d8"
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
          <CardFooter>
            <Tabs
              defaultValue="1 month"
              className="w-full"
              onValueChange={setSelectedTab}
            >
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="1 day">Day</TabsTrigger>
                <TabsTrigger value="1 week">Week</TabsTrigger>
                <TabsTrigger value="1 month">Month</TabsTrigger>
                <TabsTrigger value="1 year">Year</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Coin Details</CardTitle>
          </CardHeader>
          <CardContent>
            {coinData ? (
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold">Current Price</h3>
                  <p>${coinData.market_data.current_price.usd.toLocaleString()}</p>
                </div>
                <div>
                  <h3 className="font-semibold">Market Cap</h3>
                  <p>${coinData.market_data.market_cap.usd.toLocaleString()}</p>
                </div>
                <div>
                  <h3 className="font-semibold">24h Trading Volume</h3>
                  <p>${coinData.market_data.total_volume.usd.toLocaleString()}</p>
                </div>
                <div>
                  <h3 className="font-semibold">24h High / Low</h3>
                  <p>${coinData.market_data.high_24h.usd.toLocaleString()} / ${coinData.market_data.low_24h.usd.toLocaleString()}</p>
                </div>
                <div>
                  <h3 className="font-semibold">Circulating Supply</h3>
                  <p>{coinData.market_data.circulating_supply.toLocaleString()} {coinData.symbol.toUpperCase()}</p>
                </div>
                <div>
                  <h3 className="font-semibold">All-Time High</h3>
                  <p>${coinData.market_data.ath.usd.toLocaleString()} ({new Date(coinData.market_data.ath_date.usd).toLocaleDateString()})</p>
                </div>
              </div>
            ) : (
              <p>Loading coin details...</p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="mt-4">
        <CardHeader>
          <CardTitle>About {coinData ? coinData.name : id}</CardTitle>
        </CardHeader>
        <CardContent>
          {coinData ? (
            <div className="space-y-4">
              <p>{coinData.description.en}</p>
              <div>
                <h3 className="font-semibold">Links</h3>
                <ul className="list-disc list-inside">
                  <li><a href={coinData.links.homepage[0]} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Official Website</a></li>
                  {coinData.links.blockchain_site.slice(0, 3).map((site, index) => (
                    site && <li key={index}><a href={site} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Block Explorer {index + 1}</a></li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <p>Loading coin description...</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}