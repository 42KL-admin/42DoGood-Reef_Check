import ResultComponent from "@/components/ResultComponent";
import { Box, Container, Typography } from "@mui/material";

export default function ResultListSection() {
  return (
    <Container maxWidth="xl">
      <Box px={14} py={8} display="grid" rowGap={4}>
        <ResultComponent />
        <ResultComponent />
        <ResultComponent />
        <ResultComponent />
        <ResultComponent />
        <ResultComponent />
        <ResultComponent />
        <ResultComponent />
        <ResultComponent />
      </Box>
    </Container>
  );
}
