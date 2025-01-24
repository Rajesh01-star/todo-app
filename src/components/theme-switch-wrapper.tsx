"use client";

import ThemeSwitch from "./theme-switch";

export default function ThemeSwitchWrapper() {
  return (
    <div className="fixed bottom-4 right-4 z-50">
      <ThemeSwitch />
    </div>
  );
} 