import React, { useState } from "react";
import { useExperienceAdmin } from "@/hooks/useExperienceAdmin";
import { TableExperience } from "@/components/ui/table";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/buttons/defaultButton";
import { Link } from "@tanstack/react-router";

export function AdminExperience() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const { data, isLoading, error } = useExperienceAdmin(page, pageSize);

  // Exemplo de dados mock para visualização
  const mockData = [
    {
      id: 1,
      nome: "Experiência X",
      descricao: "Lorem Ipsum Dolor",
      data: "19/03 - 25/03",
    },
    {
      id: 2,
      nome: "Experiência Y",
      descricao: "Lorem Ipsum Dolor",
      data: "19/03 - 25/03",
    },
    {
      id: 3,
      nome: "Experiência Z",
      descricao: "Lorem Ipsum Dolor",
      data: "-",
    },
  ];

  return (
    <div className="p-4 sm:p-8">
      <div className="flex justify-end mb-8">
        <Link to="/admin/experiences/create">
          <Button
            label="Criar nova experiência"
            className="min-w-[170px] px-10 py-5"
          />
        </Link>
      </div>
      <div className="overflow-x-auto rounded-lg shadow">
        <TableExperience>
          <thead>
            <tr className="bg-gray-100">
              <th className="px-2 py-2 sm:px-4">Nome</th>
              <th className="px-2 py-2 sm:px-4">Descrição</th>
              <th className="px-2 py-2 sm:px-4">Data</th>
              <th className="px-2 py-2 sm:px-4">Ações</th>
            </tr>
          </thead>
          <tbody>
            {mockData.map((exp) => (
              <tr key={exp.id} className="border-b">
                <td className="px-2 py-2 sm:px-4">{exp.nome}</td>
                <td className="px-2 py-2 sm:px-4">{exp.descricao}</td>
                <td className="px-2 py-2 sm:px-4">{exp.data}</td>
                <td className="px-2 py-2 sm:px-4">
                  <div className="relative">
                    <button className="border px-2 py-1 rounded text-xs sm:text-sm">
                      Ações ▾
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </TableExperience>
      </div>

      {/* Paginação e select de resultados */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between mt-4 gap-4">
        <div className="text-sm text-gray-500 flex items-center gap-2">
          Resultados por página:
          <Select
            value={String(pageSize)}
            onValueChange={(value) => {
              setPageSize(Number(value));
              setPage(1);
            }}
          >
            <SelectTrigger className="w-16 h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[10, 20, 50].map((size) => (
                <SelectItem key={size} value={String(size)}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2 justify-end">
          <button
            className="border rounded px-2 py-1"
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
            &lt;
          </button>
          <span className="px-2 bg-green-100 text-green-800 rounded">
            {page}
          </span>
          <button
            className="border rounded px-2 py-1"
            disabled={data && page >= Math.ceil((data.total || 1) / pageSize)}
            onClick={() => setPage(page + 1)}
          >
            &gt;
          </button>
        </div>
      </div>
    </div>
  );
}
