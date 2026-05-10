import React from "react";
import { MiniForm } from "./shared";

export function LoginDemo() {
  return (
    <MiniForm
      columns={12}
      submitLabel="Sign In"
      fields={[
        {
          name: "email",
          label: "Email",
          type: "email",
          required: true,
          colSpan: 12,
          placeholder: "you@example.com",
          validate: (v) => {
            if (v && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v as string))
              return "Enter a valid email address";
          },
        },
        {
          name: "password",
          label: "Password",
          type: "password",
          required: true,
          colSpan: 12,
          placeholder: "••••••••",
          validate: (v) => {
            if (v && (v as string).length < 6)
              return "Password must be at least 6 characters";
          },
        },
        {
          name: "remember",
          label: "Remember me",
          type: "checkbox",
          colSpan: 12,
          defaultValue: false,
        },
      ]}
    />
  );
}
