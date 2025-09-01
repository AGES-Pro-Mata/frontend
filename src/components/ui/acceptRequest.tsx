import { useRef, useState, useEffect } from "react";

export default function TeacherApproval() {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isEmpty, setIsEmpty] = useState(true);
  const [activeFormats, setActiveFormats] = useState<string[]>([]);

  const handleInput = () => {
    const text = editorRef.current?.innerText.trim() || "";
    setIsEmpty(text === "");
  };

  const handleCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value ?? "");
    editorRef.current?.focus();
    updateActiveFormats();
  };

  const updateActiveFormats = () => {
    const formats: string[] = [];
    if (document.queryCommandState("bold")) formats.push("bold");
    if (document.queryCommandState("italic")) formats.push("italic");
    if (document.queryCommandState("underline")) formats.push("underline");
    if (document.queryCommandState("strikeThrough")) formats.push("strikeThrough");
    if (document.queryCommandState("insertUnorderedList")) formats.push("insertUnorderedList");
    if (document.queryCommandState("insertOrderedList")) formats.push("insertOrderedList");
    setActiveFormats(formats);
  };

  useEffect(() => {
    document.addEventListener("selectionchange", updateActiveFormats);
    return () => document.removeEventListener("selectionchange", updateActiveFormats);
  }, []);

  const isActive = (cmd: string) =>
    activeFormats.includes(cmd)
      ? "bg-[var(--color-main-dark-green)] text-white"
      : "hover:bg-[var(--color-soft-white)]";

  return (
    <div
      className="flex flex-col border-2 rounded-3xl p-8 bg-white border-[var(--color-dark-gray)]"
      style={{ width: "514px", height: "482px" }}
    >
      {/* Toolbar */}
      <div className="border rounded-md mb-4 border-[var(--color-dark-gray)]">
        <div className="flex items-center gap-2 border-b border-[var(--color-dark-gray)] p-2 bg-white rounded-t-md">
          <button
            onClick={() => handleCommand("bold")}
            className={`p-1 rounded font-bold ${isActive("bold")}`}
          >
            B
          </button>
          <button
            onClick={() => handleCommand("italic")}
            className={`p-1 rounded italic ${isActive("italic")}`}
          >
            I
          </button>
          <button
            onClick={() => handleCommand("underline")}
            className={`p-1 rounded underline ${isActive("underline")}`}
          >
            U
          </button>
          <button
            onClick={() => handleCommand("strikeThrough")}
            className={`p-1 rounded line-through ${isActive("strikeThrough")}`}
          >
            S
          </button>
        </div>

        {/* Área editável */}
        <div className="relative mt-1">
          {isEmpty && (
            <span className="absolute top-3 left-3 text-[var(--color-dark-gray)] pointer-events-none select-none">
              Digite alguma observação sobre essa solicitação
            </span>
          )}
          <div
            ref={editorRef}
            contentEditable
            onInput={handleInput}
            className="w-full p-3 rounded-b-md outline-none resize-none overflow-y-auto"
            style={{ height: "250px" }}
            suppressContentEditableWarning={true}
          ></div>
        </div>
      </div>

      {/* Botões de ação */}
      <div className="flex justify-center gap-4 mt-auto mb-4">
        <button
          style={{ backgroundColor: "var(--color-default-red)" }}
          className="hover:brightness-90 text-white px-13 py-2 rounded-md text-sm"
        >
          Recusar professor
        </button>
        <button
          style={{ backgroundColor: "var(--color-contrast-green)" }}
          className="hover:brightness-90 text-white px-13 y-2 rounded-md text-sm"
        >
          Aprovar professor
        </button>
      </div>

      {/* Botão desabilitado */}
      <button
        style={{ backgroundColor: "var(--color-muted-foreground)" }}
        className="text-white w-full py-2 rounded-md cursor-not-allowed text-sm"
        disabled
      >
        Visualizar comprovante
      </button>
    </div>
  );
}
