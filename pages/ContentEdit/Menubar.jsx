import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { getMenuBlueprint } from "./MenubarConfig";
import MenubarDropdown from "@/pages/ContentEdit/MenubarDropdown";
import FindReplaceModal from "@/pages/ContentEdit/FindReplaceModal";
import { useState, useEffect, useRef } from "react";

const Menubar = () => {
  const [editor] = useLexicalComposerContext();
  const [openFindReplaceDialog, setOpenFindReplaceDialog] = useState(false);
  const fileRefrence = useRef(null);
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "f") {
        e.preventDefault();
        setOpenFindReplaceDialog(true);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);
  
  const handleChange = () => {

  };

  return (
      <menu className="menubar">
        {getMenuBlueprint(fileRefrence, editor, () => setOpenFindReplaceDialog(true)).map(
          (section) => (
            <MenubarDropdown
              key={section.label}
              mainLabel={section.label}
              items={section.items}
            />
          )
        )}
        {/* Added By Erfan  */}
        {/* it was obvious, trash code */}
        {openFindReplaceDialog && (
          <FindReplaceModal
            onClose={() => setOpenFindReplaceDialog(false)}
            isOpen={openFindReplaceDialog}
          />
        )}
        <input type="file" ref={fileRefrence} style={{display:"none"}} />
      </menu>
  );
};

export default Menubar;
