'use client'

import * as React from 'react'
import { useState, useRef } from 'react'
import { Input, InputProps } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Upload, X, FileIcon } from 'lucide-react'
import { cn } from "@/lib/utils"

interface FileInputProps extends Omit<InputProps, 'type' | 'onChange'> {
  onChange?: (file: File | null) => void
}

export const FileInput = React.forwardRef<HTMLInputElement, FileInputProps>(
  ({ className, onChange, ...props }, ref) => {
    const [file, setFile] = useState<File | null>(null)
    const [isDragging, setIsDragging] = useState(false)
    const inputRef = useRef<HTMLInputElement>(null)

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFile = event.target.files && event.target.files[0]
      setFile(selectedFile || null)
      if (onChange) {
        onChange(selectedFile || null)
      }
    }

    const handleDragEnter = (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault()
      event.stopPropagation()
      setIsDragging(true)
    }

    const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault()
      event.stopPropagation()
      setIsDragging(false)
    }

    const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault()
      event.stopPropagation()
    }

    const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault()
      event.stopPropagation()
      setIsDragging(false)
      const droppedFile = event.dataTransfer.files && event.dataTransfer.files[0]
      if (droppedFile) {
        setFile(droppedFile)
        if (onChange) {
          onChange(droppedFile)
        }
      }
    }

    const handleRemove = () => {
      setFile(null)
      if (inputRef.current) {
        inputRef.current.value = ''
      }
      if (onChange) {
        onChange(null)
      }
    }

    return (
      <div
        className={cn(
          "grid w-full max-w-sm items-center gap-1.5",
          className
        )}
      >
        <Label htmlFor="file-input">File</Label>
        <div
          className={cn(
            "flex flex-col items-center gap-2 p-4 rounded-md border border-input",
            isDragging && "border-2 border-dashed border-primary",
            "transition-colors duration-300"
          )}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <Input
            id="file-input"
            type="file"
            className="hidden"
            onChange={handleFileChange}
            ref={inputRef}
            {...props}
          />
          {file ? (
            <div className="flex items-center justify-between w-full p-2 bg-secondary rounded-md">
              <div className="flex items-center gap-2">
                <FileIcon className="h-4 w-4 text-secondary-foreground" />
                <span className="text-sm text-secondary-foreground truncate max-w-[180px]">{file.name}</span>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="p-1 text-destructive hover:text-destructive/80 hover:bg-destructive/20"
                onClick={handleRemove}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-muted-foreground/25 rounded-md">
              <Upload className="h-10 w-10 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">Drag & drop or click to upload</p>
              {props.accept && <p className="text-xs text-muted-foreground mt-1">Accepted formats: {props.accept}</p>}
            </div>
          )}
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="w-full bg-secondary hover:bg-secondary/80 text-secondary-foreground"
            onClick={() => inputRef.current?.click()}
          >
            <Upload className="mr-2 h-4 w-4" />
            {file ? 'Change File' : 'Select File'}
          </Button>
        </div>
      </div>
    )
  }
)

FileInput.displayName = "FileInput"