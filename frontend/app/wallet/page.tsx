"use client";

import { useState, useEffect } from "react";
import { Bar, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Header } from "../components/Header";

interface Action {
  id: string;
  type: "income" | "expense" | "transfer";
  description: string;
  amount: number;
  category: string;
  timestamp: Date;
  status: "completed" | "pending" | "failed";
}

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export default function WalletPage() {
  // State for real-time actions
  const [actions, setActions] = useState<Action[]>([
    {
      id: "1",
      type: "income",
      description: "Salary Payment",
      amount: 2500,
      category: "Income",
      timestamp: new Date(Date.now() - 1000 * 60 * 5),
      status: "completed",
    },
    {
      id: "2",
      type: "expense",
      description: "Grocery Shopping",
      amount: 150,
      category: "Food",
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      status: "completed",
    },
    {
      id: "3",
      type: "transfer",
      description: "Transfer to Savings",
      amount: 500,
      category: "Savings",
      timestamp: new Date(Date.now() - 1000 * 60 * 60),
      status: "completed",
    },
    {
      id: "4",
      type: "expense",
      description: "Netflix Subscription",
      amount: 15.99,
      category: "Entertainment",
      timestamp: new Date(Date.now() - 1000 * 60 * 120),
      status: "completed",
    },
  ]);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      const randomTypes: ("income" | "expense" | "transfer")[] = [
        "income",
        "expense",
        "transfer",
      ];
      const randomType =
        randomTypes[Math.floor(Math.random() * randomTypes.length)];

      const descriptions = {
        income: ["Freelance Payment", "Investment Return", "Bonus", "Refund"],
        expense: ["Coffee Shop", "Gas Station", "Online Shopping", "Utilities"],
        transfer: [
          "Transfer to Savings",
          "Investment Transfer",
          "Emergency Fund",
        ],
      };

      const categories = {
        income: ["Income", "Investments"],
        expense: ["Food", "Entertainment", "Bills", "Other"],
        transfer: ["Savings", "Investments"],
      };

      const newAction: Action = {
        id: Date.now().toString(),
        type: randomType,
        description:
          descriptions[randomType][
            Math.floor(Math.random() * descriptions[randomType].length)
          ],
        amount: Math.floor(Math.random() * 500) + 10,
        category:
          categories[randomType][
            Math.floor(Math.random() * categories[randomType].length)
          ],
        timestamp: new Date(),
        status: Math.random() > 0.1 ? "completed" : "pending",
      };

      setActions((prev) => [newAction, ...prev].slice(0, 10)); // Keep only last 10 actions
    }, 5000); // Add new action every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return date.toLocaleDateString();
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "income":
        return "text-green-600 bg-green-100";
      case "expense":
        return "text-red-600 bg-red-100";
      case "transfer":
        return "text-blue-600 bg-blue-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-700">
            ✓ Completed
          </span>
        );
      case "pending":
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-700">
            ⏳ Pending
          </span>
        );
      case "failed":
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-700">
            ✗ Failed
          </span>
        );
      default:
        return null;
    }
  };

  // Bar chart data
  const barData = {
    labels: ["January", "February", "March", "April", "May", "June"],
    datasets: [
      {
        label: "Income",
        data: [1200, 1900, 1500, 2000, 2200, 1800],
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
      {
        label: "Expenses",
        data: [800, 1200, 900, 1100, 1300, 1000],
        backgroundColor: "rgba(255, 99, 132, 0.6)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 1,
      },
    ],
  };

  // Bar chart options
  const barOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Monthly Income vs Expenses",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  // Doughnut chart data
  const doughnutData = {
    labels: [
      "Savings",
      "Investments",
      "Food",
      "Entertainment",
      "Bills",
      "Other",
    ],
    datasets: [
      {
        label: "Spending Categories",
        data: [3000, 2500, 1500, 800, 1200, 600],
        backgroundColor: [
          "rgba(54, 162, 235, 0.6)",
          "rgba(75, 192, 192, 0.6)",
          "rgba(255, 206, 86, 0.6)",
          "rgba(153, 102, 255, 0.6)",
          "rgba(255, 99, 132, 0.6)",
          "rgba(201, 203, 207, 0.6)",
        ],
        borderColor: [
          "rgba(54, 162, 235, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 99, 132, 1)",
          "rgba(201, 203, 207, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  // Doughnut chart options
  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: "bottom" as const,
      },
      title: {
        display: true,
        text: "Budget Distribution",
      },
    },
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto p-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">
          Minha carteira
        </h1>

        <div className="flex flex-row gap-8 flex-wrap">
          {/* Bar Chart Container */}
          <div className="flex-1 min-w-[400px] bg-white rounded-lg shadow-lg p-6">
            <Bar data={barData} options={barOptions} />
          </div>

          {/* Doughnut Chart Container */}
          <div className="flex-1 min-w-[400px] bg-white rounded-lg shadow-lg p-6 flex items-center justify-center">
            <div className="w-full max-w-md">
              <Doughnut data={doughnutData} options={doughnutOptions} />
            </div>
          </div>
        </div>

        {/* Real-Time Actions Table */}
        <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-800">
              Transações recentes
            </h2>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-600">Ao vivo</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">
                    Type
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">
                    Description
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">
                    Category
                  </th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700">
                    Amount
                  </th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">
                    Status
                  </th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700">
                    Time
                  </th>
                </tr>
              </thead>
              <tbody>
                {actions.map((action, index) => (
                  <tr
                    key={action.id}
                    className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                      index === 0 ? "animate-[fadeIn_0.5s_ease-in]" : ""
                    }`}
                  >
                    <td className="py-3 px-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold uppercase ${getTypeColor(
                          action.type
                        )}`}
                      >
                        {action.type}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-800">
                      {action.description}
                    </td>
                    <td className="py-3 px-4 text-gray-600">
                      {action.category}
                    </td>
                    <td
                      className={`py-3 px-4 text-right font-semibold ${
                        action.type === "income"
                          ? "text-green-600"
                          : action.type === "expense"
                          ? "text-red-600"
                          : "text-blue-600"
                      }`}
                    >
                      {action.type === "income"
                        ? "+"
                        : action.type === "expense"
                        ? "-"
                        : "→"}{" "}
                      ${action.amount.toFixed(2)}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {getStatusBadge(action.status)}
                    </td>
                    <td className="py-3 px-4 text-right text-sm text-gray-500">
                      {formatTime(action.timestamp)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {actions.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              Não há transações recentes.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
