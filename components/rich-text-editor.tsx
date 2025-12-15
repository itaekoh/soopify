// components/rich-text-editor.tsx
"use client"

import { Editor } from "@tinymce/tinymce-react"

type RichTextEditorProps = {
  value: string
  onChange: (content: string) => void
}

export function RichTextEditor({ value, onChange }: RichTextEditorProps) {
  const apiKey = process.env.NEXT_PUBLIC_TINYMCE_API_KEY

  // 이미지 업로드 핸들러
  const handleImageUpload = (
    blobInfo: any,
    progress: (percent: number) => void,
  ): Promise<string> => {
    return new Promise(async (resolve, reject) => {
      try {
        const formData = new FormData()
        formData.append("file", blobInfo.blob(), blobInfo.filename())

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        })

        const data = await response.json()

        if (!response.ok || !data.ok) {
          reject(data.error || "이미지 업로드에 실패했습니다.")
          return
        }

        resolve(data.location)
      } catch (error) {
        reject("이미지 업로드 중 오류가 발생했습니다.")
      }
    })
  }

  return (
    <Editor
      apiKey={apiKey}
      value={value}
      onEditorChange={onChange}
      init={{
        height: 500,
        menubar: true,
        plugins: [
          "advlist",
          "autolink",
          "lists",
          "link",
          "image",
          "charmap",
          "preview",
          "anchor",
          "searchreplace",
          "visualblocks",
          "code",
          "fullscreen",
          "insertdatetime",
          "media",
          "table",
          "code",
          "help",
          "wordcount",
        ],
        toolbar:
          "undo redo | blocks | " +
          "bold italic forecolor | alignleft aligncenter " +
          "alignright alignjustify | bullist numlist outdent indent | " +
          "image link | removeformat | help",
        block_formats:
          "Paragraph=p; Heading 1=h1; Heading 2=h2; Heading 3=h3; Heading 4=h4; Heading 5=h5; Heading 6=h6",
        content_style:
          "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
        // 이미지 업로드 설정
        images_upload_handler: handleImageUpload,
        automatic_uploads: true,
        file_picker_types: "image",
        image_advtab: true,
        image_caption: true,
        image_title: true,
      }}
    />
  )
}
