'use client';

import axios from 'axios';
import { useEffect, useState } from 'react';
import { TrendingUp } from 'lucide-react';
import { CartesianGrid, Line, LineChart, XAxis, Tooltip } from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

const fetchChartData = async (coin) => {
  try {
    const response = await axios.get(
      `https://api.coingecko.com/api/v3/coins/${coin}/market_chart/range?vs_currency=USD&from=1700328225&to=1718731425`
    );
    return response.data.prices;
  } catch (error) {
    console.error(`Error fetching data for ${coin}:`, error);
    return [];
  }
};

function HomeChartCard() {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const bitcoinData = await fetchChartData('bitcoin');
      const ethereumData = await fetchChartData('ethereum');
      const ltcData = await fetchChartData('litecoin');

      const formattedData = bitcoinData.map((item, index) => ({
        month: new Date(item[0]).toLocaleString('default', { month: 'short' }),
        bitcoin: item[1],
        Ethereum: ethereumData[index] ? ethereumData[index][1] : null,
        LTC: ltcData[index] ? ltcData[index][1] : null,
      }));

      setChartData(formattedData);
    };

    fetchData();
  }, []);

  const chartConfig = {
    bitcoin: {
      label: 'bitcoin',
      color: '#ff7300',
    },
    Ethereum: {
      label: 'Ethereum',
      color: '#387908',
    },
    LTC: {
      label: 'LTC',
      color: '#8884d8',
    },
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Line Chart - Multiple</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent>
        <LineChart
          width={1100}
          height={300}
          data={chartData}
          margin={{ top: 10, right: 20, left: 0, bottom: 0 }} // Adjust margin for full coverage
        >
          <CartesianGrid stroke="none" /> {/* Remove grid lines */}
          <XAxis
            dataKey="month"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tickFormatter={(value) => value.slice(0, 3)}
            tickSize={10}
          />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="bitcoin"
            stroke={chartConfig.bitcoin.color}
            strokeWidth={2}
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="Ethereum"
            stroke={chartConfig.Ethereum.color}
            strokeWidth={2}
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="LTC"
            stroke={chartConfig.LTC.color}
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 font-medium leading-none">
              Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
            </div>
            <div className="flex items-center gap-2 leading-none text-muted-foreground">
              Showing total visitors for the last 6 months
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}

export default HomeChartCard;
