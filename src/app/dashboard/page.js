"use client";

import { useState } from "react";
import Link from "next/link";
import { Line, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { MdDashboard, MdAttachMoney, MdInsertChart } from "react-icons/md";
import { useDataContext } from "../../context/DataContext";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export default function Dashboard() {
  const [menuExpanded, setMenuExpanded] = useState(false);
  const { salesData, expensesData } = useDataContext();

  // Calculando resumos
  const salesTotal = salesData.reduce((total, sale) => total + (sale.status === "Pago" ? sale.value : 0), 0);
  const expensesTotal = expensesData.reduce((total, expense) => total + (expense.status === "Pago" ? expense.value : 0), 0);
  const toReceive = salesData.reduce((total, sale) => total + (sale.status === "Pendente" ? sale.value : 0), 0);
  const toPay = expensesData.reduce((total, expense) => total + (expense.status === "Pendente" ? expense.value : 0), 0);

  // Dados dos gráficos
  const lineData = {
    labels: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"],
    datasets: [
      {
        label: "Receita",
        data: salesData.map((sale) => sale.value),
        borderColor: "#1E4D92",
        backgroundColor: "rgba(30, 77, 146, 0.3)",
        fill: true,
      },
      {
        label: "Despesa",
        data: expensesData.map((expense) => expense.value),
        borderColor: "#E67E22",
        backgroundColor: "rgba(230, 126, 34, 0.3)",
        fill: true,
      },
    ],
  };

  const pieData = {
    labels: expensesData.map((expense) => expense.category || "Outros"),
    datasets: [
      {
        data: expensesData.map((expense) => expense.value),
        backgroundColor: ["#1E4D92", "#3498db", "#2ecc71", "#e74c3c", "#f1c40f", "#9b59b6"],
      },
    ],
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Menu Lateral */}
      <aside
        className={`fixed top-0 left-0 h-full bg-blue-800 text-white shadow-lg transition-all duration-300 ${
          menuExpanded ? "w-64" : "w-16"
        }`}
        onMouseEnter={() => setMenuExpanded(true)}
        onMouseLeave={() => setMenuExpanded(false)}
      >
        <div className="flex items-center justify-center mb-8">
          <h2
            className={`text-2xl font-bold tracking-wide transition-opacity duration-300 ${
              menuExpanded ? "opacity-100" : "opacity-0"
            }`}
          >
            {menuExpanded && "CashHero"}
          </h2>
        </div>
        <nav className="space-y-4">
          <Link href="/dashboard">
            <div className="flex items-center py-2 px-4 rounded hover:bg-blue-700 transition cursor-pointer">
              <MdDashboard className="text-2xl" />
              <span
                className={`ml-4 transition-opacity duration-300 ${
                  menuExpanded ? "opacity-100" : "hidden"
                }`}
              >
                Dashboard
              </span>
            </div>
          </Link>
          <Link href="/sales">
            <div className="flex items-center py-2 px-4 rounded hover:bg-blue-700 transition cursor-pointer">
              <MdAttachMoney className="text-2xl" />
              <span
                className={`ml-4 transition-opacity duration-300 ${
                  menuExpanded ? "opacity-100" : "hidden"
                }`}
              >
                Controle de Vendas
              </span>
            </div>
          </Link>
          <Link href="/expenses">
            <div className="flex items-center py-2 px-4 rounded hover:bg-blue-700 transition cursor-pointer">
              <MdInsertChart className="text-2xl" />
              <span
                className={`ml-4 transition-opacity duration-300 ${
                  menuExpanded ? "opacity-100" : "hidden"
                }`}
              >
                Gestão de Despesas
              </span>
            </div>
          </Link>
        </nav>
      </aside>

      {/* Conteúdo Principal */}
      <main
        className={`flex-1 ${menuExpanded ? "ml-64" : "ml-16"} transition-all duration-300 p-8`}
      >
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-blue-800 mb-4">Dashboard</h1>
          <p className="text-gray-600">Monitoramento de métricas e desempenho financeiro.</p>
        </header>

        {/* Resumo em Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            {
              title: "Receitas Pagas",
              value: salesTotal,
              bgColor: "bg-green-500",
              hoverColor: "hover:bg-green-600",
            },
            {
              title: "Despesas Pendentes",
              value: toPay,
              bgColor: "bg-red-500",
              hoverColor: "hover:bg-red-600",
            },
            {
              title: "Receitas Pendentes",
              value: toReceive,
              bgColor: "bg-blue-500",
              hoverColor: "hover:bg-blue-600",
            },
            {
              title: "Despesas Pagas",
              value: expensesTotal,
              bgColor: "bg-teal-500",
              hoverColor: "hover:bg-teal-600",
            },
          ].map((card, index) => (
            <div
              key={index}
              className={`${card.bgColor} ${card.hoverColor} text-white p-6 rounded-lg shadow-md transform hover:scale-105 transition`}
            >
              <h3 className="text-lg">{card.title}</h3>
              <p className="text-3xl font-bold mt-2">R$ {card.value.toFixed(2)}</p>
            </div>
          ))}
        </div>

        {/* Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md transform hover:scale-105 transition">
            <h3 className="text-xl font-bold text-blue-800 mb-4">Receita x Despesa (2024-2025)</h3>
            <Line data={lineData} />
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md transform hover:scale-105 transition">
            <h3 className="text-xl font-bold text-blue-800 mb-4">Despesas por Categoria</h3>
            <Pie data={pieData} />
          </div>
        </div>
      </main>
    </div>
  );
}
