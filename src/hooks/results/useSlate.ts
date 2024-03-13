import { useState } from "react";
import { SlateState } from "../upload/types";

const useSlate = () => {
  const [slate, setSlate] = useState<SlateState | null>(null);

  return {
    slate,
    setSlate,
  };
};

export default useSlate;
