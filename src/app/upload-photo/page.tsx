import CheckCircleRounded from "@mui/icons-material/CheckCircleRounded";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

const ChipLabels = ["Not blurry", "Bright enough", "Pencil writing is clear"];
const Buttons = [
  {
    label: "Convert Files Now",
    color: "primary",
  },
  {
    label: "View Results",
    color: "black",
  },
];

export default function UploadPhotoPage() {
  return (
    <Box>
      <Box></Box>
      <Box rowGap={4} display="grid" justifyItems="center">
        <Box rowGap={2} display="grid">
          <Typography variant="h5" align="center">
            Upload your slates photo
          </Typography>
          <Typography variant="h4" align="center" fontWeight="400">
            Make sure that your photos are:
          </Typography>
        </Box>
        <Box display="flex" columnGap={2}>
          {ChipLabels.map((chipLabel) => {
            return (
              <Chip
                label={chipLabel}
                icon={<CheckCircleRounded color="primary" />}
                variant="outlined"
                sx={{
                  borderRadius: "8px",
                  borderColor: "black",
                  color: "black",
                  fontWeight: 400,
                }}
              />
            );
          })}
        </Box>
      </Box>
      <Box>
        <Button
          variant="contained"
          sx={{ borderRadius: "20px", fontSize: "16px", px: 6, py: 2 }}
        >
          Convert Files Now
        </Button>
        <Button>View Results</Button>
      </Box>
    </Box>
  );
}
