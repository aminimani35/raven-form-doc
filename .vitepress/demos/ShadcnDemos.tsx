import React from "react";
import { MiniForm } from "./shared";

export function SignupDemo() {
  return (
    <MiniForm
      columns={12}
      submitLabel="Create Account"
      fields={[
        {
          name: "name",
          label: "Full Name",
          type: "text",
          required: true,
          colSpan: 12,
          placeholder: "Jane Doe",
        },
        {
          name: "email",
          label: "Email",
          type: "email",
          required: true,
          colSpan: 12,
          placeholder: "jane@example.com",
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
          colSpan: 6,
          placeholder: "••••••••",
          validate: (v) =>
            ((v as string)?.length ?? 0) < 8 ? "Min 8 characters" : undefined,
        },
        {
          name: "confirm",
          label: "Confirm Password",
          type: "password",
          required: true,
          colSpan: 6,
          placeholder: "••••••••",
          validate: (v, all) =>
            v !== all.password ? "Passwords do not match" : undefined,
        },
        {
          name: "terms",
          label: "I agree to the Terms of Service",
          type: "checkbox",
          required: true,
          colSpan: 12,
          defaultValue: false,
        },
      ]}
    />
  );
}

export function SettingsDemo() {
  return (
    <MiniForm
      columns={12}
      submitLabel="Save Settings"
      fields={[
        {
          name: "displayName",
          label: "Display Name",
          type: "text",
          colSpan: 12,
          placeholder: "Your public name",
        },
        {
          name: "bio",
          label: "Bio",
          type: "textarea",
          colSpan: 12,
          placeholder: "Tell us about yourself",
        },
        {
          name: "language",
          label: "Language",
          type: "select",
          colSpan: 6,
          defaultValue: "en",
          options: [
            { label: "English", value: "en" },
            { label: "فارسی", value: "fa" },
            { label: "Español", value: "es" },
            { label: "Français", value: "fr" },
          ],
        },
        {
          name: "theme",
          label: "Theme",
          type: "radio",
          colSpan: 6,
          defaultValue: "system",
          options: [
            { label: "Light", value: "light" },
            { label: "Dark", value: "dark" },
            { label: "System", value: "system" },
          ],
        },
        {
          name: "emailNotif",
          label: "Email Notifications",
          type: "switch",
          colSpan: 6,
          defaultValue: true,
        },
        {
          name: "pushNotif",
          label: "Push Notifications",
          type: "switch",
          colSpan: 6,
          defaultValue: false,
        },
        {
          name: "weeklyReport",
          label: "Weekly Report Digest",
          type: "switch",
          colSpan: 6,
          defaultValue: true,
        },
      ]}
    />
  );
}

export function FeedbackDemo() {
  return (
    <MiniForm
      columns={12}
      submitLabel="Send Feedback"
      fields={[
        {
          name: "subject",
          label: "Subject",
          type: "text",
          required: true,
          colSpan: 12,
        },
        {
          name: "rating",
          label: "Overall Rating",
          type: "radio",
          colSpan: 12,
          defaultValue: "5",
          options: ["1", "2", "3", "4", "5"].map((v) => ({
            label: "★".repeat(+v),
            value: v,
          })),
        },
        {
          name: "message",
          label: "Message",
          type: "textarea",
          required: true,
          colSpan: 12,
          placeholder: "Your feedback...",
        },
      ]}
    />
  );
}
