"use client";
import { Header } from "../components/Header";
import React, { useState } from "react";
import GeminiChatPopup from "../components/GeminiChatPopup";
import { useRouter } from "next/navigation";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import SearchIcon from "@mui/icons-material/Search";

export default function Home() {
  const [input, setInput] = useState("");
  const router = useRouter();

  const handleSearch = () => {
    if (input.trim() !== "") {
      router.push(`/stock/${input.toUpperCase()}`);
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="bg-[#ECECEC] min-h-screen">
      <Header />

      <div className="max-w-2xl mx-auto px-4">
        <div className="min-h-[calc(100vh-64px)] flex flex-col justify-center items-center text-center gap-4">
          <h1 className="text-4xl text-black font-bold mb-4">
            Análise de Ações 📈
          </h1>

          <div className="flex items-center w-full gap-2 mt-4">
            <TextField
              fullWidth
              variant="outlined"
              label="Digite o ticker (ex: PETR4)"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              slotProps={{
                input: {
                  style: { textTransform: "uppercase" },
                },
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  bgcolor: "white",
                  "& fieldset": {
                    borderWidth: 1,
                    borderColor: "#7c3aed",
                  },
                },
              }}
            />
            <Button
              variant="contained"
              onClick={handleSearch}
              disabled={!input.trim()}
              sx={{ height: "56px", backgroundColor: "#7c3aed" }}
            >
              <SearchIcon fontSize="large" />
            </Button>
          </div>
        </div>
      </div>
          {/* Popup do Chat IA Gemini */}
          <GeminiChatPopup />
    </div>
  );
}
