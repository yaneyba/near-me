import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Stripe from "npm:stripe@14.20.0";
import { DataProviderFactory } from "../../providers/DataProviderFactory.ts";

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

    if (!stripeSecretKey) {
      throw new Error("Missing Stripe secret key");
    }

    // Initialize services
    const dataProvider = DataProviderFactory.getProvider();
    
    // Initialize Stripe
    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: "2023-10-16",
    });

    // Parse request body
    const { priceId, businessProfileId, successUrl, cancelUrl } = await req.json();

    if (!priceId || !businessProfileId || !successUrl || !cancelUrl) {
      throw new Error("Missing required parameters");
    }

    // Get the business profile directly from Supabase
    const { data: profile, error: profileError } = await supabase
      .from("business_profiles")
      .select("*")
      .eq("id", businessProfileId)
      .single();

    if (profileError || !profile) {
      throw new Error("Business profile not found");
    }

    // Check if the business already has a Stripe customer ID
    let customerId = profile.stripe_customer_id;

    if (!customerId) {
      // Create a new Stripe customer
      const customer = await stripe.customers.create({
        email: profile.email,
        name: profile.business_name,
        metadata: {
          business_profile_id: businessProfileId,
        },
      });

      customerId = customer.id;

      // Update the business profile with the Stripe customer ID directly
      const { error: updateError } = await supabase
        .from("business_profiles")
        .update({ 
          stripe_customer_id: customerId,
          updated_at: new Date().toISOString()
        })
        .eq("id", businessProfileId);

      if (updateError) {
        throw new Error("Failed to update business profile with Stripe customer ID");
      }
    }

    // Create a checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        business_profile_id: businessProfileId,
      },
    });

    // Return the checkout URL
    return new Response(
      JSON.stringify({
        success: true,
        url: session.url,
      }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error creating checkout session:", error);
    
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