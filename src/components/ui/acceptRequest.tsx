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
    if (document.queryCommandState("strikeThrough"))
      formats.push("strikeThrough");
    if (document.queryCommandState("insertUnorderedList"))
      formats.push("insertUnorderedList");
    if (document.queryCommandState("insertOrderedList"))
      formats.push("insertOrderedList");
    setActiveFormats(formats);
  };

  useEffect(() => {
    document.addEventListener("selectionchange", updateActiveFormats);
    return () =>
      document.removeEventListener("selectionchange", updateActiveFormats);
  }, []);

  const isActive = (cmd: string) =>
    activeFormats.includes(cmd)
      ? "bg-gray-400 text-white"
      : "hover:bg-gray-200";

  return (
    <div 
      className="border rounded-2xl p-4 shadow-sm bg-white"
      style={{ width: "514px", height: "482px" }}
    >
      {/* Toolbar */}
      <div className="border rounded-md">
        <div className="flex items-center gap-2 border-b p-2 bg-gray-50 rounded-t-md">
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
        <div className="relative">
          {isEmpty && (
            <span className="absolute top-3 left-3 text-gray-400 pointer-events-none select-none">
              Digite alguma observação sobre essa solicitação
            </span>
          )}

          <div
            ref={editorRef}
            contentEditable
            onInput={handleInput}
            className="w-full h-32 p-3 rounded-md outline-none resize-none"
            suppressContentEditableWarning={true}
          ></div>
        </div>
      </div>

      {/* Botões de ação */}
      <div className="flex justify-center gap-4 mt-6">
        <button className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-md text-sm">
          Recusar professor
        </button>
        <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md text-sm">
          Aprovar professor
        </button>
      </div>

      {/* Botão desabilitado */}
      <button
        className="bg-gray-300 text-gray-600 w-full py-3 rounded-md mt-6 cursor-not-allowed text-sm"
        disabled
      >
        Visualizar comprovante
      </button>
    </div>
  );
}
