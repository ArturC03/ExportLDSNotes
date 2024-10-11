"use client";

import { ColumnDef } from "@tanstack/react-table";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Notes = {
  type: "journal" | "highlight" | "journal";
  title: string;
  noteText: string;
  sourceLocation: string;
  tags: string;
  noteBooks: string;
  studySet: string;
  lastUpdated: string;
  created: string;
};

export const columns: ColumnDef<Notes>[] = [
  {
    accessorKey: "type",
    header: "Type",
  },

  {
    accessorKey: "title",
    header: "Title",
  },

  {
    accessorKey: "noteText",
    header: "NoteText",
  },

  {
    accessorKey: "sourceLocation",
    header: "SourceLocation",
  },

  {
    accessorKey: "tags",
    header: "Tags",
  },

  {
    accessorKey: "noteBooks",
    header: "NoteBooks",
  },

  {
    accessorKey: "studySet",
    header: "StudySet",
  },

  {
    accessorKey: "lastUpdated",
    header: "LastUpdated",
  },

  {
    accessorKey: "created",
    header: "Created",
  },
];
