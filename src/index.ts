import express from "express";
import OpenAI from "openai";
import { zodTextFormat } from "openai/helpers/zod";
import { authMiddleware } from "./middlewares/auth.js";
import {
  placesResponseSchema,
  restaurantDetailSchema,
} from "./schemas/restaurant.schema.js";
import { PlacesResponse, QueryParams } from "./types/restaurant.type.js";
import { Request, Response } from "express";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const app = express();
const port = parseInt(process.env.PORT || "3000");

app.use(authMiddleware);

app.get("/api/execute", async (req: Request, res: Response) => {
  const { message, code } = req.query as QueryParams;
  if (message?.length === 0) {
    return res.status(400).json({ error: "Message is required" });
  }

  const response = await openai.responses.parse({
    model: "gpt-5",
    input: [
      {
        role: "system",
        content:
          "Extract necessary information from the user's message to find a restaurant. Make sure to follow the schema provided. Limit the query to 1 word. You will return a JSON object with the restaurant details. Omit any rating related information.",
      },
      {
        role: "user",
        content: message,
      },
    ],
    text: {
      format: zodTextFormat(restaurantDetailSchema, "event"),
    },
  });

  const restaurantDetail = response.output_parsed;
  if (!restaurantDetail) {
    return res.status(400).json({ error: "Invalid restaurant detail" });
  }

  const searchParams = new URLSearchParams({
    query: restaurantDetail.parameters.query,
    near: restaurantDetail.parameters.near,
    open_now: restaurantDetail.parameters.open_now.toString(),
    max_price: restaurantDetail.parameters.price_range.toString(),
    sort: "rating",
  });

  const url = `https://places-api.foursquare.com/places/search?${searchParams.toString()}`;

  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      "X-Places-Api-Version": "2025-06-17",
      authorization: `Bearer ${process.env.FOURSQUARE_API_KEY}`,
    },
  };

  const placesResponse = await fetch(url, options);

  const { results } = (await placesResponse.json()) as PlacesResponse;

  const restaurants = results.map((place) => {
    return {
      name: place.name,
      address: place.location.address,
      cuisine: place.categories[0].name,
      price_level: "$".repeat(restaurantDetail.parameters.price_range),
    };
  });

  const validatedRestaurants = placesResponseSchema.parse({
    success: true,
    message: `Found ${restaurants.length} restaurants`,
    data: restaurants,
  });

  res.json(validatedRestaurants);
});

app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});
