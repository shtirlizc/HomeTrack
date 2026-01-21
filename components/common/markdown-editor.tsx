"use client";

import { useState } from "react";
import { SerializedEditorState } from "lexical";
import { Editor } from "@/components/blocks/editor-00/editor";
import { InputJsonValue } from "@prisma/client/runtime/edge";
import { NullableJsonNullValueInput } from "@/lib/generated/prisma/internal/prismaNamespace";

interface Props {
  initialMd?: NullableJsonNullValueInput | InputJsonValue;
  onChange: (md: string) => void;
}

export const MarkdownEditor = ({ initialMd, onChange }: Props) => {
  const initObject = initialMd ? JSON.parse(initialMd as string) : "";

  const initialValue = getInitValue(
    initObject,
  ) as unknown as SerializedEditorState;

  const [editorState, setEditorState] =
    useState<SerializedEditorState>(initialValue);

  const handleBlur = () => {
    onChange(JSON.stringify(editorState));
  };

  return (
    <div onBlur={handleBlur}>
      <Editor
        editorSerializedState={editorState}
        onSerializedChange={(value) => setEditorState(value)}
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
