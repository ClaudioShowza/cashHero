"use client";

import { createContext, useContext, useState } from "react";

// Criação do Contexto
const DataContext = createContext();

// Hook para usar o Contexto
export const useDataContext = () => useContext(DataContext);

// Provedor de Dados Compartilhados
export const DataProvider = ({ children }) => {
  const [salesData, setSalesData] = useState([
    { id: 1, product: "Serviço de Consultoria", date: "2024-11-27", value: 500, client: "João Silva", status: "Pago" },
    { id: 2, product: "Criação de Site", date: "2024-11-26", value: 1500, client: "Maria Oliveira", status: "Pendente" },
  ]);

  const [expensesData, setExpensesData] = useState([
    { id: 1, category: "Energia", date: "2024-11-27", value: 300, status: "Pendente" },
    { id: 2, category: "Aluguel", date: "2024-11-26", value: 1200, status: "Pago" },
  ]);

  return (
    <DataContext.Provider value={{ salesData, setSalesData, expensesData, setExpensesData }}>
      {children}
    </DataContext.Provider>
  );
};
