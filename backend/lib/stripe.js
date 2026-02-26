import Stripe from "stripe";
import env from "../utils/envalidate.js";

export const stripe = new Stripe(env.STRIPE_SECRET_KEY);
