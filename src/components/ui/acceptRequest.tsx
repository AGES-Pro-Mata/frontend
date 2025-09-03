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
    if (!editorRef.current) return;
    editorRef.current.focus();
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;
    const range = selection.getRangeAt(0);
    let tag: string | undefined;
    switch (command) {
      case "bold":
        tag = "b";
        break;
      case "italic":
        tag = "i";
        break;
      case "underline":
        tag = "u";
        break;
      case "strikeThrough":
        tag = "s";
        break;
      default:
        break;
    }
    if (tag) {
      // Check if selection is already inside the tag
      let node: Node | null = range.startContainer;
      while (node && node.nodeType !== 1) {
        if (node.parentNode) {
          node = node.parentNode;
        } else {
          node = null;
          break;
        }
      }
      let el = node as HTMLElement | null;
      if (el && el.closest(tag)) {
        // Remove the tag by replacing it with its children
        const parent = el.closest(tag);
        if (parent) {
          const fragment = document.createDocumentFragment();
          while (parent.firstChild) {
            fragment.appendChild(parent.firstChild);
          }
          parent.replaceWith(fragment);
        }
      } else {
        // Add the tag
        const selectedText = range.extractContents();
        const newEl = document.createElement(tag);
        newEl.appendChild(selectedText);
        range.insertNode(newEl);
        // Move selection after inserted node
        range.setStartAfter(newEl);
        range.collapse(true);
        selection.removeAllRanges();
        selection.addRange(range);
      }
    }
    updateActiveFormats();
  };

  const updateActiveFormats = () => {
    const formats: string[] = [];
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) {
      setActiveFormats([]);
      return;
    }
    const range = selection.getRangeAt(0);
    let node: Node | null = range.startContainer;
    // Traverse up to the parent element
    while (node && node.nodeType !== 1) {
      if (node.parentNode) {
        node = node.parentNode;
      } else {
        node = null;
        break;
      }
    }
    if (node) {
      let el = node as HTMLElement;
      // Check for bold
      if (el.closest('b, strong')) formats.push('bold');
      // Check for italic
      if (el.closest('i, em')) formats.push('italic');
      // Check for underline
      if (el.closest('u')) formats.push('underline');
      // Check for strikethrough
      if (el.closest('s, strike')) formats.push('strikeThrough');
      // Check for unordered list
      if (el.closest('ul')) formats.push('insertUnorderedList');
      // Check for ordered list
      if (el.closest('ol')) formats.push('insertOrderedList');
    }
    setActiveFormats(formats);
  };

  useEffect(() => {
    document.addEventListener("selectionchange", updateActiveFormats);
    return () => document.removeEventListener("selectionchange", updateActiveFormats);
  }, []);

  const isActive = (cmd: string) =>
    activeFormats.includes(cmd)
      ? "bg-main-dark-green text-white"
      : "hover:bg-soft-white";

  return (
    <div
      className="flex flex-col border-2 rounded-3xl p-8 bg-white border-dark-gray"
      style={{ width: "514px", height: "482px" }}
    >
      {/* Toolbar */}
      <div className="border rounded-md mb-4 border-dark-gray">
        <div className="flex items-center gap-2 border-b border-dark-gray p-2 bg-white rounded-t-md">
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
            <span className="absolute top-3 left-3 text-dark-gray pointer-events-none select-none">
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
          style={{ backgroundColor: "" }}
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
