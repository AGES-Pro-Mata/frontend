

import { useState, useRef, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import { Button } from "../buttons/defaultButton";
import { Heading1, Heading2, Heading3, ListOrdered, List } from "lucide-react";

export default function TeacherApproval() {
  const [markdown, setMarkdown] = useState("");
  const [tab, setTab] = useState<"write" | "preview">("write");

  const [showHeadingMenu, setShowHeadingMenu] = useState(false);
  const headingMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!showHeadingMenu) return;
    function handleClickOutside(event: MouseEvent) {
      if (
        headingMenuRef.current &&
        !headingMenuRef.current.contains(event.target as Node)
      ) {
        setShowHeadingMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showHeadingMenu]);

  const insertMarkdown = (syntax: string, headingLevel?: number) => {
    const textarea = document.getElementById(
      "markdown-editor"
    ) as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = markdown.substring(start, end);

    let newText = "";
    const before = markdown.substring(0, start);
    const needsBreak = before.length > 0 && !before.endsWith("\n");
    switch (syntax) {
      case "bold":
        newText = `**${selected || " "}**`;
        break;
      case "italic":
        newText = `*${selected || " "}*`;
        break;
      case "underline":
        newText = `<u>${selected || " "}</u>`;
        break;
      case "strike":
        newText = `~~${selected || " "}~~`;
        break;
      case "heading":
        {
          const level =
            headingLevel && headingLevel >= 1 && headingLevel <= 6
              ? headingLevel
              : 1;
          newText = `${needsBreak ? "\n" : ""}${"#".repeat(level)} ${selected || " "}`;
        }
        break;
      case "ol": {
        // Busca a linha anterior ao cursor
        const lines = before.split("\n");
        const lastLine = lines.length > 0 ? lines[lines.length - 1] : "";
        const match = lastLine.match(/^(\d+)\. /);
        let nextNumber = 1;
        if (match) {
          nextNumber = parseInt(match[1], 10) + 1;
        }
        newText = `${needsBreak ? "\n" : ""}${nextNumber}. ${selected || " "}`;
        break;
      }
      case "ul": {
        newText = `${needsBreak ? "\n" : ""}- ${selected || " "}`;
        break;
      }
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
  <div className="flex flex-col border-2 rounded-3xl px-8 pb-8 pt-3 bg-white border-dark-gray w-full max-w-xl min-h-[30rem]">
      {/* Tabs */}
  <div className="flex bg-white justify-center items-center mb-2">
        <button
          className={`px-4 py-2 text-sm font-medium focus:outline-none ${tab === "write" ? "border-b-1 border-black text-black" : "text-black/60"}`}
          onClick={() => setTab("write")}
          type="button"
        >
          Editar
        </button>
        <button
          className={`px-4 py-2 text-sm font-medium focus:outline-none ${tab === "preview" ? "border-b-1 border-black text-black" : "text-black/60"}`}
          onClick={() => setTab("preview")}
          type="button"
        >
          Visualizar
        </button>
      </div>
      {/* Toolbar, Tabs e Área Editável/Preview */}
      <div className="flex flex-col border rounded-md mb-4 border-dark-gray flex-grow bg-white min-h-[10rem]">
        <div className="flex items-center gap-2 border-b border-dark-gray p-2 bg-white rounded-t-md">
          <button
            onClick={() => insertMarkdown("bold")}
            className="p-1 rounded font-bold"
            type="button"
          >
            B
          </button>
          <button
            onClick={() => insertMarkdown("italic")}
            className="p-1 rounded italic"
            type="button"
          >
            I
          </button>
          <button
            onClick={() => insertMarkdown("underline")}
            className="p-1 rounded underline"
            type="button"
          >
            U
          </button>
          <button
            onClick={() => insertMarkdown("strike")}
            className="p-1 rounded line-through"
            type="button"
          >
            S
          </button>
          <span className="mx-2 text-gray-300">|</span>
          <div ref={headingMenuRef} className="relative">
            <button
              type="button"
              className="p-1 rounded font-bold text-lg"
              title="Título"
              onClick={() => setShowHeadingMenu((v) => !v)}
            >
              H
            </button>
            {showHeadingMenu && (
              <div className="absolute left-0 mt-1 z-10 bg-white rounded shadow-md min-w-[60px]">
                <button
                  type="button"
                  className="block w-full text-left px-3 py-1 hover:bg-gray-100"
                  onClick={() => {
                    insertMarkdown("heading", 1);
                    setShowHeadingMenu(false);
                  }}
                >
                  <Heading1 className="inline mr-2" />
                </button>
                <button
                  type="button"
                  className="block w-full text-left px-3 py-1 hover:bg-gray-100"
                  onClick={() => {
                    insertMarkdown("heading", 2);
                    setShowHeadingMenu(false);
                  }}
                >
                  <Heading2 className="inline mr-2" />
                </button>
                <button
                  type="button"
                  className="block w-full text-left px-3 py-1 hover:bg-gray-100"
                  onClick={() => {
                    insertMarkdown("heading", 3);
                    setShowHeadingMenu(false);
                  }}
                >
                  <Heading3 className="inline mr-2" />
                </button>
              </div>
            )}
          </div>
          <button
            onClick={() => insertMarkdown("ol")}
            className="p-1 rounded"
            type="button"
            title="Lista ordenada"
          >
            <ListOrdered size={24} />
          </button>
          <button
            onClick={() => insertMarkdown("ul")}
            className="p-1 rounded"
            type="button"
            title="Lista não ordenada"
          >
            <List size={24} />
          </button>
        </div>

        {/* Área Editável/Preview */}
        {tab === "write" ? (
          <Textarea
            id="markdown-editor"
            className="w-full h-full p-3 text-sm rounded-b-md border-none focus:border-none focus:ring-0 focus:outline-none resize-none shadow-none min-h-[8rem] max-h-[16rem]"
            style={{
              outline: "none",
              boxShadow: "none",
              WebkitBoxShadow: "none",
              border: "none",
            }}
            value={markdown}
            onChange={(e) => setMarkdown(e.target.value)}
            placeholder="Digite sua mensagem..."
          />
        ) : (
          <div className="w-full h-full p-3 bg-gray-50 text-sm overflow-y-auto rounded-b-md min-h-[8rem] max-h-[16rem]">
            <ReactMarkdown
              remarkPlugins={[remarkGfm, remarkBreaks]}
              components={{
                blockquote: () => null,
                h1: ({ node, ...props }) => (
                  <h1 className="text-2xl font-bold mt-2 mb-2" {...props} />
                ),
                h2: ({ node, ...props }) => (
                  <h2 className="text-xl font-bold mt-2 mb-2" {...props} />
                ),
                h3: ({ node, ...props }) => (
                  <h3 className="text-lg font-bold mt-2 mb-2" {...props} />
                ),
                ul: ({ node, ...props }) => (
                  <ul className="list-disc ml-6 my-2" {...props} />
                ),
                ol: ({ node, ...props }) => (
                  <ol className="list-decimal ml-6 my-2" {...props} />
                ),
                li: ({ node, ...props }) => <li className="mb-1" {...props} />,
              }}
            >
              {markdown || "Nada para visualizar."}
            </ReactMarkdown>
          </div>
        )}
      </div>

      {/* Botões de ação */}
      <div className="flex gap-3 mt-2">
        <Button
          variant="destructive"
          className="flex-1 min-w-0 py-2 px-0 text-sm"
          label="Recusar professor"
          onClick={() => {}}
        />
        <Button
          className="flex-1 min-w-0 py-2 px-0 text-sm"
          label="Aprovar professor"
          onClick={() => {}}
        />
      </div>

      {/* Botão desabilitado */}
      <Button
        variant="secondary"
        className="w-full mt-4"
        disabled
        label="Visualizar comprovante"
      />
    </div>
  );
}
