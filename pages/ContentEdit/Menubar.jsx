import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { getMenuBlueprint } from "./MenubarConfig";
import MenubarDropdown from "@/pages/ContentEdit/MenubarDropdown";
import FindReplaceModal from "@/pages/ContentEdit/FindReplaceModal";
import { useState, useEffect } from "react";

const Menubar = () => {
  const [editor] = useLexicalComposerContext();
  const [openFindReplaceDialog, setOpenFindReplaceDialog] = useState(false);

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

  return (
    <menu className="menubar">
      {getMenuBlueprint(editor, () => setOpenFindReplaceDialog(true)).map(
        (section) => (
          <MenubarDropdown
            key={section.label}
            mainLabel={section.label}
            items={section.items}
          />
        )
      )}
      {/* Added By Erfan  */}
      {openFindReplaceDialog && (
        <FindReplaceModal
          onClose={() => setOpenFindReplaceDialog(false)}
          isOpen={openFindReplaceDialog}
        />
      )}
    </menu>
  );
};

export default Menubar;
