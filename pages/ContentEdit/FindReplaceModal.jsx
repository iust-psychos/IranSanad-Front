import { useState, useEffect, useCallback } from "react";
import "@/pages/ContentEdit/index.css";
import { IoMdClose } from "react-icons/io";
import { LuReplace, LuReplaceAll } from "react-icons/lu";
import {
  IoIosArrowRoundDown,
  IoIosArrowRoundUp,
  IoIosArrowBack,
} from "react-icons/io";
import {
  $getRoot,
  $getSelection,
  $isTextNode,
  $createRangeSelection,
  $setSelection,
  $createNodeSelection,
  $isRangeSelection,
  $getNodeByKey,
} from "lexical";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

const FindReplaceModal = ({ onClose }) => {
  const [editor] = useLexicalComposerContext();
  const [findText, setFindText] = useState("");
  const [replaceText, setReplaceText] = useState("");
  const [showReplace, setShowReplace] = useState(false);
  const [matches, setMatches] = useState([]);
  const [currentMatchIndex, setCurrentMatchIndex] = useState(-1);

  // Find all matches in the document
  useEffect(() => {
    if (!editor || findText.trim() === "") {
      setMatches([]);
      setCurrentMatchIndex(-1);
      return;
    }

    const foundMatches = [];
    editor.getEditorState().read(() => {
      const root = $getRoot();
      const searchText = findText.toLowerCase();

      const visitNode = (node) => {
        if ($isTextNode(node)) {
          const text = node.getTextContent().toLowerCase();
          let index = text.indexOf(searchText);

          while (index !== -1) {
            foundMatches.push({
              nodeKey: node.getKey(),
              start: index,
              end: index + findText.length,
            });
            index = text.indexOf(searchText, index + 1);
          }
        }

        if (typeof node.getChildren === "function") {
          node.getChildren().forEach(visitNode);
        }
      };

      root.getChildren().forEach(visitNode);
    });

    setMatches(foundMatches);
    // Don't automatically select the first match
    // Just reset the current index
    setCurrentMatchIndex(-1);
  }, [findText, editor]);

  const selectMatch = useCallback(
    (index) => {
      if (matches.length === 0 || index < 0 || index >= matches.length) return;

      const match = matches[index];
      editor.update(() => {
        const node = $getNodeByKey(match.nodeKey);

        if ($isTextNode(node)) {
          // Create a range selection for the match
          const rangeSelection = $createRangeSelection();
          rangeSelection.anchor.set(match.nodeKey, match.start, "text");
          rangeSelection.focus.set(match.nodeKey, match.end, "text");
          $setSelection(rangeSelection);

          // Scroll to the selection
          const element = editor.getElementByKey(match.nodeKey);
          if (element) {
            element.scrollIntoView({
              behavior: "smooth",
              block: "center",
              inline: "center",
            });

            // Add temporary highlight class
            element.classList.add("text-match-highlight");
            setTimeout(() => {
              element.classList.remove("text-match-highlight");
            }, 1000);
          }
        }
      });
    },
    [matches, editor]
  );

  // Navigate to next/previous match
  const navigateMatch = useCallback(
    (direction) => {
      if (matches.length === 0) return;

      // If no match is currently selected, select the first one in the direction
      let newIndex;
      if (currentMatchIndex === -1) {
        newIndex = direction > 0 ? 0 : matches.length - 1;
      } else {
        newIndex =
          (currentMatchIndex + direction + matches.length) % matches.length;
      }

      setCurrentMatchIndex(newIndex);
      selectMatch(newIndex);
    },
    [matches, currentMatchIndex, selectMatch]
  );

  // Replace current match
  const replaceCurrent = useCallback(() => {
    if (matches.length === 0 || currentMatchIndex === -1) return;

    const match = matches[currentMatchIndex];
    editor.update(() => {
      const node = $getNodeByKey(match.nodeKey);

      if ($isTextNode(node)) {
        const text = node.getTextContent();
        const newText =
          text.substring(0, match.start) +
          replaceText +
          text.substring(match.end);

        node.setTextContent(newText);

        // Adjust subsequent matches positions
        const lengthDiff = replaceText.length - findText.length;
        if (lengthDiff !== 0) {
          setMatches((prevMatches) =>
            prevMatches.map((m, i) => {
              if (
                i > currentMatchIndex &&
                m.nodeKey === match.nodeKey &&
                m.start > match.start
              ) {
                return {
                  ...m,
                  start: m.start + lengthDiff,
                  end: m.end + lengthDiff,
                };
              }
              return m;
            })
          );
        }
      }
    });

    // Move to next match or reset if no more matches
    if (currentMatchIndex < matches.length - 1) {
      setCurrentMatchIndex(currentMatchIndex + 1);
      selectMatch(currentMatchIndex + 1);
    } else {
      setFindText(""); // Reset search to refresh matches
    }
  }, [matches, currentMatchIndex, replaceText, findText, editor, selectMatch]);

  // Replace all matches
  const replaceAll = useCallback(() => {
    if (matches.length === 0) return;

    editor.update(() => {
      // Process replacements from last to first to avoid position shifting issues
      const sortedMatches = [...matches].sort((a, b) => {
        if (a.nodeKey !== b.nodeKey) return 0;
        return b.start - a.start;
      });

      sortedMatches.forEach((match) => {
        const node = $getNodeByKey(match.nodeKey);
        if ($isTextNode(node)) {
          const text = node.getTextContent();
          const newText =
            text.substring(0, match.start) +
            replaceText +
            text.substring(match.end);
          node.setTextContent(newText);
        }
      });
    });

    setFindText("");
    setMatches([]);
    setCurrentMatchIndex(-1);
  }, [matches, replaceText, editor]);

  const matchCount = matches.length;
  const currentIndex = currentMatchIndex >= 0 ? currentMatchIndex + 1 : 0;

  return (
    <div>
      <div className="FindReplaceModal-Popup">
        <div className="FindReplaceModal-Content">
          <div className="FindReplaceModal-SearchGroup">
            <input
              type="text"
              placeholder="جست و جو ..."
              className="FindReplaceModal-Input"
              value={findText}
              onChange={(e) => setFindText(e.target.value)}
              autoFocus
            />
            <div className="FindReplaceModal-Actions">
              <span className="FindReplaceModal-Result">
                {matchCount
                  ? `نتیجه ${currentIndex} از ${matchCount}`
                  : "موردی یافت نشد"}
              </span>
              <button
                className="FindReplaceModal-ActionButton"
                onClick={() => navigateMatch(-1)}
                disabled={!matchCount}
              >
                <IoIosArrowRoundUp className="FindReplaceModal-Icon" />
              </button>
              <button
                className="FindReplaceModal-ActionButton"
                onClick={() => navigateMatch(1)}
                disabled={!matchCount}
              >
                <IoIosArrowRoundDown className="FindReplaceModal-Icon" />
              </button>
            </div>
          </div>

          <div className="FindReplaceModal-ToggleContainer">
            <button
              className="FindReplaceModal-ToggleButton"
              onClick={() => setShowReplace(!showReplace)}
              aria-expanded={showReplace}
            >
              <IoIosArrowBack className="FindReplaceModal-ToggleIcon" />
            </button>
          </div>

          {showReplace && (
            <div className="FindReplaceModal-ReplaceGroup">
              <input
                type="text"
                placeholder="جایگزینی با ..."
                className="FindReplaceModal-Input"
                value={replaceText}
                onChange={(e) => setReplaceText(e.target.value)}
              />
              <div className="FindReplaceModal-Actions">
                <button
                  className="FindReplaceModal-ReplaceButton"
                  onClick={replaceCurrent}
                  disabled={!matchCount || currentMatchIndex === -1}
                >
                  <LuReplace className="FindReplaceModal-Icon" />
                  {/* <span>جایگزینی</span> */}
                </button>
                <button
                  className="FindReplaceModal-ReplaceButton"
                  onClick={replaceAll}
                  disabled={!matchCount}
                >
                  <LuReplaceAll className="FindReplaceModal-Icon" />
                  {/* <span>جایگزینی همه</span> */}
                </button>
              </div>
            </div>
          )}
        </div>

        <button className="FindReplaceModal-CloseButton" onClick={onClose}>
          <IoMdClose className="FindReplaceModal-Icon" />
        </button>
      </div>
    </div>
  );
};

export default FindReplaceModal;
