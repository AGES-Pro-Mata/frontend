import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import { Textarea } from "@/components/ui/textarea";
import {
  Bold,
  Heading,
  Heading1,
  Heading2,
  Heading3,
  Italic,
  List,
  ListOrdered,
  Strikethrough,
  Underline,
} from "lucide-react";

interface MarkdownTextAreaProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function MarkdownTextArea({ value, onChange, placeholder }: MarkdownTextAreaProps) {
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
    const selected = value.substring(start, end);

    let newText = "";
    const before = value.substring(0, start);
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
      case "heading": {
        const level =
          headingLevel && headingLevel >= 1 && headingLevel <= 6
            ? headingLevel
            : 1;

        newText = `${needsBreak ? "\n" : ""}${"#".repeat(level)} ${selected || " "}`;
        break;
      }
      case "ol": {
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

    const updated = value.substring(0, start) + newText + value.substring(end);

    onChange(updated);

    setTimeout(() => {
      textarea.focus();
      textarea.selectionStart = textarea.selectionEnd = start + newText.length;
    }, 0);
  };

  return (
    <div className="w-full">
      {/* Tabs */}
      <div className="flex bg-white justify-center items-center mb-1">
        <button
          className={`px-2 py-1 mb-1 text-md font-medium focus:outline-none hover:cursor-pointer ${tab === "write" ? "border-b-1 border-black text-black" : "text-black/60"}`}
          onClick={() => setTab("write")}
          type="button"
        >
          Editar
        </button>
        <button
          className={`px-2 py-1 mb-1 text-md font-medium focus:outline-none hover:cursor-pointer ${tab === "preview" ? "border-b-1 border-black text-black" : "text-black/60"}`}
          onClick={() => setTab("preview")}
          type="button"
        >
          Visualizar
        </button>
      </div>
      <div className="rounded-xl border border-dark-gray bg-white mb-2">
        {/* Toolbar */}
        <div className="flex items-center gap-2 px-4 pt-3 pb-2 border-b">
          <button
            onClick={() => insertMarkdown("bold")}
            className="p-1 rounded font-bold text-base flex items-center justify-center hover:cursor-pointer"
            type="button"
          >
            <Bold size={18} strokeWidth={3} className="align-middle" />
          </button>
          <button
            onClick={() => insertMarkdown("italic")}
            className="p-1 rounded italic text-base flex items-center justify-center hover:cursor-pointer"
            type="button"
          >
            <Italic size={18} strokeWidth={2} className="align-middle" />
          </button>
          <button
            onClick={() => insertMarkdown("underline")}
            className="p-1 rounded underline text-base flex items-center justify-center hover:cursor-pointer"
            type="button"
          >
            <Underline size={18} strokeWidth={2} className="align-middle" />
          </button>
          <button
            onClick={() => insertMarkdown("strike")}
            className="p-1 rounded line-through text-base flex items-center justify-center hover:cursor-pointer"
            type="button"
          >
            <Strikethrough size={18} strokeWidth={2} className="align-middle" />
          </button>
          <span className="mx-2 text-gray-300">|</span>
          <div ref={headingMenuRef} className="relative">
            <button
              type="button"
              className="p-1 rounded font-bold text-lg hover:cursor-pointer"
              title="Título"
              onClick={() => setShowHeadingMenu((v) => !v)}
            >
              <Heading size={20} />
            </button>
            {showHeadingMenu && (
                 <div className="absolute left-0 mt-1 z-10 rounded-lg shadow-lg min-w-[60px]">
                   <div className="bg-soft-white rounded-lg">
                <button
                  type="button"
                  className="block w-full text-left px-3 py-1 rounded-lg hover:bg-soft-gray hover:cursor-pointer"
                  onClick={() => {
                    insertMarkdown("heading", 1);
                    setShowHeadingMenu(false);
                  }}
                >
                  <Heading1 className="inline mr-2" />
                </button>
                <button
                  type="button"
                  className="block w-full text-left px-3 py-1 rounded-lg hover:bg-soft-gray hover:cursor-pointer"
                  onClick={() => {
                    insertMarkdown("heading", 2);
                    setShowHeadingMenu(false);
                  }}
                >
                  <Heading2 className="inline mr-2" />
                </button>
                <button
                  type="button"
                  className="block w-full text-left px-3 py-1 rounded-lg hover:bg-soft-gray hover:cursor-pointer"
                  onClick={() => {
                    insertMarkdown("heading", 3);
                    setShowHeadingMenu(false);
                  }}
                >
                  <Heading3 className="inline mr-2" />
                </button>
                   </div>
              </div>
            )}
          </div>
          <button
            onClick={() => insertMarkdown("ol")}
            className="p-1 rounded text-base hover:cursor-pointer"
            type="button"
            title="Lista ordenada"
          >
            <ListOrdered size={22} />
          </button>
          <button
            onClick={() => insertMarkdown("ul")}
            className="p-1 rounded text-base hover:cursor-pointer"
            type="button"
            title="Lista não ordenada"
          >
            <List size={22} />
          </button>
        </div>
        {/* Área Editável/Preview */}
        {tab === "write" ? (
          <Textarea
            id="markdown-editor"
            className="w-full p-4 bg-white text-base rounded-b-xl border-none focus:border-none focus:ring-0 focus:outline-none resize-none shadow-none min-h-[14rem] max-h-[32rem]"
            style={{
              outline: "none",
              boxShadow: "none",
              WebkitBoxShadow: "none",
              border: "none",
            }}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder || "Escreva sua mensagem aqui..."}
          />
        ) : (
          <div className="w-full p-4 bg-gray-50 text-base overflow-y-auto rounded-b-xl min-h-[14rem] max-h-[32rem]">
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
              {value || "Nada para visualizar."}
            </ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
}
