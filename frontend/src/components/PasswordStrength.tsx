import { useMemo, useEffect } from "react";
import { Check } from "lucide-react";
import {
  calculatePasswordStrength,
  type PasswordStrengthLevel,
  type PasswordRules,
} from "../utils/passwordValidator";

interface PasswordStrengthProps {
  password: string;
  onStrengthChange?: (level: PasswordStrengthLevel) => void;
}

export const PasswordStrength = ({
  password,
  onStrengthChange,
}: PasswordStrengthProps) => {
  const result = useMemo(() => calculatePasswordStrength(password), [password]);

  // Notify parent of strength level changes
  useEffect(() => {
    if (onStrengthChange) {
      onStrengthChange(result.level);
    }
  }, [result.level, onStrengthChange]);

  // Determine configuration based on level
  const getLevelConfig = (level: PasswordStrengthLevel, isEmpty: boolean) => {
    if (isEmpty) {
      return {
        label: "None",
        colorClass: "text-gray-400",
        barColorClass: "bg-gray-200",
        filledBars: 0,
      };
    }

    switch (level) {
      case "Strong":
        return {
          label: "Strong",
          colorClass: "text-emerald-500 font-bold",
          barColorClass: "bg-emerald-500",
          filledBars: 4,
        };
      case "Good":
        return {
          label: "Good",
          colorClass: "text-teal-600 font-semibold",
          barColorClass: "bg-teal-500",
          filledBars: 3,
        };
      case "Fair":
        return {
          label: "Fair",
          colorClass: "text-amber-500 font-medium",
          barColorClass: "bg-amber-500",
          filledBars: 2,
        };
      case "Weak":
      default:
        return {
          label: "Weak",
          colorClass: "text-red-500 font-medium",
          barColorClass: "bg-red-500",
          filledBars: 1,
        };
    }
  };

  const isEmpty = password.length === 0;
  const config = getLevelConfig(result.level, isEmpty);

  // List of rules with labels
  const ruleItems: { key: keyof PasswordRules; label: string }[] = [
    { key: "minLength", label: "Minimum 8 characters" },
    { key: "hasUppercase", label: "Uppercase letter" },
    { key: "hasLowercase", label: "Lowercase letter" },
    { key: "hasNumber", label: "Number" },
    { key: "hasSpecialChar", label: "Special character" },
  ];

  return (
    <div className="mt-3 space-y-4 animate-fadeIn">
      {/* Strength Info & Bar */}
      <div className="space-y-2">
        <div className="flex justify-between items-center text-xs">
          <span className="font-semibold text-gray-500">Password Strength</span>
          <span className={`transition-all duration-300 ${config.colorClass}`}>
            {config.label}
          </span>
        </div>

        {/* Dynamic 4-Segment Strength Bar */}
        <div className="grid grid-cols-4 gap-2">
          {[0, 1, 2, 3].map((index) => {
            const isFilled = index < config.filledBars;
            return (
              <div
                key={index}
                className="h-2 rounded-full bg-gray-200 overflow-hidden"
              >
                <div
                  className={`h-full transition-all duration-500 ease-out ${
                    isFilled ? config.barColorClass : "bg-transparent"
                  }`}
                  style={{ width: isFilled ? "100%" : "0%" }}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Rules Checklist */}
      <div className="bg-gray-50/50 rounded-2xl p-4 border border-gray-100">
        <p className="text-xs font-semibold text-gray-500 mb-2.5 uppercase tracking-wider">
          Requirements:
        </p>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
          {ruleItems.map((item) => {
            const isPassed = result.rules[item.key];
            return (
              <li
                key={item.key}
                className={`flex items-center gap-2 text-xs transition-all duration-300 ${
                  isPassed ? "text-gray-700" : "text-gray-400"
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full flex items-center justify-center transition-all duration-300 border ${
                    isPassed
                      ? "bg-emerald-500 border-emerald-500 text-white"
                      : "border-gray-300 text-transparent bg-white"
                  }`}
                >
                  <Check size={10} strokeWidth={3} />
                </div>
                <span>{item.label}</span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};
