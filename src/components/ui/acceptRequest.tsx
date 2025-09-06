"use client";

import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function TeacherApproval() {
  const [markdown, setMarkdown] = useState("");

  const insertMarkdown = (syntax: string) => {
    const textarea = document.getElementById("markdown-editor") as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = markdown.substring(start, end);

    let newText = "";
    switch (syntax) {
      case "bold":
        newText = `**${selected || "texto em negrito"}**`;
        break;
      case "italic":
        newText = `_${selected || "texto em itálico"}_`;
        break;
      case "underline":
        newText = `<u>${selected || "texto sublinhado"}</u>`;
        break;
      case "strike":
        newText = `~~${selected || "texto riscado"}~~`;
        break;
      default:
        newText = selected;
    }

    const updated =
      markdown.substring(0, start) + newText + markdown.substring(end);
    setMarkdown(updated);

    setTimeout(() => {
      textarea.focus();
      textarea.selectionStart = textarea.selectionEnd = start + newText.length;
    }, 0);
  };

  return (
    <div
      className="flex flex-col border-2 rounded-3xl p-8 bg-white border-[var(--color-dark-gray)]"
      style={{ width: "514px", height: "482px" }}
    >
      {/* Toolbar e Área Editável com altura limitada */}
      <div className="flex flex-col border rounded-md mb-4 border-[var(--color-dark-gray)] flex-grow">
        <div className="flex items-center gap-2 border-b border-[var(--color-dark-gray)] p-2 bg-white rounded-t-md">
          <button onClick={() => insertMarkdown("bold")} className="p-1 rounded font-bold">
            B
          </button>
          <button onClick={() => insertMarkdown("italic")} className="p-1 rounded italic">
            I
          </button>
          <button onClick={() => insertMarkdown("underline")} className="p-1 rounded underline">
            U
          </button>
          <button onClick={() => insertMarkdown("strike")} className="p-1 rounded line-through">
            S
          </button>
        </div>

        {/* Área editável com altura limitada e scroll */}
        <div className="flex-grow overflow-hidden">
          <Label htmlFor="markdown-editor" className="sr-only">
            Editor
          </Label>
          <Textarea
            id="markdown-editor"
            value={markdown}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setMarkdown(e.target.value)}
            placeholder="Digite alguma observação sobre essa solicitação"
            className="w-full h-full p-3 rounded-b-md resize-none overflow-y-auto focus-visible:ring-0 focus-visible:ring-offset-0 border-0 focus:border-0 focus:outline-none"
            style={{ minHeight: "50px", maxHeight: "240px" }}
          />
        </div>
      </div>

      {/* Botões de ação */}
      <div className="flex justify-center gap-4 mt-4">
        <button
          style={{ backgroundColor: "var(--color-default-red)" }}
          className="hover:brightness-90 text-white px-13 py-2 rounded-md text-sm"
        >
          Recusar professor
        </button>
        <button
          style={{ backgroundColor: "var(--color-contrast-green)" }}
          className="hover:brightness-90 text-white px-13 py-2 rounded-md text-sm"
        >
          Aprovar professor
        </button>
      </div>

      {/* Botão desabilitado */}
      <button
        style={{ backgroundColor: "var(--color-muted-foreground)" }}
        className="text-white w-full py-2 rounded-md cursor-not-allowed text-sm mt-4"
        disabled
      >
        Visualizar comprovante
      </button>
    </div>
  );
}