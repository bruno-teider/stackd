"use client";
import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  CircularProgress,
  Alert,
} from "@mui/material";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import Image from "next/image";

interface NewsArticle {
  title: string;
  description: string;
  url: string;
  published_at: string;
  source: string;
  image_url?: string;
  entities?: Array<{
    symbol: string;
    name: string;
  }>;
}

interface NewsProps {
  limit?: number;
  language?: string;
}

export default function News({ limit = 10, language = "pt" }: NewsProps) {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        setError(null);

        const apiKey = "d81pYJrnjeCxJcZ6YVM79YhhcgiNU4QJIA3RL6Ax";
        if (!apiKey) {
          throw new Error("API key não configurada");
        }

        const response = await fetch(
          `https://api.marketaux.com/v1/news/all?api_token=${apiKey}&language=${language}&limit=${limit}&countries=br`
        );

        if (!response.ok) {
          throw new Error("Erro ao buscar notícias");
        }

        const data = await response.json();
        setNews(data.data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro desconhecido");
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [limit, language]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <Box className="flex justify-center items-center py-12">
        <CircularProgress sx={{ color: "#7c3aed" }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" className="my-4">
        {error}
      </Alert>
    );
  }

  if (news.length === 0) {
    return (
      <Alert severity="info" className="my-4">
        Nenhuma notícia disponível no momento.
      </Alert>
    );
  }

  return (
    <Box className="py-8">
      <h1 className="text-black text-3xl font-bold text-center">
        Notícias do Mercado
      </h1>

      <div className="grid mt-6 gap-4 md:grid-cols-1 lg:grid-cols-1">
        {news.map((article, index) => (
          <Card
            key={index}
            className="hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => window.open(article.url, "_blank")}
            sx={{ display: "flex", flexDirection: "row", overflow: "hidden" }}
          >
            {/* Image on the left */}
            {article.image_url && (
              <Box
                sx={{
                  position: "relative",
                  width: "250px",
                  minWidth: "250px",
                  height: "auto",
                  backgroundColor: "#f3f4f6",
                }}
              >
                <Image
                  src={article.image_url}
                  alt={article.title}
                  width={200}
                  height={150}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                  unoptimized
                />
              </Box>
            )}

            {/* Content on the right */}
            <CardContent sx={{ flex: 1 }}>
              <Box className="flex flex-col gap-2">
                {/* Header with source and date */}
                <Box className="flex justify-between items-start">
                  <Chip
                    label={article.source}
                    size="small"
                    sx={{
                      backgroundColor: "#7c3aed",
                      color: "white",
                      fontWeight: "bold",
                    }}
                  />
                  <Typography variant="caption" className="text-gray-500">
                    {formatDate(article.published_at)}
                  </Typography>
                </Box>

                {/* Title */}
                <Typography
                  variant="h6"
                  className="text-black font-semibold hover:text-purple-600 transition-colors"
                >
                  {article.title}
                </Typography>

                {/* Description */}
                {article.description && (
                  <Typography
                    variant="body2"
                    className="text-gray-700"
                    sx={{
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {article.description}
                  </Typography>
                )}

                {/* Entities (Stock symbols) */}
                {article.entities && article.entities.length > 0 && (
                  <Box className="flex flex-wrap gap-1">
                    {article.entities.slice(0, 5).map((entity, idx) => (
                      <Chip
                        key={idx}
                        label={entity.symbol}
                        size="small"
                        variant="outlined"
                        sx={{
                          borderColor: "#7c3aed",
                          color: "#7c3aed",
                          fontSize: "0.7rem",
                        }}
                      />
                    ))}
                  </Box>
                )}

                {/* Read more link */}
                <Box className="flex items-center gap-1 text-purple-600">
                  <Typography variant="caption" className="font-semibold">
                    Ler mais
                  </Typography>
                  <OpenInNewIcon sx={{ fontSize: 14 }} />
                </Box>
              </Box>
            </CardContent>
          </Card>
        ))}
      </div>
    </Box>
  );
}
