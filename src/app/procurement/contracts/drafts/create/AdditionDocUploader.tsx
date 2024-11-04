"use client";

import React, { useState } from "react";
import { EditIcon, Paperclip, UploadCloud } from "lucide-react";
import {
  FileInput,
  FileUploader,
  FileUploaderItem,
  FileUploaderContent,
} from "@/Components/ui/file-uploader";
import Tooltip from "@/Components/ui/tooltip";
import { Input } from "@/Components/ui/input";

type Props = {
  documents?: ContractAttachment[];
  onDocumentsChange?: (docs: Attachment[]) => void;
};

interface Attachment extends ContractAttachment {
  file: File;
}

export default function AdditionDocUploader(props: Props) {
  const [attachments, setAttachments] = useState<{ [key: string]: Attachment }>(
    {}
  );
  const [files, setFiles] = useState<File[]>([]);

  const dropZoneConfig = {
    maxFiles: 5,
    maxSize: 1024 * 1024 * 10, // 10MB
    multiple: true,
  };

  function getFileKey(file: File) {
    return file.name + file.lastModified;
  }

  return (
    <>
      <div className="grid w-full gap-2 file-item">
        <label htmlFor="additional-docs" className="text-sm font-medium">
          Attachments{" "}
          <small className="text-muted-foreground ml-2">
            (Option) Max 5 files, 10MB each
          </small>
        </label>

        <FileUploader
          value={files}
          onValueChange={(files) => {
            setFiles(files || []);
            if (!files) return;
            const _docks = {} as typeof attachments;
            for (const file of files) {
              const key = getFileKey(file);
              let doc = attachments[key];

              if (doc) {
                doc.file = file;
                _docks[key] = doc;
                continue;
              }

              _docks[key] = {
                file,
                name: file.name,
                id: Date.now().toString(),
              } as any;
            }
            setAttachments(_docks);
            props.onDocumentsChange?.(Object.values(_docks).flat());
          }}
          dropzoneOptions={dropZoneConfig}
          className="relative bg-background rounded-lg p-2"
        >
          <FileInput className="outline-dashed outline-1 outline-secondary">
            <div className="flex items-center justify-center flex-col pt-3 pb-4 w-full ">
              <UploadCloud className="w-8 h-8 mr-2" />
              <div className="space-y-1 text-center">
                <p className="mb-1 text-sm text-muted-foreground">
                  <span className="font-semibold">Click to upload</span>
                  &nbsp; or drag and drop
                </p>
                <p className="text-xs text-muted-foreground">
                  Supported formats: PDF, Word, Excel, CSV (Max 10MB per file)
                </p>
              </div>
            </div>
          </FileInput>
          <FileUploaderContent>
            {files &&
              files.length > 0 &&
              files.map((file, i) => {
                const key = getFileKey(file);
                const attachment = attachments[key];

                return (
                  <FileUploaderItem key={i} index={i}>
                    <AttachmentItem
                      name={attachment.name}
                      fileType={attachment.file.type}
                      onNameChange={(name) => {
                        attachment.name = name;
                        attachments[key] = attachment;
                        setAttachments(attachments);
                        props.onDocumentsChange?.(
                          Object.values(attachments).flat()
                        );
                      }}
                    />
                  </FileUploaderItem>
                );
              })}
          </FileUploaderContent>
        </FileUploader>
      </div>
    </>
  );
}

type AttachmentItemProps = {
  name: string;
  fileType: string;
  onNameChange?: (name: string) => void;
};

function AttachmentItem({ name, onNameChange, fileType }: AttachmentItemProps) {
  const [edit, toggleEdit] = useState(false);
  const [documentName, setDocumentName] = useState(name);

  return (
    <div className="inline-flex items-center gap-4 w-full justify-between pr-6">
      <div className="inline-flex items-center gap-2" key={String(edit)}>
        <Paperclip className="h-4 w-4 stroke-primary/50" />
        {edit && (
          <Input
            autoFocus
            type="text"
            value={documentName}
            onChange={({ currentTarget }) => {
              setDocumentName(currentTarget.value);
            }}
            onBlur={() => {
              onNameChange?.(documentName || name);
              setDocumentName(documentName || name);
              toggleEdit(false);
            }}
            maxLength={20}
            className="outline-none z-10 bg-background text-sm border p-1 h-max"
          />
        )}
        {!edit && (
          <span className="text-sm truncate sm:w-[20ch] lg:w-[25ch]">
            {documentName}
          </span>
        )}
      </div>
      <span>
        <small className="text-muted-foreground">{fileType}</small>
      </span>
      <Tooltip content="Edit Attachment Name">
        <button type="button" onClick={() => toggleEdit(true)}>
          <EditIcon className="h-4 w-4 stroke-current" />
        </button>
      </Tooltip>
    </div>
  );
}
