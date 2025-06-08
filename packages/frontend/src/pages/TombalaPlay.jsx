import React from "react";
import TombalaGame from "@gamecenter/tombala";
import { Container } from "@mui/material";

export default function TombalaPlay() {
  return (
    <Container sx={{ mt: 4 }}>
      <TombalaGame />
    </Container>
  );
}
