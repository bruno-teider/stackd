import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import Card from "@mui/material/Card";
import React, { useState, useRef, useEffect } from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Grid from "@mui/material/Grid";

export const DisplayCard = ({ name, data }) => {
  return (
    <Card
      variant="outlined"
      sx={{
        backgroundColor: "#3260ddff",
        color: "white",
        borderRadius: "12px",
        padding: "12px 24px",
        textAlign: "center",
        minWidth: 120,
      }}
    >
      <Box>
        <Stack
          direction="row"
          sx={{
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Typography gutterBottom variant="h6">
            {name}
          </Typography>
        </Stack>
      </Box>
      <Divider />
      <Box>
        <Typography align="center" justifyContent={"center"} marginTop={1}>
          {data !== null && data !== undefined ? data : "N/A"}
        </Typography>
      </Box>
    </Card>
  );
};

const formatarNumeroCompleto = (valor) => {
  const numero = parseFloat(valor);

  if (isNaN(numero)) {
    return "N/A";
  }

  return new Intl.NumberFormat("pt-BR", {
    style: "decimal",
    maximumFractionDigits: 2,
    minimumFractionDigits: 0,
  }).format(numero);
};

export const FundamentalCard = ({ name, data }) => {
  return (
    <Card
      variant="outlined"
      sx={{
        backgroundColor: "#3260ddff",
        color: "white",
        borderRadius: "12px",
        padding: "12px 24px",
        textAlign: "center",
        minWidth: 120,
      }}
    >
      <Box>
        <Stack
          direction="row"
          sx={{
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Typography gutterBottom variant="h6">
            {name}
          </Typography>
        </Stack>
      </Box>
      <Divider sx={{ borderColor: "primary.main" }} />
      <Box>
        <Typography align="center" justifyContent={"center"} marginTop={1}>
          {formatarNumeroCompleto(data)}
        </Typography>
      </Box>
    </Card>
  );
};
