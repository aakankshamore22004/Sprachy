import type { Scenario } from "./types";

export const SCENARIOS: Scenario[] = [
  {
    id: "casual",
    title: "Free Casual Talk",
    titleDe: "Freie Unterhaltung",
    emoji: "💬",
    description: "Open-ended chit-chat about anything — hobbies, plans, weather, life.",
    aiRole: "ein Freund / eine Freundin zum Plaudern",
    scene:
      "The learner is chatting casually with a friend. No fixed scenario — pick up on whatever they say. Ask about their day, hobbies, weekend plans, favourite things, or the weather. Keep the vibe relaxed and friendly, like texting a friend.",
  },
  {
    id: "taxi",
    title: "Taxi Pickup",
    titleDe: "Im Taxi",
    emoji: "🚕",
    description: "Tell the driver your destination and chat on the ride.",
    aiRole: "Taxifahrer(in) in Berlin",
    scene:
      "The learner just got into your taxi. Greet them, ask where they want to go, and make light small talk about the weather or the trip.",
  },
  {
    id: "smalltalk",
    title: "Small Talk",
    titleDe: "Kleingespräch",
    emoji: "☕",
    description: "Casual chat at a café with a new acquaintance.",
    aiRole: "eine freundliche Bekannte beim Kaffee",
    scene:
      "You met the learner at a café. Make casual small talk: ask how they are, what they do, hobbies, weekend plans.",
  },
  {
    id: "restaurant",
    title: "Restaurant",
    titleDe: "Im Restaurant",
    emoji: "🍽️",
    description: "Order food, ask about the menu, and pay the bill.",
    aiRole: "Kellner(in) in einem deutschen Restaurant",
    scene:
      "The learner is at your restaurant. Greet them, offer a table, present the menu, take their order, recommend a dish, and later bring the bill.",
  },
  {
    id: "doctor",
    title: "Doctor Visit",
    titleDe: "Beim Arzt",
    emoji: "🩺",
    description: "Describe your symptoms and understand the advice.",
    aiRole: "Arzt/Ärztin in einer Praxis",
    scene:
      "The learner is your patient. Ask what's wrong, ask follow-up questions about symptoms and duration, and give simple advice or a prescription.",
  },
  {
    id: "hotel",
    title: "Hotel Check-in",
    titleDe: "Im Hotel",
    emoji: "🏨",
    description: "Check in, ask about amenities, and your room.",
    aiRole: "Rezeptionist(in) in einem Hotel",
    scene:
      "The learner is checking in. Confirm their reservation, ask for ID, explain breakfast times and wifi, and hand over the room key.",
  },
  {
    id: "directions",
    title: "Asking Directions",
    titleDe: "Nach dem Weg fragen",
    emoji: "🧭",
    description: "Ask a local how to get to the train station.",
    aiRole: "eine freundliche Person auf der Straße",
    scene:
      "The learner stops you to ask for directions. Help them find the train station / a nearby landmark using clear, simple directions.",
  },
  {
    id: "grocery",
    title: "Grocery Store",
    titleDe: "Im Supermarkt",
    emoji: "🛒",
    description: "Find items, ask prices, and check out.",
    aiRole: "Supermarkt-Mitarbeiter(in)",
    scene:
      "The learner is shopping. Help them find items, answer questions about prices, and handle checkout small talk.",
  },
  {
    id: "interview",
    title: "Job Interview",
    titleDe: "Bewerbungsgespräch",
    emoji: "💼",
    description: "Answer common interview questions professionally.",
    aiRole: "Personalleiter(in) bei einem Unternehmen",
    scene:
      "You are interviewing the learner for a job. Ask about their background, strengths, and motivation, and respond professionally.",
  },
];

export function getScenario(id: string): Scenario | undefined {
  return SCENARIOS.find((s) => s.id === id);
}
