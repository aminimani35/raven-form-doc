# فیلد سفارشی

برای نیازهایی که انواع استاندارد کافی نیستند، می‌توانید فیلد کاملاً سفارشی بسازید.

## روش ۱: `type: "custom"` با prop `render`

```tsx
import { RavenForm } from "@/form-engine";
import { rhfAdapter } from "@/form-engine/adapters/rhfAdapter";

const schema = {
  id: "profile",
  fields: [
    {
      name: "avatar",
      type: "custom",
      label: "تصویر پروفایل",
      colSpan: 12,
      render: ({ value, onChange, error, label }) => (
        <AvatarUploader
          value={value as string}
          onChange={onChange}
          error={error}
          label={label}
        />
      ),
    },
    {
      name: "location",
      type: "custom",
      label: "موقعیت روی نقشه",
      colSpan: 12,
      render: ({ value, onChange }) => (
        <MapPicker center={value as [number, number]} onPick={onChange} />
      ),
    },
  ],
};
```

## روش ۲: `useRavenField` برای کامپوننت‌های مستقل

```tsx
import { useRavenField } from "@/form-engine/hooks/useRavenField";

interface Props {
  name: string;
  label: string;
}

export function TagInput({ name, label }: Props) {
  const { value, onChange, error } = useRavenField(name);
  const tags = (value as string[]) ?? [];

  const addTag = (tag: string) => onChange([...tags, tag]);
  const removeTag = (i: number) => onChange(tags.filter((_, idx) => idx !== i));

  return (
    <div>
      <label>{label}</label>
      <div className="tag-list">
        {tags.map((t, i) => (
          <span key={i} className="tag">
            {t} <button onClick={() => removeTag(i)}>×</button>
          </span>
        ))}
      </div>
      <input
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            addTag((e.target as HTMLInputElement).value);
            (e.target as HTMLInputElement).value = "";
          }
        }}
        placeholder="تایپ کنید + Enter"
      />
      {error && <span className="error">{error}</span>}
    </div>
  );
}
```

سپس در فرم:

```tsx
const schema = {
  id: "article",
  fields: [
    { name: "title", type: "text", label: "عنوان", colSpan: 12 },
    {
      name: "tags",
      type: "custom",
      label: "تگ‌ها",
      colSpan: 12,
      render: (ctx) => <TagInput name={ctx.name} label={ctx.label} />,
    },
  ],
};
```

## Context رندر سفارشی

```ts
interface RenderContext {
  name: string;
  label: string;
  value: unknown;
  onChange: (v: unknown) => void;
  onBlur: () => void;
  error?: string;
  disabled: boolean;
  schema: FormSchema;
  allValues: Record<string, unknown>;
}
```
