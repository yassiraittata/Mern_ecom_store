import Stripe from "stripe";
import env from "../utils/envalidate.js";

export default new Stripe(env.STRIPE_SECRET_KEY);
