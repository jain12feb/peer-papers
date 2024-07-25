/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { mergeRegister } from "@lexical/utils";
import {
  $createParagraphNode,
  $isRootOrShadowRoot,
  $getSelection,
  $isRangeSelection,
  CAN_REDO_COMMAND,
  CAN_UNDO_COMMAND,
  FORMAT_ELEMENT_COMMAND,
  FORMAT_TEXT_COMMAND,
  REDO_COMMAND,
  SELECTION_CHANGE_COMMAND,
  UNDO_COMMAND,
} from "lexical";
import {
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  INSERT_CHECK_LIST_COMMAND,
  REMOVE_LIST_COMMAND,
} from "@lexical/list";
import {
  $createHeadingNode,
  $createQuoteNode,
  $isHeadingNode,
} from "@lexical/rich-text";
import { $setBlocksType } from "@lexical/selection";
import { $findMatchingParent } from "@lexical/utils";
import React from "react";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Bold,
  Code,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Heading5,
  Heading6,
  Italic,
  List,
  ListOrdered,
  Pilcrow,
  Quote,
  Redo,
  Strikethrough,
  Underline,
  Undo,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const LowPriority = 1;

function Divider() {
  return <div className="divider" />;
}

export default function ToolbarPlugin({ disable }) {
  const [editor] = useLexicalComposerContext();
  const toolbarRef = useRef(null);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [isBold, setIsBold] = useState(false);
  const [isCode, setIsCode] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);
  const activeBlock = useActiveBlock();

  const $updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      // Update text format
      setIsBold(selection.hasFormat("bold"));
      setIsCode(selection.hasFormat("code"));
      setIsItalic(selection.hasFormat("italic"));
      setIsUnderline(selection.hasFormat("underline"));
      setIsStrikethrough(selection.hasFormat("strikethrough"));
    }
  }, []);

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          $updateToolbar();
        });
      }),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        (_payload, _newEditor) => {
          $updateToolbar();
          return false;
        },
        LowPriority
      ),
      editor.registerCommand(
        CAN_UNDO_COMMAND,
        (payload) => {
          setCanUndo(payload);
          return false;
        },
        LowPriority
      ),
      editor.registerCommand(
        CAN_REDO_COMMAND,
        (payload) => {
          setCanRedo(payload);
          return false;
        },
        LowPriority
      )
    );
  }, [editor, $updateToolbar]);

  function toggleBlock(type) {
    const selection = $getSelection();

    console.log("activeBlock", activeBlock);
    console.log("type", type);

    if (activeBlock === type || type === "para") {
      return $setBlocksType(selection, () => $createParagraphNode());
    }

    if (type === "h1") {
      return $setBlocksType(selection, () => $createHeadingNode("h1"));
    }

    if (type === "h2") {
      return $setBlocksType(selection, () => $createHeadingNode("h2"));
    }

    if (type === "h3") {
      return $setBlocksType(selection, () => $createHeadingNode("h3"));
    }

    if (type === "h4") {
      return $setBlocksType(selection, () => $createHeadingNode("h4"));
    }

    if (type === "h5") {
      return $setBlocksType(selection, () => $createHeadingNode("h5"));
    }

    if (type === "h6") {
      return $setBlocksType(selection, () => $createHeadingNode("h6"));
    }

    if (type === "quote") {
      return $setBlocksType(selection, () => $createQuoteNode());
    }
  }

  return (
    <div className="toolbar" ref={toolbarRef}>
      <Button
        title="Undo"
        size="icon"
        variant="icon"
        disabled={!canUndo || disable}
        onClick={() => {
          editor.dispatchCommand(UNDO_COMMAND, undefined);
        }}
        className="toolbar-item spaced disabled:opacity-25"
        aria-label="Undo"
      >
        {/* <i className="format undo" /> */}
        <Undo className="format" />
      </Button>
      <Button
        title="Redo"
        size="icon"
        variant="icon"
        disabled={!canRedo || disable}
        onClick={() => {
          editor.dispatchCommand(REDO_COMMAND, undefined);
        }}
        className="toolbar-item disabled:opacity-25"
        aria-label="Redo"
      >
        {/* <i className="format redo" /> */}
        <Redo className="format" />
      </Button>
      <Divider />
      <Button
        title="Heading 1"
        onClick={() => editor.update(() => toggleBlock("h1"))}
        disabled={disable}
        size="icon"
        variant="icon"
        data-active={activeBlock === "h1" ? "" : undefined || disable}
        className={
          "toolbar-item spaced disabled:opacity-25" +
          (activeBlock === "h1" ? "active" : "")
        }
      >
        {/* <i className="format h1" /> */}
        <Heading1 className="format" />
      </Button>
      <Button
        title="Heading 2"
        onClick={() => editor.update(() => toggleBlock("h2"))}
        disabled={disable}
        size="icon"
        variant="icon"
        data-active={activeBlock === "h2" ? "" : undefined || disable}
        className={
          "toolbar-item spaced disabled:opacity-25" +
          (activeBlock === "h2" ? "active" : "")
        }
      >
        {/* <i className="format h2" /> */}
        <Heading2 className="format" />
      </Button>
      <Button
        title="Heading 3"
        onClick={() => editor.update(() => toggleBlock("h3"))}
        disabled={disable}
        size="icon"
        variant="icon"
        data-active={activeBlock === "h3" ? "" : undefined || disable}
        className={
          "toolbar-item spaced disabled:opacity-25" +
          (activeBlock === "h3" ? "active" : "")
        }
      >
        {/* <i className="format h3" /> */}
        <Heading3 className="format" />
      </Button>
      {/* <button
        title="Heading 4"
        onClick={() => editor.update(() => toggleBlock("h4"))}
        data-active={activeBlock === "h4" ? "" : undefined}
        className={
          "toolbar-item spaced " + (activeBlock === "h4" ? "active" : "")
        }
      >
        <Heading4 className="format" />
      </button>
      <button
        title="Heading 5"
        onClick={() => editor.update(() => toggleBlock("h5"))}
        data-active={activeBlock === "h5" ? "" : undefined}
        className={
          "toolbar-item spaced " + (activeBlock === "h5" ? "active" : "")
        }
      >
        <Heading5 className="format" />
      </button>
      <button
        title="Heading 6"
        onClick={() => editor.update(() => toggleBlock("h6"))}
        data-active={activeBlock === "h6" ? "" : undefined}
        className={
          "toolbar-item spaced " + (activeBlock === "h6" ? "active" : "")
        }
      >
        <Heading6 className="format" />
      </button> */}
      <Button
        title="Paragraph"
        onClick={() => editor.update(() => toggleBlock("para"))}
        disabled={disable}
        size="icon"
        variant="icon"
        data-active={activeBlock === "para" ? "" : undefined || disable}
        className={
          "toolbar-item spaced disabled:opacity-25" +
          (activeBlock === "para" ? "active" : "")
        }
      >
        {/* <i className="format h3" /> */}
        <Pilcrow size={18} className="format mt-1" />
      </Button>
      <Divider />
      <Button
        title="Bold"
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold");
        }}
        className={
          "toolbar-item spaced disabled:opacity-25" + (isBold ? "active" : "")
        }
        aria-label="Format Bold"
        disabled={disable}
        size="icon"
        variant="icon"
      >
        {/* <i className="format bold" /> */}
        <Bold size={18} className="format mt-1" />
      </Button>
      <Button
        title="Italic"
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic");
        }}
        className={
          "toolbar-item spaced disabled:opacity-25" + (isItalic ? "active" : "")
        }
        aria-label="Format Italics"
        disabled={disable}
        size="icon"
        variant="icon"
      >
        <Italic size={18} className="format mt-1" />
      </Button>
      <Button
        title="Underline"
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline");
        }}
        className={
          "toolbar-item spaced disabled:opacity-25" +
          (isUnderline ? "active" : "")
        }
        aria-label="Format Underline"
        disabled={disable}
        size="icon"
        variant="icon"
      >
        <Underline size={18} className="format mt-1" />
      </Button>
      <Button
        title="Strikethrough"
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "strikethrough");
        }}
        className={
          "toolbar-item spaced disabled:opacity-25" +
          (isStrikethrough ? "active" : "")
        }
        aria-label="Format Strikethrough"
        disabled={disable}
        size="icon"
        variant="icon"
      >
        <Strikethrough size={18} className="format mt-1" />
      </Button>
      <Button
        title="Code"
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "code");
        }}
        className={
          "toolbar-item spaced disabled:opacity-25" + (isCode ? "active" : "")
        }
        aria-label="Format Code"
        disabled={disable}
        size="icon"
        variant="icon"
      >
        <Code size={18} className="format mt-1" />
      </Button>

      <Button
        title="Quote"
        onClick={() => editor.update(() => toggleBlock("quote"))}
        disabled={disable}
        size="icon"
        variant="icon"
        data-active={activeBlock === "quote" ? "" : undefined || disable}
        className={
          "toolbar-item spaced disabled:opacity-25" +
          (activeBlock === "quote" ? "active" : "")
        }
      >
        {/* <i className="format h3" /> */}
        <Quote size={18} className="format mt-1" />
      </Button>
      <Divider />
      <Button
        title="Content Left"
        onClick={() => {
          editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "left");
        }}
        className="toolbar-item spaced disabled:opacity-25"
        aria-label="Left Align"
        disabled={disable}
        size="icon"
        variant="icon"
      >
        <AlignLeft size={20} className="format mt-1" />
      </Button>
      <Button
        title="Content Center"
        onClick={() => {
          editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "center");
        }}
        className="toolbar-item spaced disabled:opacity-25"
        aria-label="Center Align"
        disabled={disable}
        size="icon"
        variant="icon"
      >
        <AlignCenter size={20} className="format mt-1" />
      </Button>
      <Button
        title="Content Right"
        onClick={() => {
          editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "right");
        }}
        className="toolbar-item spaced disabled:opacity-25"
        aria-label="Right Align"
        disabled={disable}
        size="icon"
        variant="icon"
      >
        <AlignRight size={20} className="format mt-1" />
      </Button>
      <Button
        title="Content Justify"
        onClick={() => {
          editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "justify");
        }}
        className="toolbar-item disabled:opacity-25"
        aria-label="Justify Align"
        disabled={disable}
        size="icon"
        variant="icon"
      >
        <AlignJustify size={20} className="format mt-1" />
      </Button>
    </div>
  );
}

function useActiveBlock() {
  const [editor] = useLexicalComposerContext();

  const subscribe = useCallback(
    (onStoreChange) => {
      return editor.registerUpdateListener(onStoreChange);
    },
    [editor]
  );

  const getSnapshot = useCallback(() => {
    return editor.getEditorState().read(() => {
      const selection = $getSelection();
      if (!$isRangeSelection(selection)) return null;

      const anchor = selection.anchor.getNode();
      let element =
        anchor.getKey() === "root"
          ? anchor
          : $findMatchingParent(anchor, (e) => {
              const parent = e.getParent();
              return parent !== null && $isRootOrShadowRoot(parent);
            });

      if (element === null) {
        element = anchor.getTopLevelElementOrThrow();
      }

      if ($isHeadingNode(element)) {
        return element.getTag();
      }

      return element.getType();
    });
  }, [editor]);

  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}
