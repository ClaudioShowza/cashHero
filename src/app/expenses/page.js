"use client";

import { useState } from "react";
import Link from "next/link";
import { MdDashboard, MdAttachMoney, MdInsertChart } from "react-icons/md";
import { useDataContext } from "@/context/DataContext";

export default function Expenses() {
  const { expensesData, setExpensesData } = useDataContext(); // Usando o contexto
  const [menuExpanded, setMenuExpanded] = useState(false);
  const [statusFilter, setStatusFilter] = useState("Todos os Status");
  const [responsibleFilter, setResponsibleFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newExpense, setNewExpense] = useState({
    category: "",
    date: "",
    value: "",
    responsible: "",
    status: "Pendente",
  });

  // Função para filtrar os dados
  // Função para filtrar os dados
  const filteredExpenses = expensesData.filter((expense) => {
    const matchesStatus =
      statusFilter === "Todos os Status" || expense.status.toLowerCase() === statusFilter.toLowerCase();

    const matchesResponsible =
      responsibleFilter === "" ||
      (expense.responsible && expense.responsible.toLowerCase().includes(responsibleFilter.toLowerCase()));

    const matchesDate =
      dateFilter === "" ||
      (expense.date && expense.date === dateFilter);

    return matchesStatus && matchesResponsible && matchesDate;
  });


  // Função para adicionar nova despesa
  const addExpense = () => {
    setExpensesData([
      ...expensesData,
      {
        ...newExpense,
        id: expensesData.length + 1,
        value: parseFloat(newExpense.value), // Converte o valor para número
      },
    ]);
    setNewExpense({ category: "", date: "", value: "", responsible: "", status: "Pendente" });
    setIsModalOpen(false);
  };

  // Função para excluir despesa
  const deleteExpense = (id) => {
    setExpensesData(expensesData.filter((expense) => expense.id !== id));
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar Menu */}
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
                Gestão de despesas
              </span>
            </div>
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main
        className={`flex-1 ${menuExpanded ? "ml-64" : "ml-16"} transition-all duration-300 p-8`}
      >
        <header className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-blue-800 mb-4">Gestão de Despesas</h1>
            <p className="text-gray-600">Acompanhe e gerencie suas despesas.</p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-800 text-white px-4 py-2 rounded shadow-md hover:bg-blue-700 transition"
          >
            Incluir Despesa
          </button>
        </header>

        {/* Filtros */}
        <div className="flex items-center gap-4 mb-6">
          <select
            className="p-2 border rounded text-gray-700"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option>Todos os Status</option>
            <option>Pago</option>
            <option>Pendente</option>
          </select>
          <input
            type="text"
            placeholder="Filtrar por responsável"
            className="p-2 border rounded text-gray-700"
            value={responsibleFilter}
            onChange={(e) => setResponsibleFilter(e.target.value)}
          />
          <input
            type="date"
            className="p-2 border rounded text-gray-700"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
          />
        </div>

        {/* Tabela de Despesas */}
        <table className="w-full bg-white rounded shadow-md">
          <thead>
            <tr className="bg-blue-800 text-white">
              <th className="py-2 px-4">Categoria</th>
              <th className="py-2 px-4">Data</th>
              <th className="py-2 px-4">Valor</th>
              <th className="py-2 px-4">Responsável</th>
              <th className="py-2 px-4">Status</th>
              <th className="py-2 px-4">Ações</th>
            </tr>
          </thead>
          <tbody>
            {filteredExpenses.map((expense) => (
              <tr key={expense.id} className="border-t">
                <td className="py-2 px-4">{expense.category}</td>
                <td className="py-2 px-4">{expense.date}</td>
                <td className="py-2 px-4">R$ {expense.value.toFixed(2)}</td>
                <td className="py-2 px-4">{expense.responsible}</td>
                <td
                  className={`py-2 px-4 font-bold ${
                    expense.status === "Pago" ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {expense.status}
                </td>
                <td className="py-2 px-4">
                  <button
                    onClick={() => deleteExpense(expense.id)}
                    className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600 transition"
                  >
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Modal para Incluir Despesa */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-10">
            <div className="bg-white p-6 rounded shadow-lg w-1/3">
              <h2 className="text-xl font-bold mb-4">Incluir Nova Despesa</h2>
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Categoria"
                  className="p-2 border rounded w-full"
                  value={newExpense.category}
                  onChange={(e) =>
                    setNewExpense((prev) => ({ ...prev, category: e.target.value }))
                  }
                />
              </div>
              <div className="mb-4">
                <input
                  type="date"
                  className="p-2 border rounded w-full"
                  value={newExpense.date}
                  onChange={(e) =>
                    setNewExpense((prev) => ({ ...prev, date: e.target.value }))
                  }
                />
              </div>
              <div className="mb-4">
                <input
                  type="number"
                  placeholder="Valor"
                  className="p-2 border rounded w-full"
                  value={newExpense.value}
                  onChange={(e) =>
                    setNewExpense((prev) => ({ ...prev, value: e.target.value }))
                  }
                />
              </div>
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Responsável"
                  className="p-2 border rounded w-full"
                  value={newExpense.responsible}
                  onChange={(e) =>
                    setNewExpense((prev) => ({ ...prev, responsible: e.target.value }))
                  }
                />
              </div>
              <div className="mb-4">
                <select
                  className="p-2 border rounded w-full"
                  value={newExpense.status}
                  onChange={(e) =>
                    setNewExpense((prev) => ({ ...prev, status: e.target.value }))
                  }
                >
                  <option>Pendente</option>
                  <option>Pago</option>
                </select>
              </div>
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="bg-gray-400 text-white px-4 py-2 rounded shadow hover:bg-gray-500 transition"
                >
                  Cancelar
                </button>
                <button
                  onClick={addExpense}
                  className="bg-blue-800 text-white px-4 py-2 rounded shadow hover:bg-blue-700 transition"
                >
                  Adicionar
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
