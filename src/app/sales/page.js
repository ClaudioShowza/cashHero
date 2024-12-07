"use client";

import { useState } from "react";
import Link from "next/link";
import { MdDashboard, MdAttachMoney, MdInsertChart } from "react-icons/md";
import { useDataContext } from "@/context/DataContext";

export default function Sales() {
  const { salesData, setSalesData } = useDataContext(); // Usando o contexto
  const [menuExpanded, setMenuExpanded] = useState(false);
  const [statusFilter, setStatusFilter] = useState("Todos os Status");
  const [clientFilter, setClientFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newSale, setNewSale] = useState({
    product: "",
    date: "",
    value: "",
    client: "",
    status: "Pendente",
  });

  // Função para filtrar os dados
  const filteredSales = salesData.filter((sale) => {
    const matchesStatus =
      statusFilter === "Todos os Status" || sale.status === statusFilter;
    const matchesClient =
      clientFilter === "" || sale.client.toLowerCase().includes(clientFilter.toLowerCase());
    const matchesDate = dateFilter === "" || sale.date === dateFilter;

    return matchesStatus && matchesClient && matchesDate;
  });

  // Função para adicionar nova venda
  const addSale = () => {
    setSalesData([
      ...salesData,
      {
        ...newSale,
        id: salesData.length + 1,
        value: parseFloat(newSale.value), // Converte o valor para número
      },
    ]);
    setNewSale({ product: "", date: "", value: "", client: "", status: "Pendente" });
    setIsModalOpen(false);
  };

  // Função para excluir venda
  const deleteSale = (id) => {
    setSalesData(salesData.filter((sale) => sale.id !== id));
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
                Controle de vendas
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
            <h1 className="text-4xl font-bold text-blue-800 mb-4">Controle de Vendas</h1>
            <p className="text-gray-600">Acompanhe e gerencie suas vendas.</p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-800 text-white px-4 py-2 rounded shadow-md hover:bg-blue-700 transition"
          >
            Incluir Venda
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
            placeholder="Filtrar por cliente"
            className="p-2 border rounded text-gray-700"
            value={clientFilter}
            onChange={(e) => setClientFilter(e.target.value)}
          />
          <input
            type="date"
            className="p-2 border rounded text-gray-700"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
          />
        </div>

        {/* Tabela de Vendas */}
        <table className="w-full bg-white rounded shadow-md">
          <thead>
            <tr className="bg-blue-800 text-white">
              <th className="py-2 px-4">Produto/Serviço</th>
              <th className="py-2 px-4">Data</th>
              <th className="py-2 px-4">Valor</th>
              <th className="py-2 px-4">Cliente</th>
              <th className="py-2 px-4">Status</th>
              <th className="py-2 px-4">Ações</th>
            </tr>
          </thead>
          <tbody>
            {filteredSales.map((sale) => (
              <tr key={sale.id} className="border-t">
                <td className="py-2 px-4">{sale.product}</td>
                <td className="py-2 px-4">{sale.date}</td>
                <td className="py-2 px-4">R$ {sale.value.toFixed(2)}</td>
                <td className="py-2 px-4">{sale.client}</td>
                <td
                  className={`py-2 px-4 font-bold ${
                    sale.status === "Pago" ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {sale.status}
                </td>
                <td className="py-2 px-4">
                  <button
                    onClick={() => deleteSale(sale.id)}
                    className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600 transition"
                  >
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Modal de Inclusão */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-10">
            <div className="bg-white p-6 rounded shadow-lg w-1/3">
              <h2 className="text-xl font-bold mb-4">Incluir Nova Venda</h2>
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Produto/Serviço"
                  className="p-2 border rounded w-full"
                  value={newSale.product}
                  onChange={(e) =>
                    setNewSale((prev) => ({ ...prev, product: e.target.value }))
                  }
                />
              </div>
              <div className="mb-4">
                <input
                  type="date"
                  className="p-2 border rounded w-full"
                  value={newSale.date}
                  onChange={(e) =>
                    setNewSale((prev) => ({ ...prev, date: e.target.value }))
                  }
                />
              </div>
              <div className="mb-4">
                <input
                  type="number"
                  placeholder="Valor"
                  className="p-2 border rounded w-full"
                  value={newSale.value}
                  onChange={(e) =>
                    setNewSale((prev) => ({ ...prev, value: e.target.value }))
                  }
                />
              </div>
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Cliente"
                  className="p-2 border rounded w-full"
                  value={newSale.client}
                  onChange={(e) =>
                    setNewSale((prev) => ({ ...prev, client: e.target.value }))
                  }
                />
              </div>
              <div className="mb-4">
                <select
                  className="p-2 border rounded w-full"
                  value={newSale.status}
                  onChange={(e) =>
                    setNewSale((prev) => ({ ...prev, status: e.target.value }))
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
                  onClick={addSale}
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
