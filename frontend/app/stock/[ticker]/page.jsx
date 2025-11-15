"use client";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { Header } from "../../components/Header";
import { DisplayCard, FundamentalCard } from "../../utils/stockPriceUtils";
import { useStockSetter } from "../../utils/stockFundamentals";
import { fundamentals } from "../../utils/fundamentals";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const StockPage = () => {
  const params = useParams();
  const ticker = params?.ticker;

  // Get stock data from custom hook
  const {
    stockInfo,
    priceToEarningsRatio,
    dividendYield,
    priceToBook,
    currentPrice,
  } = useStockSetter(ticker);

  // State for historical data and filtering
  const [historicalData, setHistoricalData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [showDetails, setShowDetails] = useState(false);

  // State for Monte Carlo simulation
  const [monteCarloData, setMonteCarloData] = useState([]);
  const [processedMonteCarlo, setProcessedMonteCarlo] = useState([]);

  // Fetch historical data
  useEffect(() => {
    if (ticker) {
      fetch(`http://127.0.0.1:5000/stock/${ticker}/historical`)
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) {
            setHistoricalData(data);
            setFilteredData(data);
          }
        })
        .catch((error) => {
          console.error("Error fetching historical data:", error);
        });
    }
  }, [ticker]);

  // Fetch Monte Carlo simulation data
  useEffect(() => {
    if (ticker) {
      fetch(`http://127.0.0.1:5000/stock/${ticker}/monte-carlo`)
        .then((res) => res.json())
        .then((data) => {
          if (data && data.simulations) {
            setMonteCarloData(data.simulations);
            // Process simulations for charting
            const processed = data.simulations.map((sim) =>
              sim.map((price, index) => ({
                day: index * 5,
                price: price,
              }))
            );
            setProcessedMonteCarlo(processed);
          }
        })
        .catch((error) => {
          console.error("Error fetching Monte Carlo data:", error);
        });
    }
  }, [ticker]);

  // Filter data by time period
  const handleFilter = (period) => {
    if (!historicalData || historicalData.length === 0) return;

    const now = new Date();
    let startDate = new Date();

    switch (period) {
      case "1d":
        startDate.setDate(now.getDate() - 1);
        break;
      case "1w":
        startDate.setDate(now.getDate() - 7);
        break;
      case "1m":
        startDate.setMonth(now.getMonth() - 1);
        break;
      case "6m":
        startDate.setMonth(now.getMonth() - 6);
        break;
      case "1y":
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      case "5y":
        startDate.setFullYear(now.getFullYear() - 5);
        break;
      default:
        setFilteredData(historicalData);
        return;
    }

    const filtered = historicalData.filter((item) => {
      const itemDate = new Date(item.date);
      return itemDate >= startDate;
    });

    setFilteredData(filtered);
  };

  const GraphData = () => {
    if (!filteredData || filteredData.length === 0) {
      return [];
    }
    const valueList = filteredData.map((data) => ({
      date: data.date,
      open: data.open,
    }));

    valueList[valueList.length - 1].open = currentPrice;
    return valueList;
  };

  const stockChartData = {
    labels: GraphData().map((item) => {
      const d = new Date(item.date);
      return d.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
      });
    }),
    datasets: [
      {
        label: "Preço",
        data: GraphData().map((item) => item.open),
        borderColor: "#82ca9d",
        tension: 0.1,
        pointRadius: 0,
        borderWidth: 2,
      },
    ],
  };

  const stockChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      intersect: false,
      mode: "nearest",
    },
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: false,
      },
    },
    scales: {
      x: {
        grid: {
          display: true,
        },
      },
      y: {
        grid: {
          display: true,
        },
      },
    },
  };

  // Configure Monte Carlo chart
  const monteCarloChartData = {
    labels: Array.from({ length: 21 }, (_, i) => i * 5), // 0 to 100 by steps of 5
    datasets: processedMonteCarlo.map((simulation, i) => ({
      label: `Simulação ${i + 1}`,
      data: simulation.map((point) => point.price),
      borderColor: `hsl(${(i * 360) / processedMonteCarlo.length}, 70%, 50%)`,
      tension: 0.1,
      pointRadius: 0,
      borderWidth: 1,
    })),
  };

  const monteCarloChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false, // Hide legend due to many lines
      },
      title: {
        display: false,
      },
    },
    interaction: {
      intersect: false,
      mode: "nearest",
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Dias",
        },
        grid: {
          display: true,
        },
      },
      y: {
        title: {
          display: true,
          text: "Preço",
        },
        grid: {
          display: true,
        },
      },
    },
  };

  return (
    <Box className="bg-[#ECECEC] min-h-screen">
      <Header />
      <div className="max-w-6xl mx-auto px-4">
        {/* Botões de filtro */}
        <Box sx={{ mt: 4 }} className="flex justify-end">
          <Stack direction={"row"} spacing={1}>
            <Button variant="outlined" onClick={() => handleFilter("1d")}>
              1D
            </Button>
            <Button variant="outlined" onClick={() => handleFilter("1w")}>
              1W
            </Button>
            <Button variant="outlined" onClick={() => handleFilter("1m")}>
              1M
            </Button>
            <Button variant="outlined" onClick={() => handleFilter("6m")}>
              6M
            </Button>
            <Button variant="outlined" onClick={() => handleFilter("1y")}>
              1Y
            </Button>
            <Button variant="outlined" onClick={() => handleFilter("5y")}>
              5Y
            </Button>
          </Stack>
        </Box>

        {/* Gráfico de preço */}
        <Box sx={{ width: "100%", mt: 4 }}>
          <Box
            sx={{
              backgroundColor: "white",
              borderRadius: 2,
              boxShadow: 3,
              p: 2,
              height: 400,
            }}
          >
            <Line options={stockChartOptions} data={stockChartData} />
          </Box>
        </Box>

        {/* Cards de métricas + detalhes */}
        <Box sx={{ mt: 6 }}>
          <Stack
            direction="row"
            divider={<Divider orientation="vertical" flexItem />}
            spacing={2}
            sx={{
              justifyContent: "center",
              alignItems: "center",
              flexWrap: "wrap",
              width: "100%",
            }}
          >
            <DisplayCard name="Preço" data={currentPrice} />
            <DisplayCard
              name="DY"
              data={(dividendYield * 100).toFixed(2) + "%"}
            />
            <DisplayCard
              name="P/L"
              data={
                priceToEarningsRatio ? priceToEarningsRatio.toFixed(2) : "N/A"
              }
            />
            <DisplayCard
              name="P/VP"
              data={priceToBook ? priceToBook.toFixed(2) : "N/A"}
            />
            <DisplayCard
              name="Ticker"
              data={ticker ? ticker.toUpperCase() : "N/A"}
            />
          </Stack>
          <Box sx={{ textAlign: "center", my: 4 }}>
            <Button
              onClick={() => setShowDetails(!showDetails)}
              endIcon={showDetails ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            >
              {showDetails ? "Ver Menos" : "Ver Mais"}
            </Button>
          </Box>

          {showDetails && (
            <Card
              variant="outlined"
              sx={{ p: 3, borderRadius: 2, backgroundColor: "white" }}
            >
              <Typography variant="h5" gutterBottom>
                Dados Fundamentais de {ticker}
              </Typography>

              <Grid container spacing={4} justifyContent={"center"}>
                {fundamentals
                  .filter(
                    (item) =>
                      ![
                        "fiftyTwoWeekLowChange",
                        "fiftyTwoWeekLowChangePercent",
                        "fiftyTwoWeekHighChangePercent",
                        "fiftyTwoWeekHighChange",
                        "fiftyTwoWeekLow",
                        "fiftyTwoWeekHigh",
                        "targetMedianPrice",
                        "targetMeanPrice",
                        "targetLowPrice",
                        "targetHighPrice",
                        "currentPrice",
                        "overallRisk",
                        "bookValue",
                        "dividendYield",
                        "priceToEarningsRatio",
                        "priceToBook",
                      ].includes(item.key)
                  )
                  .map((item, index) => (
                    <Grid item xs={12} sm={6} md={3} key={index}>
                      <FundamentalCard
                        name={item.name}
                        data={stockInfo?.[item.key] ?? "N/A"}
                      />
                    </Grid>
                  ))}
              </Grid>
            </Card>
          )}
        </Box>

        {/* Gráfico Monte Carlo */}
        <Box sx={{ width: "100%", mt: 6, mb: 10 }}>
          <Box
            sx={{
              backgroundColor: "white",
              borderRadius: 2,
              boxShadow: 3,
              p: 2,
              height: 400,
            }}
          >
            <Line
              options={monteCarloChartOptions}
              data={monteCarloChartData}
            />
          </Box>
        </Box>
      </div>
    </Box>
  );
};

export default StockPage;
