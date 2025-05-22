import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  $isRangeSelection,
  $insertNodes,
} from "lexical";
import {  $getSelection } from 'lexical';
import { $createParagraphNode } from "lexical";
import {$createTableNodeWithDimensions} from "@lexical/table";
import { TableIcon } from "./Icons";

export default function InsertTableButton({rows , columns}) {
  const [editor] = useLexicalComposerContext();

  const insertTable = () => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        const tableNode = $createTableNodeWithDimensions(columns, rows);
        $insertNodes([tableNode, $createParagraphNode()]);
      }
    });
  };

  return (
    <button onClick={insertTable}>
      <TableIcon/>
    </button>
  );
}
