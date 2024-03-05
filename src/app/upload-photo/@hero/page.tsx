import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import CheckmarkChip from "@/components/CheckmarkChip";
import { RoundedButton, RoundedButtonProps } from "@/components/RoundedButton";
import DropdownMenu from "@/components/DropdownMenu";
import Container from "@mui/material/Container";

const ChipLabels = ["Not blurry", "Bright enough", "Pencil writing is clear"];

interface ButtonData {
  label: string;
  props: RoundedButtonProps;
}

// please extend this when implementing the logic
const Buttons: ButtonData[] = [
  {
    label: "convert files now",
    props: {
      itemType: "",
      variant: "contained",
    },
  },
  {
    label: "view results",
    props: {
      itemType: "secondary",
      variant: "outlined",
    },
  },
];

export default function UploadPhotoHeroSection() {
  return (
    <Container maxWidth="xl">
      <Box
        display="grid"
        justifyItems="center"
        rowGap={8}
        px={6}
        pt={4}
        pb={15}
      >
        <Box justifySelf="end" sx={{ py: 1 }}>
          <DropdownMenu />
        </Box>
        <Box rowGap={4} display="grid" justifyItems="center">
          <Box rowGap={2} display="grid">
            <Typography variant="h5" align="center">
              Upload your slates photo
            </Typography>
            <Typography variant="h4" align="center">
              Make sure that your photos are:
            </Typography>
          </Box>
          <Box display="flex" columnGap={2}>
            {ChipLabels.map((chipLabel) => (
              <CheckmarkChip label={chipLabel} key={chipLabel} />
            ))}
          </Box>
        </Box>
        <Box display="flex" columnGap={2.5}>
          {Buttons.map((btn) => (
            <RoundedButton {...btn.props} size="large" key={btn.label}>
              {btn.label}
            </RoundedButton>
          ))}
        </Box>
      </Box>
    </Container>
  );
}
