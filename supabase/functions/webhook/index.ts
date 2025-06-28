import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Stripe from "npm:stripe@14.20.0";
import { getSupabaseClient } from "../_shared/supabase-client.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }

  try {
    // Get environment variables
    const stripeSecretKey = Deno.env.get("STRIPE_SECRET_KEY") || "";
    const endpointSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET") || "";

    if (!stripeSecretKey) {
      throw new Error("Missing environment variables");
    }

    // Initialize services
    const supabase = getSupabaseClient();
    
    // Initialize Stripe
    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: "2023-10-16",
    });

    // Get the signature from the headers
    const signature = req.headers.get("stripe-signature");
    if (!signature) {
      throw new Error("No signature provided");
    }

    // Get the raw request body
    const body = await req.text();

    // Verify the webhook signature
    let event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, endpointSecret);
    } catch (err) {
      console.error(`Webhook signature verification failed: ${err.message}`);
      return new Response(JSON.stringify({ error: "Invalid signature" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Handle the event
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        const businessProfileId = session.metadata?.business_profile_id;
        const customerId = session.customer;
        const subscriptionId = session.subscription;

        if (businessProfileId && customerId && subscriptionId) {
          // Get the subscription details
          const subscription = await stripe.subscriptions.retrieve(subscriptionId);
          const priceId = subscription.items.data[0].price.id;

          // Update the business profile with subscription info
          const { error } = await supabase
            .from("business_profiles")
            .update({
              stripe_customer_id: customerId,
              stripe_subscription_id: subscriptionId,
              stripe_price_id: priceId,
              premium: true,
              updated_at: new Date().toISOString(),
            })
            .eq("id", businessProfileId);

          if (error) {
            console.error("Error updating business profile:", error);
            throw new Error("Failed to update business profile");
          }
        }
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object;
        const customerId = subscription.customer;
        const subscriptionId = subscription.id;
        const priceId = subscription.items.data[0].price.id;
        const status = subscription.status;

        // Update the business profile with the new subscription status
        const { data: profiles, error: fetchError } = await supabase
          .from("business_profiles")
          .select("*")
          .eq("stripe_customer_id", customerId);

        if (fetchError || !profiles || profiles.length === 0) {
          console.error("Error fetching business profile:", fetchError);
          throw new Error("Failed to fetch business profile");
        }

        const profile = profiles[0];
        const { error } = await supabase
          .from("business_profiles")
          .update({
            stripe_subscription_id: subscriptionId,
            stripe_price_id: priceId,
            premium: status === "active" || status === "trialing",
            updated_at: new Date().toISOString(),
          })
          .eq("id", profile.id);

        if (error) {
          console.error("Error updating business profile:", error);
          throw new Error("Failed to update business profile");
        }
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object;
        const customerId = subscription.customer;

        // Update the business profile to remove premium status
        const { data: profiles, error: fetchError } = await supabase
          .from("business_profiles")
          .select("*")
          .eq("stripe_customer_id", customerId);

        if (fetchError || !profiles || profiles.length === 0) {
          console.error("Error fetching business profile:", fetchError);
          throw new Error("Failed to fetch business profile");
        }

        const profile = profiles[0];
        const { error } = await supabase
          .from("business_profiles")
          .update({
            premium: false,
            updated_at: new Date().toISOString(),
          })
          .eq("id", profile.id);

        if (error) {
          console.error("Error updating business profile:", error);
          throw new Error("Failed to update business profile");
        }
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error processing webhook:", error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
        status: 400,
      }
    );
  }
});