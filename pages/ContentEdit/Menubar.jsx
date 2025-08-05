import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { getMenuBlueprint } from "./MenubarConfig";
import MenubarDropdown from "@/pages/ContentEdit/MenubarDropdown";
import FindReplaceModal from "@/pages/ContentEdit/FindReplaceModal";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import CookieManager from "@/managers/CookieManager";
import { INSERT_IMAGE_COMMAND } from "./ImagePlugin";
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

  const uploadImage = async (file) => {
    try {
      // این می تونه حذف بشه اگه تو بک نیاریم
      const formData = new FormData();
      formData.append("image", file);

      const token = CookieManager.LoadToken();
      const response = await axios.post(
        "http://your-api-endpoint/upload",
        formData,
        {
          headers: {
            Authorization: `JWT ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return {
        src: response.data.url,
        altText: file.name,
      };
    } catch (error) {
      console.error("Image upload failed:", error);
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => {
          resolve({
            src: reader.result,
            altText: file.name,
          });
        };
        reader.readAsDataURL(file);
      });
    }
  };
  const handleChange = (event) => {
      const file = event.target.files[0];
      console.log(file)
      if (!file) return;
      if (file.type.startsWith("image/")) {
        uploadImage(file).then(({ src, altText }) => {
          editor.dispatchCommand(INSERT_IMAGE_COMMAND, { src, altText });
        });
      }
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
        <input type="file" ref={fileRefrence} style={{display:"none"}} onChange={handleChange}/>
      </menu>
  );
};

export default Menubar;
