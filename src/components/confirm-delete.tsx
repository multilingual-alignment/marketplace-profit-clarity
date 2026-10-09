"use client";
import type { FormEvent } from "react";
export function ConfirmDelete({ action }: { action: (formData: FormData) => void | Promise<void> }) {
  function confirm(event: FormEvent<HTMLFormElement>) { if (!window.confirm("Delete this product? This action cannot be undone.")) event.preventDefault(); }
  return <form action={action} onSubmit={confirm}><button className="button button-danger button-small" type="submit">Delete product</button></form>;
}
