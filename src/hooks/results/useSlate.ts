import { SlateState } from "@/stores/fileRowStore";
import { useState } from "react";

const useSlate = () => {
  const [slate, setSlate] = useState<SlateState | null>(null);

  return {
    slate,
    setSlate,
  };
};

export default useSlate;
