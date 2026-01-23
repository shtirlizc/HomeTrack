"use client";

import { useState } from "react";
import { SerializedEditorState } from "lexical";
import { Editor } from "@/components/blocks/editor-00/editor";
import { JsonValue } from "@prisma/client/runtime/edge";

interface Props {
  initialMd?: JsonValue;
  onChange?: (md: string) => void;
  isEditable?: boolean;
}

export const MarkdownEditor = ({
  initialMd = "",
  onChange,
  isEditable = false,
}: Props) => {
  const initObject = initialMd ? JSON.parse(initialMd as string) : "";
  const initialValue = getInitValue(
    initObject,
  ) as unknown as SerializedEditorState;

  const [editorState, setEditorState] =
    useState<SerializedEditorState>(initialValue);

  const handleBlur = () => {
    if (onChange) {
      onChange(JSON.stringify(editorState));
    }
  };

  if (!isEditable && !initObject) {
    return null;
  }

  if (!isEditable) {
    return <Editor editorSerializedState={editorState} editable={false} />;
  }

  return (
    <div onBlur={handleBlur}>
      <Editor
        editorSerializedState={editorState}
        onSerializedChange={(value) => setEditorState(value)}
        editable={isEditable}
      />
    </div>
  );
};

function getInitValue(initObject: string) {
  if (initObject) {
    return initObject;
  }

  return {
    root: {
      children: [
        {
          children: [
            {
              detail: 0,
              format: 0,
              mode: "normal",
              style: "",
              text: "",
              type: "text",
              version: 1,
            },
          ],
          direction: "ltr",
          format: "",
          indent: 0,
          type: "paragraph",
          version: 1,
        },
      ],
      direction: "ltr",
      format: "",
      indent: 0,
      type: "root",
      version: 1,
    },
  };
}
