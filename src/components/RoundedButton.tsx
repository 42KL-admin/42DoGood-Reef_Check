"use client";

import Button, { ButtonProps } from "@mui/material/Button";
import { styled } from "@mui/material/styles";

interface RoundedButtonProps extends ButtonProps {
  itemType: string;
  variant: "text" | "outlined" | "contained";
}

const RoundedButton = styled(Button)<RoundedButtonProps>(
  ({ theme, itemType, variant }) => ({
    boxShadow: "none",
    borderRadius: "20px",
    fontSize: "16px",
    fontWeight: 400,
    padding: "8px 24px",
    textTransform: "capitalize",
    ...(itemType === "secondary"
      ? { color: "black", borderColor: "black" }
      : {}),
    variant: variant || "text",
  })
);

export { RoundedButton };
export type { RoundedButtonProps };
