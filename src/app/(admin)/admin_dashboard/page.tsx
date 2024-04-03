"use client";

import EmailRowComponent from "@/components/EmailRowComponent";
import Add from "@mui/icons-material/Add";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import { TransitionGroup } from "react-transition-group";
import { Collapse, Drawer } from "@mui/material";
import { RoundedButton } from "@/components/RoundedButton";
import { useEmailRowStore } from "@/stores/emailRowStore";

export default function UploadEmailSection() {
  const rows = useEmailRowStore((state) => state.rows); // useMemo here
  const addRow = useEmailRowStore((state) => state.addRow);
  const email = useEmailRowStore((state) => state.rows);

  return (
    <Box pt={12}>
      <Container maxWidth="xl" disableGutters sx={{ display: "grid" , borderTop: "1px black"}}>
        <Box
          display="grid"
          rowGap={2.5}
          maxHeight={{ md: 400 }}
          overflow="scroll"
          sx={{ mb: { xs: 50, md: 0 } }}
        >
          <TransitionGroup>
            {rows.map((row, index) => (
              <Collapse key={row.email}>
                <EmailRowComponent index={index} row={row} email={row.email}/>
              </Collapse>
            ))}
          </TransitionGroup>
        </Box>
        {/** Drawer here (mobile) */}
      </Container>
    </Box>
  );
}

// "use client";

// import EmailRowComponent from "@/components/EmailRowComponent";
// import Add from "@mui/icons-material/Add";
// import Button from "@mui/material/Button";
// import Box from "@mui/material/Box";
// import Container from "@mui/material/Container";
// import { useContext } from "react";
// import { SlateContext } from "@/contexts";

// export default function UploadPhotoSection() {
//   const { rows, addRow } = useContext(SlateContext);

//   return (
//     <Box pt={12}>
//       <Container maxWidth="xl" disableGutters sx={{ display: "grid" }}>
//         <Box display="grid" rowGap={2.5} maxHeight={400} overflow="scroll">
//           {rows.map((row, index) => (
//             <EmailRowComponent key={index} index={index} row={row} />
//           ))}
//         </Box>
//         {/* <Button
//           type="button"
//           startIcon={<Add />}
//           variant="text"
//           size="large"
//           sx={{
//             textTransform: "unset",
//             color: "black",
//             fontWeight: 400,
//             fontSize: 20,
//             margin: "0 auto",
//             mt: 9,
//             width: "fit-content",
//           }}
//           onClick={addRow}
//         >
//           Add more files
//         </Button> */}
//       </Container>
//     </Box>
//   );
// }
