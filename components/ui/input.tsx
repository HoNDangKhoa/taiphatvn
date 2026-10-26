import { cn } from "@/lib/utils";

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={cn("flex h-10 w-full rounded-lg border border-black/10 bg-white px-3 text-sm outline-none focus:border-[#3f7d3a]", props.className)} />;
}
export function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={cn("flex min-h-24 w-full rounded-lg border border-black/10 bg-white px-3 py-2 text-sm outline-none focus:border-[#3f7d3a]", props.className)} />;
}
export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className={cn("flex h-10 w-full rounded-lg border border-black/10 bg-white px-3 text-sm outline-none focus:border-[#3f7d3a]", props.className)} />;
}
export function Label(props: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return <label {...props} className={cn("mb-1.5 block text-sm font-medium text-ink/70", props.className)} />;
}
